import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";

import { db } from "@/db";
import { agents, meetings, userPreferences } from "@/db/schema";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";
import { MEDIA_LIMITS, VOICE_SAMPLE_MIME_ALLOWLIST } from "@/modules/media/constants";

const validateAgentMediaInput = (
  input: Partial<z.infer<typeof agentsInsertSchema>>
) => {
  if (
    input.sampleAudioDurationSec &&
    input.sampleAudioDurationSec > MEDIA_LIMITS.voice.maxDurationSec
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Voice sample must be 3 minutes or less.",
    });
  }

  if (
    input.sampleAudioMime &&
    !VOICE_SAMPLE_MIME_ALLOWLIST.has(input.sampleAudioMime)
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unsupported audio format for voice samples.",
    });
  }

  if (
    (input.sampleAudioUrl || input.faceImageUrl || input.faceVideoUrl) &&
    input.consentAccepted !== true
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Consent is required before uploading media assets.",
    });
  }

  if ((input.faceImageUrl || input.faceVideoUrl) && !input.faceSourceType) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Face source type is required for face assets.",
    });
  }
};

const hasMediaPayload = (input: Partial<z.infer<typeof agentsInsertSchema>>) => {
  return Boolean(
    input.sampleAudioUrl ||
      input.faceImageUrl ||
      input.faceVideoUrl
  );
};

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: db.$count(meetings, eq(meetings.agentId, agents.id))
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        );

      if (!existingAgent)
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found!" });

      return existingAgent;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;
      const data = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: db.$count(meetings, eq(meetings.agentId, agents.id))
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

  create: premiumProcedure("agents")
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      if (hasMediaPayload(input)) {
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
      }
      validateAgentMediaInput(input);
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          consentAccepted: input.consentAccepted ?? false,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),

  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;
      if (hasMediaPayload(updateData)) {
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
      }
      validateAgentMediaInput(updateData);

      const [updatedAgent] = await db
        .update(agents)
        .set({
          ...updateData,
          consentAccepted: updateData.consentAccepted ?? undefined,
          updatedAt: new Date(),
        })
        .where(and(eq(agents.id, id), eq(agents.userId, ctx.auth.user.id)))
        .returning();

      if (!updatedAgent)
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found!" });

      return updatedAgent;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [deletedAgent] = await db
        .delete(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        )
        .returning();

      if (!deletedAgent)
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found!" });

      return deletedAgent;
    }),
});
