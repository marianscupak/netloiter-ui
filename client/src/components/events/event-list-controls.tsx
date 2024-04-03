import { Select } from "../forms/select";
import { useCallback } from "react";
import { Button, SelectChangeEvent } from "@mui/material";
import { MessageTypeFilter } from "./message-type-filter";
import { MessageType } from "../../../../server/nl-status/message-types";
import { SelectOption } from "../../utils/select-option";

const eventsShownOptions: SelectOption[] = [
  { value: 1000, label: "1000" },
  { value: 500, label: "500" },
  { value: 100, label: "100" },
  { value: 50, label: "50" },
];

interface Props {
  eventsShown: number;
  isPaused?: boolean;
  showPause?: boolean;
  showMessageTypeFilter?: boolean;
  messageTypeFilter?: MessageType[];
  onMessageTypeFilterChange?(types: MessageType[]): void;
  onEventsShownChange(n: number): void;
  onPause?(): void;
  onResume?(): void;
}

export const EventListControls = ({
  eventsShown,
  isPaused,
  showPause,
  messageTypeFilter,
  onMessageTypeFilterChange,
  showMessageTypeFilter,
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
    <div>
      <div className="flex">
        <Select
          label="Amount of events shown"
          options={eventsShownOptions}
          // @ts-expect-error Value type
          value={eventsShown}
          onChange={innerOnEventsShownChange}
          className={showPause ? "w-[90%]" : undefined}
        />
        {showPause &&
          (isPaused ? (
            <Button
              variant="contained"
              className="flex-grow"
              onClick={onResume}
            >
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
          ))}
      </div>
      {showMessageTypeFilter &&
        messageTypeFilter &&
        onMessageTypeFilterChange && (
          <div className="my-4">
            <MessageTypeFilter
              value={messageTypeFilter}
              onChange={onMessageTypeFilterChange}
            />
          </div>
        )}
    </div>
  );
};
