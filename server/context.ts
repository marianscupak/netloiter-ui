import { prisma } from "./prisma";

export const createContext = async () => {
  return {
    prisma,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
