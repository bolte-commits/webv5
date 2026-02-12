"use client";

import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { AnimatedChart } from "./Timeline";
import s from "../report.module.css";

type Region = {
  name: string;
  fatPercent: number;
  lean: number;
  fat: number;
  total: number;
  prevFat: number;
  prevDate: string;
  fatTrend: number[];
  leanTrend: number[];
  fatMassTrend: number[];
};

/* ── Realistic body silhouette ── */
function BodySilhouette({
  active,
  onTap,
}: {
  active: string | null;
  onTap: (name: string) => void;
}) {
  const isActive = (name: string) => active === name;
  const fill = (name: string) =>
    isActive(name) ? "rgba(0,122,255,0.2)" : "rgba(255,255,255,0.03)";
  const stroke = (name: string) =>
    isActive(name) ? "#007aff" : "rgba(255,255,255,0.12)";
  const sw = (name: string) => (isActive(name) ? 1.8 : 0.8);
  const glow = (name: string) =>
    isActive(name) ? "drop-shadow(0 0 6px rgba(0,122,255,0.4))" : "none";

  return (
    <svg viewBox="0 0 200 440" className={s.bodySvg}>
      {/* Head */}
      <ellipse cx="100" cy="38" rx="22" ry="26" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      {/* Neck */}
      <path d="M90,62 L90,78 Q90,82 94,82 L106,82 Q110,82 110,78 L110,62" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

      {/* Trunk — torso */}
      <path
        d="M72,82 Q64,86 60,100 L56,142 Q54,158 56,170 L60,185 Q64,192 72,196 L82,198 L100,200 L118,198 L128,196 Q136,192 140,185 L144,170 Q146,158 144,142 L140,100 Q136,86 128,82 Z"
        fill={fill("Trunk")}
        stroke={stroke("Trunk")}
        strokeWidth={sw("Trunk")}
        style={{ filter: glow("Trunk"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Trunk")}
      />

      {/* Android (belly) overlay */}
      <path
        d="M74,132 Q72,130 76,128 L124,128 Q128,130 126,132 L126,168 Q126,172 122,172 L78,172 Q74,172 74,168 Z"
        fill={fill("Android (Belly)")}
        stroke={stroke("Android (Belly)")}
        strokeWidth={sw("Android (Belly)")}
        strokeDasharray={isActive("Android (Belly)") ? "none" : "3 2"}
        style={{ filter: glow("Android (Belly)"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Android (Belly)")}
      />

      {/* Gynoid (hip) overlay */}
      <path
        d="M66,186 Q64,182 68,180 L132,180 Q136,182 134,186 L130,206 Q126,212 118,214 L82,214 Q74,212 70,206 Z"
        fill={fill("Gynoid (Hip)")}
        stroke={stroke("Gynoid (Hip)")}
        strokeWidth={sw("Gynoid (Hip)")}
        strokeDasharray={isActive("Gynoid (Hip)") ? "none" : "3 2"}
        style={{ filter: glow("Gynoid (Hip)"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Gynoid (Hip)")}
      />

      {/* Left Arm */}
      <path
        d="M58,88 Q48,92 42,104 L36,132 Q32,148 30,160 Q28,168 32,172 L38,172 Q44,170 46,162 L52,136 L56,112 L58,98 Z"
        fill={fill("Arms")}
        stroke={stroke("Arms")}
        strokeWidth={sw("Arms")}
        style={{ filter: glow("Arms"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Arms")}
      />
      {/* Left Forearm + Hand */}
      <path d="M32,172 Q28,180 26,194 L24,208 Q22,216 26,220 L32,220 Q36,218 36,210 L38,196 L38,172" fill={fill("Arms")} stroke={stroke("Arms")} strokeWidth={sw("Arms")} style={{ filter: glow("Arms"), cursor: "pointer", transition: "all 0.3s" }} onClick={() => onTap("Arms")} />

      {/* Right Arm */}
      <path
        d="M142,88 Q152,92 158,104 L164,132 Q168,148 170,160 Q172,168 168,172 L162,172 Q156,170 154,162 L148,136 L144,112 L142,98 Z"
        fill={fill("Arms")}
        stroke={stroke("Arms")}
        strokeWidth={sw("Arms")}
        style={{ filter: glow("Arms"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Arms")}
      />
      {/* Right Forearm + Hand */}
      <path d="M168,172 Q172,180 174,194 L176,208 Q178,216 174,220 L168,220 Q164,218 164,210 L162,196 L162,172" fill={fill("Arms")} stroke={stroke("Arms")} strokeWidth={sw("Arms")} style={{ filter: glow("Arms"), cursor: "pointer", transition: "all 0.3s" }} onClick={() => onTap("Arms")} />

      {/* Left Leg */}
      <path
        d="M78,200 L74,230 L70,270 L66,310 L64,340 Q62,354 64,360 L68,364 L78,364 Q82,362 82,354 L84,340 L86,310 L88,270 L90,230 L92,206"
        fill={fill("Legs")}
        stroke={stroke("Legs")}
        strokeWidth={sw("Legs")}
        style={{ filter: glow("Legs"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Legs")}
      />
      {/* Left Foot */}
      <path d="M64,360 L60,370 Q56,378 58,382 L62,386 Q68,390 78,388 L82,384 Q84,378 82,372 L82,360" fill={fill("Legs")} stroke={stroke("Legs")} strokeWidth={sw("Legs")} style={{ filter: glow("Legs"), cursor: "pointer", transition: "all 0.3s" }} onClick={() => onTap("Legs")} />

      {/* Right Leg */}
      <path
        d="M122,200 L126,230 L130,270 L134,310 L136,340 Q138,354 136,360 L132,364 L122,364 Q118,362 118,354 L116,340 L114,310 L112,270 L110,230 L108,206"
        fill={fill("Legs")}
        stroke={stroke("Legs")}
        strokeWidth={sw("Legs")}
        style={{ filter: glow("Legs"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Legs")}
      />
      {/* Right Foot */}
      <path d="M136,360 L140,370 Q144,378 142,382 L138,386 Q132,390 122,388 L118,384 Q116,378 118,372 L118,360" fill={fill("Legs")} stroke={stroke("Legs")} strokeWidth={sw("Legs")} style={{ filter: glow("Legs"), cursor: "pointer", transition: "all 0.3s" }} onClick={() => onTap("Legs")} />
    </svg>
  );
}

export default function BodyMap({
  regions,
  trendLabels,
}: {
  regions: Region[];
  trendLabels: string[];
}) {
  const [active, setActive] = useState<string | null>("Trunk");
  const ref = useScrollReveal<HTMLElement>();

  const activeRegion = regions.find((r) => r.name === active);

  const toggle = (name: string) => setActive(active === name ? null : name);

  return (
    <section ref={ref} className={`${s.section} ${s.bodyMapSection}`}>
      <div className={s.sectionLabel}>Regions</div>
      <div className={s.sectionTitle}>Where Your Fat Lives</div>

      <div className={s.bodyMapContainer}>
        <div className={s.bodySvgWrap}>
          <BodySilhouette active={active} onTap={toggle} />
        </div>

        {/* Region Buttons */}
        <div className={s.regionLabels}>
          {regions.map((r) => (
            <button
              key={r.name}
              className={`${s.regionBtn} ${active === r.name ? s.regionBtnActive : ""}`}
              onClick={() => toggle(r.name)}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Detail Sheet */}
        {activeRegion && (
          <div className={s.detailSheet} key={activeRegion.name}>
            <div className={s.detailName}>{activeRegion.name}</div>
            <div className={s.detailGrid}>
              <div className={s.detailMetric}>
                <span className={s.detailMetricLabel}>Fat %</span>
                <span className={s.detailMetricValue}>
                  {activeRegion.fatPercent}<span className={s.detailMetricUnit}>%</span>
                </span>
              </div>
              <div className={s.detailMetric}>
                <span className={s.detailMetricLabel}>Lean</span>
                <span className={s.detailMetricValue}>
                  {activeRegion.lean}<span className={s.detailMetricUnit}> kg</span>
                </span>
              </div>
              <div className={s.detailMetric}>
                <span className={s.detailMetricLabel}>Fat Mass</span>
                <span className={s.detailMetricValue}>
                  {activeRegion.fat}<span className={s.detailMetricUnit}> kg</span>
                </span>
              </div>
              <div className={s.detailMetric}>
                <span className={s.detailMetricLabel}>Total</span>
                <span className={s.detailMetricValue}>
                  {activeRegion.total}<span className={s.detailMetricUnit}> kg</span>
                </span>
              </div>
              <div className={s.detailDelta}>
                Was {activeRegion.prevFat}% in {activeRegion.prevDate} &middot; &darr;
                {(activeRegion.prevFat - activeRegion.fatPercent).toFixed(1)}%
              </div>
            </div>

            {/* Region Scale */}
            {(() => {
              const pos = Math.min(activeRegion.fatPercent / 30, 1) * 100;
              return (
                <div className={s.scaleWrap}>
                  <span className={s.scaleYou} style={{ left: `${pos}%` }}>You</span>
                  <div
                    className={s.scaleTrack}
                    style={{
                      background:
                        "linear-gradient(90deg, #34d399 0%, #6ee7b7 33%, #fbbf24 55%, #fb923c 75%, #f87171 100%)",
                    }}
                  >
                    <div className={s.scaleMarker} style={{ left: `${pos}%` }} />
                  </div>
                  <div className={s.scaleTicks}>
                    <span>0%</span><span>10%</span><span>20%</span><span>30%+</span>
                  </div>
                </div>
              );
            })()}

            {/* Region Trends */}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className={s.sectionTitle}>Trends</div>
              <div style={{ marginTop: 12 }}>
              <AnimatedChart
                title={`${activeRegion.name} Fat %`}
                data={activeRegion.fatTrend}
                labels={trendLabels}
                unit="%"
                color="#fbbf24"
                decreaseIsGood
              />
              <AnimatedChart
                title={`${activeRegion.name} Lean (kg)`}
                data={activeRegion.leanTrend}
                labels={trendLabels}
                unit=""
                color="#60a5fa"
              />
              <AnimatedChart
                title={`${activeRegion.name} Fat Mass (kg)`}
                data={activeRegion.fatMassTrend}
                labels={trendLabels}
                unit=""
                color="#f87171"
                decreaseIsGood
              />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
