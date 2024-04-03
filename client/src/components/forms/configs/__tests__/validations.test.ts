import {
  CreateConfigFormValues,
  createConfigFormValuesSchema,
  FlowActionType,
} from "../create-config-form-types";
import { ConfigMode } from "../../../../../../server/prisma/public";

describe("config validations module", () => {
  test("config validations should pass on valid config", () => {
    const config: CreateConfigFormValues = {
      name: "Test config",
      mode: ConfigMode.socket,
      udpAddresses: [
        {
          local: { ip: "127.0.0.1", port: 123 },
          remote: { ip: "8.8.8.8", port: 321 },
        },
      ],
    };

    expect(createConfigFormValuesSchema.parse(config)).toEqual(config);
  });
  test("config validations should fail on invalid config", () => {
    const invalidConfig: CreateConfigFormValues = {
      name: "Test config",
      mode: ConfigMode.nf_mark,
      // @ts-expect-error Intentionally invalid
      flows: [{ invalid: "value" }],
    };
    expect(
      createConfigFormValuesSchema.safeParse(invalidConfig).success,
    ).toBeFalsy();

    const invalidIpConfig: CreateConfigFormValues = {
      name: "Test config 2",
      mode: ConfigMode.tc_mark_vlan,
      flows: [{ ip: "23", action: FlowActionType.Ignore }],
      ignoreComm: false,
    };
    expect(
      createConfigFormValuesSchema.safeParse(invalidIpConfig).success,
    ).toBeFalsy();
  });
});
