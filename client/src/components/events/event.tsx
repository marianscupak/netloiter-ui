import { Message } from "../../../../server/nl-status/message-types";

interface Props {
  message: Message;
}

export const Event = ({ message }: Props) => {
  return (
    <div className="bg-dark-gray p-4 text-white border rounded-[4px]">
      {JSON.stringify(message)}
    </div>
  );
};
