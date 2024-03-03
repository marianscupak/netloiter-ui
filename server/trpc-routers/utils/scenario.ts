import { getRuleDetail } from "./rule";
import { Context } from "../../context";

export const getScenarioDetail = async (ctx: Context, id: number) => {
  const scenario = await ctx.prisma.scenario.findUniqueOrThrow({
    where: { id },
    include: { rules: true },
  });

  const rules = await Promise.all(
    scenario.rules.map(async (rule) => await getRuleDetail(ctx, rule.ruleId)),
  );

  return {
    ...scenario,
    rules,
  };
};
