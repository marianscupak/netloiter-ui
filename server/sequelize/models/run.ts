import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { HasManyGetAssociationsMixin } from "@sequelize/core";
import type { NonAttribute } from "@sequelize/core";
import { RunMessage } from "./run-message";
import { Optional } from "@prisma/client/runtime/library";

interface RunAttributes {
  id: number;
  dateTime: Date;
  scenarioId?: number;
  configId?: number;
}

interface RunCreationAttributes extends Optional<RunAttributes, "id"> {}

@Table({ tableName: "Run" })
export class Run extends Model<RunAttributes, RunCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.DATE, allowNull: false })
  declare dateTime: Date;

  @Column(DataType.INTEGER)
  declare scenarioId: number;

  @Column(DataType.INTEGER)
  declare configId: number;

  @HasMany(() => RunMessage, "runId")
  declare messages: NonAttribute<RunMessage[]>;

  // @ts-expect-error Sequelize types
  declare getMessages: HasManyGetAssociationsMixin<RunMessage>;
}
