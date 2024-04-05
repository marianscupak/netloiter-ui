import {
  CreateGuardFormValues,
  createGuardFormValuesSchema,
  SizeGuardOperation,
} from "../create-guard-form-types";
import { GuardType } from "../../../../../../server/prisma/public";
import { ValueGeneratorType } from "../../value-generators/types";

describe("guard validations module", () => {
  test("valid count guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Count,
      after: 1,
      duration: 1,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid count guard validation should fail", () => {
    // After equals 0
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Count,
      after: 0,
      duration: 1,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // Duration equals 0
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Count,
      after: 1,
      duration: 0,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();
  });
  test("valid count period guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.CountPeriod,
      falsePeriod: 3,
      truePeriod: 3,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid count period guard validation should fail", () => {
    // True period equals 0
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.CountPeriod,
      falsePeriod: 3,
      truePeriod: 0,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // False period equals 0
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.CountPeriod,
      falsePeriod: 0,
      truePeriod: 3,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();
  });
  test("valid every n guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.EveryN,
      n: 3,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid every n guard validation should fail", () => {
    // N equals 0
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.EveryN,
      n: 0,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();
  });
  test("valid ICMP guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.ICMP,
      icmpType: 2,
      icmpCode: 2,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid ICMP guard validation should fail", () => {
    // @ts-expect-error icmpCode missing
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.ICMP,
      icmpType: 2,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();
  });
  test("valid IP guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      src: "127.0.0.1",
      dst: "8.8.8.8",
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);

    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      src: "127.0.0.1",
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard2)).toEqual(guard2);

    const guard3: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      dst: "8.8.8.8",
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard3)).toEqual(guard3);

    const guard4: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      any: "127.0.0.1",
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard4)).toEqual(guard4);
  });
  test("invalid IP guard validation should fail", () => {
    // Any and dst both filled
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      any: "127.0.0.1",
      dst: "8.8.8.8",
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // Any and src both filled
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      any: "127.0.0.1",
      src: "8.8.8.8",
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();

    // Any, src and dest not filled
    const guard3: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard3).success).toBeFalsy();

    // Invalid IP in src
    const guard4: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.IP,
      src: "300.300.300.300",
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard4).success).toBeFalsy();
  });
  test("valid IP guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Port,
      src: 30,
      dst: 50,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);

    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Port,
      src: 30,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard2)).toEqual(guard2);

    const guard3: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Port,
      dst: 50,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard3)).toEqual(guard3);

    const guard4: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Port,
      any: 30,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard4)).toEqual(guard4);
  });
  test("invalid IP guard validation should fail", () => {
    // Any and dst both filled
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Port,
      any: 30,
      dst: 50,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // Any and src both filled
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Port,
      any: 30,
      src: 50,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();

    // Any, src and dest not filled
    const guard3: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Port,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard3).success).toBeFalsy();
  });
  test("valid probability guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Prob,
      prob: 0.3,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid probability guard validation should fail", () => {
    // prob less than 0
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Prob,
      prob: -0.1,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // prob greater than 1
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Prob,
      prob: 1.1,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();

    // prob greater than 1 in generator
    const guard3: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Prob,
      prob: {
        type: ValueGeneratorType.Normal,
        min: 0,
        max: 1.1,
        average: 0.5,
        deviation: 0.25,
      },
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard3).success).toBeFalsy();
  });
  test("valid protocol guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Protocol,
      id: 0,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid protocol guard validation should fail", () => {
    // @ts-expect-error id missing
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Protocol,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();
  });
  test("valid size guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Size,
      size: 1000,
      op: SizeGuardOperation.Eq,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid size guard validation should fail", () => {
    // size equals 0
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Size,
      size: 0,
      op: SizeGuardOperation.Eq,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // size less than 0
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Size,
      size: -1,
      op: SizeGuardOperation.Eq,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();
  });
  test("valid time guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Time,
      after: 10,
      duration: 10,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid time guard validation should fail", () => {
    // after equals 0
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Time,
      after: 0,
      duration: 10,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // duration equals 0
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Time,
      after: 10,
      duration: 0,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();

    // after less than 0
    const guard3: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Time,
      after: -1,
      duration: 10,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard3).success).toBeFalsy();

    // duration less than 0
    const guard4: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.Time,
      after: 10,
      duration: -1,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard4).success).toBeFalsy();
  });
  test("valid time period guard validation should pass", () => {
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.TimePeriod,
      truePeriod: 5,
      falsePeriod: 5,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.parse(guard)).toEqual(guard);
  });
  test("invalid time period guard validation should fail", () => {
    // true period equals 0
    const guard: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.TimePeriod,
      truePeriod: 0,
      falsePeriod: 5,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard).success).toBeFalsy();

    // false period equals 0
    const guard2: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.TimePeriod,
      truePeriod: 5,
      falsePeriod: 0,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard2).success).toBeFalsy();

    // true period less than 0
    const guard3: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.TimePeriod,
      truePeriod: -1,
      falsePeriod: 5,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard3).success).toBeFalsy();

    // false period less than 0
    const guard4: CreateGuardFormValues = {
      name: "Test guard",
      type: GuardType.TimePeriod,
      truePeriod: 5,
      falsePeriod: -1,
      instant: true,
      invert: false,
    };

    expect(createGuardFormValuesSchema.safeParse(guard4).success).toBeFalsy();
  });
});
