import { LineChart } from "@mui/x-charts";
import { colors } from "../../utils/mui";

interface GraphSeries {
  data: (number | null)[] | undefined;
  color: string;
  label: string;
}

interface Props {
  windowFrom: number;
  windowSize: number;
  graphSeries: GraphSeries[];
  formattedTimes: number[] | undefined;
}

const chartStyles = {
  "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
    fill: colors.white,
  },
  "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
    fill: colors.white,
  },
  "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
    stroke: colors.white,
  },
  "& .MuiChartsAxis-left .MuiChartsAxis-line": {
    stroke: colors.white,
  },
  "& .MuiChartsAxis-tick": {
    stroke: colors.white,
  },
};

export const LineGraph = ({
  windowFrom,
  windowSize,
  graphSeries,
  formattedTimes,
}: Props) => {
  return (
    <LineChart
      series={graphSeries}
      height={400}
      xAxis={[
        {
          id: "time",
          data: formattedTimes?.slice(windowFrom, windowFrom + windowSize),
          scaleType: "band",
          label: "Time (s)",
          labelStyle: { fill: colors.white },
        },
      ]}
      sx={chartStyles}
    />
  );
};
