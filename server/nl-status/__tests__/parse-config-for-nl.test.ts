import {
  NL_REST_PORT,
  parseActionForNl,
  parseConfigForNl,
  parseGuardForNl,
  parseRuleForNl,
  parseScenarioForNl,
  parseValueGenerator,
  uiFlows,
} from "../parse-config-for-nl";
import { CreateScenarioFormValues } from "netloiter-ui-fe/src/components/forms/scenarios/create-scenario-form-types";
import {
  ActionType,
  ConfigMode,
  GuardType,
  RuleType,
  ScenarioType,
} from "../../prisma/public";
import {
  SequenceMode,
  ValueGenerator,
  ValueGeneratorType,
} from "netloiter-ui-fe/src/components/forms/value-generators/types";
import {
  BitNoiseLayer,
  BitNoiseStrategy,
} from "netloiter-ui-fe/src/components/forms/actions/create-action-form-types";
import {
  CreateConfigFormValues,
  FlowActionType,
} from "netloiter-ui-fe/src/components/forms/configs/create-config-form-types";

const valueGenerator: ValueGenerator = {
  type: ValueGeneratorType.Uniform,
  min: 0,
  max: 5,
  int: true,
  once: false,
};

const simpleGuard: CreateScenarioFormValues["rules"][number]["guards"][number] =
  {
    type: GuardType.TimePeriod,
    truePeriod: 5,
    falsePeriod: 5,
    instant: false,
    invert: false,
  };

const guardWithValueGenerator: CreateScenarioFormValues["rules"][number]["guards"][number] =
  {
    type: GuardType.EveryN,
    n: {
      type: ValueGeneratorType.Normal,
      int: true,
      once: false,
      average: 5,
      deviation: 2,
      min: 2,
    },
    invert: false,
  };

const simpleAction: CreateScenarioFormValues["rules"][number]["actions"][number] =
  {
    type: ActionType.BitNoise,
    percentageOfBitsToSwap: 0.4,
    layer: BitNoiseLayer.L2,
    noiseStrategy: BitNoiseStrategy.Random,
    usingPercentage: true,
  };

const actionWithValueGenerator: CreateScenarioFormValues["rules"][number]["actions"][number] =
  {
    type: ActionType.Delay,
    n: {
      type: ValueGeneratorType.Sequence,
      step: 1,
      mode: SequenceMode.Reverse,
      t: 2,
    },
  };

const simpleRule: CreateScenarioFormValues["rules"][number] = {
  type: RuleType.All,
  guards: [simpleGuard, guardWithValueGenerator],
  actions: [simpleAction, actionWithValueGenerator],
};

const expectedSimpleRuleResult: ReturnType<typeof parseRuleForNl> = {
  $type: RuleType.All,
  guards: [
    {
      $type: GuardType.TimePeriod,
      invert: false,
      t: 5,
      f: 5,
      instant: false,
    },
    {
      $type: GuardType.EveryN,
      invert: false,
      n: {
        // @ts-expect-error Different naming for value generator types
        $type: "NormalInt",
        m: 5,
        s: 2,
        min: 2,
        once: false,
      },
    },
  ],
  actions: [
    {
      $type: ActionType.BitNoise,
      layer: BitNoiseLayer.L2,
      x: 0.4,
      // @ts-expect-error Different naming for bit noise strategy
      strategy: "random",
    },
    {
      $type: "Delay",
      // @ts-expect-error Different naming for sequence value generator
      n: {
        $type: "SeqCount",
        step: 1,
        T: 2,
        mode: "reverse",
      },
    },
  ],
};

