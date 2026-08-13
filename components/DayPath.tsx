"use client";

import { currentStation } from "@/lib/clock";
import type { DayRecord, StationId } from "@/lib/types";
import { STATIONS } from "@/lib/types";

const POS = [18, 50, 82];

export function DayPath({ day, onToggle }: { day: DayRecord; onToggle: (id: StationId) => void }) {
  const now = currentStation();
  const done = [day.morning, day.noon, day.evening];
  const activeIdx = STATIONS.findIndex((s) => s.id === now);
  const fillTo = done.lastIndexOf(true);
  const fillH = fillTo >= 0 ? POS[fillTo] : 8;

  return (
    <svg className="path-wrap" viewBox="0 0 200 520" role="img" aria-label="今日三站点">
      <defs>
        <linearGradient id="rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a36a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3f8f7e" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <line x1="46" y1="36" x2="46" y2="484" stroke="rgba(201,163,106,.22)" strokeWidth="2" />
      <line
        x1="46"
        y1="36"
        x2="46"
        y2={(fillH / 100) * 448 + 36}
        stroke="url(#rail)"
        strokeWidth="3"
        style={{ transition: "all .7s ease" }}
      />
      {STATIONS.map((s, i) => {
        const y = (POS[i] / 100) * 448 + 36;
        const on = done[i];
        const isNow = s.id === now;
        return (
          <g key={s.id}>
            <circle
              cx="46"
              cy={y}
              r={isNow ? 11 : 8}
              fill={on ? "#3f8f7e" : "#071318"}
              stroke={on ? "#e8d2a4" : "#c9a36a"}
              strokeWidth="1.6"
              style={{ transition: "all .45s ease" }}
            />
            <text x="72" y={y - 8} fill="#d7e6df" fontSize="15" fontFamily="Noto Serif SC, serif">
              {s.label}
            </text>
            <text x="72" y={y + 12} fill="#8aa398" fontSize="11" fontFamily="Noto Sans SC, sans-serif">
              {s.hint}
            </text>
            <rect
              x="0"
              y={y - 28}
              width="200"
              height="56"
              fill="transparent"
              role="button"
              tabIndex={0}
              aria-label={`${s.label}${on ? "已完成" : "未完成"}`}
              style={{ cursor: "pointer" }}
              onClick={() => onToggle(s.id)}
            />
          </g>
        );
      })}
      <circle
        cx="46"
        cy={(POS[Math.max(activeIdx, 0)] / 100) * 448 + 36}
        r="3"
        fill="#e8d2a4"
        style={{ transition: "cy .8s ease" }}
      >
        <animate attributeName="opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
