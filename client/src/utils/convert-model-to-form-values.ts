import { RouterOutputs } from "../../../server/trpc-routers";
import { GuardType } from "../../../server/prisma/public";

export const convertGuardToFormValues = ({
  id,
  type,
  // @ts-expect-error Guard data type hard to infer
  data,
  invert,
}: RouterOutputs["guard"]["getGuardDetail"]) => ({
  // @ts-expect-error Guard data type hard to infer
  ...data,
  type: type as GuardType,
  invert,
  loadedId: id,
});

export const convertActionToFormValues = ({
  id,
  type,
  data,
}: RouterOutputs["action"]["getActionDetail"]) => ({
  // @ts-expect-error Guard data type hard to infer
  ...data,
  type: type as GuardType,
  loadedId: id,
});
