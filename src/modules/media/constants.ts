export const VOICE_SAMPLE_MIME_ALLOWLIST = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/aac",
  "audio/ogg",
  "audio/webm",
]);

export const FACE_IMAGE_MIME_ALLOWLIST = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const FACE_VIDEO_MIME_ALLOWLIST = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const MEDIA_LIMITS = {
  voice: {
    maxBytes: 12 * 1024 * 1024,
    maxDurationSec: 180,
  },
  faceImage: {
    maxBytes: 6 * 1024 * 1024,
    minDimension: 256,
    maxDimension: 4096,
  },
  faceVideo: {
    maxBytes: 32 * 1024 * 1024,
    maxDurationSec: 30,
  },
};

export const OPENAI_VOICES = [
  "alloy",
  "echo",
  "shimmer",
  "ash",
  "ballad",
  "coral",
  "sage",
  "verse",
] as const;

export type OpenAIVoice = (typeof OPENAI_VOICES)[number];

export type MediaUploadKind = "voice_sample" | "face_image" | "face_video";
