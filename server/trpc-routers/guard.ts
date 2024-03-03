import { createTRPCRouter, publicProcedure } from "../trpc";
import { createGuardFormValuesSchema } from "netloier-ui/src/components/forms/guards/create-guard-form-types";
import { z } from "zod";
import { convertGuardToFormValues } from "./utils/convert-model-to-form-values";

export const guardRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.guard.findMany({
      select: { name: true, id: true },
    });
  }),
  createGuard: publicProcedure.input(createGuardFormValuesSchema).mutation(
    async ({ ctx, input: { type, name, invert, ...rest } }) =>
      await ctx.prisma.guard.create({
        data: { type, name, invert, data: rest },
      }),
  ),
  deleteGuard: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.guard.delete({ where: { id: input.id } }),
    ),
  getGuardDetail: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) =>
      convertGuardToFormValues(
        await ctx.prisma.guard.findUniqueOrThrow({ where: { id: input.id } }),
      ),
    ),
});
