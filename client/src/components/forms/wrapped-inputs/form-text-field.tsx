import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "../text-field";
import { TextFieldProps } from "@mui/material";
import { ChangeEvent, useCallback } from "react";

export const FormTextField = ({
  name,
  ...rest
}: TextFieldProps & { name: string }) => {
  const { control, setValue } = useFormContext();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        rest.type === "number"
          ? Number.parseFloat(e.target.value)
          : e.target.value;

      if (value !== Number.NaN) {
        setValue(name, value);
      }
    },
    [rest.type],
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
