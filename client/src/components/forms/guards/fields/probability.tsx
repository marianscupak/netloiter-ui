import { FormNumberWithGenerator } from "../../wrapped-inputs/form-number-with-generator";

export const ProbabilityGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormNumberWithGenerator name="prob" label="Probability" />
    </div>
  </div>
);
