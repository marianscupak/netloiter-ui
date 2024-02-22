import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";

export const ThrottleFields = () => (
  <div className="mt-4">
    <FormNumberWithGenerator name="limit" label="Limit" />
  </div>
);
