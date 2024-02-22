import { z } from "zod";

export enum ValueGeneratorType {
  Normal,
  Uniform,
  Sequence,
}

export const valueGeneratorTypeSchema = z.nativeEnum(ValueGeneratorType);

export enum SequenceMode {
  Repeat,
  Keep,
  Reverse,
}

const valueGeneratorBaseSchema = z.object({
  type: valueGeneratorTypeSchema,
});

const normalDistributionGeneratorFormSchema = valueGeneratorBaseSchema.extend({
  min: z.number(),
  max: z.number(),
  once: z.boolean().optional(),
  average: z.number(),
  deviation: z.number(),
});

const normalDistributionGeneratorSchema =
  normalDistributionGeneratorFormSchema.extend({
    type: z.literal(ValueGeneratorType.Normal),
  });

const uniformDistributionGeneratorFormSchema = valueGeneratorBaseSchema.extend({
  min: z.number(),
  max: z.number(),
  once: z.boolean().optional(),
});

const uniformDistributionGeneratorSchema =
  uniformDistributionGeneratorFormSchema.extend({
    type: z.literal(ValueGeneratorType.Uniform),
  });

const sequenceGeneratorFormSchema = valueGeneratorBaseSchema.extend({
  min: z.number(),
  max: z.number(),
  once: z.boolean().optional(),
  step: z.number(),
  mode: z.nativeEnum(SequenceMode),
});

const sequenceGeneratorSchema = sequenceGeneratorFormSchema.extend({
  type: z.literal(ValueGeneratorType.Sequence),
});

export const valueGeneratorFormSchema = z.union([
  normalDistributionGeneratorFormSchema,
  uniformDistributionGeneratorFormSchema,
  sequenceGeneratorFormSchema,
]);

export const numberWithValueGeneratorSchema = z.union([
  z.number(),
  valueGeneratorFormSchema,
]);

export const valueGeneratorSchema = z.union([
  normalDistributionGeneratorSchema,
  uniformDistributionGeneratorSchema,
  sequenceGeneratorSchema,
]);
