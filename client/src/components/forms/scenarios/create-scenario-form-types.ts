import { z } from "zod";
import { ScenarioType } from "../../../../../server/prisma/public";
import { createRuleValuesSchema } from "../rules/create-rule-form-types";
import { objectWithLoadedIdSchema } from "../../../utils/object-with-loaded-id";
import { baseActionSchema } from "../actions/create-action-form-types";

export const createScenarioFormValuesSchema = z.object({
  name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  type: z.nativeEnum(ScenarioType),
  defaultAction: baseActionSchema,
  rules: z.array(
    z.intersection(createRuleValuesSchema, objectWithLoadedIdSchema),
  ),
});

export type CreateScenarioFormValues = z.infer<
  typeof createScenarioFormValuesSchema
>;
