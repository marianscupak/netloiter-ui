import { Sequelize } from "sequelize-typescript";
import { z } from "zod";
import { Run } from "./models/run";
import { RunMessage } from "./models/run-message";

const databaseUrl = z.string().parse(process.env.DATABASE_URL);

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  protocol: "postgres",
  schema: "public",
  models: [Run, RunMessage],
  logging: false,
});

export const initHyperTable = async (sequelize: Sequelize) => {
  // Create hypertables if they don't exist
  const [, result] = await sequelize.query(
    "SELECT * FROM timescaledb_information.hypertables;",
  );
  // @ts-expect-error Timescale + sequelize types
  if (!result.rows.find((x) => x.hypertable_name === "RunMessage")) {
    await sequelize.query(
      "SELECT create_hypertable('\"RunMessage\"', by_range('time'));",
    );
  }
};
