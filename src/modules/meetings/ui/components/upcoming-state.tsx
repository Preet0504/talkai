import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

interface Props {
  meetingId: string;
  isCanceling: boolean;
}

export const UpcomingState = ({
  meetingId,
  isCanceling,
}: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Not started yet"
        description="Once you start this meeting, a summary will appear here"
      />
      <div className="flex lg:flex-row lg:justify-center items-center gap-2">
        <Button asChild className="w-full lg:w-auto" disabled={isCanceling}>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
