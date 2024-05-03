import { Select } from "../forms/select";
import {
  MessageType,
  messageTypeOptions,
} from "netloiter-ui-be/nl-status/message-types";
import { useCallback, useState } from "react";
import { Button, SelectChangeEvent } from "@mui/material";
import { messageTypesInitialValue } from "../../screens/run-history/detail";

interface Props {
  value: MessageType[];
  onChange(types: MessageType[]): void;
}

export const MessageTypeFilter = ({ value, onChange }: Props) => {
  const [innerValue, setInnerValue] = useState(value);

  const onSelect = useCallback((event: SelectChangeEvent) => {
    setInnerValue(event.target.value as unknown as MessageType[]);
  }, []);

  const onSave = useCallback(() => {
    onChange(innerValue);
  }, [innerValue, onChange]);

  const onReset = useCallback(() => {
    setInnerValue(messageTypesInitialValue);
    onChange(messageTypesInitialValue);
  }, [onChange]);

  return (
    <div className="flex gap-4 flex-wrap sm:flex-nowrap">
      <div className="w-full">
        <Select
          label="Message types"
          options={messageTypeOptions}
          multiple
          // @ts-expect-error MUI multiple select type not working
          value={innerValue}
          onChange={onSelect}
          renderValue={(selected: MessageType[]) =>
            `${selected.length} Message types selected`
          }
        />
      </div>
      <Button variant="contained" onClick={onSave}>
        SAVE
      </Button>
      <Button variant="contained" onClick={onReset} color="error">
        RESET
      </Button>
    </div>
  );
};
