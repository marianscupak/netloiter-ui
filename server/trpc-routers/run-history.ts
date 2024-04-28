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
import { sequelize } from "../sequelize";
import { NetworkFlow } from "netloiter-ui-fe/src/utils/common";
import { ActionType } from "@prisma/client";

export const runHistoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(
    async () => await Run.findAll({ order: [["dateTime", "DESC"]] }),
  ),
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
        const messagesCount = await RunMessage.count({
          where: messageTypes
            ? { "data.type": { [Op.in]: messageTypes }, runId: id }
            : { runId: id },
        });

        if (run.scenarioId !== null) {
          const scenario = await getScenarioDetail(ctx, run.scenarioId);

          return {
            ...run.dataValues,
            scenario,
            messagesCount,
          };
        }

        return { ...run.dataValues, messagesCount };
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
            : { runId: id },
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
  getRunStatistics: publicProcedure
    .input(objectWithId)
    .query(async ({ input: { id }, ctx }) => {
      const scenarioId = (await Run.findOne({ where: { id } }))?.scenarioId;
      const actions = scenarioId
        ? await ctx.prisma.action.findMany({
            where: {
              rules: {
                some: { rule: { scenarios: { some: { scenarioId } } } },
              },
            },
            select: { type: true },
          })
        : [];
      const rulesChangedMessageCount = await RunMessage.count({
        where: { data: { type: MessageType.RulesReplaced }, runId: id },
      });

      const actionTypes = actions.map(({ type }) => type);

      const scenarioContainsActionType = (type: ActionType) =>
        actionTypes.includes(type) || rulesChangedMessageCount > 0;
      const containsFinish = scenarioContainsActionType(ActionType.Finish);
      const containsDrop = scenarioContainsActionType(ActionType.Drop);
      const containsSkip = scenarioContainsActionType(ActionType.Skip);
      const containsPause = scenarioContainsActionType(ActionType.Pause);

      const [
        packetsProcessed,
        packetsByTime,
        packetsFinishedCount,
        packetsFinishedByTime,
        packetsDroppedCount,
        packetsDroppedByTime,
        packetsSkippedCount,
        packetsSkippedByTime,
        packetsPausedCount,
        packetsPausedByTime,
        messageCountByType,
      ] = await Promise.all([
        RunMessage.count({
          where: {
            runId: id,
            data: { type: MessageType.StartingPacketProcessing },
          },
        }),
        RunMessage.findAll({
          where: {
            runId: id,
            data: { type: MessageType.StartingPacketProcessing },
          },
          group: "time",
          attributes: [
            "time",
            [sequelize.fn("COUNT", sequelize.col("id")), "packetsCount"],
          ],
          order: ["time"],
        }),
        containsFinish
          ? RunMessage.count({
              where: { runId: id, data: { type: MessageType.FinishAction } },
            })
          : 0,
        containsFinish
          ? RunMessage.findAll({
              where: { runId: id, data: { type: MessageType.FinishAction } },
              group: "time",
              attributes: [
                "time",
                [sequelize.fn("COUNT", sequelize.col("id")), "packetsCount"],
              ],
              order: ["time"],
            })
          : [],
        containsDrop
          ? RunMessage.count({
              where: { runId: id, data: { type: MessageType.DropAction } },
            })
          : 0,
        containsDrop
          ? RunMessage.findAll({
              where: { runId: id, data: { type: MessageType.DropAction } },
              group: "time",
              attributes: [
                "time",
                [sequelize.fn("COUNT", sequelize.col("id")), "packetsCount"],
              ],
              order: ["time"],
            })
          : [],
        containsSkip
          ? RunMessage.count({
              where: { runId: id, data: { type: MessageType.SkipAction } },
            })
          : 0,
        containsSkip
          ? RunMessage.findAll({
              where: { runId: id, data: { type: MessageType.SkipAction } },
              group: "time",
              attributes: [
                "time",
                [sequelize.fn("COUNT", sequelize.col("id")), "packetsCount"],
              ],
              order: ["time"],
            })
          : [],
        containsPause
          ? RunMessage.count({
              where: { runId: id, data: { type: MessageType.PauseAction } },
            })
          : 0,
        containsPause
          ? RunMessage.findAll({
              where: { runId: id, data: { type: MessageType.PauseAction } },
              group: "time",
              attributes: [
                "time",
                [sequelize.fn("COUNT", sequelize.col("id")), "packetsCount"],
              ],
              order: ["time"],
            })
          : [],
        sequelize.query(
          "SELECT data->>'type' as type, COUNT(*) as \"messagesCount\" " +
            'FROM "public"."RunMessage" ' +
            `WHERE "runId" = ${id} ` +
            "GROUP BY data->>'type'",
        ),
      ]);

      // Return the results
      return {
        packetsProcessed,
        packetsByTime: packetsByTime as unknown as {
          time: Date;
          packetsCount: number;
        }[],
        packetsFinishedCount,
        packetsFinishedByTime: packetsFinishedByTime as unknown as {
          time: Date;
          packetsCount: number;
        }[],
        packetsDroppedCount,
        packetsDroppedByTime: packetsDroppedByTime as unknown as {
          time: Date;
          packetsCount: number;
        }[],
        packetsSkippedCount,
        packetsSkippedByTime: packetsSkippedByTime as unknown as {
          time: Date;
          packetsCount: number;
        }[],
        packetsPausedCount,
        packetsPausedByTime: packetsPausedByTime as unknown as {
          time: Date;
          packetsCount: number;
        }[],
        messageCountByType: messageCountByType[0] as unknown as {
          type: MessageType;
          messagesCount: number;
        }[],
      };
    }),
  getRunFlows: publicProcedure
    .input(objectWithId)
    .query(async ({ input: { id } }) => {
      const [result] = await sequelize.query(
        `SELECT data->>'sourceIp' as "sourceIp", data->>'destIp' as "destIp", COUNT(*) as "messagesCount" 
        FROM "public"."RunMessage"
        WHERE "runId" = ${id} AND data->>'type' = '${MessageType.StartingPacketProcessing}'
        GROUP BY data->>'sourceIp', data->>'destIp'`,
      );

      return result as NetworkFlow[];
    }),
});
