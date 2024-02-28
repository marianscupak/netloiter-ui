export { ActionType } from "@prisma/client";

// TODO: For some reason, this cannot be exported from the prisma client
export enum GuardType {
  Count = "Count",
  CountPeriod = "CountPeriod",
  EveryN = "EveryN",
  ICMP = "ICMP",
  IP = "IP",
  Port = "Port",
  Prob = "Prob",
  Protocol = "Protocol",
  Size = "Size",
  Time = "Time",
  TimePeriod = "TimePeriod",
}

export enum RuleType {
  All = "All",
  Any = "Any",
}
