import CytoscapeComponent from "react-cytoscapejs";
import { useCallback, useMemo, useState } from "react";
import { NetworkFlow } from "../../../utils/common";
import { parseFlows } from "./parse-flows";
import { Select } from "../../forms/select";
import { SelectChangeEvent } from "@mui/material";
import {
  highlightNeighbours,
  Layout,
  layoutOptions,
  layouts,
  styleSheets,
} from "./config";

interface Props {
  flows: NetworkFlow[];
}

export const NetworkGraph = ({ flows }: Props) => {
  const [selectedLayout, setSelectedLayout] = useState(Layout.Concentric);

  const elements = useMemo(() => parseFlows(flows), [flows]);

  const normalizedElements = useMemo(
    () => CytoscapeComponent.normalizeElements(elements),
    [elements],
  );

  const onSelectedLayoutChange = useCallback(
    (event: SelectChangeEvent<Layout>) => {
      setSelectedLayout(event.target.value as Layout);
    },
    [],
  );

  return (
    <div className="border rounded-[4px] mt-4">
      <div className="mt-4 ml-4 absolute inline-block z-[10]">
        <Select
          label="Layout"
          options={layoutOptions}
          value={selectedLayout}
          onChange={onSelectedLayoutChange}
        />
      </div>
      <CytoscapeComponent
        elements={normalizedElements}
        style={{ width: "100%", height: 500 }}
        layout={layouts[selectedLayout]}
        stylesheet={styleSheets}
        maxZoom={1.5}
        minZoom={0.25}
        cy={highlightNeighbours}
      />
    </div>
  );
};
