import { agents } from '@/db/schema';
import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure
    .query(async () => {
      const data = await db
      .select()
      .from(agents);
    throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No agents found',
      });
    return data;
    }),
});