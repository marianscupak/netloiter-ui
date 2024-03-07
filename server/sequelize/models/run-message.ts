import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { CreationOptional } from "@sequelize/core";
import { Optional } from "@prisma/client/runtime/library";

interface RunMessageAttributes {
  id: number;
  data: object;
  time: Date;
  runId: number;
}

interface RunMessageCreationAttributes
  extends Optional<RunMessageAttributes, "id"> {}

@Table({ tableName: "RunMessage", timestamps: false })
export class RunMessage extends Model<
  RunMessageAttributes,
  RunMessageCreationAttributes
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column({ type: DataType.JSON, allowNull: false })
  declare data: object;

  @PrimaryKey
  @Column(DataType.DATE)
  declare time: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare runId: number;
}
