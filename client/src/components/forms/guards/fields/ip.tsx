import { FormTextField } from "../../wrapped-inputs/form-text-field";

export const IPGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormTextField name="src" label="Source" />
    </div>
    <div className="mt-4">
      <FormTextField name="dest" label="Destination" />
    </div>
    <div className="mt-4">
      <FormTextField name="any" label="Any" />
    </div>
  </div>
);
