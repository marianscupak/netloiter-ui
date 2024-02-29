import { createTRPCRouter, publicProcedure } from "../trpc";
import { createConfigFormValuesSchema } from "netloier-ui/src/components/forms/configs/create-config-form-types";
import { z } from "zod";

export const configRouter = createTRPCRouter({
  getAll: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.config.findMany({ select: { name: true, id: true } }),
  ),
  createConfig: publicProcedure
    .input(createConfigFormValuesSchema)
    .mutation(
      async ({ ctx, input: { type, name, ...rest } }) =>
        await ctx.prisma.config.create({ data: { name, type, data: rest } }),
    ),
  deleteConfig: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.config.delete({ where: { id: input.id } }),
    ),
  getConfigDetail: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.config.findUniqueOrThrow({ where: { id: input.id } }),
    ),
});
