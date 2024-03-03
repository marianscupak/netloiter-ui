import { atom } from "jotai";
import { CreateScenarioFormValues } from "../components/forms/scenarios/create-scenario-form-types";
import { CreateConfigFormValues } from "../components/forms/configs/create-config-form-types";

export interface Status {
  runningFrom: Date | false;
  scenario: CreateScenarioFormValues | undefined;
  config: CreateConfigFormValues | undefined;
}

export const statusAtom = atom<Status>({
  runningFrom: false,
  scenario: undefined,
  config: undefined,
});
