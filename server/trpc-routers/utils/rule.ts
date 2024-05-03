import { Context } from "../../context";
import { CreateRuleFormValues } from "netloiter-ui-fe/src/components/forms/rules/create-rule-form-types";
import {
  convertActionToFormValues,
  convertGuardToFormValues,
} from "./convert-model-to-form-values";

export const createRule = async (
  ctx: Context,
  { name, actions, guards, type }: CreateRuleFormValues,
) => {
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

export const getRuleDetail = async (
  ctx: Context,
  id: number,
  includeName?: boolean,
) => {
  const rule = await ctx.prisma.rule.findUniqueOrThrow({
    where: { id },
    select: {
      type: true,
      id: true,
      actions: true,
      guards: true,
      name: includeName,
    },
  });

  const guardIds = rule.guards.map(({ guardId }) => guardId);
  const guards = (
    await ctx.prisma.guard.findMany({
      where: { id: { in: guardIds } },
    })
  ).map(convertGuardToFormValues());

  const actionIds = rule.actions.map(({ actionId }) => actionId);
  const actions = (
    await ctx.prisma.action.findMany({
      where: { id: { in: actionIds } },
    })
  ).map(convertActionToFormValues());

  return { ...rule, guards, actions };
};
