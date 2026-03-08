import { z } from "zod";

const mediaProcessingStatusSchema = z.enum([
  "pending",
  "processing",
  "ready",
  "failed",
]);

const faceSourceTypeSchema = z.enum(["image", "video", "generated"]);

const faceAnimationModeSchema = z.enum([
  "static",
  "lip-sync",
  "realtime-avatar",
]);

export const agentsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  instructions: z.string().min(1, { message: "Instructions are required" }),
  voiceProvider: z.string().max(120).nullable().optional(),
  voiceId: z.string().max(200).nullable().optional(),
  voiceModelId: z.string().max(200).nullable().optional(),
  sampleAudioUrl: z.string().url().nullable().optional(),
  sampleAudioDurationSec: z.number().int().min(1).max(3600).nullable().optional(),
  sampleAudioMime: z.string().max(100).nullable().optional(),
  voiceQualityScore: z.number().int().min(0).max(100).nullable().optional(),
  voiceProcessingStatus: mediaProcessingStatusSchema.nullable().optional(),
  voiceProcessingError: z.string().max(500).nullable().optional(),
  faceSourceType: faceSourceTypeSchema.nullable().optional(),
  faceImageUrl: z.string().url().nullable().optional(),
  faceVideoUrl: z.string().url().nullable().optional(),
  faceThumbnailUrl: z.string().url().nullable().optional(),
  faceAnimationMode: faceAnimationModeSchema.nullable().optional(),
  faceQualityScore: z.number().int().min(0).max(100).nullable().optional(),
  faceProcessingStatus: mediaProcessingStatusSchema.nullable().optional(),
  faceProcessingError: z.string().max(500).nullable().optional(),
  consentAccepted: z.boolean().nullable().optional(),
});

export const agentsUpdateSchema = agentsInsertSchema.partial().extend({
  id: z.string().min(1, { message: "Id is required" }),
});
