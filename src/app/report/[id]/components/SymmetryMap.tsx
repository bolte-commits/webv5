"use client";

import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import StatusTag from "./shared/StatusTag";
import s from "../report.module.css";

type SymSide = {
  fatPercent: number;
  total: number;
  lean: number;
  fat: number;
  bone: number;
};

type SymRegion = {
  name: string;
  left: SymSide;
  right: SymSide;
  verdict: string;
  status: "green" | "yellow" | "red" | "neutral";
  balancePercent: number;
};

/* ── Symmetry silhouette (Arms / Legs / Trunk only) ── */
function SymSilhouette({
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

  /* Show L / R labels when Arms or Legs selected */
  const showLR = active === "Arms" || active === "Legs";

  return (
    <svg viewBox="0 0 200 440" className={s.bodySvg}>
      {/* L / R labels */}
      {showLR && (
        <>
          <text x="22" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="rgba(0,122,255,0.6)">L</text>
          <text x="178" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="rgba(0,122,255,0.6)">R</text>
        </>
      )}

      {/* Head (not clickable) */}
      <ellipse cx="100" cy="38" rx="22" ry="26" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      {/* Neck */}
      <path d="M90,62 L90,78 Q90,82 94,82 L106,82 Q110,82 110,78 L110,62" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

      {/* Trunk */}
      <path
        d="M72,82 Q64,86 60,100 L56,142 Q54,158 56,170 L60,185 Q64,192 72,196 L82,198 L100,200 L118,198 L128,196 Q136,192 140,185 L144,170 Q146,158 144,142 L140,100 Q136,86 128,82 Z"
        fill={fill("Trunk")}
        stroke={stroke("Trunk")}
        strokeWidth={sw("Trunk")}
        style={{ filter: glow("Trunk"), cursor: "pointer", transition: "all 0.3s" }}
        onClick={() => onTap("Trunk")}
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
      <path d="M136,360 L140,370 Q144,378 142,382 L138,386 Q132,390 122,388 L118,384 Q116,378 118,372 L118,360" fill={fill("Legs")} stroke={stroke("Legs")} strokeWidth={sw("Legs")} style={{ filter: glow("Legs"), cursor: "pointer", transition: "all 0.3s" }} onClick={() => onTap("Legs")} />
    </svg>
  );
}

export default function SymmetryMap({
  symmetry,
}: {
  symmetry: SymRegion[];
}) {
  const [active, setActive] = useState<string | null>("Arms");
  const ref = useScrollReveal<HTMLElement>();

  const activeSym = symmetry.find((r) => r.name === active);
  const toggle = (name: string) => setActive(active === name ? null : name);

  return (
    <section ref={ref} className={`${s.section} ${s.bodyMapSection}`}>
      <div className={s.sectionLabel}>Symmetry</div>
      <div className={s.sectionTitle}>Left vs Right</div>

      <div className={s.bodyMapContainer}>
        <div className={s.bodySvgWrap}>
          <SymSilhouette active={active} onTap={toggle} />
        </div>

        {/* Region Pills */}
        <div className={s.regionLabels}>
          {symmetry.map((r) => (
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
        {activeSym && (() => {
          const leftTotal = activeSym.left.total;
          const rightTotal = activeSym.right.total;
          const leftPct = (leftTotal / (leftTotal + rightTotal)) * 100;
          const rightPct = (rightTotal / (leftTotal + rightTotal)) * 100;

          return (
            <div className={s.detailSheet} key={activeSym.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div className={s.detailName} style={{ marginBottom: 0 }}>{activeSym.name}</div>
                <StatusTag status={activeSym.status} label="Balanced" />
              </div>

              {/* Balance bar */}
              <div className={s.balanceBarWrap}>
                <div className={s.balanceLabel}>
                  <span>L</span>
                  <span>R</span>
                </div>
                <div className={s.balanceTrack}>
                  <div className={s.balanceLeft} style={{ width: `${leftPct}%` }} />
                  <div className={s.balanceRight} style={{ width: `${rightPct}%` }} />
                  <div className={s.balanceCenter} />
                </div>
                <div className={s.balancePcts}>
                  <span>{leftTotal} kg</span>
                  <span>{rightTotal} kg</span>
                </div>
              </div>

              {/* Side-by-side metrics */}
              <div className={s.symSides}>
                <div className={s.symSide}>
                  <div className={s.symSideLabel}>Left</div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Fat %</span>
                    <span className={s.symMetricVal}>{activeSym.left.fatPercent}%</span>
                  </div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Lean</span>
                    <span className={s.symMetricVal}>{activeSym.left.lean} kg</span>
                  </div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Fat</span>
                    <span className={s.symMetricVal}>{activeSym.left.fat} kg</span>
                  </div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Bone</span>
                    <span className={s.symMetricVal}>{activeSym.left.bone} kg</span>
                  </div>
                </div>
                <div className={s.symDivider} />
                <div className={s.symSide}>
                  <div className={s.symSideLabel}>Right</div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Fat %</span>
                    <span className={s.symMetricVal}>{activeSym.right.fatPercent}%</span>
                  </div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Lean</span>
                    <span className={s.symMetricVal}>{activeSym.right.lean} kg</span>
                  </div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Fat</span>
                    <span className={s.symMetricVal}>{activeSym.right.fat} kg</span>
                  </div>
                  <div className={s.symMetricRow}>
                    <span className={s.symMetricName}>Bone</span>
                    <span className={s.symMetricVal}>{activeSym.right.bone} kg</span>
                  </div>
                </div>
              </div>

              {/* Verdict */}
              <div className={s.symVerdict2}>{activeSym.verdict}</div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
