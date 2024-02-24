import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";
import { FormCheckbox } from "../../wrapped-inputs/form-checkbox";

export const TimePeriodGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator name="truePeriod" label="True period" />
    </div>
    <div className="mt-4">
      <FormNumberWithGenerator name="falsePeriod" label="False period" />
    </div>
    <div className="mt-4">
      <FormCheckbox name="instant" label="Instant" />
    </div>
  </div>
);
