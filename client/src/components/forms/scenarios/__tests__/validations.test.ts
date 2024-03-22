import {
  CreateScenarioFormValues,
  createScenarioFormValuesSchema,
} from "../create-scenario-form-types";
import {
  ActionType,
  GuardType,
  RuleType,
  ScenarioType,
} from "../../../../../../server/prisma/public";
import { CreateRuleFormValues } from "../../rules/create-rule-form-types";
import { SequenceMode, ValueGeneratorType } from "../../value-generators/types";

const rule: Omit<CreateRuleFormValues, "name"> = {
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

describe("scenario validations module", () => {
  test("scenario validations should pass on valid scenario", () => {
    const scenario: CreateScenarioFormValues = {
      name: "Test scenario",
      type: ScenarioType.Sequential,
      defaultAction: ActionType.Finish,
      rules: [rule],
    };

    expect(createScenarioFormValuesSchema.parse(scenario)).toEqual(scenario);
  });
  test("scenario validations should fail on invalid scenario", () => {
    // @ts-expect-error Intentionally invalid
    const scenario: CreateScenarioFormValues = {
      name: "Invalid scenario",
      type: ScenarioType.Sequential,
      defaultAction: ActionType.Finish,
    };

    expect(
      createScenarioFormValuesSchema.safeParse(scenario).success,
    ).toBeFalsy();
  });
});
