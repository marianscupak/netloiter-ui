import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";

export const CountGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator name="after" label="After" />
    </div>
    <div className="mt-4">
      <FormNumberWithGenerator name="count" label="Count" />
    </div>
  </div>
);
