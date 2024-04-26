import { Client } from "ssh2";
import { eventEmitter } from "../event-emitter";
import { CreateScenarioFormValues } from "netloiter-ui-fe/src/components/forms/scenarios/create-scenario-form-types";
import { CreateConfigFormValues } from "netloiter-ui-fe/src/components/forms/configs/create-config-form-types";
import { z } from "zod";
import {
  NlConfig,
  NlScenario,
  parseConfigForNl,
  parseScenarioForNl,
} from "./parse-config-for-nl";
import { initializeRun } from "../websocket";
import { BaseAction } from "netloiter-ui-fe/src/components/forms/actions/create-action-form-types";

const configsPath = z.string().parse(process.env.NL_HOST_CONFIGS_PATH);
const nlHostIp = z.string().parse(process.env.NL_HOST_IP);
const nlHostPort = z.coerce.number().parse(process.env.NL_HOST_PORT);
const nlHostUsername = z.string().parse(process.env.NL_HOST_USERNAME);
const nlHostPassword = z.string().parse(process.env.NL_HOST_PASSWORD);
const nlPath = z.string().parse(process.env.NL_PATH);

const getBaseNlStartCommand = (configFileName: string) =>
  `sudo python3 ${nlPath} -v 3 --log-mode csv run -c ${configsPath}/out/configs/${configFileName}.json`;

const getNlStartCommandWithScenario = (
  scenarioFileName: string,
  configFileName: string,
) =>
  `${getBaseNlStartCommand(
    configFileName,
  )} -s ${configsPath}/out/scenarios/${scenarioFileName}.json`;

const getNlStartCommandWithDefaultAction = (
  baseAction: BaseAction,
  configFileName: string,
) => `${getBaseNlStartCommand(configFileName)} -a ${baseAction.toLowerCase()}`;

const getNlStartCommand = (
  configFileName: string,
  scenarioFileName: string | undefined,
  baseAction: BaseAction | undefined,
) => {
  if (scenarioFileName) {
    return getNlStartCommandWithScenario(scenarioFileName, configFileName);
  } else if (baseAction) {
    return getNlStartCommandWithDefaultAction(baseAction, configFileName);
  } else {
    return getBaseNlStartCommand(configFileName);
  }
};

const getInitConfigsCommands = (
  configFileName: string,
  config: NlConfig,
  scenarioFileName?: string,
  scenario?: NlScenario,
): string[] => [
  `mkdir -p ${configsPath}/out/configs`,
  `touch ${configsPath}/out/configs/${configFileName}.json`,
  `echo '${JSON.stringify(
    config,
  )}' > ${configsPath}/out/configs/${configFileName}.json`,
  ...(scenarioFileName && scenario
    ? [
        `mkdir -p ${configsPath}/out/scenarios`,
        `touch ${configsPath}/out/scenarios/${scenarioFileName}.json`,
        `echo '${JSON.stringify(
          scenario,
        )}' > ${configsPath}/out/scenarios/${scenarioFileName}.json`,
      ]
    : []),
];

const sshConfig = {
  host: nlHostIp,
  port: nlHostPort,
  username: nlHostUsername,
  password: nlHostPassword,
};

const sshClient = new Client().on("ready", () => {
  if ((!scenario && !defaultAction) || !config) throw new Error();
  const scenarioFileName = scenario?.name.replace(new RegExp(" ", "g"), "_");
  const configFileName = config.name.replace(new RegExp(" ", "g"), "_");

  sshClient.exec(
    getInitConfigsCommands(
      configFileName,
      parseConfigForNl(config),
      scenarioFileName,
      scenario ? parseScenarioForNl(scenario) : undefined,
    ).join(" && "),
    (err) => {
      if (err) throw err;

      const startCommand = getNlStartCommand(
        configFileName,
        scenarioFileName,
        defaultAction,
      );
      console.log(startCommand);

      let firstResponse = true;
      sshClient.exec(startCommand, { pty: true }, (err, channel) => {
        if (err) throw err;
        if (scenario) {
          console.log(
            `Starting NetLoiter with Scenario: ${scenario?.name}, Config: ${config?.name}`,
          );
        } else {
          console.log(
            `Starting NetLoiter with Default Action: ${defaultAction}, Config: ${config?.name}`,
          );
        }
        runningFrom = new Date();
        initializeRun(
          runningFrom,
          scenario && "id" in scenario ? (scenario.id as number) : undefined,
          config && "id" in config ? (config.id as number) : undefined,
          defaultAction,
        );
        channel
          .on("data", (data: unknown) => {
            if (firstResponse) {
              firstResponse = false;
              channel.write(nlHostPassword + "\n");
            } else {
              eventEmitter.emit("add", data);
            }
          })
          .on("close", (code: unknown, signal: unknown) => {
            console.log("Closed with code: " + code, signal);
            sshClient.end();
            runningFrom = false;
            eventEmitter.emit("close");
          });
      });
    },
  );
});

let runningFrom: Date | false = false;
let scenario: CreateScenarioFormValues | undefined = undefined;
let config: (CreateConfigFormValues & { id: number }) | undefined = undefined;
let defaultAction: BaseAction | undefined = undefined;

export const startNetLoiter = ({
  scenario: _scenario,
  defaultAction: _defaultAction,
  config: _config,
}: {
  scenario?: CreateScenarioFormValues;
  defaultAction?: BaseAction;
  config: CreateConfigFormValues & { id: number };
}) => {
  if (!runningFrom) {
    if (_scenario) {
      scenario = _scenario;
    } else if (_defaultAction) {
      defaultAction = _defaultAction;
    }
    config = _config;
    sshClient.connect(sshConfig);
  }
};

export const getStatus = () => {
  return { runningFrom, scenario, config, defaultAction };
};

export const stopNetLoiter = () => {
  sshClient.end();
  runningFrom = false;
  scenario = undefined;
  config = undefined;
  defaultAction = undefined;
};
