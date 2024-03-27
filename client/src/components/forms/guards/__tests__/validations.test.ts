import {
  CreateGuardFormValues,
  createGuardFormValuesSchema,
} from "../create-guard-form-types";
import { GuardType } from "../../../../../../server/prisma/public";
import { ValueGeneratorType } from "../../value-generators/types";

describe("guard validations module", () => {
  test("guard validations should pass on valid guard", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.TimePeriod,
      truePeriod: 5,
      falsePeriod: {
        type: ValueGeneratorType.Normal,
        average: 5,
        deviation: 1,
        min: 3,
      },
      invert: false,
      instant: true,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("guard validations should fail on invalid guard", () => {
    // @ts-expect-error Intentionally invalid
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.TimePeriod,
      truePeriod: 5,
      invert: false,
      instant: true,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();
  });
});
