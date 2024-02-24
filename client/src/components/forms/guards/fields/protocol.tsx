import { FormTextField } from "../../wrapped-inputs/form-text-field";

export const ProtocolGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormTextField type="number" name="id" label="Protocol ID" />
    </div>
  </div>
);