describe("parse config for NetLoiter module", () => {
  test("parses value generator", () => {
    const expectedResult: ReturnType<typeof parseValueGenerator> = {
      $type: "UniformInt",
      min: 0,
      max: 5,
      once: false,
    };

    expect(parseValueGenerator(valueGenerator)).toEqual(expectedResult);
  });
  test("parses guard", () => {
    const expectedResult: ReturnType<typeof parseGuardForNl> = {
      $type: GuardType.TimePeriod,
      invert: false,
      t: 5,
      f: 5,
      instant: false,
    };

    expect(parseGuardForNl(simpleGuard)).toEqual(expectedResult);
  });
  test("parses guard with value generator", () => {
    const expectedResult: ReturnType<typeof parseGuardForNl> = {
      $type: GuardType.EveryN,
      invert: false,
      n: {
        // @ts-expect-error Different naming for value generator types
        $type: "NormalInt",
        m: 5,
        s: 2,
        once: false,
        min: 2,
      },
    };

    expect(
      parseGuardForNl(JSON.parse(JSON.stringify(guardWithValueGenerator))),
    ).toEqual(expectedResult);
  });
  test("parses action", () => {
    const expectedResult: ReturnType<typeof parseActionForNl> = {
      $type: ActionType.BitNoise,
      layer: BitNoiseLayer.L2,
      x: 0.4,
      // @ts-expect-error Different naming for bit noise strategy
      strategy: "random",
    };

    expect(parseActionForNl(simpleAction)).toEqual(expectedResult);
  });
  test("parses action with value generator", () => {
    const expectedResult: ReturnType<typeof parseActionForNl> = {
      $type: "Delay",
      // @ts-expect-error Different naming for sequence value generator
      n: {
        $type: "SeqCount",
        step: 1,
        T: 2,
        mode: "reverse",
      },
    };

    expect(parseActionForNl(actionWithValueGenerator)).toEqual(expectedResult);
  });
  test("parses rule", () => {
    expect(parseRuleForNl(simpleRule)).toEqual(expectedSimpleRuleResult);
  });
  test("parses scenario", () => {
    const simpleScenario: CreateScenarioFormValues = JSON.parse(
      JSON.stringify({
        type: ScenarioType.Sequential,
        rules: [simpleRule],
        name: "scenario",
        defaultAction: ActionType.Finish,
      }),
    );

    const expectedResult: ReturnType<typeof parseScenarioForNl> = {
      $type: ScenarioType.Sequential,
      rules: [expectedSimpleRuleResult],
      default_action: "finish",
    };

    expect(parseScenarioForNl(simpleScenario)).toEqual(expectedResult);
  });
  test("parses sequential http scenario", () => {
    const httpScenario: CreateScenarioFormValues = {
      type: ScenarioType.SequentialHTTP,
      rules: [simpleRule],
      name: "scenario",
      defaultAction: ActionType.Finish,
    };

    const expectedResult: ReturnType<typeof parseScenarioForNl> = {
      $type: ScenarioType.SequentialHTTP,
      rules: [expectedSimpleRuleResult],
      default_action: "finish",
      server_address: ["0.0.0.0", NL_REST_PORT],
    };

    expect(parseScenarioForNl(httpScenario)).toEqual(expectedResult);
  });
  test("parses config", () => {
    const config: CreateConfigFormValues & { id: number } = {
      name: "test",
      mode: ConfigMode.nf_mark,
      flows: [{ all: true, action: FlowActionType.Catch }],
      id: 0,
      ignoreComm: false,
    };

    const expectedResult: ReturnType<typeof parseConfigForNl> = {
      mode: ConfigMode.nf_mark,
      flows: [
        {
          all: true,
          action: FlowActionType.Catch,
        },
      ],
    };

    expect(parseConfigForNl(config)).toEqual(expectedResult);
  });
  test("parses config with ignoring UI communication", () => {
    const config: CreateConfigFormValues & { id: number } = {
      name: "test",
      mode: ConfigMode.nf_mark,
      flows: [{ all: true, action: FlowActionType.Catch }],
      id: 0,
      ignoreComm: true,
    };

    const expectedResult: ReturnType<typeof parseConfigForNl> = {
      mode: ConfigMode.nf_mark,
      flows: [
        {
          all: true,
          action: FlowActionType.Catch,
        },
        ...uiFlows,
      ],
    };

    expect(parseConfigForNl(config)).toEqual(expectedResult);
  });
});
