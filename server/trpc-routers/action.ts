import { createTRPCRouter, publicProcedure } from "../trpc";
import { createActionFormValuesSchema } from "netloier-ui/src/components/forms/actions/create-action-form-types";
import { z } from "zod";
import { convertActionToFormValues } from "./utils/convert-model-to-form-values";

export const actionRouter = createTRPCRouter({
  getAll: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.action.findMany({
        select: { name: true, id: true },
      }),
  ),
  createAction: publicProcedure.input(createActionFormValuesSchema).mutation(
    async ({ ctx, input: { type, name, ...rest } }) =>
      await ctx.prisma.action.create({
        data: { type, name, data: rest },
      }),
  ),
  deleteAction: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.action.delete({ where: { id: input.id } }),
    ),
  getActionDetail: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) =>
      convertActionToFormValues()(
        await ctx.prisma.action.findUniqueOrThrow({ where: { id: input.id } }),
      ),
    ),
  getActionDetailQuery: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) =>
      convertActionToFormValues(true)(
        await ctx.prisma.action.findUniqueOrThrow({ where: { id: input.id } }),
      ),
    ),
});
