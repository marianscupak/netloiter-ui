import { prisma } from "./prisma";
import { sequelize } from "./sequelize";

export const createContext = async () => {
  return {
    prisma,
    sequelize,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
