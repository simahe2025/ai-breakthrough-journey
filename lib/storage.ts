import type { DayRecord, StoreV1 } from "./types";
import { shiftKey, todayKey } from "./clock";

const KEY = "rike.v1";

function emptyDay(date: string): DayRecord {
  return {
    date,
    task: "",
    morning: false,
    noon: false,
    evening: false,
    notes: "",
    tomorrow: "",
  };
}

function emptyStore(): StoreV1 {
  return { version: 1, days: {} };
}

export function loadStore(): StoreV1 {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as StoreV1;
    if (parsed?.version !== 1 || typeof parsed.days !== "object") return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

export function saveStore(store: StoreV1): void {
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

export function getDay(store: StoreV1, date = todayKey()): DayRecord {
  return store.days[date] ?? emptyDay(date);
}

export function upsertDay(store: StoreV1, day: DayRecord): StoreV1 {
  return { ...store, days: { ...store.days, [day.date]: day } };
}

/** A day counts for streak only when evening is closed. */
export function streakCount(store: StoreV1, from = todayKey()): number {
  let n = 0;
  let cursor = from;
  const today = getDay(store, from);
  if (!today.evening) cursor = shiftKey(from, -1);
  while (getDay(store, cursor).evening) {
    n += 1;
    cursor = shiftKey(cursor, -1);
    if (n > 400) break;
  }
  return n;
}

export function lastNDays(store: StoreV1, n = 7, from = todayKey()): DayRecord[] {
  return Array.from({ length: n }, (_, i) => getDay(store, shiftKey(from, i - (n - 1))));
}

export function exportJson(store: StoreV1): string {
  return JSON.stringify(store, null, 2);
}

export function draftTomorrow(day: DayRecord): string {
  if (day.tomorrow.trim()) return day.tomorrow.trim();
  const lines = day.notes
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const last = lines.at(-1);
  if (last && last.length < 80) return last;
  if (!day.task.trim()) return "先写下今日唯一，再收束。";
  if (!day.evening) return `把「${day.task}」收束：完成、切掉，或改成明日唯一。`;
  return `明日唯一：延续「${day.task}」里未关掉的那一刀。`;
}
