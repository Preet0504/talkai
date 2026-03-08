"use client";

import { Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSound } from "@/components/sound/sound-provider";

export const SoundToggle = () => {
  const { soundEnabled, toggleSound } = useSound();
  const Icon = soundEnabled ? Volume2 : VolumeX;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
      aria-pressed={soundEnabled}
      className="h-9 w-9 border-border/60 bg-background/70"
      onClick={toggleSound}
    >
      <Icon className="size-4" />
    </Button>
  );
};
