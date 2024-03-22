import {
  SequenceMode,
  ValueGenerator,
  valueGeneratorSchema,
  ValueGeneratorType,
} from "../types";

describe("value generator validations module", () => {
  test("value generator validations should pass on valid value generator", () => {
    const normalValueGenerator: ValueGenerator = {
      type: ValueGeneratorType.Normal,
      deviation: 0.5,
      average: 1,
      once: false,
    };
    expect(valueGeneratorSchema.parse(normalValueGenerator)).toEqual(
      normalValueGenerator,
    );

    const sequenceValueGenerator: ValueGenerator = {
      type: ValueGeneratorType.Sequence,
      step: 1,
      mode: SequenceMode.Repeat,
      int: true,
      min: 0,
      t: 2,
    };
    expect(valueGeneratorSchema.parse(sequenceValueGenerator)).toEqual(
      sequenceValueGenerator,
    );

    const sequenceMaxValueGenerator: ValueGenerator = {
      type: ValueGeneratorType.Sequence,
      step: -1,
      mode: SequenceMode.Repeat,
      int: true,
      max: 10,
      t: 2,
    };
    expect(valueGeneratorSchema.parse(sequenceMaxValueGenerator)).toEqual(
      sequenceMaxValueGenerator,
    );

    const uniformValueGenerator: ValueGenerator = {
      type: ValueGeneratorType.Uniform,
      min: 0,
      max: 1,
      int: false,
      once: true,
    };
    expect(valueGeneratorSchema.parse(uniformValueGenerator)).toEqual(
      uniformValueGenerator,
    );
  });
  test("value generator validations should fail on invalid value generator", () => {
    // requires at least step and min or negative step and max
    const invalidSequenceValueGenerator: ValueGenerator = {
      type: ValueGeneratorType.Sequence,
      step: 1,
      mode: SequenceMode.Repeat,
      int: true,
      t: 2,
    };
    expect(
      valueGeneratorSchema.safeParse(invalidSequenceValueGenerator).success,
    ).toBeFalsy();

    const invalidValueGenerator: ValueGenerator = {
      type: ValueGeneratorType.Normal,
      // @ts-expect-error Intentionally invalid
      step: 1,
      max: 10,
      mode: SequenceMode.Repeat,
      int: true,
      t: 2,
    };
    expect(
      valueGeneratorSchema.safeParse(invalidValueGenerator).success,
    ).toBeFalsy();
  });
});
