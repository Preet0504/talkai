import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

import { AgentVideoTile } from "./agent-video-tile";

interface Props {
  onLeave: () => void;
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

export const CallActive = ({ onLeave, meetingName, agent }: Props) => {
  return (
    <div className="flex h-full flex-col justify-between p-4 text-white">
      <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center justify-center p-1 bg-foreground/10 rounded-full w-fit"
        >
          <Image src="/logo.svg" alt="Logo" width={24} height={24} />
        </Link>
        <h4 className="text-base">{meetingName}</h4>
      </div>
      <div className="relative flex-1">
        <SpeakerLayout
          filterParticipants={
            agent
              ? (participant) => participant.userId !== agent.id
              : undefined
          }
        />
        {agent && (
          <div className="absolute right-4 bottom-4 w-56">
            <AgentVideoTile agent={agent} />
          </div>
        )}
      </div>
      <div className="bg-[#101213] rounded-full px-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
