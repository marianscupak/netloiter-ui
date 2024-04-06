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

const RUN_SCENARIO_FK_NAME = "fk_run_scenario";
const RUN_CONFIG_FK_NAME = "fk_run_config";

export const initHyperTable = async (sequelize: Sequelize) => {
  // Create hypertables if they don't exist
  const [, result] = await sequelize.query(
    "SELECT * FROM timescaledb_information.hypertables;",
  );
  // @ts-expect-error Timescale + sequelize types
  if (!result.rows.find((x) => x.hypertable_name === "RunMessage")) {
    await sequelize.query(
      `SELECT create_hypertable('"RunMessage"', by_range('time'));`,
    );
  }

  const [, runScenarioFkExists] = await sequelize.query(
    `SELECT 1 FROM pg_constraint WHERE conname = '${RUN_SCENARIO_FK_NAME}'`,
  );

  if ((runScenarioFkExists as { rowCount: number }).rowCount === 0) {
    await sequelize.query(
      'ALTER TABLE "Run" ' +
        `ADD CONSTRAINT ${RUN_SCENARIO_FK_NAME} ` +
        'FOREIGN KEY ("scenarioId") ' +
        'REFERENCES "Scenario"(id);',
    );
  }

  const [, runConfigFkExists] = await sequelize.query(
    `SELECT 1 FROM pg_constraint WHERE conname = '${RUN_CONFIG_FK_NAME}'`,
  );

  if ((runConfigFkExists as { rowCount: number }).rowCount === 0) {
    await sequelize.query(
      'ALTER TABLE "Run" ' +
        `ADD CONSTRAINT ${RUN_CONFIG_FK_NAME} ` +
        'FOREIGN KEY ("configId") ' +
        'REFERENCES "Config"(id);',
    );
  }
};
