import { ConfigType } from "../../../../../server/prisma/public";
import { MarkConfigFields } from "../configs/fields/mark-config";
import { SocketConfigFields } from "../configs/fields/socket-config";

interface Props {
  type: ConfigType;
}

export const ConfigSpecificFields = ({ type }: Props) => {
  switch (type) {
    case ConfigType.nf_mark:
    case ConfigType.tc_mark_vlan:
      return <MarkConfigFields />;
    case ConfigType.socket:
      return <SocketConfigFields />;
    default:
      return null;
  }
};
