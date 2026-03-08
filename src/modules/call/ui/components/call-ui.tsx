"use client";

import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallEnded } from "./call-ended";
import { CallActive } from "./call-active";
import { useCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useSound } from "@/components/sound/sound-provider";

interface Props {
  meetingName: string;
  agent?: {
    id: string;
    name: string;
    faceThumbnailUrl?: string | null;
    faceImageUrl?: string | null;
    faceVideoUrl?: string | null;
    faceAnimationMode?: string | null;
    faceProcessingStatus?: string | null;
  };
}

export const CallUI = ({ meetingName, agent }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const { play } = useSound();

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    play("join");
    setShow("call");
  };

  const handleLeave = async () => {
    if (!call) return;
    await call.endCall();
    play("leave");
    setShow("ended");
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && (
        <CallActive
          onLeave={handleLeave}
          meetingName={meetingName}
          agent={agent}
        />
      )}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  );
};
