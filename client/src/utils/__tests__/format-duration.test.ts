import dayjs from "dayjs";
import { formatDuration } from "../format-duration";

describe("format duration", () => {
  test("format duration correctly", () => {
    const now = dayjs();

    expect(formatDuration(now.diff(now.subtract(5, "seconds")))).toEqual(
      "5 seconds",
    );

    expect(
      formatDuration(
        now.diff(now.subtract(5, "seconds").subtract(2, "minutes")),
      ),
    ).toEqual("2 minutes 5 seconds");

    expect(
      formatDuration(
        now.diff(
          now
            .subtract(5, "seconds")
            .subtract(2, "minutes")
            .subtract(3, "hours"),
        ),
      ),
    ).toEqual("3 hours 2 minutes 5 seconds");

    expect(
      formatDuration(
        now.diff(
          now
            .subtract(5, "seconds")
            .subtract(2, "minutes")
            .subtract(3, "hours")
            .subtract(2, "days"),
        ),
      ),
    ).toEqual("2 days 3 hours 2 minutes 5 seconds");
  });
});
