import { Client } from "ssh2";
import { eventEmitter } from "../event-emitter";

const nlStartCommand =
  "sudo python3 ~/Documents/NetLoiter/netloiter.py -v 3 --log-mode csv run -s ~/Documents/NetLoiter/examples/scenario/scenario1.yaml -c ~/Documents/NetLoiter/examples/config/config_nf1.yaml";

const sshConfig = {
  host: "192.168.64.4",
  port: 22,
  username: "marian",
  password: "password",
};

const sshClient = new Client().on("ready", () => {
  let responseCount = 0;

  sshClient.exec(nlStartCommand, { pty: true }, (err, channel) => {
    if (err) throw err;
    runningFrom = new Date();
    channel
      .on("data", (data: unknown) => {
        if (responseCount === 0) {
          channel.write("password" + "\n");
        } else {
          eventEmitter.emit("add", data);
        }
        responseCount++;
      })
      .on("close", (code: unknown, signal: unknown) => {
        console.log("Closed with code: " + code, signal);
        sshClient.end();
        runningFrom = false;
      });
  });
});

let runningFrom: Date | false = false;

export const startNetLoiter = () => {
  if (!runningFrom) {
    sshClient.connect(sshConfig);
  }
};

export const getRunningFrom = () => {
  return runningFrom;
};

export const stopNetLoiter = () => {
  sshClient.end();
  runningFrom = false;
};
