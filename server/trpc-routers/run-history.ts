import { createTRPCRouter, publicProcedure } from "../trpc";
import { Run } from "../sequelize/models/run";
import { z } from "zod";
import { RunMessage } from "../sequelize/models/run-message";
import { objectWithId } from "./utils/object-with-id";
import { getScenarioDetail } from "./utils/scenario";
import { TRPCError } from "@trpc/server";
import { Op } from "@sequelize/core";
import { messageTypeSchema } from "../nl-status/message-types";

export const runHistoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => await Run.findAll()),
  deleteRunHistory: publicProcedure
    .input(objectWithId)
    .mutation(async ({ input: { id } }) => {
      await RunMessage.destroy({ where: { runId: id } });
      await Run.destroy({ where: { id } });
    }),
  getRunHistoryDetail: publicProcedure
    .input(
      objectWithId.merge(
        z.object({ messageTypes: z.array(messageTypeSchema).optional() }),
      ),
    )
    .query(async ({ input: { id, messageTypes }, ctx }) => {
      const run = await Run.findByPk(id);

      if (run) {
        const scenario = await getScenarioDetail(ctx, run.scenarioId);
        const messagesCount = await RunMessage.count({
          where: messageTypes
            ? { "data.type": { [Op.in]: messageTypes }, runId: id }
            : { runId: id },
        });

        return {
          ...run.dataValues,
          scenario,
          messagesCount,
        };
      }
      throw new TRPCError({ code: "NOT_FOUND" });
    }),
  getRunMessages: publicProcedure
    .input(
      objectWithId.merge(
        z.object({
          messageTypes: z.array(messageTypeSchema).optional(),
          page: z.number(),
          pageSize: z.number(),
        }),
      ),
    )
    .query(
      async ({ input: { page, pageSize, messageTypes, id } }) =>
        await RunMessage.findAll({
          limit: pageSize,
          offset: (page - 1) * pageSize,
          where: messageTypes
            ? { "data.type": { [Op.in]: messageTypes }, runId: id }
            : undefined,
          order: [["time", "DESC"]],
          subQuery: false,
        }),
    ),
});
