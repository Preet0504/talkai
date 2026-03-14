"use client";

import { useMemo } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

import { Badge } from "@/components/ui/badge";
import { resolveAgentAvatar } from "@/modules/agents/engines/avatar-engine";

interface AgentVideoTileProps {
  agent: {
    id: string;
    name: string;
    faceThumbnailUrl?: string | null;
    faceImageUrl?: string | null;
    faceVideoUrl?: string | null;
    faceAnimationMode?: string | null;
    faceProcessingStatus?: string | null;
  };
}

export const AgentVideoTile = ({ agent }: AgentVideoTileProps) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const participant = useMemo(
    () => participants.find((item) => item.userId === agent.id),
    [participants, agent.id]
  );

  const isSpeaking = participant?.isSpeaking ?? false;

  const resolvedAvatar = resolveAgentAvatar({
    id: agent.id,
    name: agent.name,
    faceThumbnailUrl: agent.faceThumbnailUrl,
    faceImageUrl: agent.faceImageUrl,
    faceVideoUrl: agent.faceVideoUrl,
    faceAnimationMode: agent.faceAnimationMode,
    faceProcessingStatus: agent.faceProcessingStatus,
  });

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-3 shadow-sm backdrop-blur">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={resolvedAvatar.imageUrl}
          alt={`${agent.name} avatar`}
          className="h-32 w-full object-cover"
        />
        {isSpeaking && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-primary/60" />
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <Badge variant={isSpeaking ? "default" : "secondary"}>
            {isSpeaking ? "Speaking" : "Idle"}
          </Badge>
          {agent.faceProcessingStatus === "processing" && (
            <Badge variant="outline">Processing</Badge>
          )}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-foreground">{agent.name}</p>
        <p className="text-xs text-muted-foreground">Agent Presence</p>
      </div>
    </div>
  );
};
