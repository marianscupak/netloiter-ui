import { Button, CircularProgress } from "@mui/material";
import { Select, SelectOption } from "./select";
import { Modal } from "../common/modal";
import { NavLink } from "react-router-dom";

interface Props {
  open: boolean;
  loading: boolean;
  scenarioOptions: SelectOption[];
  configOptions: SelectOption[];
  onClose(): void;
  onStartNetLoiter(): void;
}

export const StartNetLoiterModal = ({
  open,
  loading,
  scenarioOptions,
  configOptions,
  onClose,
  onStartNetLoiter,
}: Props) => (
  <Modal open={open} onClose={onClose}>
    <div className="text-header">Start NetLoiter</div>
    <div className="flex w-full gap-4 my-4">
      <div className="w-[70%]">
        <Select label="Scenario" options={scenarioOptions} />
      </div>
      <NavLink to="/scenarios/create" className="w-[30%]">
        <Button variant="outlined" className="w-full h-full">
          NEW SCENARIO
        </Button>
      </NavLink>
    </div>
    <div className="flex w-full gap-4">
      <div className="w-[70%]">
        <Select label="Config" options={configOptions} />
      </div>
      <NavLink to="/configs/create" className="w-[30%]">
        <Button variant="outlined" className="w-full h-full">
          NEW CONFIG
        </Button>
      </NavLink>
    </div>
    <div className="mt-4">
      <Button variant="contained" onClick={onStartNetLoiter} disabled={loading}>
        {loading ? <CircularProgress color="info" size="24px" /> : "START"}
      </Button>
    </div>
  </Modal>
);
