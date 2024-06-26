import { router } from "../trpc";
import { actionRouter } from "./action";
import { inferRouterOutputs } from "@trpc/server";
import { guardRouter } from "./guard";
import { ruleRouter } from "./rule";
import { scenarioRouter } from "./scenario";
import { configRouter } from "./config";
import { runHistoryRouter } from "./run-history";

export const appRouter = router({
  action: actionRouter,
  guard: guardRouter,
  rule: ruleRouter,
  scenario: scenarioRouter,
  config: configRouter,
  runHistory: runHistoryRouter,
});

export type AppRouter = typeof appRouter;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
