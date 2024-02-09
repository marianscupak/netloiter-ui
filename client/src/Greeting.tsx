import { trpc } from "./utils/trpc";

export function Greeting() {
  const greeting = trpc.greeting.useQuery({ name: "NetLoiter UI" });

  return <div>{greeting.data?.text}</div>;
}
