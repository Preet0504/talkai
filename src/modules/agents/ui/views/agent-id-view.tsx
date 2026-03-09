"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { AgentMediaPanel } from "../components/agent-media-panel";

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
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  const mediaEnabled = preferences.data?.mediaFeaturesEnabled ?? false;
  
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

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getOne.queryOptions({ id: agentId })
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  useEffect(() => {
    setConsentAccepted(data.consentAccepted ?? false);
  }, [data.consentAccepted]);

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

        <div className="space-y-3">
          {!mediaEnabled && (
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Enable agent media in Settings to upload voice samples and face assets.
            </div>
          )}
          <AgentMediaPanel
            agentId={agentId}
            consentAccepted={consentAccepted}
            onConsentChange={(value) => {
              setConsentAccepted(value);
              updateAgent.mutate({ id: agentId, consentAccepted: value });
            }}
          />
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
