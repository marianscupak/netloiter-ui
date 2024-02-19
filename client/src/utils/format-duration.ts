const secondsInHour = 60 * 60;
const secondsInDay = secondsInHour * 24;

export const formatDuration = (duration: number) => {
  const days = Math.floor(duration / secondsInDay);
  const hours = Math.floor((duration - days * secondsInDay) / secondsInHour);
  const minutes = Math.floor(
    (duration - days * secondsInDay - hours * secondsInHour) / 60,
  );
  const seconds =
    duration - days * secondsInDay - hours * secondsInHour - minutes * 60;

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
