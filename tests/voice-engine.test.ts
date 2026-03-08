import test from "node:test";
import assert from "node:assert/strict";

import { resolveVoiceSession } from "@/modules/agents/engines/voice-engine";

const baseAgent = {
  voiceProvider: "openai",
  voiceId: "alloy",
  voiceModelId: null,
  sampleAudioUrl: null,
  voiceProcessingStatus: null,
};

test("uses requested openai voice when valid", () => {
  const session = resolveVoiceSession({ ...baseAgent, voiceId: "shimmer" });
  assert.equal(session.voice, "shimmer");
});

test("falls back to alloy for unsupported provider", () => {
  const session = resolveVoiceSession({
    ...baseAgent,
    voiceProvider: "custom",
    voiceId: "custom-1",
  });
  assert.equal(session.voice, "alloy");
  assert.equal(session.provider, "openai");
});

test("marks sample as available when processing ready", () => {
  const session = resolveVoiceSession({
    ...baseAgent,
    voiceProcessingStatus: "ready",
    sampleAudioUrl: "https://example.com/audio.mp3",
  });
  assert.equal(session.hasSample, true);
});
