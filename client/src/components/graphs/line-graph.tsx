import { LineChart } from "@mui/x-charts";

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
    fill: "#F2F2F3",
  },
  "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
    fill: "#F2F2F3",
  },
  "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
    stroke: "#F2F2F3",
  },
  "& .MuiChartsAxis-left .MuiChartsAxis-line": {
    stroke: "#F2F2F3",
  },
  "& .MuiChartsAxis-tick": {
    stroke: "#F2F2F3",
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
          labelStyle: { fill: "#F2F2F3" },
        },
      ]}
      sx={chartStyles}
    />
  );
};
