"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Mic, Square, Upload } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAudioDuration,
  getImageDimensions,
  getVideoDuration,
} from "@/modules/media/client/metadata";
import { uploadFileWithProgress } from "@/modules/media/client/upload";
import { MEDIA_LIMITS } from "@/modules/media/constants";

interface AgentMediaPanelProps {
  agentId: string;
  consentAccepted: boolean;
  onConsentChange: (value: boolean) => void;
}

type UploadState = {
  kind: "voice" | "face";
  progress: number;
  label: string;
  previewUrl?: string;
  previewIsVideo?: boolean;
};

const statusLabel: Record<string, string> = {
  empty: "Not set",
  pending: "Queued",
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
};

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  empty: "outline",
  pending: "secondary",
  processing: "secondary",
  ready: "default",
  failed: "destructive",
};

const FACE_ANIMATION_MODES = [
  "static",
  "lip-sync",
  "realtime-avatar",
] as const;

type FaceAnimationMode = (typeof FACE_ANIMATION_MODES)[number];

const isFaceAnimationMode = (value: string): value is FaceAnimationMode =>
  FACE_ANIMATION_MODES.includes(value as FaceAnimationMode);

const isMediaRecorderSupported = () =>
  typeof window !== "undefined" &&
  !!navigator.mediaDevices &&
  typeof (window as typeof window & { MediaRecorder?: typeof MediaRecorder })
    .MediaRecorder !== "undefined";

