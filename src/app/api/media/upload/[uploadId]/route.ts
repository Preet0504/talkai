import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { agents, mediaUploads } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getExtensionForMime } from "@/lib/media-utils";
import { createStorageKey, deleteMediaFile, saveMediaFile } from "@/lib/media-storage";
import { validateMediaMeta } from "@/modules/media/server/validation";
import { inngest } from "@/inngest/client";

export const runtime = "nodejs";

interface Params {
  params: Promise<{
    uploadId: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { uploadId } = await params;
  const uploadToken = req.headers.get("x-upload-token");

  if (!uploadToken) {
    return NextResponse.json(
      { error: "Missing upload token." },
      { status: 401 }
    );
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const [upload] = await db
    .select()
    .from(mediaUploads)
    .where(
      and(eq(mediaUploads.id, uploadId), eq(mediaUploads.uploadToken, uploadToken))
    );

  if (!upload) {
    return NextResponse.json(
      { error: "Upload session not found." },
      { status: 404 }
    );
  }

  if (upload.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 403 }
    );
  }

  if (upload.status !== "pending") {
    return NextResponse.json(
      { error: "Upload session is no longer active." },
      { status: 409 }
    );
  }

  const mime = req.headers.get("content-type") ?? upload.mime ?? "";

  if (upload.mime && mime && upload.mime !== mime) {
    await db
      .update(mediaUploads)
      .set({
        status: "failed",
        error: "Uploaded file type does not match the prepared session.",
        updatedAt: new Date(),
      })
      .where(eq(mediaUploads.id, uploadId));
    return NextResponse.json(
      { error: "Uploaded file type does not match the prepared session." },
      { status: 400 }
    );
  }

  const arrayBuffer = await req.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const sizeBytes = data.byteLength;

  const validation = validateMediaMeta({
    kind: upload.kind,
    mime,
    sizeBytes,
    durationSec: upload.durationSec ?? undefined,
    width: upload.width ?? undefined,
    height: upload.height ?? undefined,
  });

  if (!validation.ok) {
    await db
      .update(mediaUploads)
      .set({ status: "failed", error: validation.message, updatedAt: new Date() })
      .where(eq(mediaUploads.id, uploadId));

    return NextResponse.json(
      { error: validation.message ?? "Invalid media upload." },
      { status: 400 }
    );
  }

  try {
    const extension = getExtensionForMime(mime);
    const storageKey = createStorageKey(upload.agentId, uploadId, extension);
    await saveMediaFile(storageKey, data);
    const fileUrl = `/api/media/file/${uploadId}`;

    await db
      .update(mediaUploads)
      .set({
        status: "uploaded",
        uploadToken: null,
        mime,
        sizeBytes,
        storageKey,
        url: fileUrl,
        updatedAt: new Date(),
      })
      .where(eq(mediaUploads.id, uploadId));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(
        and(eq(agents.id, upload.agentId), eq(agents.userId, upload.userId))
      );

    if (existingAgent) {
      const cleanupPrevious = async (url?: string | null) => {
        if (!url) return;
        const [previous] = await db
          .select()
          .from(mediaUploads)
          .where(eq(mediaUploads.url, url));
        if (previous?.storageKey) {
          await deleteMediaFile(previous.storageKey);
        }
        if (previous) {
          await db
            .update(mediaUploads)
            .set({ status: "deleted", updatedAt: new Date() })
            .where(eq(mediaUploads.id, previous.id));
        }
      };

      if (upload.kind === "voice_sample") {
        await cleanupPrevious(existingAgent.sampleAudioUrl);
        await db
          .update(agents)
          .set({
            sampleAudioUrl: fileUrl,
            sampleAudioMime: mime,
            sampleAudioDurationSec: upload.durationSec ?? null,
            voiceProcessingStatus: "pending",
            voiceProcessingError: null,
            voiceQualityScore: null,
            consentAccepted: true,
            updatedAt: new Date(),
          })
          .where(eq(agents.id, upload.agentId));
      }

      if (upload.kind === "face_image") {
        await cleanupPrevious(existingAgent.faceImageUrl);
        await db
          .update(agents)
          .set({
            faceSourceType: "image",
            faceImageUrl: fileUrl,
            faceThumbnailUrl: fileUrl,
            faceProcessingStatus: "pending",
            faceProcessingError: null,
            faceQualityScore: null,
            faceAnimationMode: existingAgent.faceAnimationMode ?? "static",
            consentAccepted: true,
            updatedAt: new Date(),
          })
          .where(eq(agents.id, upload.agentId));
      }

      if (upload.kind === "face_video") {
        await cleanupPrevious(existingAgent.faceVideoUrl);
        await db
          .update(agents)
          .set({
            faceSourceType: "video",
            faceVideoUrl: fileUrl,
            faceProcessingStatus: "pending",
            faceProcessingError: null,
            faceQualityScore: null,
            faceAnimationMode: existingAgent.faceAnimationMode ?? "static",
            consentAccepted: true,
            updatedAt: new Date(),
          })
          .where(eq(agents.id, upload.agentId));
      }

      await inngest.send({
        name: "agents/media.process",
        data: {
          uploadId,
          agentId: upload.agentId,
          kind: upload.kind,
        },
      });
    }

    return NextResponse.json({
      status: "ok",
      mediaUrl: fileUrl,
      uploadId,
    });
  } catch (error) {
    await db
      .update(mediaUploads)
      .set({
        status: "failed",
        error: error instanceof Error ? error.message : "Upload failed",
        updatedAt: new Date(),
      })
      .where(eq(mediaUploads.id, uploadId));

    return NextResponse.json(
      { error: "Failed to store uploaded file." },
      { status: 500 }
    );
  }
}
