"use client";

import { useState, useEffect, useRef } from "react";
import s from "../report.module.css";

type ChartProps = {
  title: string;
  data: number[];
  labels: string[];
  unit?: string;
  color?: string;
  decreaseIsGood?: boolean;
};

function AnimatedChart({ title, data, labels, unit = "", color = "#007aff", decreaseIsGood = false }: ChartProps) {
  const w = 360, h = 120, pad = 28;
  const min = Math.min(...data) - (Math.max(...data) - Math.min(...data)) * 0.15;
  const max = Math.max(...data) + (Math.max(...data) - Math.min(...data)) * 0.15;
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);

  const pts = data.map((v, i) => ({
    x: pad + i * step,
    y: h - pad - ((v - min) / range) * (h - pad * 2),
    val: v,
  }));

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0].x},${h - pad} ${pts.map((p) => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length - 1].x},${h - pad} Z`;

  // Stroke draw animation
  const ref = useRef<SVGSVGElement>(null);
  const polyRef = useRef<SVGPolylineElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.unobserve(svg);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  // Calculate total length for dash animation
  const totalLength = pts.reduce((acc, p, i) => {
    if (i === 0) return 0;
    const prev = pts[i - 1];
    return acc + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
  }, 0);

  const last = data[data.length - 1];
  const first = data[0];
  const improved = decreaseIsGood ? last < first : last > first;

  return (
    <div className={s.chartWrap}>
      <div className={s.chartTitle}>{title}</div>
      <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className={s.chartSvg}>
        {/* Grid lines */}
        <line x1={pad} y1={pad} x2={w - pad} y2={pad} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4" />
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

        {/* Area */}
        <path d={area} fill={color} className={s.chartArea} opacity={drawn ? 0.08 : 0} style={{ transition: "opacity 1s ease 0.5s" }} />

        {/* Line */}
        <polyline
          ref={polyRef}
          points={polyline}
          className={s.chartLine}
          stroke={color}
          strokeDasharray={totalLength}
          strokeDashoffset={drawn ? 0 : totalLength}
        />

        {/* Dots */}
        {pts.map((p, i) => {
          const isLast = i === pts.length - 1;
          return (
            <g key={i} className={s.chartDot} style={{ opacity: drawn ? 1 : 0, transition: `opacity 0.3s ease ${0.8 + i * 0.15}s` }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isLast ? 5 : 3.5}
                fill={isLast ? color : "var(--r-bg, #050505)"}
                stroke={color}
                strokeWidth="2"
                className={isLast ? s.chartDotPulse : ""}
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fontSize="9"
                fontWeight={isLast ? "700" : "500"}
                fill={
                  isLast && improved
                    ? "var(--r-green, #34d399)"
                    : isLast
                      ? "var(--r-yellow, #fbbf24)"
                      : "var(--r-text-secondary, #8e8e93)"
                }
              >
                {p.val}{unit}
              </text>
            </g>
          );
        })}
      </svg>
      <div className={s.chartLabels}>
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  );
}

export { AnimatedChart };

export default function Timeline({
  dates,
  bodyFat,
  leanMass,
  fatMass,
  scanNumber,
  visceralFatTrend,
  tScoreTrend,
}: {
  dates: string[];
  bodyFat: number[];
  leanMass: number[];
  fatMass: number[];
  scanNumber: number;
  visceralFatTrend: number[];
  tScoreTrend: number[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${s.section} ${s.timelineSection}`}>
      <div className={s.sectionLabel}>Trends</div>
      <div className={s.sectionTitle}>How You&apos;ve Changed</div>
      <div className={s.sectionDesc}>Across {scanNumber} DEXA scans since {dates[0]}.</div>

      <div style={{ marginTop: 16 }}>
        <AnimatedChart title="Body Fat %" data={bodyFat} labels={dates} unit="%" color="#007aff" decreaseIsGood />
        <AnimatedChart title="Lean Mass (kg)" data={leanMass} labels={dates} unit="" color="#60a5fa" />
        <AnimatedChart title="Fat Mass (kg)" data={fatMass} labels={dates} unit="" color="#fbbf24" decreaseIsGood />
        <AnimatedChart title="Visceral Fat (g)" data={visceralFatTrend} labels={dates} unit="g" color="#f87171" decreaseIsGood />
        <AnimatedChart title="T-Score Trend" data={tScoreTrend} labels={dates} unit="" color="#a78bfa" />
      </div>
    </section>
  );
}
