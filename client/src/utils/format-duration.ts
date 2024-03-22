const secondsInHour = 60 * 60;
const secondsInDay = secondsInHour * 24;

export const formatDuration = (duration: number) => {
  const durationInSeconds = duration / 1000;
  const days = Math.floor(durationInSeconds / secondsInDay);
  const hours = Math.floor(
    (durationInSeconds - days * secondsInDay) / secondsInHour,
  );
  const minutes = Math.floor(
    (durationInSeconds - days * secondsInDay - hours * secondsInHour) / 60,
  );
  const seconds = Math.floor(
    durationInSeconds -
      days * secondsInDay -
      hours * secondsInHour -
      minutes * 60,
  );

  const parts = [];
  if (days > 0) {
    parts.push(`${days} days`);
  }
  if (hours > 0) {
    parts.push(`${hours} hours`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minutes`);
  }
  if (seconds > 0) {
    parts.push(`${seconds} seconds`);
  }

  return parts.join(" ");
};
