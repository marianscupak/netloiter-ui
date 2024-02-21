import { initTRPC } from "@trpc/server";
import { createContext } from "./context";

const t = initTRPC.context<typeof createContext>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const router = t.router;
