import { FormTextField } from "../../wrapped-inputs/form-text-field";

export const DelayFields = () => (
  <div className="mt-4">
    <FormTextField name="n" label="Duration" defaultValue={0.5} />
  </div>
);
