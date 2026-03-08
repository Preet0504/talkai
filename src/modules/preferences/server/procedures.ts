import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const preferencesUpdateSchema = z.object({
  soundEnabled: z.boolean().optional(),
  soundVolume: z.number().min(0).max(100).optional(),
  mediaFeaturesEnabled: z.boolean().optional(),
});

const defaultPreferences = {
  soundEnabled: false,
  soundVolume: 60,
  mediaFeaturesEnabled: false,
};

export const preferencesRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, ctx.auth.user.id));

    return (
      preferences ?? {
        userId: ctx.auth.user.id,
        ...defaultPreferences,
      }
    );
  }),

  update: protectedProcedure
    .input(preferencesUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const insertValues = {
        userId: ctx.auth.user.id,
        soundEnabled: input.soundEnabled ?? defaultPreferences.soundEnabled,
        soundVolume: input.soundVolume ?? defaultPreferences.soundVolume,
        mediaFeaturesEnabled:
          input.mediaFeaturesEnabled ?? defaultPreferences.mediaFeaturesEnabled,
      };

      const updateValues: Partial<typeof insertValues> & {
        updatedAt: Date;
      } = {
        updatedAt: new Date(),
      };

      if (input.soundEnabled !== undefined) {
        updateValues.soundEnabled = input.soundEnabled;
      }
      if (input.soundVolume !== undefined) {
        updateValues.soundVolume = input.soundVolume;
      }
      if (input.mediaFeaturesEnabled !== undefined) {
        updateValues.mediaFeaturesEnabled = input.mediaFeaturesEnabled;
      }

      const [updated] = await db
        .insert(userPreferences)
        .values(insertValues)
        .onConflictDoUpdate({
          target: userPreferences.userId,
          set: updateValues,
        })
        .returning();

      return updated;
    }),
});
