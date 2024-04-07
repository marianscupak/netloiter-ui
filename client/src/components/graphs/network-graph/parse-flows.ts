import { NetworkFlow } from "../../../utils/common";
import { ElementsDefinition } from "cytoscape";

export const parseFlows = (flows: NetworkFlow[]): ElementsDefinition => {
  const ips = Array.from(
    new Set(flows.flatMap(({ sourceIp, destIp }) => [sourceIp, destIp])),
  );

  return {
    edges: flows.map((flow) => ({
      data: {
        source: flow.sourceIp,
        target: flow.destIp,
        label: flow.messagesCount,
      },
    })),
    nodes: ips.map((ip) => ({ data: { id: ip, label: ip } })),
  };
};
