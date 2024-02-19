import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { CreateHTTPContextOptions } from "@trpc/server/dist/adapters/standalone";

interface Context {
  runningFrom: Date | false;
}

const context: Context = { runningFrom: false };

export const createContext = async (
  _opts: CreateWSSContextFnOptions | CreateHTTPContextOptions,
) => {
  return {
    context,
  };
};
