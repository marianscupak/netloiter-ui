import { ActionType } from "../../../../../server/prisma/public";
import { BitNoiseActionFields } from "./fields/bit-noise";
import { DelayFields } from "./fields/delay";
import { ReorderFields } from "./fields/reorder";
import { ReplicateFields } from "./fields/replicate";
import { SocketTcpFields } from "./fields/socket-tcp";
import { ThrottleFields } from "./fields/throttle";
import { FieldNamePrefix } from "../field-name-prefix";

interface Props extends FieldNamePrefix {
  type: ActionType;
  disabled?: boolean;
}

export const ActionSpecificFields = ({
  type,
  fieldNamePrefix,
  disabled,
}: Props) => {
  switch (type) {
    case ActionType.BitNoise: {
      return (
        <BitNoiseActionFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case ActionType.Delay: {
      return (
        <DelayFields fieldNamePrefix={fieldNamePrefix} disabled={disabled} />
      );
    }
    case ActionType.Reorder: {
      return (
        <ReorderFields fieldNamePrefix={fieldNamePrefix} disabled={disabled} />
      );
    }
    case ActionType.Replicate: {
      return (
        <ReplicateFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case ActionType.SocketTcp: {
      return (
        <SocketTcpFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case ActionType.Throttle: {
      return (
        <ThrottleFields fieldNamePrefix={fieldNamePrefix} disabled={disabled} />
      );
    }
    default: {
      return null;
    }
  }
};
