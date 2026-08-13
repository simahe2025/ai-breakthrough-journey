const TZ = "Asia/Shanghai";

export function todayKey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function displayDate(now = new Date()): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: TZ,
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
}

export function hourInShanghai(now = new Date()): number {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "numeric",
      hour12: false,
    }).format(now),
  );
  return hour === 24 ? 0 : hour;
}

export function currentStation(now = new Date()): "morning" | "noon" | "evening" {
  const h = hourInShanghai(now);
  if (h < 12) return "morning";
  if (h < 18) return "noon";
  return "evening";
}

export function shiftKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}
