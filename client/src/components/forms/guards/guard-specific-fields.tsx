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
import { FieldNamePrefix } from "../field-name-prefix";

interface Props extends FieldNamePrefix {
  type: GuardType;
  disabled?: boolean;
}

export const GuardSpecificFields = ({
  type,
  fieldNamePrefix,
  disabled,
}: Props) => {
  switch (type) {
    case GuardType.Count: {
      return (
        <CountGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.CountPeriod: {
      return (
        <CountPeriodGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.EveryN: {
      return (
        <EveryNGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.ICMP: {
      return (
        <ICMPGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.IP: {
      return (
        <IPGuardFields fieldNamePrefix={fieldNamePrefix} disabled={disabled} />
      );
    }
    case GuardType.Port: {
      return (
        <PortGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.Prob: {
      return (
        <ProbabilityGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.Protocol: {
      return (
        <ProtocolGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.Size: {
      return (
        <SizeGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.Time: {
      return (
        <TimeGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    case GuardType.TimePeriod: {
      return (
        <TimePeriodGuardFields
          fieldNamePrefix={fieldNamePrefix}
          disabled={disabled}
        />
      );
    }
    default: {
      return null;
    }
  }
};
