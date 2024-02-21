import { router } from "../trpc";
import { actionRouter } from "./action";

export const appRouter = router({
  action: actionRouter,
});

export type AppRouter = typeof appRouter;
