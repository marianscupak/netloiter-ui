import {
  BitNoiseLayer,
  BitNoiseStrategy,
  CreateActionFormValues,
  createActionFormValuesSchema,
  ReorderStrategy,
} from "../create-action-form-types";
import { ActionType } from "../../../../../../server/prisma";

describe("action validations module", () => {
  test("valid bit noise action validation should pass", () => {
    const action: CreateActionFormValues = {
      type: ActionType.BitNoise,
      name: "Throttle action",
      usingPercentage: true,
      percentageOfBitsToSwap: 0.3,
      layer: BitNoiseLayer.L2,
      noiseStrategy: BitNoiseStrategy.Random,
    };

    expect(createActionFormValuesSchema.parse(action)).toEqual(action);
  });
  test("invalid bit noise action validation should fail", () => {
    // Using percentage true, but using amount
    const action: CreateActionFormValues = {
      type: ActionType.BitNoise,
      name: "Invalid action",
      usingPercentage: true,
      amountOfBitsToSwap: 35,
      layer: BitNoiseLayer.L2,
      noiseStrategy: BitNoiseStrategy.Random,
    };
    expect(createActionFormValuesSchema.safeParse(action).success).toBeFalsy();

    // Percentage above 100%
    const action2: CreateActionFormValues = {
      type: ActionType.BitNoise,
      name: "Invalid action",
      usingPercentage: true,
      percentageOfBitsToSwap: 2,
      layer: BitNoiseLayer.L2,
      noiseStrategy: BitNoiseStrategy.Random,
    };
    expect(createActionFormValuesSchema.safeParse(action2).success).toBeFalsy();

    // Percentage below 0
    const action3: CreateActionFormValues = {
      type: ActionType.BitNoise,
      name: "Invalid action",
      usingPercentage: true,
      percentageOfBitsToSwap: -0.1,
      layer: BitNoiseLayer.L2,
      noiseStrategy: BitNoiseStrategy.Random,
    };
    expect(createActionFormValuesSchema.safeParse(action3).success).toBeFalsy();

    // Amount below 0
    const action4: CreateActionFormValues = {
      type: ActionType.BitNoise,
      name: "Invalid action",
      usingPercentage: false,
      amountOfBitsToSwap: -1,
      layer: BitNoiseLayer.L2,
      noiseStrategy: BitNoiseStrategy.Random,
    };
    expect(createActionFormValuesSchema.safeParse(action4).success).toBeFalsy();
  });
  test("valid delay action validation should pass", () => {
    const action: CreateActionFormValues = {
      type: ActionType.Delay,
      name: "Delay action",
      n: 5,
    };

    expect(createActionFormValuesSchema.parse(action)).toEqual(action);

    const action2: CreateActionFormValues = {
      type: ActionType.Delay,
      name: "Delay action",
      n: 0,
    };

    expect(createActionFormValuesSchema.parse(action2)).toEqual(action2);
  });
  test("invalid delay action validation should fail", () => {
    // N below 0
    const action: CreateActionFormValues = {
      type: ActionType.Delay,
      name: "Invalid delay action",
      n: -1,
    };

    expect(createActionFormValuesSchema.safeParse(action).success).toBeFalsy();
  });
  test("valid reorder action validation should pass", () => {
    const action: CreateActionFormValues = {
      type: ActionType.Reorder,
      name: "Reorder action",
      count: 1,
      reorderStrategy: ReorderStrategy.Random,
    };

    expect(createActionFormValuesSchema.parse(action)).toEqual(action);
  });
  test("invalid reorder action validation should fail", () => {
    // N equals 0
    const action: CreateActionFormValues = {
      type: ActionType.Reorder,
      name: "Invalid reorder action",
      count: 0,
      reorderStrategy: ReorderStrategy.Random,
    };

    expect(createActionFormValuesSchema.safeParse(action).success).toBeFalsy();

    // N below 0
    const action2: CreateActionFormValues = {
      type: ActionType.Reorder,
      name: "Invalid reorder action",
      count: -1,
      reorderStrategy: ReorderStrategy.Random,
    };

    expect(createActionFormValuesSchema.safeParse(action2).success).toBeFalsy();
  });
  test("valid replicate action validation should pass", () => {
    const action: CreateActionFormValues = {
      type: ActionType.Replicate,
      name: "Replicate action",
      count: 1,
      action: ActionType.Finish,
    };

    expect(createActionFormValuesSchema.parse(action)).toEqual(action);
  });
  test("invalid replicate action validation should fail", () => {
    // count equals 0
    const action: CreateActionFormValues = {
      type: ActionType.Replicate,
      name: "Invalid replicate action",
      count: 0,
      action: ActionType.Finish,
    };

    expect(createActionFormValuesSchema.safeParse(action).success).toBeFalsy();

    // N below 0
    const action2: CreateActionFormValues = {
      type: ActionType.Replicate,
      name: "Invalid replicate action",
      count: -1,
      action: ActionType.Finish,
    };

    expect(createActionFormValuesSchema.safeParse(action2).success).toBeFalsy();
  });
  test("valid socket tcp action validation should pass", () => {
    const action: CreateActionFormValues = {
      type: ActionType.SocketTcp,
      name: "Socket TCP action",
      ip: "127.0.0.1",
      port: 3030,
      mark: 2,
      packFormat: "Pack format",
    };

    expect(createActionFormValuesSchema.parse(action)).toEqual(action);
  });
  test("invalid socket tcp action validation should fail", () => {
    // invalid IP
    const action: CreateActionFormValues = {
      type: ActionType.SocketTcp,
      name: "Invalid socket TCP action",
      ip: "127.0",
      port: 3030,
      mark: 2,
      packFormat: "Pack format",
    };

    expect(createActionFormValuesSchema.safeParse(action).success).toBeFalsy();
  });
  test("valid throttle action validation should pass", () => {
    const action: CreateActionFormValues = {
      type: ActionType.Throttle,
      name: "Throttle action",
      limit: 2000,
    };

    expect(createActionFormValuesSchema.parse(action)).toEqual(action);
  });
  test("invalid throttle action validation should fail", () => {
    // limit equals 0
    const action: CreateActionFormValues = {
      type: ActionType.Throttle,
      name: "Throttle action",
      limit: 0,
    };

    expect(createActionFormValuesSchema.safeParse(action).success).toBeFalsy();

    // limit below 0
    const action2: CreateActionFormValues = {
      type: ActionType.Throttle,
      name: "Throttle action",
      limit: -1,
    };

    expect(createActionFormValuesSchema.safeParse(action2).success).toBeFalsy();
  });
});
