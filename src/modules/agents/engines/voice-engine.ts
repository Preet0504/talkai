import { OPENAI_VOICES, type OpenAIVoice } from "@/modules/media/constants";

export interface AgentVoiceProfile {
  voiceProvider?: string | null;
  voiceId?: string | null;
  voiceModelId?: string | null;
  sampleAudioUrl?: string | null;
  voiceProcessingStatus?: string | null;
}

export interface ResolvedVoiceSession {
  provider: "openai";
  voice: OpenAIVoice;
  modelId?: string;
  hasSample: boolean;
  reason?: string;
}

export const resolveVoiceSession = (
  agent: AgentVoiceProfile
): ResolvedVoiceSession => {
  const provider = agent.voiceProvider ?? "openai";
  if (provider !== "openai") {
    return {
      provider: "openai",
      voice: "alloy",
      modelId: agent.voiceModelId ?? undefined,
      hasSample: false,
      reason: "Unsupported provider, falling back to OpenAI voice.",
    };
  }

  const selectedVoice =
    agent.voiceId && OPENAI_VOICES.includes(agent.voiceId as (typeof OPENAI_VOICES)[number])
      ? (agent.voiceId as OpenAIVoice)
      : "alloy";

  return {
    provider: "openai",
    voice: selectedVoice,
    modelId: agent.voiceModelId ?? undefined,
    hasSample: agent.voiceProcessingStatus === "ready",
  };
};
