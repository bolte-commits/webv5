"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import MetricRing from "./shared/MetricRing";
import FlipCard from "./shared/FlipCard";
import s from "../report.module.css";

type Plan = {
  goal: string;
  calories: number;
  note: string;
  protein: number;
  carbs: number;
  fat: number;
};

/* ── Inline mini chart for RMR trend ── */
function MiniTrend({
  data,
  labels,
  color = "#0a84ff",
}: {
  data: number[];
  labels: string[];
  color?: string;
}) {
  const w = 360, h = 100, pad = 24;
  const min = Math.min(...data) - (Math.max(...data) - Math.min(...data)) * 0.2;
  const max = Math.max(...data) + (Math.max(...data) - Math.min(...data)) * 0.2;
  const range = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);

  const pts = data.map((v, i) => ({
    x: pad + i * step,
    y: h - pad - ((v - min) / range) * (h - pad * 2),
    val: v,
  }));

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const totalLength = pts.reduce((acc, p, i) => {
    if (i === 0) return 0;
    const prev = pts[i - 1];
    return acc + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
  }, 0);

  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setDrawn(true); observer.unobserve(el); }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={s.chartWrap} style={{ marginTop: 12 }}>
      <div className={s.chartTitle}>RMR Trend (kcal)</div>
      <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} className={s.chartSvg}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <polyline
          points={polyline}
          className={s.chartLine}
          stroke={color}
          strokeDasharray={totalLength}
          strokeDashoffset={drawn ? 0 : totalLength}
        />
        {pts.map((p, i) => {
          const isLast = i === pts.length - 1;
          return (
            <g key={i} style={{ opacity: drawn ? 1 : 0, transition: `opacity 0.3s ease ${0.8 + i * 0.15}s` }}>
              <circle cx={p.x} cy={p.y} r={isLast ? 5 : 3.5} fill={isLast ? color : "var(--r-bg)"} stroke={color} strokeWidth="2" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight={isLast ? "700" : "500"} fill={isLast ? "var(--r-green)" : "var(--r-text-secondary)"}>{p.val}</text>
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

export default function FuelStation({
  rmr,
  aboveAvg,
  tdee,
  breakdown,
  plans,
  recommendation,
  activities,
  rmrTrend,
  trendLabels,
}: {
  rmr: number;
  aboveAvg: number;
  tdee: number;
  breakdown: { label: string; value: number }[];
  plans: Plan[];
  recommendation: string;
  activities: { name: string; cal: number }[];
  rmrTrend: number[];
  trendLabels: string[];
}) {
  const ref = useScrollReveal<HTMLElement>();
  const [planIdx, setPlanIdx] = useState(1);
  const plan = plans[planIdx];

  return (
    <section ref={ref} className={`${s.section} ${s.fuelSection}`}>
      <div className={s.sectionLabel}>Fuel</div>
      <div className={s.sectionTitle}>How You Burn Energy</div>

      {/* RMR Card */}
      <div className={s.fuelFlipWrap}>
        <FlipCard
          front={
            <div className={s.fuelFlipFront}>
              <div className={s.fuelLabel}>Resting Metabolic Rate</div>
              <div className={s.fuelBigNum}>
                {rmr}<span className={s.fuelUnit}> kcal/day</span>
              </div>
              <div className={s.fuelAbove}>{aboveAvg}% above average</div>
            </div>
          }
          back={
            <>
              <div className={s.hcBackTitle}>Resting Metabolic Rate</div>
              <p className={s.hcBackText}>
                The calories your body burns at complete rest to keep you alive — breathing, circulation, cell repair. Higher lean mass = higher RMR.
              </p>
            </>
          }
        />
      </div>

      {/* TDEE Breakdown */}
      <div className={s.fuelCard}>
        <div className={s.fuelLabel}>Daily Calorie Needs</div>
        {breakdown.map((item, i) => (
          <div className={s.breakdownRow} key={i}>
            <span className={s.breakdownLabel}>
              {i + 1}. <strong>{item.label}</strong>
            </span>
            <span className={s.breakdownVal}>{i === 0 ? "" : "+"}{item.value}</span>
          </div>
        ))}
        <div className={s.breakdownTotal}>
          <span className={s.breakdownTotalLabel}>Total Expenditure</span>
          <span className={s.breakdownTotalVal}>{tdee}</span>
        </div>
      </div>

      {/* RMR Trend */}
      <MiniTrend data={rmrTrend} labels={trendLabels} />

      {/* Activity Calories */}
      <div className={s.activityCard}>
        <div className={s.activityCardTitle}>Calories per Activity (1 hr)</div>
        {activities.map((a, i) => (
          <div className={s.actRow} key={i}>
            <span className={s.actName}>{a.name}</span>
            <span className={s.actVal}>{a.cal}</span>
          </div>
        ))}
      </div>

      {/* Nutrition Plan Selector */}
      <div style={{ marginTop: 24 }}>
        <div className={s.sectionLabel}>Nutrition</div>
        <div className={s.sectionTitle}>What to Eat</div>

        <div className={s.planTabs}>
          {plans.map((p, i) => (
            <button
              key={p.goal}
              className={`${s.planTab} ${planIdx === i ? s.planTabActive : ""}`}
              onClick={() => setPlanIdx(i)}
            >
              {p.goal}
            </button>
          ))}
        </div>

        <div className={s.fuelFlipWrap} key={plan.goal}>
          <FlipCard
            className={s.planFlipTall}
            front={
              <div className={s.planFlipFront}>
                <div className={s.planCalories}>
                  {plan.calories}<span className={s.planCalUnit}> kcal</span>
                </div>
                <div className={s.planNote}>{plan.note}</div>

                <div className={s.macroRow}>
                  <div className={s.macroItem}>
                    <MetricRing
                      value={plan.protein}
                      max={plan.protein + plan.carbs + plan.fat}
                      size={72}
                      strokeWidth={5}
                      color="#0a84ff"
                      unit="g"
                    />
                    <span className={s.macroName}>Protein</span>
                  </div>
                  <div className={s.macroItem}>
                    <MetricRing
                      value={plan.carbs}
                      max={plan.protein + plan.carbs + plan.fat}
                      size={72}
                      strokeWidth={5}
                      color="#fbbf24"
                      unit="g"
                    />
                    <span className={s.macroName}>Carbs</span>
                  </div>
                  <div className={s.macroItem}>
                    <MetricRing
                      value={plan.fat}
                      max={plan.protein + plan.carbs + plan.fat}
                      size={72}
                      strokeWidth={5}
                      color="#8e8e93"
                      unit="g"
                    />
                    <span className={s.macroName}>Fat</span>
                  </div>
                </div>
              </div>
            }
            back={
              <>
                <div className={s.hcBackTitle}>Calories &amp; Macros</div>
                <p className={s.hcBackText}>
                  Your <strong>target calories</strong> are the total energy you should eat each day to reach your goal — calculated from your metabolism, activity level, and whether you want to lose fat, maintain, or gain muscle.
                </p>
                <p className={s.hcBackText} style={{ marginTop: 8 }}>
                  <strong>Macros</strong> (macronutrients) are the three building blocks of food: <strong>Protein</strong> repairs and grows muscle. <strong>Carbs</strong> fuel your brain and workouts. <strong>Fat</strong> regulates hormones and absorbs vitamins. Hitting the right ratio matters as much as total calories.
                </p>
              </>
            }
          />
        </div>
      </div>

      <div className={s.nutritionRec}>
        <strong>Recommendation:</strong> {recommendation}
      </div>
    </section>
  );
}
