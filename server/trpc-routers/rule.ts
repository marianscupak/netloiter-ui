import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { createRuleFormValuesSchema } from "netloier-ui/src/components/forms/rules/create-rule-form-types";
import { createRule, getRuleDetail } from "./utils/rule";

export const ruleRouter = createTRPCRouter({
  getAll: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.rule.findMany({
        select: { name: true, id: true },
      }),
  ),
  createRule: publicProcedure
    .input(createRuleFormValuesSchema)
    .mutation(async ({ ctx, input }) => await createRule(ctx, input)),
  deleteRule: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.actionToRule.deleteMany({ where: { ruleId: input.id } });
      await ctx.prisma.guardToRule.deleteMany({ where: { ruleId: input.id } });
      return await ctx.prisma.rule.delete({ where: { id: input.id } });
    }),
  getRuleDetail: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => await getRuleDetail(ctx, input.id)),
  getRuleDetailQuery: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => await getRuleDetail(ctx, input.id, true)),
});
