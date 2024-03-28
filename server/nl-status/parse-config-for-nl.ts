import {
  CreateConfigFormValues,
  Flow,
  FlowActionType,
} from "netloiter-ui-fe/src/components/forms/configs/create-config-form-types";
import { CreateScenarioFormValues } from "netloiter-ui-fe/src/components/forms/scenarios/create-scenario-form-types";
import {
  ActionType,
  ConfigMode,
  GuardType,
  ScenarioType,
} from "../prisma/public";
import { SizeGuardOperation } from "netloiter-ui-fe/src/components/forms/guards/create-guard-form-types";
import {
  SequenceMode,
  ValueGenerator,
  ValueGeneratorType,
} from "netloiter-ui-fe/src/components/forms/value-generators/types";
import { CreateRuleFormValues } from "netloiter-ui-fe/src/components/forms/rules/create-rule-form-types";
import { z } from "zod";

export const parseConfigForNl = (
  config: CreateConfigFormValues & { id: number },
) => {
  const { mode, id: _id, name: _name, ...data } = config;
  if (
    (config.mode === ConfigMode.nf_mark ||
      config.mode === ConfigMode.tc_mark_vlan) &&
    config.ignoreComm
  ) {
    const beFlow: Flow = {
      action: FlowActionType.Ignore,
      ip: process.env.LOCAL_IP,
      port: z.coerce.number().parse(process.env.BE_PORT),
    };
    const dbFlow: Flow = {
      action: FlowActionType.Ignore,
      ip: process.env.DB_IP,
      port: z.coerce.number().parse(process.env.DB_PORT),
    };
    const feFlow: Flow = {
      action: FlowActionType.Ignore,
      ip: process.env.LOCAL_IP,
      port: z.coerce.number().parse(process.env.FE_PORT),
    };
    const nlFLow: Flow = {
      action: FlowActionType.Ignore,
      ip: process.env.NL_HOST_IP,
      port: z.coerce.number().parse(process.env.NL_HOST_PORT),
    };

    return { mode, flows: [...config.flows, beFlow, dbFlow, feFlow, nlFLow] };
  }
  return { mode, ...data };
};

export type NlConfig = ReturnType<typeof parseConfigForNl>;

const translateSizeGuardOperation = (op: SizeGuardOperation) => {
  switch (op) {
    case SizeGuardOperation.Eq:
      return "eq";
    case SizeGuardOperation.Ge:
      return "ge";
    case SizeGuardOperation.Gt:
      return "gt";
    case SizeGuardOperation.Lt:
      return "lt";
    case SizeGuardOperation.Le:
      return "le";
  }
};

export const parseValueGenerator = (
  generator: number | ValueGenerator | undefined,
) => {
  if (generator === undefined) return undefined;
  if (typeof generator === "number") return generator;

  switch (generator.type) {
    case ValueGeneratorType.Normal: {
      const { min, max, once, average, deviation, int } = generator;

      return {
        $type: int ? "NormalInt" : "NormalFloat",
        m: average,
        s: deviation,
        min,
        max,
        once,
      };
    }
    case ValueGeneratorType.Uniform: {
      const { int, min, max, once } = generator;

      return {
        $type: int ? "UniformInt" : "UniformFloat",
        min,
        max,
        once,
      };
    }
    case ValueGeneratorType.Sequence: {
      const { min, max, mode, step, t } = generator;

      return {
        $type: "SeqCount",
        min,
        max,
        step,
        T: t,
        mode:
          mode === SequenceMode.Repeat
            ? "repeat"
            : mode === SequenceMode.Reverse
            ? "reverse"
            : "keep",
      };
    }
    default:
      return undefined;
  }
};

