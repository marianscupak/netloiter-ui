import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectProps } from "../select";

interface Props extends SelectProps {
  name: string;
}

export const FormSelect = ({ defaultValue, name, ...rest }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <div>
          <Select {...rest} {...field} error={Boolean(error)} />
          {error && (
            <div className="text-error text-small">{error.message}</div>
          )}
        </div>
      )}
      name={name}
      defaultValue={defaultValue}
      control={control}
    />
  );
};
