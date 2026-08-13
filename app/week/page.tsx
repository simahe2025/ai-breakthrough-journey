"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { exportJson, lastNDays, loadStore } from "@/lib/storage";
import type { StoreV1 } from "@/lib/types";

export default function WeekPage() {
  const [store, setStore] = useState<StoreV1>({ version: 1, days: {} });

  useEffect(() => {
    setStore(loadStore());
  }, []);

  const days = lastNDays(store, 7);

  return (
    <>
      <header className="top">
        <div className="brand">
          <strong>日课</strong>
          <em>Rike</em>
        </div>
        <nav className="nav">
          <Link href="/">今日</Link>
          <Link href="/week" aria-current="page">
            周览
          </Link>
        </nav>
      </header>
      <main className="week">
        <p className="kicker">近七日</p>
        <h1>有没有关掉</h1>
        <div className="days">
          {days.map((d) => (
            <div className="day-row" key={d.date}>
              <span className="when">{d.date.slice(5)}</span>
              <span>{d.task || "（未写今日唯一）"}</span>
              <span className={d.evening ? "closed" : "open"}>{d.evening ? "已收束" : "未关"}</span>
            </div>
          ))}
        </div>
        <div className="cta" style={{ marginTop: "2.2rem" }}>
          <button
            className="primary"
            type="button"
            onClick={() => {
              const blob = new Blob([exportJson(store)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "rike-export.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            导出本机记录
          </button>
        </div>
      </main>
    </>
  );
}
