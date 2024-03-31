import {
  MessageType,
  messageTypeOptions,
} from "../../../../server/nl-status/message-types";
import { PieChart } from "@mui/x-charts";

interface Props {
  messageCountByType: { type: MessageType; messagesCount: number }[];
}

export const PieGraph = ({ messageCountByType }: Props) => {
  return (
    <PieChart
      series={[
        {
          data: messageCountByType.map(({ messagesCount, type }) => ({
            id: type,
            value: messagesCount,
            label: `${messageTypeOptions.find(
              ({ value }) =>
                value === Number.parseInt(type as unknown as string),
            )?.label}: ${messagesCount}`,
          })),
        },
      ]}
      height={400}
    />
  );
};
