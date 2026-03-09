import {
  FACE_IMAGE_MIME_ALLOWLIST,
  FACE_VIDEO_MIME_ALLOWLIST,
  MEDIA_LIMITS,
  VOICE_SAMPLE_MIME_ALLOWLIST,
  type MediaUploadKind,
} from "../constants";

export interface MediaMetaInput {
  kind: MediaUploadKind;
  mime: string | null;
  sizeBytes: number;
  durationSec?: number | null;
  width?: number | null;
  height?: number | null;
}

export interface MediaValidationResult {
  ok: boolean;
  message?: string;
}

export const normalizeMime = (value: string | null | undefined) =>
  (value ?? "").split(";")[0].trim().toLowerCase();

export const validateMediaMeta = (input: MediaMetaInput): MediaValidationResult => {
  const mime = normalizeMime(input.mime);
  if (!mime) {
    return { ok: false, message: "Missing file type." };
  }

  if (input.sizeBytes <= 0) {
    return { ok: false, message: "Empty file uploads are not allowed." };
  }

  if (input.kind === "voice_sample") {
    if (!VOICE_SAMPLE_MIME_ALLOWLIST.has(mime)) {
      return { ok: false, message: "Unsupported audio format." };
    }

    if (input.sizeBytes > MEDIA_LIMITS.voice.maxBytes) {
      return {
        ok: false,
        message: "Voice sample file size is too large.",
      };
    }

    if (
      typeof input.durationSec === "number" &&
      input.durationSec > MEDIA_LIMITS.voice.maxDurationSec
    ) {
      return {
        ok: false,
        message: "Voice sample must be 3 minutes or less.",
      };
    }
  }

  if (input.kind === "face_image") {
    if (!FACE_IMAGE_MIME_ALLOWLIST.has(mime)) {
      return { ok: false, message: "Unsupported image format." };
    }

    if (input.sizeBytes > MEDIA_LIMITS.faceImage.maxBytes) {
      return {
        ok: false,
        message: "Image file size is too large.",
      };
    }

    if (
      typeof input.width === "number" &&
      typeof input.height === "number"
    ) {
      if (
        input.width < MEDIA_LIMITS.faceImage.minDimension ||
        input.height < MEDIA_LIMITS.faceImage.minDimension
      ) {
        return {
          ok: false,
          message: "Image dimensions are too small.",
        };
      }

      if (
        input.width > MEDIA_LIMITS.faceImage.maxDimension ||
        input.height > MEDIA_LIMITS.faceImage.maxDimension
      ) {
        return {
          ok: false,
          message: "Image dimensions are too large.",
        };
      }
    }
  }

  if (input.kind === "face_video") {
    if (!FACE_VIDEO_MIME_ALLOWLIST.has(mime)) {
      return { ok: false, message: "Unsupported video format." };
    }

    if (input.sizeBytes > MEDIA_LIMITS.faceVideo.maxBytes) {
      return {
        ok: false,
        message: "Video file size is too large.",
      };
    }

    if (
      typeof input.durationSec === "number" &&
      input.durationSec > MEDIA_LIMITS.faceVideo.maxDurationSec
    ) {
      return {
        ok: false,
        message: "Face videos must be 30 seconds or less.",
      };
    }
  }

  return { ok: true };
};
