import { Select, SelectOption } from "../forms/select";
import { useCallback } from "react";
import { Button, SelectChangeEvent } from "@mui/material";

const eventsShownOptions: SelectOption[] = [
  { value: 100, label: "100" },
  { value: 10, label: "10" },
];

interface Props {
  eventsShown: number;
  isPaused: boolean;
  onEventsShownChange(n: number): void;
  onPause(): void;
  onResume(): void;
}

export const EventListControls = ({
  eventsShown,
  isPaused,
  onEventsShownChange,
  onPause,
  onResume,
}: Props) => {
  const innerOnEventsShownChange = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      onEventsShownChange(e.target.value as number);
    },
    [onEventsShownChange],
  );

  return (
    <div className="flex">
      <Select
        label="Amount of events shown"
        options={eventsShownOptions}
        value={eventsShown}
        onChange={innerOnEventsShownChange}
        className="w-[90%]"
      />
      {isPaused ? (
        <Button variant="contained" className="flex-grow" onClick={onResume}>
          RESUME
        </Button>
      ) : (
        <Button
          variant="contained"
          color="warning"
          className="flex-grow"
          onClick={onPause}
        >
          PAUSE
        </Button>
      )}
    </div>
  );
};
