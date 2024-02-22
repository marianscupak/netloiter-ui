import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";

export const DelayFields = () => (
  <div className="mt-4">
    <FormNumberWithGenerator name="n" label="Duration" />
  </div>
);
