import { ConfigMode } from "../../../../../server/prisma/public";
import { MarkConfigFields } from "../configs/fields/mark-config";
import { SocketConfigFields } from "../configs/fields/socket-config";

interface Props {
  type: ConfigMode;
}

export const ConfigSpecificFields = ({ type }: Props) => {
  switch (type) {
    case ConfigMode.nf_mark:
    case ConfigMode.tc_mark_vlan:
      return <MarkConfigFields />;
    case ConfigMode.socket:
      return <SocketConfigFields />;
    default:
      return null;
  }
};
