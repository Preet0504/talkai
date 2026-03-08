const MIME_EXTENSION_MAP: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export const getExtensionForMime = (mime: string) => {
  return MIME_EXTENSION_MAP[mime] ?? "bin";
};

export const normalizeMediaKindLabel = (kind: string) => {
  if (kind === "voice_sample") return "Voice sample";
  if (kind === "face_image") return "Face image";
  if (kind === "face_video") return "Face video";
  return "Media";
};
