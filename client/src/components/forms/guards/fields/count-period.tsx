import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";

export const CountPeriodGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator name="truePeriod" label="True period" />
    </div>
    <div className="mt-4">
      <FormNumberWithGenerator name="falsePeriod" label="False period" />
    </div>
  </div>
);
