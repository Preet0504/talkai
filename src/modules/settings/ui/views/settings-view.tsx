"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSound } from "@/components/sound/sound-provider";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const SettingsView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const preferences = useQuery(trpc.preferences.get.queryOptions());
  const updatePreferences = useMutation(
    trpc.preferences.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.preferences.get.queryOptions()
        );
      },
    })
  );

  const { soundEnabled, soundVolume, setSoundEnabled, setSoundVolume, play } =
    useSound();

  if (preferences.isLoading) {
    return (
      <LoadingState
        title="Loading settings"
        description="Preparing your preferences"
      />
    );
  }

  if (preferences.error || !preferences.data) {
    return (
      <ErrorState
        title="Unable to load settings"
        description="Please try again shortly."
      />
    );
  }

  return (
    <div className="flex-1 px-4 py-6 md:px-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold font-display">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Control sound feedback, experimental features, and system behavior.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-elevated">
          <CardHeader>
            <CardTitle>Sound Design</CardTitle>
            <CardDescription>
              Optional audio cues for key meeting and system events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable UI sounds</p>
                <p className="text-sm text-muted-foreground">
                  Play soft cues for join/leave, success, and notifications.
                </p>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Volume</p>
                <span className="text-sm text-muted-foreground">
                  {soundVolume}%
                </span>
              </div>
              <Slider
                value={[soundVolume]}
                onValueChange={(value) => setSoundVolume(value[0] ?? 60)}
                disabled={!soundEnabled}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => play("notify")}
              disabled={!soundEnabled}
            >
              Play test sound
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-elevated">
          <CardHeader>
            <CardTitle>Experimental Media</CardTitle>
            <CardDescription>
              Enable voice and avatar features for AI agents. These are behind a
              feature flag while we validate quality and latency.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable agent media</p>
                <p className="text-sm text-muted-foreground">
                  Unlock voice samples, avatar uploads, and agent video tiles.
                </p>
              </div>
              <Switch
                checked={preferences.data.mediaFeaturesEnabled}
                onCheckedChange={(value) =>
                  updatePreferences.mutate({ mediaFeaturesEnabled: value })
                }
              />
            </div>
            <div className="rounded-lg border border-dashed border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              When enabled, media assets are processed asynchronously. If a
              provider is unavailable, TalkAI will fall back to static avatars
              and default voice synthesis.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
