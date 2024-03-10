import { ConfigMode } from "../../../../../server/prisma/public";
import { MarkConfigFields } from "../configs/fields/mark-config";
import { SocketConfigFields } from "../configs/fields/socket-config";

interface Props {
  type: ConfigMode;
  readOnly?: boolean;
}

export const ConfigSpecificFields = ({ type, readOnly }: Props) => {
  switch (type) {
    case ConfigMode.nf_mark:
    case ConfigMode.tc_mark_vlan:
      return <MarkConfigFields readOnly={readOnly} />;
    case ConfigMode.socket:
      return <SocketConfigFields readOnly={readOnly} />;
    default:
      return null;
  }
};
