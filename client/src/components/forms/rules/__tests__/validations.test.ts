import {
  CreateRuleFormValues,
  createRuleFormValuesSchema,
} from "../create-rule-form-types";
import {
  GuardType,
  RuleType,
  ActionType,
} from "../../../../../../server/prisma/public";
import { SequenceMode, ValueGeneratorType } from "../../value-generators/types";

describe("rule validations module", () => {
  test("rule validations should pass on valid rule", () => {
    const rule: CreateRuleFormValues = {
      name: "Test rule",
      type: RuleType.All,
      actions: [
        {
          type: ActionType.Throttle,
          limit: {
            type: ValueGeneratorType.Sequence,
            mode: SequenceMode.Repeat,
            min: 1000,
            step: 20,
            t: 2,
          },
        },
      ],
      guards: [
        {
          type: GuardType.TimePeriod,
          truePeriod: 5,
          falsePeriod: {
            type: ValueGeneratorType.Normal,
            average: 5,
            deviation: 1,
          },
          invert: false,
          instant: true,
        },
      ],
    };

    expect(createRuleFormValuesSchema.parse(rule)).toEqual(rule);
  });
  test("rule validations should fail on invalid rule", () => {
    // @ts-expect-error Intentionally invalid
    const rule: CreateRuleFormValues = {
      name: "Test rule",
      type: RuleType.All,
      guards: [
        {
          type: GuardType.TimePeriod,
          truePeriod: 5,
          falsePeriod: {
            type: ValueGeneratorType.Normal,
            average: 5,
            deviation: 1,
          },
          invert: false,
          instant: true,
        },
      ],
    };
    expect(createRuleFormValuesSchema.safeParse(rule).success).toBeFalsy();

    const ruleWithoutName: CreateRuleFormValues = {
      name: "",
      type: RuleType.All,
      actions: [{ type: ActionType.Finish }],
      guards: [
        {
          type: GuardType.TimePeriod,
          truePeriod: 5,
          falsePeriod: {
            type: ValueGeneratorType.Normal,
            average: 5,
            deviation: 1,
          },
          invert: false,
          instant: true,
        },
      ],
    };
    expect(
      createRuleFormValuesSchema.safeParse(ruleWithoutName).success,
    ).toBeFalsy();
  });
});
