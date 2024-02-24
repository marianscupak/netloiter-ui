import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";

export const EveryNGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator name="n" label="N" />
    </div>
  </div>
);
