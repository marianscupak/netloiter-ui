import { createTRPCRouter, publicProcedure } from "../trpc";
import { createActionFormValuesSchema } from "netloier-ui/src/components/forms/actions/create-action-form-types";
import { z } from "zod";

export const actionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.action.findMany({
      select: { name: true, id: true },
    });
  }),
  createAction: publicProcedure
    .input(createActionFormValuesSchema)
    .mutation(async ({ ctx, input }) => {
      const { type, name, ...rest } = input;

      return await ctx.prisma.action.create({
        data: { type, name, data: rest },
      });
    }),
  deleteAction: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.action.delete({ where: { id: input.id } }),
    ),
});
