import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  ConfigData,
  createConfigFormValuesSchema,
} from "netloiter-ui-fe/src/components/forms/configs/create-config-form-types";
import { objectWithId } from "./utils/object-with-id";

export const configRouter = createTRPCRouter({
  getAll: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.config.findMany({ select: { name: true, id: true } }),
  ),
  createConfig: publicProcedure
    .input(createConfigFormValuesSchema)
    .mutation(
      async ({ ctx, input: { mode, name, ...rest } }) =>
        await ctx.prisma.config.create({ data: { name, mode, data: rest } }),
    ),
  deleteConfig: publicProcedure
    .input(objectWithId)
    .mutation(
      async ({ ctx, input }) =>
        await ctx.prisma.config.delete({ where: { id: input.id } }),
    ),
  getConfigDetail: publicProcedure
    .input(objectWithId)
    .mutation(async ({ ctx, input }) => {
      const { id, name, mode, data } =
        await ctx.prisma.config.findUniqueOrThrow({ where: { id: input.id } });

      return { id, name, mode, ...(data as ConfigData) };
    }),
  getConfigDetailQuery: publicProcedure
    .input(objectWithId)
    .query(async ({ ctx, input }) => {
      const { id, name, mode, data } =
        await ctx.prisma.config.findUniqueOrThrow({ where: { id: input.id } });

      return { id, name, mode, ...(data as ConfigData) };
    }),
});
