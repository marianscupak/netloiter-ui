import { router } from "../trpc";
import { actionRouter } from "./action";
import { inferRouterOutputs } from "@trpc/server";
import { guardRouter } from "./guard";

export const appRouter = router({
  action: actionRouter,
  guard: guardRouter,
});

export type AppRouter = typeof appRouter;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
