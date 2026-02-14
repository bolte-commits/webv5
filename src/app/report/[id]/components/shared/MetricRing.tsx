"use client";

import { useEffect, useState } from "react";
import s from "./MetricRing.module.css";

export default function MetricRing({
  value,
  max,
  size = 100,
  strokeWidth = 6,
  color = "var(--r-accent, #0a84ff)",
  label,
  unit,
  animate = true,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  unit?: string;
  animate?: boolean;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    if (!animate) {
      setOffset(circ - (value / max) * circ);
      return;
    }
    const t = setTimeout(() => {
      setOffset(circ - (value / max) * circ);
    }, 200);
    return () => clearTimeout(t);
  }, [value, max, circ, animate]);

  return (
    <div className={s.wrap} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className={s.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={s.fill}
        />
      </svg>
      <div className={s.center}>
        <span className={s.value}>
          {value}
          {unit && <span className={s.unit}>{unit}</span>}
        </span>
        {label && <span className={s.label}>{label}</span>}
      </div>
    </div>
  );
}
