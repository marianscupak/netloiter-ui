import { Context } from "../../context";
import { CreateRuleFormValues } from "netloier-ui/src/components/forms/rules/create-rule-form-types";
import { TRPCError } from "@trpc/server";

export const createRule = async (
  ctx: Context,
  { name, actions, guards, type }: CreateRuleFormValues,
) => {
  if (actions.length === 0 || guards.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Provide at least one guard and action",
    });
  }

  const actionsWithIds = actions.filter(
    (action) => action.loadedId !== undefined,
  );
  const guardsWithIds = guards.filter((guard) => guard.loadedId !== undefined);

  const newRule = await ctx.prisma.rule.create({
    data: {
      type,
      name,
    },
  });

  if (actionsWithIds.length > 0) {
    await ctx.prisma.actionToRule.createMany({
      data: actionsWithIds.map(({ loadedId }) => ({
        ruleId: newRule.id,
        actionId: loadedId!,
      })),
    });
  }

  if (guardsWithIds.length > 0) {
    await ctx.prisma.guardToRule.createMany({
      data: guardsWithIds.map(({ loadedId }) => ({
        ruleId: newRule.id,
        guardId: loadedId!,
      })),
    });
  }

  const newActions = actions.filter((action) => action.loadedId === undefined);

  if (newActions.length > 0) {
    let index = 1;
    for (const { type, ...rest } of newActions) {
      const newDbAction = await ctx.prisma.action.create({
        data: { name: `${name}_Action_${index}`, type, data: rest },
      });

      await ctx.prisma.actionToRule.create({
        data: { ruleId: newRule.id, actionId: newDbAction.id },
      });
      index++;
    }
  }

  const newGuards = guards.filter((guard) => guard.loadedId === undefined);

  if (newGuards.length > 0) {
    let index = 1;
    for (const { type, invert, ...rest } of newGuards) {
      const newDbGuard = await ctx.prisma.guard.create({
        data: { name: `${name}_Guard_${index}`, type, invert, data: rest },
      });

      await ctx.prisma.guardToRule.create({
        data: { ruleId: newRule.id, guardId: newDbGuard.id },
      });
      index++;
    }
  }

  return newRule;
};

export const getRuleDetail = async (ctx: Context, id: number) => {
  const rule = await ctx.prisma.rule.findUniqueOrThrow({
    where: { id },
    select: { type: true, id: true, actions: true, guards: true },
  });

  const guardIds = rule.guards.map(({ guardId }) => guardId);
  const guards = await ctx.prisma.guard.findMany({
    where: { id: { in: guardIds } },
  });

  const actionIds = rule.actions.map(({ actionId }) => actionId);
  const actions = await ctx.prisma.action.findMany({
    where: { id: { in: actionIds } },
  });

  return { ...rule, guards, actions };
};