import {
  CreateActionFormValues,
  createActionFormValuesSchema,
} from "../create-action-form-types";
import { ActionType } from "../../../../../../server/prisma";
import { SequenceMode, ValueGeneratorType } from "../../value-generators/types";

describe("action validations module", () => {
  test("action validations should pass on valid action", () => {
    const action: CreateActionFormValues = {
      type: ActionType.Throttle,
      name: "Throttle action",
      limit: {
        type: ValueGeneratorType.Sequence,
        mode: SequenceMode.Repeat,
        min: 1000,
        step: 20,
        t: 2,
      },
    };

    expect(createActionFormValuesSchema.parse(action)).toEqual(action);
  });
  test("action validations should fail on invalid action", () => {
    const invalidDelayAction: CreateActionFormValues = {
      type: ActionType.Delay,
      name: "Invalid action",
      // @ts-expect-error Intentionally wrong
      limit: 2000,
    };
    expect(
      createActionFormValuesSchema.safeParse(invalidDelayAction).success,
    ).toBeFalsy();

    // @ts-expect-error Intentionally wrong
    const invalidReplicateAction: CreateActionFormValues = {
      type: ActionType.Replicate,
      name: "Invalid action",
    };
    expect(
      createActionFormValuesSchema.safeParse(invalidReplicateAction).success,
    ).toBeFalsy();
  });
});
