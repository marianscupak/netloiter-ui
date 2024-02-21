import { ActionType } from "../../../../../server/prisma/public";
import { BitNoiseActionFields } from "./fields/bit-noise";
import { DelayFields } from "./fields/delay";
import { ReorderFields } from "./fields/reorder";
import { ReplicateFields } from "./fields/replicate";
import { SocketTcpFields } from "./fields/socket-tcp";
import { ThrottleFields } from "./fields/throttle";

interface Props {
  type: ActionType;
}

export const ActionSpecificFields = ({ type }: Props) => {
  switch (type) {
    case ActionType.BitNoise: {
      return <BitNoiseActionFields />;
    }
    case ActionType.Delay: {
      return <DelayFields />;
    }
    case ActionType.Reorder: {
      return <ReorderFields />;
    }
    case ActionType.Replicate: {
      return <ReplicateFields />;
    }
    case ActionType.SocketTcp: {
      return <SocketTcpFields />;
    }
    case ActionType.Throttle: {
      return <ThrottleFields />;
    }
    default: {
      return null;
    }
  }
};
