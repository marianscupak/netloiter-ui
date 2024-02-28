import { router } from "../trpc";
import { actionRouter } from "./action";
import { inferRouterOutputs } from "@trpc/server";
import { guardRouter } from "./guard";
import { ruleRouter } from "./rule";
import { scenarioRouter } from "./scenario";

export const appRouter = router({
  action: actionRouter,
  guard: guardRouter,
  rule: ruleRouter,
  scenario: scenarioRouter,
});

export type AppRouter = typeof appRouter;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
