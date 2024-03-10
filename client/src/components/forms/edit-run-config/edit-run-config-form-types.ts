import { z } from "zod";
import { createRuleValuesSchema } from "../rules/create-rule-form-types";
import { objectWithLoadedIdSchema } from "../../../utils/object-with-loaded-id";

export const editRunConfigFormValuesSchema = z.object({
  rules: z.array(
    z.intersection(createRuleValuesSchema, objectWithLoadedIdSchema),
  ),
});

export type EditRunConfigFormValues = z.infer<
  typeof editRunConfigFormValuesSchema
>;
