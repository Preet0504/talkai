import { generateAvatarUri } from "@/lib/avatar";

export interface AgentFaceProfile {
  id: string;
  name: string;
  faceThumbnailUrl?: string | null;
  faceImageUrl?: string | null;
  faceVideoUrl?: string | null;
  faceAnimationMode?: string | null;
  faceProcessingStatus?: string | null;
}

export interface ResolvedAvatar {
  imageUrl: string;
  videoUrl?: string;
  mode: "static" | "lip-sync" | "realtime-avatar";
  source: "custom" | "generated";
}

export const resolveAgentAvatar = (agent: AgentFaceProfile): ResolvedAvatar => {
  const mode =
    agent.faceAnimationMode === "lip-sync" ||
    agent.faceAnimationMode === "realtime-avatar"
      ? agent.faceAnimationMode
      : "static";

  const imageUrl =
    agent.faceThumbnailUrl ||
    agent.faceImageUrl ||
    generateAvatarUri({ seed: agent.name, variant: "botttsNeutral" });

  return {
    imageUrl,
    videoUrl: agent.faceVideoUrl ?? undefined,
    mode,
    source: agent.faceThumbnailUrl || agent.faceImageUrl ? "custom" : "generated",
  };
};
