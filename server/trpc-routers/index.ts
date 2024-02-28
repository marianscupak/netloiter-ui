import { router } from "../trpc";
import { actionRouter } from "./action";
import { inferRouterOutputs } from "@trpc/server";
import { guardRouter } from "./guard";
import { ruleRouter } from "./rule";

export const appRouter = router({
  action: actionRouter,
  guard: guardRouter,
  rule: ruleRouter,
});

export type AppRouter = typeof appRouter;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
