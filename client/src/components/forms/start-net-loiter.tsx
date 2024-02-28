import { Button, CircularProgress } from "@mui/material";
import { Select } from "./select";
import { Modal } from "../common/modal";

interface Props {
  open: boolean;
  loading: boolean;
  onClose(): void;
  onStartNetLoiter(): void;
}

export const StartNetLoiterModal = ({
  open,
  loading,
  onClose,
  onStartNetLoiter,
}: Props) => (
  <Modal open={open} onClose={onClose}>
    <div className="text-header">Start NetLoiter</div>
    <div className="flex w-full gap-4 my-4">
      <div className="w-[70%]">
        <Select label="Scenario" options={[]} />
      </div>
      <Button variant="outlined" className="w-[30%]">
        NEW SCENARIO
      </Button>
    </div>
    <div className="flex w-full gap-4">
      <div className="w-[70%]">
        <Select label="Config" options={[]} />
      </div>
      <Button variant="outlined" className="w-[30%]">
        NEW CONFIG
      </Button>
    </div>
    <div className="mt-4">
      <Button variant="contained" onClick={onStartNetLoiter} disabled={loading}>
        {loading ? <CircularProgress color="info" size="24px" /> : "START"}
      </Button>
    </div>
  </Modal>
);
