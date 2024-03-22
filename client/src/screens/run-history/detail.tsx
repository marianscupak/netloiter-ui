import { useParams } from "react-router-dom";
import { z } from "zod";
import {
  MessageType,
  messageTypeOptions,
} from "../../../../server/nl-status/message-types";
import { useMemo } from "react";
import { RunDetail } from "../../components/run-detail";
import dayjs from "dayjs";
import { trpc } from "../../utils/trpc";

export const messageTypesInitialValue: MessageType[] = messageTypeOptions.map(
  (option) => option.value as MessageType,
);

export const RunHistoryDetail = () => {
  const { id: urlId } = useParams();

  const id = useMemo(() => Number.parseInt(z.string().parse(urlId)), [urlId]);

  const { data: runHistory } = trpc.runHistory.getRunHistoryDetail.useQuery({
    id,
  });

  return (
    <div className="p-4">
      <div className="text-header">
        Run{" "}
        {runHistory
          ? dayjs(runHistory.dateTime).format("DD. MM. YYYY HH:mm")
          : "History"}
      </div>
      <RunDetail id={id} />
    </div>
  );
};
