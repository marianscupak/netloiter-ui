import { createTRPCRouter, publicProcedure } from "../trpc";
import { createScenarioFormValuesSchema } from "netloiter-ui-fe/src/components/forms/scenarios/create-scenario-form-types";
import { createRule } from "./utils/rule";
import { getScenarioDetail } from "./utils/scenario";
import { objectWithId } from "./utils/object-with-id";
import { parseScenarioForNl } from "../nl-status/parse-config-for-nl";

export const scenarioRouter = createTRPCRouter({
  getAll: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.scenario.findMany({
        select: { name: true, id: true },
      }),
  ),
  createScenario: publicProcedure
    .input(createScenarioFormValuesSchema)
    .mutation(async ({ ctx, input: { rules, type, name, defaultAction } }) => {
      const newScenario = await ctx.prisma.scenario.create({
        data: { name, type, defaultAction },
      });

      const rulesWithIds = rules.filter((rule) => rule.loadedId !== undefined);
      if (rulesWithIds.length > 0) {
        await ctx.prisma.ruleToScenario.createMany({
          data: rulesWithIds.map(({ loadedId }) => ({
            ruleId: loadedId!,
            scenarioId: newScenario.id,
          })),
        });
      }

      const newRules = rules.filter((rule) => rule.loadedId === undefined);
      if (newRules.length > 0) {
        let index = 1;
        for (const rule of newRules) {
          const newRule = await createRule(ctx, {
            ...rule,
            name: `${name}_Rule_${index}`,
          });

          await ctx.prisma.ruleToScenario.create({
            data: { ruleId: newRule.id, scenarioId: newScenario.id },
          });
          index++;
        }
      }

      return newScenario;
    }),
  deleteScenario: publicProcedure
    .input(objectWithId)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.ruleToScenario.deleteMany({
        where: { scenarioId: input.id },
      });
      return await ctx.prisma.scenario.delete({ where: { id: input.id } });
    }),
  getScenarioDetail: publicProcedure
    .input(objectWithId)
    .mutation(async ({ ctx, input }) => await getScenarioDetail(ctx, input.id)),
  getScenarioDetailQuery: publicProcedure
    .input(objectWithId)
    .query(async ({ ctx, input }) => await getScenarioDetail(ctx, input.id)),
  parseScenarioForNl: publicProcedure
    .input(createScenarioFormValuesSchema)
    .mutation(async ({ input }) => parseScenarioForNl(input)),
});
