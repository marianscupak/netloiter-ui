import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FormCheckbox } from "../../wrapped-inputs/form-checkbox";

export const TimeGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator name="after" label="After" />
    </div>
    <div className="mt-4">
      <FormNumberWithGenerator name="duration" label="Duration" />
    </div>
    <div className="mt-4">
      <FormCheckbox name="instant" label="Instant" />
    </div>
  </div>
);
