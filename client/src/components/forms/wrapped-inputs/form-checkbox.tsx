import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, CheckboxProps } from "../checkbox";

interface Props extends CheckboxProps {
  name: string;
}

export const FormCheckbox = ({ name, checked, ...rest }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      render={({ field }) => (
        <Checkbox {...rest} {...field} checked={checked || field.value} />
      )}
      name={name}
      control={control}
    />
  );
};
