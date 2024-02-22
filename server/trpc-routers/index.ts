import { router } from "../trpc";
import { actionRouter } from "./action";
import { inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  action: actionRouter,
});

export type AppRouter = typeof appRouter;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
