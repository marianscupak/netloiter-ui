import {
  Message,
  MessageType,
} from "../../../../server/nl-status/message-types";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { statusAtom } from "../../state/status";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { RulesReplacedEvent } from "./rules-replaced-event";

interface Props {
  message: Message;
}

export const Event = ({ message }: Props) => {
  const [{ scenario }] = useAtom(statusAtom);

  const event = useMemo(() => {
    switch (message.type) {
      case MessageType.UnknownMessage:
        return <div>Unknown message</div>;
      case MessageType.StartingNetLoiter:
        return <div>Starting NetLoiter</div>;
      case MessageType.EvaluatingAllRule: {
        const { ruleIndex } = message;

        return <div>Evaluating All Rule (Rule index = {ruleIndex - 1})</div>;
      }
      case MessageType.AllRuleFailure: {
        const { ruleIndex, failedGuardIndex } = message;

        const failedGuardId =
          scenario?.rules[ruleIndex - 1]?.guards[failedGuardIndex - 1]
            ?.loadedId;

        return (
          <div>
            <div className="mb-2">
              All Rule Failure (Rule index = {ruleIndex - 1})
            </div>
            {failedGuardId ? (
              <NavLink to={`/guards/${failedGuardId}`}>
                <Button variant="contained">FAILED GUARD</Button>
              </NavLink>
            ) : (
              <div>Failed guard index: {failedGuardIndex}</div>
            )}
          </div>
        );
      }
      case MessageType.AllRuleSuccess: {
        const { ruleIndex } = message;

        return <div>All Rule Success (Rule index = {ruleIndex - 1})</div>;
      }
      case MessageType.EvaluatingAnyRule: {
        const { ruleIndex } = message;

        return <div>Evaluating Any Rule (Rule index = {ruleIndex - 1})</div>;
      }
      case MessageType.AnyRuleFailure: {
        const { ruleIndex } = message;

        return <div>Any Rule Failure (Rule index = {ruleIndex - 1})</div>;
      }
      case MessageType.AnyRuleSuccess: {
        const { ruleIndex, passedGuardIndex } = message;

        const passedGuardId =
          scenario?.rules[ruleIndex - 1]?.guards[passedGuardIndex - 1]
            ?.loadedId;

        return (
          <div>
            <div className="mb-2">
              Any Rule Success (Rule index = {ruleIndex - 1})
            </div>
            {passedGuardId !== undefined ? (
              <NavLink to={`/guards/${passedGuardId}`}>
                <Button variant="contained">PASSED GUARD</Button>
              </NavLink>
            ) : (
              <div>Passed guard index: {passedGuardIndex - 1}</div>
            )}
          </div>
        );
      }
      case MessageType.StartingPacketProcessing: {
        const { sourceIp, sourcePort, destIp, destPort, packetId } = message;

        return (
          <div className="flex-col">
            <div>Starting packet processing</div>
            <div>Packet ID: {packetId}</div>
            <div>
              Source: {sourceIp}:{sourcePort}
            </div>
            <div>
              Destination: {destIp}:{destPort}
            </div>
          </div>
        );
      }
      case MessageType.EndingPacketProcessing: {
        return <div>Ending packet processing</div>;
      }
      case MessageType.BitNoiseAction: {
        const { rawPayload, mask, result } = message;

        return (
          <div>
            <div>Executed Bit Noise Action with</div>
            <div>Raw payload: {rawPayload}</div>
            <div>Mask: {mask}</div>
            <div>Result: {result}</div>
          </div>
        );
      }
      case MessageType.DelayAction: {
        const { duration } = message;

        return (
          <div>
            <div>Executed Delay Action with</div>
            <div>Duration: {duration}</div>
          </div>
        );
      }
      case MessageType.DropAction: {
        return <div>Executed Drop Action</div>;
      }
      case MessageType.FinishAction: {
        return <div>Executed Finish Action</div>;
      }
      case MessageType.PauseAction: {
        return <div>Executed Pause Action</div>;
      }
      case MessageType.SkipAction: {
        return <div>Executed Skip Action</div>;
      }
      case MessageType.RestartAction: {
        return <div>Executed Restart Action</div>;
      }
      case MessageType.ReorderAction: {
        const { strategy } = message;

        return (
          <div>
            <div>Executed Reorder Action with</div>
            <div>Strategy: {strategy}</div>
          </div>
        );
      }
      case MessageType.ReplicateAction: {
        const { n } = message;

        return (
          <div>
            <div>Executed Replicate Action with</div>
            <div>N: {n}</div>
          </div>
        );
      }
      case MessageType.SocketTcpAction: {
        const { addr } = message;

        return (
          <div>
            <div>Executed Socket TCP Action with</div>
            <div>Address: {addr}</div>
          </div>
        );
      }
      case MessageType.ThrottleActionPass: {
        return (
          <div>
            <div>Executed Throttle Action</div>
            <div>Packet was passed through</div>
          </div>
        );
      }
      case MessageType.ThrottleActionDelay: {
        return (
          <div>
            <div>Executed ThrottleAction</div>
            <div>Packet was delayed</div>
          </div>
        );
      }
      case MessageType.RulesReplaced: {
        return <RulesReplacedEvent message={message} />;
      }
    }
  }, [message, scenario?.rules]);

  return (
    <div className="bg-dark-gray p-4 text-white border rounded-[4px]">
      {event}
    </div>
  );
};
