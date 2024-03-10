import { createTRPCRouter, publicProcedure } from "../trpc";
import { Run } from "../sequelize/models/run";
import { z } from "zod";
import { RunMessage } from "../sequelize/models/run-message";
import { objectWithId } from "./utils/object-with-id";
import { getScenarioDetail } from "./utils/scenario";
import { TRPCError } from "@trpc/server";
import { Op } from "@sequelize/core";
import { MessageType, messageTypeSchema } from "../nl-status/message-types";
import { editRunConfigFormValuesSchema } from "netloiter-ui-fe/src/components/forms/edit-run-config/edit-run-config-form-types";
import axios from "axios";
import { NL_REST_PORT, parseRuleForNl } from "../nl-status/parse-config-for-nl";

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
  getLastRun: publicProcedure.query(
    async () => await Run.findOne({ order: [["dateTime", "DESC"]] }),
  ),
  editRunConfig: publicProcedure
    .input(editRunConfigFormValuesSchema)
    .mutation(async ({ input }) => {
      try {
        const nlHostIp = z.string().parse(process.env.NL_HOST_IP);
        const response = await axios.post(
          `http://${nlHostIp}:${NL_REST_PORT}/rules/replace`,
          input.rules.map(parseRuleForNl),
        );

        if (response.status === 204) {
          const currentRun = await Run.findOne({
            order: [["dateTime", "DESC"]],
          });
          if (currentRun) {
            await RunMessage.create({
              runId: currentRun.id,
              time: new Date(),
              data: { type: MessageType.RulesReplaced, newRules: input.rules },
            });
          }
        }
      } catch (e) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
