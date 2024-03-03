import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "../text-field";
import { TextFieldProps } from "@mui/material";
import { ChangeEvent, useCallback } from "react";

export const FormTextField = ({
  name,
  int,
  ...rest
}: TextFieldProps & { name: string; int?: boolean }) => {
  const { control, setValue } = useFormContext();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        rest.type === "number"
          ? int
            ? Number.parseInt(e.target.value)
            : Number.parseFloat(e.target.value)
          : e.target.value;

      if (typeof value === "string") {
        setValue(name, value);
      } else if (!isNaN(value)) {
        setValue(name, value);
      } else {
        setValue(name, "");
      }
    },
    [int, name, rest.type, setValue],
  );

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <div>
          <TextField
            {...rest}
            {...field}
            error={Boolean(error)}
            onChange={onChange}
          />
          {error && (
            <div className="text-error text-small">{error.message}</div>
          )}
        </div>
      )}
      name={name}
      control={control}
    />
  );
};