export const AgentMediaPanel = ({
  agentId,
  consentAccepted,
  onConsentChange,
}: AgentMediaPanelProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: agent } = useQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const { data: preferences } = useQuery(
    trpc.preferences.get.queryOptions()
  );

  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const createUpload = useMutation(
    trpc.media.createUploadSession.mutationOptions()
  );

  const removeAsset = useMutation(
    trpc.media.removeAsset.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getOne.queryOptions({ id: agentId })
        );
        toast.success("Media asset removed.");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getOne.queryOptions({ id: agentId })
        );
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const mediaEnabled = preferences?.mediaFeaturesEnabled ?? false;

  const ensureConsent = useCallback(() => {
    if (!consentAccepted) {
      toast.error("Please confirm consent before uploading media.");
      return false;
    }
    return true;
  }, [consentAccepted]);

  const setProgress = (
    kind: "voice" | "face",
    progress: number,
    label: string,
    previewUrl?: string,
    previewIsVideo?: boolean
  ) => {
    setUploadState({ kind, progress, label, previewUrl, previewIsVideo });
  };

  const clearProgress = () => {
    setUploadState((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }
      return null;
    });
  };

  const handleVoiceUpload = useCallback(
    async (file: File) => {
      if (!mediaEnabled) {
        toast.error("Enable agent media in Settings to upload voice samples.");
        return;
      }

      if (!ensureConsent()) return;

      try {
        if (file.size > MEDIA_LIMITS.voice.maxBytes) {
          toast.error("Voice sample file size is too large.");
          return;
        }
        const duration = await getAudioDuration(file);
        const durationSec = Math.ceil(duration);
        if (durationSec > MEDIA_LIMITS.voice.maxDurationSec) {
          toast.error("Voice sample must be 3 minutes or less.");
          return;
        }

        const previewUrl = URL.createObjectURL(file);
        setProgress("voice", 0, "Preparing upload…", previewUrl, false);

        const session = await createUpload.mutateAsync({
          agentId,
          kind: "voice_sample",
          mime: file.type,
          sizeBytes: file.size,
          durationSec,
          consentAccepted,
        });

        setProgress("voice", 10, "Uploading…", previewUrl, false);
        await uploadFileWithProgress(
          session.uploadUrl,
          file,
          session.uploadToken,
          (progress) =>
            setProgress(
              "voice",
              progress.percent,
              "Uploading…",
              previewUrl,
              false
            )
        );

        await queryClient.invalidateQueries(
          trpc.agents.getOne.queryOptions({ id: agentId })
        );
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        toast.success("Voice sample uploaded.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        clearProgress();
      }
    },
    [
      agentId,
      consentAccepted,
      createUpload,
      ensureConsent,
      mediaEnabled,
      queryClient,
      trpc,
    ]
  );

  const handleFaceUpload = useCallback(
    async (file: File) => {
      if (!mediaEnabled) {
        toast.error("Enable agent media in Settings to upload face assets.");
        return;
      }

      if (!ensureConsent()) return;

      const isImage = file.type.startsWith("image/");
      const kind = isImage ? "face_image" : "face_video";

      try {
        if (isImage && file.size > MEDIA_LIMITS.faceImage.maxBytes) {
          toast.error("Image file size is too large.");
          return;
        }
        if (!isImage && file.size > MEDIA_LIMITS.faceVideo.maxBytes) {
          toast.error("Video file size is too large.");
          return;
        }

        let width: number | undefined;
        let height: number | undefined;
        let durationSec: number | undefined;

        if (isImage) {
          const dimensions = await getImageDimensions(file);
          width = dimensions.width;
          height = dimensions.height;
          if (
            width < MEDIA_LIMITS.faceImage.minDimension ||
            height < MEDIA_LIMITS.faceImage.minDimension
          ) {
            toast.error("Image dimensions are too small.");
            return;
          }
          if (
            width > MEDIA_LIMITS.faceImage.maxDimension ||
            height > MEDIA_LIMITS.faceImage.maxDimension
          ) {
            toast.error("Image dimensions are too large.");
            return;
          }
        } else {
          const duration = await getVideoDuration(file);
          durationSec = Math.ceil(duration);
          if (durationSec > MEDIA_LIMITS.faceVideo.maxDurationSec) {
            toast.error("Face videos must be 30 seconds or less.");
            return;
          }
        }

        const previewUrl = URL.createObjectURL(file);
        setProgress("face", 0, "Preparing upload…", previewUrl, !isImage);

        const session = await createUpload.mutateAsync({
          agentId,
          kind,
          mime: file.type,
          sizeBytes: file.size,
          durationSec,
          width,
          height,
          consentAccepted,
        });

        setProgress("face", 10, "Uploading…", previewUrl, !isImage);
        await uploadFileWithProgress(
          session.uploadUrl,
          file,
          session.uploadToken,
          (progress) =>
            setProgress(
              "face",
              progress.percent,
              "Uploading…",
              previewUrl,
              !isImage
            )
        );

        await queryClient.invalidateQueries(
          trpc.agents.getOne.queryOptions({ id: agentId })
        );
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        toast.success("Face asset uploaded.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        clearProgress();
      }
    },
    [
      agentId,
      consentAccepted,
      createUpload,
      ensureConsent,
      mediaEnabled,
      queryClient,
      trpc,
    ]
  );

  const startRecording = useCallback(async () => {
    if (!isMediaRecorderSupported()) {
      toast.error("Recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedUrl(url);
        setRecording(false);
        setRecorder(null);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
      setRecordedBlob(null);
      setRecordedUrl(null);
    } catch (error) {
      toast.error("Microphone access was denied.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recorder && recording) {
      recorder.stop();
    }
  }, [recorder, recording]);

  const handleRecordingUpload = useCallback(async () => {
    if (!recordedBlob) return;
    const file = new File([recordedBlob], "voice-sample.webm", {
      type: recordedBlob.type || "audio/webm",
    });
    await handleVoiceUpload(file);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
      setRecordedBlob(null);
    }
  }, [handleVoiceUpload, recordedBlob, recordedUrl]);

  const voiceStatus = agent?.sampleAudioUrl
    ? (agent.voiceProcessingStatus ?? "pending")
    : "empty";
  const faceStatus = agent?.faceImageUrl || agent?.faceVideoUrl
    ? (agent.faceProcessingStatus ?? "pending")
    : "empty";

  const voiceMeta = useMemo(() => {
    if (!agent?.sampleAudioUrl) return null;
    const duration = agent.sampleAudioDurationSec
      ? `${agent.sampleAudioDurationSec}s`
      : "Duration unknown";
    const mime = agent.sampleAudioMime ?? "Audio";
    return `${mime} • ${duration}`;
  }, [agent?.sampleAudioUrl, agent?.sampleAudioDurationSec, agent?.sampleAudioMime]);

  const faceMeta = useMemo(() => {
    if (!agent?.faceImageUrl && !agent?.faceVideoUrl) return null;
    if (agent.faceImageUrl) return "Image";
    return "Video";
  }, [agent?.faceImageUrl, agent?.faceVideoUrl]);

  if (!agent) {
    return (
      <Card className="p-6 flex items-center gap-3">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading media settings…
        </span>
      </Card>
    );
  }

  const faceRemoveKind = agent.faceVideoUrl ? "face_video" : "face_image";

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-base font-semibold">Voice Sample</h4>
            <p className="text-sm text-muted-foreground">
              Provide a short recording to personalize how this agent sounds.
              Audio is normalized and scored after upload.
            </p>
          </div>
          <Badge variant={statusVariant[voiceStatus] ?? "outline"}>
            {statusLabel[voiceStatus] ?? "Not set"}
          </Badge>
        </div>

        {!mediaEnabled && (
          <div className="rounded-lg border border-dashed border-border/80 bg-muted/40 p-4 text-sm text-muted-foreground">
            Enable agent media in Settings to upload voice samples.
          </div>
        )}

        {agent.sampleAudioUrl ? (
          <div className="space-y-3">
            <audio controls className="w-full">
              <source src={agent.sampleAudioUrl} />
            </audio>
            {voiceMeta && (
              <p className="text-xs text-muted-foreground">{voiceMeta}</p>
            )}
          </div>
        ) : uploadState?.kind === "voice" && uploadState.previewUrl ? (
          <div className="space-y-3">
            <audio controls className="w-full">
              <source src={uploadState.previewUrl} />
            </audio>
            <p className="text-xs text-muted-foreground">Previewing upload…</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 p-4 text-sm text-muted-foreground">
            No voice sample uploaded yet.
          </div>
        )}

        {uploadState?.kind === "voice" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{uploadState.label}</span>
              <span>{uploadState.progress.toFixed(0)}%</span>
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="file"
            accept="audio/*"
            disabled={!mediaEnabled || uploadState?.kind === "voice"}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleVoiceUpload(file);
              event.currentTarget.value = "";
            }}
          />
          {agent.sampleAudioUrl && (
            <Button
              variant="ghost"
              type="button"
              disabled={!mediaEnabled || removeAsset.isPending}
              onClick={() =>
                removeAsset.mutate({ agentId, kind: "voice_sample" })
              }
            >
              Remove
            </Button>
          )}
        </div>

        <div className="rounded-lg border border-border/60 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Record a sample</p>
            <span className="text-xs text-muted-foreground">Max 3 minutes</span>
          </div>
          {!isMediaRecorderSupported() && (
            <p className="text-xs text-muted-foreground">
              Recording is not supported in this browser. Upload an audio file
              instead.
            </p>
          )}
          {recordedUrl && (
            <audio controls className="w-full">
              <source src={recordedUrl} />
            </audio>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={recording ? "secondary" : "default"}
              disabled={!mediaEnabled || !isMediaRecorderSupported()}
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? (
                <span className="flex items-center gap-2">
                  <Square className="size-4" /> Stop
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mic className="size-4" /> Record
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!mediaEnabled || !recordedBlob}
              onClick={handleRecordingUpload}
            >
              <Upload className="size-4" /> Upload recording
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-base font-semibold">Face Asset</h4>
            <p className="text-sm text-muted-foreground">
              Upload a portrait image or short video for the agent's on-call tile.
            </p>
          </div>
          <Badge variant={statusVariant[faceStatus] ?? "outline"}>
            {statusLabel[faceStatus] ?? "Not set"}
          </Badge>
        </div>

        {!mediaEnabled && (
          <div className="rounded-lg border border-dashed border-border/80 bg-muted/40 p-4 text-sm text-muted-foreground">
            Enable agent media in Settings to upload face assets.
          </div>
        )}

        {agent.faceImageUrl || agent.faceVideoUrl ? (
          <div className="space-y-3">
            <AspectRatio ratio={16 / 9}>
              {agent.faceImageUrl ? (
                <Image
                  src={agent.faceImageUrl}
                  alt="Agent portrait"
                  fill
                  className="rounded-lg object-cover"
                />
              ) : (
                <video
                  src={agent.faceVideoUrl ?? undefined}
                  className="h-full w-full rounded-lg object-cover"
                  controls
                />
              )}
            </AspectRatio>
            {faceMeta && (
              <p className="text-xs text-muted-foreground">{faceMeta}</p>
            )}
          </div>
        ) : uploadState?.kind === "face" && uploadState.previewUrl ? (
          <div className="space-y-3">
            <AspectRatio ratio={16 / 9}>
              {uploadState.previewIsVideo ? (
                <video
                  src={uploadState.previewUrl}
                  className="h-full w-full rounded-lg object-cover"
                  controls
                />
              ) : (
                <Image
                  src={uploadState.previewUrl}
                  alt="Face preview"
                  fill
                  className="rounded-lg object-cover"
                />
              )}
            </AspectRatio>
            <p className="text-xs text-muted-foreground">Previewing upload…</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 p-4 text-sm text-muted-foreground">
            No face asset uploaded yet.
          </div>
        )}

        {uploadState?.kind === "face" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{uploadState.label}</span>
              <span>{uploadState.progress.toFixed(0)}%</span>
            </div>
            <Progress value={uploadState.progress} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="file"
            accept="image/*,video/*"
            disabled={!mediaEnabled || uploadState?.kind === "face"}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFaceUpload(file);
              event.currentTarget.value = "";
            }}
          />
          {(agent.faceImageUrl || agent.faceVideoUrl) && (
            <Button
              variant="ghost"
              type="button"
              disabled={!mediaEnabled || removeAsset.isPending}
              onClick={() =>
                removeAsset.mutate({ agentId, kind: faceRemoveKind })
              }
            >
              Remove
            </Button>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Animation mode</Label>
          <Select
            value={agent.faceAnimationMode ?? "static"}
            onValueChange={(value) => {
              if (!isFaceAnimationMode(value)) return;
              updateAgent.mutate({
                id: agentId,
                faceAnimationMode: value,
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="static">Static tile</SelectItem>
              <SelectItem value="lip-sync">Lip-sync (fallback)</SelectItem>
              <SelectItem value="realtime-avatar">
                Realtime avatar (fallback)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border/60 p-4 text-xs text-muted-foreground flex items-start gap-3">
          <AlertTriangle className="size-4 text-amber-500" />
          <div>
            Video uploads are kept short and currently rendered as static tiles
            during calls. Lip-sync and realtime avatar modes fall back to static
            until a supported avatar engine is connected.
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-semibold">Consent</h4>
            <p className="text-sm text-muted-foreground">
              Confirm you have permission to use the voice and face assets you
              upload.
            </p>
          </div>
          <Badge variant={consentAccepted ? "default" : "outline"}>
            {consentAccepted ? "Accepted" : "Required"}
          </Badge>
        </div>
        <Label className="flex items-center gap-2">
          <Checkbox
            checked={consentAccepted}
            onCheckedChange={(value) => onConsentChange(value === true)}
          />
          I confirm I have consent to use these assets in TalkAI.
        </Label>
      </Card>
    </div>
  );
};
