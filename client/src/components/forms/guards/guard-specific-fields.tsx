import { GuardType } from "../../../../../server/prisma/public";
import { CountGuardFields } from "./fields/count";
import { CountPeriodGuardFields } from "./fields/count-period";
import { EveryNGuardFields } from "./fields/every-n";
import { ICMPGuardFields } from "./fields/icmp";
import { IPGuardFields } from "./fields/ip";
import { PortGuardFields } from "./fields/port";
import { ProbabilityGuardFields } from "./fields/probability";
import { ProtocolGuardFields } from "./fields/protocol";
import { SizeGuardFields } from "./fields/size";
import { TimeGuardFields } from "./fields/time";
import { TimePeriodGuardFields } from "./fields/time-period";

interface Props {
  type: GuardType;
}

export const GuardSpecificFields = ({ type }: Props) => {
  switch (type) {
    case GuardType.Count: {
      return <CountGuardFields />;
    }
    case GuardType.CountPeriod: {
      return <CountPeriodGuardFields />;
    }
    case GuardType.EveryN: {
      return <EveryNGuardFields />;
    }
    case GuardType.ICMP: {
      return <ICMPGuardFields />;
    }
    case GuardType.IP: {
      return <IPGuardFields />;
    }
    case GuardType.Port: {
      return <PortGuardFields />;
    }
    case GuardType.Prob: {
      return <ProbabilityGuardFields />;
    }
    case GuardType.Protocol: {
      return <ProtocolGuardFields />;
    }
    case GuardType.Size: {
      return <SizeGuardFields />;
    }
    case GuardType.Time: {
      return <TimeGuardFields />;
    }
    case GuardType.TimePeriod: {
      return <TimePeriodGuardFields />;
    }
    default: {
      return null;
    }
  }
};
