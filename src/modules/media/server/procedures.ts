import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents, mediaUploads, userPreferences } from "@/db/schema";
import { validateMediaMeta } from "./validation";
import { deleteMediaFile } from "@/lib/media-storage";
import { MEDIA_LIMITS, type MediaUploadKind } from "../constants";

const mediaUploadInputSchema = z.object({
  agentId: z.string().min(1),
  kind: z.enum(["voice_sample", "face_image", "face_video"]),
  mime: z.string().min(1),
  sizeBytes: z.number().int().min(1),
  durationSec: z.number().int().min(1).max(600).optional(),
  width: z.number().int().min(1).optional(),
  height: z.number().int().min(1).optional(),
  consentAccepted: z.boolean(),
});

const removeAssetSchema = z.object({
  agentId: z.string().min(1),
  kind: z.enum(["voice_sample", "face_image", "face_video"]),
});

const updateAgentForRemoval = (kind: MediaUploadKind) => {
  if (kind === "voice_sample") {
    return {
      sampleAudioUrl: null,
      sampleAudioDurationSec: null,
      sampleAudioMime: null,
      voiceProcessingStatus: null,
      voiceProcessingError: null,
      voiceQualityScore: null,
    };
  }

  return {
    faceSourceType: null,
    faceImageUrl: null,
    faceVideoUrl: null,
    faceThumbnailUrl: null,
    faceAnimationMode: null,
    faceProcessingStatus: null,
    faceProcessingError: null,
    faceQualityScore: null,
  };
};

export const mediaRouter = createTRPCRouter({
  createUploadSession: protectedProcedure
    .input(mediaUploadInputSchema)
    .mutation(async ({ ctx, input }) => {
      const [preferences] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, ctx.auth.user.id));

      if (!preferences?.mediaFeaturesEnabled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Agent media features are disabled for this account.",
        });
      }

      if (!input.consentAccepted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Consent is required before uploading media assets.",
        });
      }

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(and(eq(agents.id, input.agentId), eq(agents.userId, ctx.auth.user.id)));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      const validation = validateMediaMeta({
        kind: input.kind,
        mime: input.mime,
        sizeBytes: input.sizeBytes,
        durationSec: input.durationSec,
        width: input.width,
        height: input.height,
      });

      if (!validation.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: validation.message ?? "Invalid media upload.",
        });
      }

      if (input.kind === "voice_sample" && input.durationSec) {
        if (input.durationSec > MEDIA_LIMITS.voice.maxDurationSec) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Voice sample must be 3 minutes or less.",
          });
        }
      }

      const uploadToken = nanoid(32);
      const [createdUpload] = await db
        .insert(mediaUploads)
        .values({
          userId: ctx.auth.user.id,
          agentId: input.agentId,
          kind: input.kind,
          status: "pending",
          uploadToken,
          mime: input.mime,
          sizeBytes: input.sizeBytes,
          durationSec: input.durationSec ?? null,
          width: input.width ?? null,
          height: input.height ?? null,
          originalName: null,
        })
        .returning();

      return {
        uploadId: createdUpload.id,
        uploadToken,
        uploadUrl: `/api/media/upload/${createdUpload.id}`,
        limits: MEDIA_LIMITS,
      };
    }),

  removeAsset: protectedProcedure
    .input(removeAssetSchema)
    .mutation(async ({ ctx, input }) => {
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(and(eq(agents.id, input.agentId), eq(agents.userId, ctx.auth.user.id)));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      const [updatedAgent] = await db
        .update(agents)
        .set(updateAgentForRemoval(input.kind))
        .where(and(eq(agents.id, input.agentId), eq(agents.userId, ctx.auth.user.id)))
        .returning();

      if (!updatedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      const [latestUpload] = await db
        .select()
        .from(mediaUploads)
        .where(
          and(
            eq(mediaUploads.agentId, input.agentId),
            eq(mediaUploads.kind, input.kind)
          )
        )
        .orderBy(desc(mediaUploads.createdAt))
        .limit(1);

      if (latestUpload?.storageKey) {
        await deleteMediaFile(latestUpload.storageKey);
      }

      await db
        .update(mediaUploads)
        .set({ status: "deleted", updatedAt: new Date() })
        .where(
          and(
            eq(mediaUploads.agentId, input.agentId),
            eq(mediaUploads.kind, input.kind)
          )
        );

      return updatedAgent;
    }),

  getRecentUploads: protectedProcedure
    .input(z.object({ agentId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(and(eq(agents.id, input.agentId), eq(agents.userId, ctx.auth.user.id)));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found.",
        });
      }

      return db
        .select()
        .from(mediaUploads)
        .where(eq(mediaUploads.agentId, input.agentId))
        .orderBy(desc(mediaUploads.createdAt))
        .limit(5);
    }),
});
