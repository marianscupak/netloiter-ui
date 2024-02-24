import { FormTextField } from "../../wrapped-inputs/form-text-field";

export const ICMPGuardFields = () => (
  <div>
    <div className="mt-4">
      <FormTextField type="number" name="icmpType" label="ICMP Type" />
    </div>
    <div className="mt-4">
      <FormTextField type="number" name="icmpCode" label="ICMP Code" />
    </div>
  </div>
);
