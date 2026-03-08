import { nanoid } from "nanoid";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  soundEnabled: boolean("sound_enabled").notNull().default(false),
  soundVolume: integer("sound_volume").notNull().default(60),
  mediaFeaturesEnabled: boolean("media_features_enabled")
    .notNull()
    .default(false),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const mediaProcessingStatus = pgEnum("media_processing_status", [
  "pending",
  "processing",
  "ready",
  "failed",
]);

export const mediaUploadStatus = pgEnum("media_upload_status", [
  "pending",
  "uploaded",
  "processing",
  "ready",
  "failed",
  "deleted",
]);

export const mediaUploadKind = pgEnum("media_upload_kind", [
  "voice_sample",
  "face_image",
  "face_video",
]);

export const faceSourceType = pgEnum("face_source_type", [
  "image",
  "video",
  "generated",
]);

export const faceAnimationMode = pgEnum("face_animation_mode", [
  "static",
  "lip-sync",
  "realtime-avatar",
]);

export const agents = pgTable("agents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instructions: text("instructions").notNull(),
  voiceProvider: text("voice_provider"),
  voiceId: text("voice_id"),
  voiceModelId: text("voice_model_id"),
  sampleAudioUrl: text("sample_audio_url"),
  sampleAudioDurationSec: integer("sample_audio_duration_sec"),
  sampleAudioMime: text("sample_audio_mime"),
  voiceQualityScore: integer("voice_quality_score"),
  voiceProcessingStatus: mediaProcessingStatus("voice_processing_status"),
  voiceProcessingError: text("voice_processing_error"),
  faceSourceType: faceSourceType("face_source_type"),
  faceImageUrl: text("face_image_url"),
  faceVideoUrl: text("face_video_url"),
  faceThumbnailUrl: text("face_thumbnail_url"),
  faceAnimationMode: faceAnimationMode("face_animation_mode"),
  faceQualityScore: integer("face_quality_score"),
  faceProcessingStatus: mediaProcessingStatus("face_processing_status"),
  faceProcessingError: text("face_processing_error"),
  consentAccepted: boolean("consent_accepted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const meetingStatus = pgEnum("meeting_status", [
  "upcoming",
  "active",
  "completed",
  "processing",
  "cancelled",
]);

export const meetings = pgTable("meetings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  status: meetingStatus("status").notNull().default("upcoming"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  transcriptUrl: text("transcript_url"),
  recordingUrl: text("recording_url"),
  summary: text("summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mediaUploads = pgTable("media_uploads", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  kind: mediaUploadKind("kind").notNull(),
  status: mediaUploadStatus("status").notNull().default("pending"),
  uploadToken: text("upload_token"),
  mime: text("mime"),
  sizeBytes: integer("size_bytes"),
  durationSec: integer("duration_sec"),
  width: integer("width"),
  height: integer("height"),
  originalName: text("original_name"),
  storageKey: text("storage_key"),
  url: text("url"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
