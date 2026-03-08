import test from "node:test";
import assert from "node:assert/strict";

import { validateMediaMeta } from "@/modules/media/server/validation";

const base = {
  kind: "voice_sample" as const,
  mime: "audio/mpeg",
  sizeBytes: 1024,
  durationSec: 10,
};

test("accepts valid voice sample metadata", () => {
  const result = validateMediaMeta(base);
  assert.equal(result.ok, true);
});

test("rejects oversized voice samples", () => {
  const result = validateMediaMeta({
    ...base,
    sizeBytes: 50 * 1024 * 1024,
  });
  assert.equal(result.ok, false);
});

test("rejects unsupported image mime", () => {
  const result = validateMediaMeta({
    kind: "face_image",
    mime: "image/gif",
    sizeBytes: 1024,
    width: 512,
    height: 512,
  });
  assert.equal(result.ok, false);
});

test("accepts valid face image", () => {
  const result = validateMediaMeta({
    kind: "face_image",
    mime: "image/png",
    sizeBytes: 1024,
    width: 512,
    height: 512,
  });
  assert.equal(result.ok, true);
});
