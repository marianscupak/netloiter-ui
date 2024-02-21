import { FormTextField } from "../../wrapped-inputs/form-text-field";

export const ThrottleFields = () => (
  <div className="mt-4">
    <FormTextField type="number" name="limit" label="Limit" />
  </div>
);
