import { Action, ActionType, Guard, GuardType } from "@prisma/client";
import { GuardData } from "netloier-ui/src/components/forms/guards/create-guard-form-types";
import { ActionData } from "netloier-ui/src/components/forms/actions/create-action-form-types";

export const convertGuardToFormValues =
  (includeName?: boolean) =>
  ({ id, type, data, invert, name }: Guard) => ({
    ...(data as GuardData),
    type: type as GuardType,
    invert,
    loadedId: id,
    ...(includeName ? { name } : {}),
  });

export const convertActionToFormValues =
  (includeName?: boolean) =>
  ({ id, type, data, name }: Action) => ({
    ...(data as ActionData),
    type: type as ActionType,
    loadedId: id,
    ...(includeName ? { name } : {}),
  });
