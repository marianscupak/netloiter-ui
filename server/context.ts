import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { CreateHTTPContextOptions } from "@trpc/server/dist/adapters/standalone";
import { prisma } from "./prisma";

export const createContext = async (
  _opts: CreateWSSContextFnOptions | CreateHTTPContextOptions,
) => {
  return {
    prisma,
  };
};
