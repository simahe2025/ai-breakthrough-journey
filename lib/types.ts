export type StationId = "morning" | "noon" | "evening";

export type DayRecord = {
  date: string;
  task: string;
  morning: boolean;
  noon: boolean;
  evening: boolean;
  notes: string;
  tomorrow: string;
};

export type StoreV1 = {
  version: 1;
  days: Record<string, DayRecord>;
};

export const STATIONS: { id: StationId; label: string; hint: string }[] = [
  { id: "morning", label: "晨计划", hint: "写下今日唯一难事" },
  { id: "noon", label: "午复盘", hint: "上午做成了什么" },
  { id: "evening", label: "晚收束", hint: "关掉今天，点明日" },
];
