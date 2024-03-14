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

const configsPath = z.string().parse(process.env.CONFIGS_PATH);
const nlHostIp = z.string().parse(process.env.NL_HOST_IP);
const nlHostPort = z.coerce.number().parse(process.env.NL_HOST_PORT);
const nlHostUsername = z.string().parse(process.env.NL_HOST_USERNAME);
const nlHostPassword = z.string().parse(process.env.NL_HOST_PASSWORD);
const nlPath = z.string().parse(process.env.NL_PATH);

const getNlStartCommand = (scenarioFileName: string, configFileName: string) =>
  `sudo python3 ${nlPath} -v 3 --log-mode csv run -s ${configsPath}/upload/scenarios/${scenarioFileName}.json -c ${configsPath}/upload/configs/${configFileName}.json`;

const getInitConfigsCommands = (
  scenarioFileName: string,
  configFileName: string,
  scenario: NlScenario,
  config: NlConfig,
) => [
  `mkdir -p ${configsPath}/upload/scenarios`,
  `mkdir -p ${configsPath}/upload/configs`,
  `touch ${configsPath}/upload/scenarios/${scenarioFileName}.json`,
  `touch ${configsPath}/upload/configs/${configFileName}.json`,
  `echo '${JSON.stringify(
    scenario,
  )}' > ${configsPath}/upload/scenarios/${scenarioFileName}.json`,
  `echo '${JSON.stringify(
    config,
  )}' > ${configsPath}/upload/configs/${configFileName}.json`,
];

const sshConfig = {
  host: nlHostIp,
  port: nlHostPort,
  username: nlHostUsername,
  password: nlHostPassword,
};

const sshClient = new Client().on("ready", () => {
  if (!scenario || !config) throw new Error();
  const scenarioFileName = scenario.name.replace(new RegExp(" ", "g"), "_");
  const configFileName = config.name.replace(new RegExp(" ", "g"), "_");

  sshClient.exec(
    getInitConfigsCommands(
      scenarioFileName,
      configFileName,
      parseScenarioForNl(scenario),
      parseConfigForNl(config),
    ).join(" && "),
    (err) => {
      if (err) throw err;

      const startCommand = getNlStartCommand(scenarioFileName, configFileName);
      console.log(startCommand);

      let firstResponse = true;
      sshClient.exec(startCommand, { pty: true }, (err, channel) => {
        if (err) throw err;
        console.log(
          `Starting NetLoiter with Scenario: ${scenario?.name}, Config: ${config?.name}`,
        );
        runningFrom = new Date();
        initializeRun(
          runningFrom,
          scenario && "id" in scenario ? (scenario.id as number) : undefined,
          config && "id" in config ? (config.id as number) : undefined,
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

export const startNetLoiter = (
  _scenario: CreateScenarioFormValues,
  _config: CreateConfigFormValues & { id: number },
) => {
  if (!runningFrom) {
    scenario = _scenario;
    config = _config;
    sshClient.connect(sshConfig);
  }
};

export const getStatus = () => {
  return { runningFrom, scenario, config };
};

export const stopNetLoiter = () => {
  sshClient.end();
  runningFrom = false;
  scenario = undefined;
  config = undefined;
};
