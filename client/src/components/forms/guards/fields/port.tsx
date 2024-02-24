import { FormTextField } from "../../wrapped-inputs/form-text-field";

export const PortGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormTextField type="number" name="src" label="Source" />
    </div>
    <div className="mt-4">
      <FormTextField type="number" name="dest" label="Destination" />
    </div>
    <div className="mt-4">
      <FormTextField type="number" name="any" label="Any" />
    </div>
  </div>
);
