import { createTRPCRouter, publicProcedure } from "../trpc";
import { createGuardFormValuesSchema } from "netloiter-ui-fe/src/components/forms/guards/create-guard-form-types";
import { convertGuardToFormValues } from "./utils/convert-model-to-form-values";
import { objectWithId } from "./utils/object-with-id";

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
    .input(objectWithId)
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.guard.delete({ where: { id: input.id } }),
    ),
  getGuardDetail: publicProcedure
    .input(objectWithId)
    .mutation(async ({ ctx, input }) =>
      convertGuardToFormValues()(
        await ctx.prisma.guard.findUniqueOrThrow({ where: { id: input.id } }),
      ),
    ),
  getGuardDetailQuery: publicProcedure
    .input(objectWithId)
    .query(async ({ ctx, input }) =>
      convertGuardToFormValues(true)(
        await ctx.prisma.guard.findUniqueOrThrow({ where: { id: input.id } }),
      ),
    ),
});
