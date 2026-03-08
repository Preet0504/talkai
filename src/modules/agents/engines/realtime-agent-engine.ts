import { streamVideo } from "@/lib/stream-video";
import { resolveVoiceSession, type AgentVoiceProfile } from "./voice-engine";

interface AgentRealtimeProfile extends AgentVoiceProfile {
  id: string;
  instructions: string | null;
}

export const joinRealtimeAgent = async (
  agent: AgentRealtimeProfile,
  meetingId: string
) => {
  const call = streamVideo.video.call("default", meetingId);
  const realtimeClient = await streamVideo.video.connectOpenAi({
    call,
    openAiApiKey: process.env.OPENAI_API_KEY!,
    agentUserId: agent.id,
  });

  const voiceSession = resolveVoiceSession(agent);

  realtimeClient.updateSession({
    instructions: agent.instructions || "You are a helpful assistant.",
    voice: voiceSession.voice,
    modalities: ["audio", "text"],
    input_audio_format: "pcm16",
    output_audio_format: "pcm16",
    input_audio_transcription: { model: "whisper-1" },
    turn_detection: { type: "server_vad" },
  });

  return { voiceSession };
};
