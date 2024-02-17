import { Button } from "@mui/material";
import { StartNetLoiterModal } from "../components/forms/start-net-loiter";
import { useCallback, useState } from "react";

export const Home = () => {
  const [startOpen, setStartOpen] = useState(false);

  const onOpen = useCallback(() => {
    setStartOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setStartOpen(false);
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <div className="text-header">NetLoiter is not running</div>
        <div className="flex justify-center gap-2">
          <Button variant="contained" onClick={onOpen}>
            START
          </Button>
          <Button variant="contained" color="warning">
            SEE LAST RUN
          </Button>
        </div>
      </div>
      <StartNetLoiterModal open={startOpen} onClose={onClose} />
    </div>
  );
};