export const parseGuardForNl = (
  guard: CreateScenarioFormValues["rules"][number]["guards"][number],
) => {
  const { type, invert, loadedId: _, ...rest } = guard;

  const baseNlGuard = { $type: type, invert };

  switch (guard.type) {
    case GuardType.Count: {
      const { duration, after } = guard;

      return {
        ...baseNlGuard,
        duration: parseValueGenerator(duration),
        after: parseValueGenerator(after),
      };
    }
    case GuardType.CountPeriod: {
      const { falsePeriod, truePeriod } = guard;

      return {
        ...baseNlGuard,
        t: parseValueGenerator(truePeriod),
        f: parseValueGenerator(falsePeriod),
      };
    }
    case GuardType.EveryN: {
      const { n } = guard;

      return {
        ...baseNlGuard,
        n: parseValueGenerator(n),
      };
    }
    case GuardType.ICMP: {
      const { icmpCode, icmpType } = guard;

      return { ...baseNlGuard, code: icmpCode, type: icmpType };
    }
    case GuardType.IP: {
      const { any, src, dst } = guard;

      return { ...baseNlGuard, ip: any, src, dst };
    }
    case GuardType.Port: {
      const { any, src, dst } = guard;

      return { ...baseNlGuard, port: any, src, dst };
    }
    case GuardType.Prob: {
      const { prob } = guard;

      return { ...baseNlGuard, x: parseValueGenerator(prob) };
    }
    case GuardType.Size: {
      const { op, size } = guard;

      return { ...baseNlGuard, op: translateSizeGuardOperation(op), size };
    }
    case GuardType.Time: {
      const { after, duration, instant } = guard;

      return {
        ...baseNlGuard,
        after: parseValueGenerator(after),
        duration: parseValueGenerator(duration),
        instant,
      };
    }
    case GuardType.TimePeriod: {
      const { falsePeriod, truePeriod, instant } = guard;

      return {
        ...baseNlGuard,
        t: parseValueGenerator(truePeriod),
        f: parseValueGenerator(falsePeriod),
        instant,
      };
    }
    default:
      return { ...baseNlGuard, ...rest };
  }
};

export const parseActionForNl = (
  action: CreateScenarioFormValues["rules"][number]["actions"][number],
) => {
  const { type, loadedId: _, ...rest } = action;

  switch (action.type) {
    case ActionType.BitNoise: {
      const {
        layer,
        noiseStrategy,
        percentageOfBitsToSwap,
        amountOfBitsToSwap,
      } = action;

      return {
        $type: type,
        layer,
        x: parseValueGenerator(percentageOfBitsToSwap),
        n: parseValueGenerator(amountOfBitsToSwap),
        strategy: noiseStrategy,
      };
    }
    case ActionType.Delay: {
      const { n } = action;

      return { $type: type, n: parseValueGenerator(n) };
    }
    case ActionType.Reorder: {
      const { count, reorderStrategy } = action;

      return {
        $type: type,
        n: parseValueGenerator(count),
        strategy: reorderStrategy,
      };
    }
    case ActionType.Replicate: {
      const { count, action: _action } = action;

      return {
        $type: type,
        n: parseValueGenerator(count),
        action: _action,
      };
    }
    case ActionType.SocketTcp: {
      const { ip, port, mark, packFormat } = action;

      return {
        $type: "SocketTCP",
        addr: [ip, port],
        mark,
        pack_format: packFormat,
      };
    }
    case ActionType.Throttle: {
      const { limit } = action;

      return {
        $type: type,
        limit: parseValueGenerator(limit),
      };
    }
  }

  return { $type: type, ...rest };
};

export const NL_REST_PORT = 4444;

export const parseRuleForNl = ({
  type,
  guards,
  actions,
}: Omit<CreateRuleFormValues, "name">) => ({
  $type: type,
  guards: guards.map(parseGuardForNl),
  actions: actions.map(parseActionForNl),
});

export const parseScenarioForNl = ({
  type,
  rules,
  defaultAction,
}: CreateScenarioFormValues) => {
  const parsedRules = rules.map(parseRuleForNl);

  return {
    $type: type,
    default_action: defaultAction.toLowerCase(),
    rules: parsedRules,
    ...(type === ScenarioType.SequentialHTTP
      ? { server_address: ["0.0.0.0", NL_REST_PORT] }
      : {}),
  };
};

export type NlScenario = ReturnType<typeof parseScenarioForNl>;
