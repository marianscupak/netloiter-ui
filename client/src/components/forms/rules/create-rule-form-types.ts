import { z } from "zod";
import { RuleType } from "../../../../../server/prisma/public";
import { guardFormValuesSchema } from "../guards/create-guard-form-types";
import { actionFormValuesSchema } from "../actions/create-action-form-types";
import { objectWithLoadedIdSchema } from "../../../utils/object-with-loaded-id";

export const createRuleValuesSchema = z.object({
  type: z.nativeEnum(RuleType),
  guards: z.array(
    z.intersection(guardFormValuesSchema, objectWithLoadedIdSchema),
  ),
  actions: z.array(
    z.intersection(actionFormValuesSchema, objectWithLoadedIdSchema),
  ),
});

export const createRuleFormValuesSchema = z
  .object({
    name: z.string().refine((name) => name.length > 0, { message: "Required" }),
  })
  .merge(createRuleValuesSchema);

export type CreateRuleFormValues = z.infer<typeof createRuleFormValuesSchema>;
