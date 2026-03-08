"use client";

import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { authClient } from "@/lib/auth-client";

export type SoundKey = "join" | "leave" | "success" | "error" | "notify";

type SoundPreferences = {
  soundEnabled: boolean;
  soundVolume: number;
};

type SoundContextValue = SoundPreferences & {
  toggleSound: () => void;
  setSoundEnabled: (value: boolean) => void;
  setSoundVolume: (value: number) => void;
  play: (sound: SoundKey) => void;
};

const SoundContext = React.createContext<SoundContextValue | null>(null);

const STORAGE_PREFIX = "talkai.sound";

const clampVolume = (value: number) => Math.min(100, Math.max(0, value));

const getStorageKey = (userId?: string) =>
  `${STORAGE_PREFIX}.${userId ?? "guest"}`;

const readStoredPreferences = (key: string): SoundPreferences | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SoundPreferences>;
    return {
      soundEnabled: Boolean(parsed.soundEnabled),
      soundVolume: clampVolume(
        typeof parsed.soundVolume === "number" ? parsed.soundVolume : 60
      ),
    };
  } catch {
    return null;
  }
};

const persistPreferences = (key: string, prefs: SoundPreferences) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(prefs));
};

const createEnvelope = (
  ctx: AudioContext,
  volume: number,
  duration: number,
  attack = 0.01,
  release = 0.08
) => {
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const maxGain = Math.max(0.001, volume);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(maxGain, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
  return gain;
};

const playTone = (
  ctx: AudioContext,
  frequency: number,
  volume: number,
  duration: number,
  type: OscillatorType = "sine",
  detune = 0
) => {
  const osc = ctx.createOscillator();
  const envelope = createEnvelope(ctx, volume, duration);
  osc.type = type;
  osc.frequency.value = frequency;
  osc.detune.value = detune;
  osc.connect(envelope);
  envelope.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.12);
};

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const [soundEnabled, setSoundEnabledState] = React.useState(false);
  const [soundVolume, setSoundVolumeState] = React.useState(60);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const hasLocalOverride = React.useRef(false);

  const preferencesQuery = useQuery(
    trpc.preferences.get.queryOptions(undefined, {
      enabled: Boolean(userId),
    })
  );

  const preferencesMutation = useMutation(
    trpc.preferences.update.mutationOptions()
  );

  React.useEffect(() => {
    hasLocalOverride.current = false;
    const stored = readStoredPreferences(getStorageKey(userId));
    if (stored) {
      setSoundEnabledState(stored.soundEnabled);
      setSoundVolumeState(stored.soundVolume);
      return;
    }
    if (preferencesQuery.data) {
      setSoundEnabledState(preferencesQuery.data.soundEnabled);
      setSoundVolumeState(preferencesQuery.data.soundVolume);
    }
  }, [userId, preferencesQuery.data]);

  React.useEffect(() => {
    if (!userId || !preferencesQuery.data) return;
    if (hasLocalOverride.current) return;
    const next = {
      soundEnabled: preferencesQuery.data.soundEnabled,
      soundVolume: preferencesQuery.data.soundVolume,
    };
    persistPreferences(getStorageKey(userId), next);
  }, [userId, preferencesQuery.data]);

  const persist = React.useCallback(
    (next: SoundPreferences) => {
      persistPreferences(getStorageKey(userId), next);
      if (userId) {
        preferencesMutation.mutate({
          soundEnabled: next.soundEnabled,
          soundVolume: next.soundVolume,
        });
      }
    },
    [userId, preferencesMutation]
  );

  const setSoundEnabled = React.useCallback(
    (value: boolean) => {
      hasLocalOverride.current = true;
      setSoundEnabledState(value);
      persist({ soundEnabled: value, soundVolume });
    },
    [persist, soundVolume]
  );

  const setSoundVolume = React.useCallback(
    (value: number) => {
      hasLocalOverride.current = true;
      const nextVolume = clampVolume(value);
      setSoundVolumeState(nextVolume);
      persist({ soundEnabled, soundVolume: nextVolume });
    },
    [persist, soundEnabled]
  );

  const toggleSound = React.useCallback(() => {
    setSoundEnabled(!soundEnabled);
  }, [setSoundEnabled, soundEnabled]);

  const play = React.useCallback(
    (sound: SoundKey) => {
      if (!soundEnabled) return;
      const volume = clampVolume(soundVolume) / 100;

      try {
        const AudioContextConstructor =
          window.AudioContext ||
          (window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }).webkitAudioContext;

        if (!AudioContextConstructor) return;

        const ctx =
          audioContextRef.current ?? new AudioContextConstructor();
        audioContextRef.current = ctx;
        if (ctx.state === "suspended") {
          void ctx.resume();
        }

        switch (sound) {
          case "join":
            playTone(ctx, 440, volume * 0.25, 0.14, "sine", -10);
            playTone(ctx, 660, volume * 0.2, 0.16, "triangle", 4);
            break;
          case "leave":
            playTone(ctx, 320, volume * 0.22, 0.18, "triangle", -8);
            playTone(ctx, 240, volume * 0.18, 0.2, "sine", -4);
            break;
          case "success":
            playTone(ctx, 520, volume * 0.2, 0.12, "sine");
            playTone(ctx, 780, volume * 0.18, 0.14, "triangle", 6);
            break;
          case "error":
            playTone(ctx, 220, volume * 0.28, 0.22, "sine", -12);
            playTone(ctx, 200, volume * 0.2, 0.2, "triangle", 0);
            break;
          case "notify":
            playTone(ctx, 880, volume * 0.2, 0.1, "sine");
            playTone(ctx, 1320, volume * 0.14, 0.08, "triangle");
            break;
          default:
            break;
        }
      } catch {
        // Ignore audio failures (e.g. blocked until user interacts).
      }
    },
    [soundEnabled, soundVolume]
  );

  const value = React.useMemo(
    () => ({
      soundEnabled,
      soundVolume,
      toggleSound,
      setSoundEnabled,
      setSoundVolume,
      play,
    }),
    [soundEnabled, soundVolume, toggleSound, setSoundEnabled, setSoundVolume, play]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = React.useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider.");
  }
  return context;
};
