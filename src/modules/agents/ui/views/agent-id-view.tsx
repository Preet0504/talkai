"use client";

import { toast } from "sonner";
import { useState } from "react";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useSound } from "@/components/sound/sound-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

import { UpdateAgentDialog } from "../components/update-agent-dialog";
import { AgentIdViewHeader } from "../components/agent-id-view-header";

interface Props {
    agentId: string;
};

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { play } = useSound();
  const preferences = useQuery(trpc.preferences.get.queryOptions());

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  const mediaEnabled = preferences.data?.mediaFeaturesEnabled ?? false;
  const statusToneMap: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    processing: "bg-sky-500/15 text-sky-700 border-sky-500/30",
    ready: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    failed: "bg-rose-500/15 text-rose-700 border-rose-500/30",
    "not configured": "bg-muted text-muted-foreground border-border/60",
  };
  const voiceStatusLabel = data.voiceProcessingStatus ?? "not configured";
  const faceStatusLabel = data.faceProcessingStatus ?? "not configured";
  
  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        play("success");
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
        play("error");
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${data.meetingCount} associated meetings`,
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      /> 
      
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />
        <div className="bg-card rounded-lg border border-border/60 shadow-elevated">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-10"
              />
              <div className="flex flex-col">
                <h2 className="text-2xl font-medium">{data.name}</h2>
                <p className="text-sm text-muted-foreground">
                  AI meeting agent
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-primary" />
              {data.meetingCount}{" "}
              {data.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-muted-foreground">{data.instructions}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/60 shadow-elevated">
            <CardHeader>
              <CardTitle>Voice Profile</CardTitle>
              <CardDescription>
                Configure the voice used when the agent speaks in calls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={statusToneMap[voiceStatusLabel]}
                >
                  {voiceStatusLabel}
                </Badge>
              </div>
              {data.sampleAudioUrl ? (
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <span>
                    Sample duration:{" "}
                    {data.sampleAudioDurationSec
                      ? formatDuration(data.sampleAudioDurationSec)
                      : "Unknown"}
                  </span>
                  <span>Format: {data.sampleAudioMime ?? "Unknown"}</span>
                  <span>
                    Provider: {data.voiceProvider ?? "Not configured"}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No voice sample uploaded yet.
                </p>
              )}
              {!mediaEnabled && (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  Enable agent media in Settings to add voice samples.
                </div>
              )}
              <Button asChild variant="outline">
                <Link href="/settings">Manage in settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-elevated">
            <CardHeader>
              <CardTitle>Face Profile</CardTitle>
              <CardDescription>
                Control the avatar tile and presentation during meetings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={statusToneMap[faceStatusLabel]}
                >
                  {faceStatusLabel}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                {data.faceThumbnailUrl ? (
                  <Image
                    src={data.faceThumbnailUrl}
                    alt={`${data.name} avatar`}
                    width={64}
                    height={64}
                    className="size-16 rounded-xl object-cover border border-border/60"
                  />
                ) : (
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.name}
                    className="size-16 border border-border/60 rounded-xl"
                  />
                )}
                <div className="text-sm text-muted-foreground">
                  <p>Source: {data.faceSourceType ?? "Not configured"}</p>
                  <p>Animation: {data.faceAnimationMode ?? "static"}</p>
                </div>
              </div>
              {!mediaEnabled && (
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  Enable agent media in Settings to upload face assets.
                </div>
              )}
              <Button asChild variant="outline">
                <Link href="/settings">Manage in settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a fews seconds"
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agent"
      description="Something went wrong"
    />
  );
};
