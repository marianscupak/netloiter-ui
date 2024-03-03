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
  int: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const normalDistributionGeneratorFormSchema = valueGeneratorBaseSchema.extend({
  type: z.literal(ValueGeneratorType.Normal),
  average: z.number(),
  deviation: z.number(),
  once: z.boolean().optional(),
});

const uniformDistributionGeneratorFormSchema = valueGeneratorBaseSchema.extend({
  type: z.literal(ValueGeneratorType.Uniform),
  once: z.boolean().optional(),
});

const sequenceGeneratorFormSchema = valueGeneratorBaseSchema.extend({
  type: z.literal(ValueGeneratorType.Sequence),
  step: z.number(),
  t: z.number(),
  mode: z.nativeEnum(SequenceMode),
});

export const valueGeneratorSchema = z
  .discriminatedUnion("type", [
    normalDistributionGeneratorFormSchema,
    uniformDistributionGeneratorFormSchema,
    sequenceGeneratorFormSchema,
  ])
  .refine(
    (gen) => {
      if (gen.type === ValueGeneratorType.Sequence) {
        return !(
          gen.step === undefined ||
          (gen.step > 0 && gen.min === undefined) ||
          (gen.step < 0 && gen.max === undefined)
        );
      }
      return true;
    },
    {
      message:
        "Required at least min and step (>0) or max and step (<0) parameters!",
      path: ["step"],
    },
  );

export const numberWithValueGeneratorSchema = z.union([
  z.number(),
  valueGeneratorSchema,
]);

export type ValueGenerator = z.infer<typeof valueGeneratorSchema>;
