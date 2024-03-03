import { Action, ActionType, Guard, GuardType } from "@prisma/client";
import { GuardData } from "netloier-ui/src/components/forms/guards/create-guard-form-types";
import { ActionData } from "netloier-ui/src/components/forms/actions/create-action-form-types";

export const convertGuardToFormValues = ({
  id,
  type,
  data,
  invert,
}: Guard) => ({
  ...(data as GuardData),
  type: type as GuardType,
  invert,
  loadedId: id,
});

export const convertActionToFormValues = ({ id, type, data }: Action) => ({
  ...(data as ActionData),
  type: type as ActionType,
  loadedId: id,
});
