"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DayPath } from "@/components/DayPath";
import { currentStation, displayDate, todayKey } from "@/lib/clock";
import {
  draftTomorrow,
  getDay,
  loadStore,
  saveStore,
  streakCount,
  upsertDay,
} from "@/lib/storage";
import type { DayRecord, StationId, StoreV1 } from "@/lib/types";

const CTA: Record<StationId, string> = {
  morning: "写下并点亮晨计划",
  noon: "点亮午复盘",
  evening: "关掉今天",
};

export default function HomePage() {
  const [store, setStore] = useState<StoreV1>({ version: 1, days: {} });
  const [ready, setReady] = useState(false);
  const date = todayKey();
  const day = getDay(store, date);
  const station = currentStation();
  const streak = useMemo(() => streakCount(store, date), [store, date]);

  useEffect(() => {
    setStore(loadStore());
    setReady(true);
  }, []);

  function commit(next: DayRecord) {
    const updated = upsertDay(store, next);
    setStore(updated);
    saveStore(updated);
  }

  function toggle(id: StationId) {
    commit({ ...day, [id]: !day[id] });
  }

  function closeEvening() {
    const tomorrow = draftTomorrow({ ...day, evening: true });
    commit({ ...day, evening: true, tomorrow });
  }

  return (
    <>
      <header className="top">
        <div className="brand">
          <strong>日课</strong>
          <em>Rike</em>
        </div>
        <nav className="nav">
          <Link href="/" aria-current="page">
            今日
          </Link>
          <Link href="/week">周览</Link>
        </nav>
      </header>

      <main className="stage">
        <section>
          <p className="kicker">{displayDate()}</p>
          <h1>每天只攻一件难事</h1>
          <input
            className="task"
            value={day.task}
            placeholder="今日唯一：一句话，今晚必须关掉"
            onChange={(e) => commit({ ...day, task: e.target.value })}
            aria-label="今日唯一难事"
          />
          <div className="cta">
            <button
              className="primary"
              type="button"
              onClick={() => (station === "evening" ? closeEvening() : toggle(station))}
            >
              {CTA[station]}
            </button>
            <span className="streak">{ready ? `连续 ${streak} 日` : "…"}</span>
          </div>
        </section>
        <DayPath day={day} onToggle={toggle} />
      </main>

      <section className="reflect">
        <h2>晚收束</h2>
        <p>卡在哪、做成哪一刀。写完后生成明日唯一。</p>
        <textarea
          className="ruled"
          value={day.notes}
          placeholder="下午做成了……卡在……"
          onChange={(e) => commit({ ...day, notes: e.target.value })}
        />
        <p className="tomorrow">{day.tomorrow || draftTomorrow(day)}</p>
        <div className="cta">
          <button
            className="primary"
            type="button"
            onClick={() => commit({ ...day, tomorrow: draftTomorrow(day), evening: true })}
          >
            生成明日唯一并收束
          </button>
        </div>
      </section>
    </>
  );
}
