"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";
import FlipCard from "./shared/FlipCard";
import StatusTag from "./shared/StatusTag";
import s from "../report.module.css";

function clr(status: string) {
  if (status === "green") return "var(--r-green, #34d399)";
  if (status === "yellow") return "var(--r-yellow, #fbbf24)";
  if (status === "red") return "var(--r-red, #f87171)";
  return "var(--r-text-secondary, #8e8e93)";
}

export default function HealthSignals({
  visceralFat,
  boneHealth,
  agRatio,
  sarcopenia,
}: {
  visceralFat: {
    mass: number;
    volume: number;
    area: number;
    rating: string;
    status: string;
    note: string;
  };
  boneHealth: {
    tScore: number;
    tScoreRating: string;
    zScore: number;
    zScoreRating: string;
    totalBMD: number;
    regions: { name: string; bmd: number }[];
    note: string;
  };
  agRatio: { value: number; status: string; verdict: string; note: string };
  sarcopenia: {
    almi: number;
    status: string;
    verdict: string;
    formula: string;
    note: string;
  };
}) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={`${s.section} ${s.healthSection}`}>
      <div className={s.sectionLabel}>Health Signals</div>
      <div className={s.sectionTitle}>Under the Hood</div>

      {/* Quick-glance 2x2 grid */}
      <div className={s.healthGrid}>
        <div className={s.healthCard}>
          <FlipCard
            front={
              <>
                <div className={s.hcFrontLabel}>Visceral Fat</div>
                <div style={{ marginTop: "auto" }}>
                  <div className={s.hcFrontValue}>
                    {visceralFat.mass}<span className={s.hcFrontUnit}>g</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <StatusTag status={visceralFat.status} label={visceralFat.rating} />
                  </div>
                </div>
              </>
            }
            back={
              <>
                <div className={s.hcBackTitle}>Visceral Fat</div>
                <p className={s.hcBackText}>
                  Organ fat around your abdomen. Below 250g is safe. Yours is trending down.
                </p>
              </>
            }
          />
        </div>
        <div className={s.healthCard}>
          <FlipCard
            front={
              <>
                <div className={s.hcFrontLabel}>Bone Health</div>
                <div style={{ marginTop: "auto" }}>
                  <div className={s.hcFrontValue}>
                    {boneHealth.tScore}<span className={s.hcFrontUnit}> T</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <StatusTag status="green" label={boneHealth.tScoreRating} />
                  </div>
                </div>
              </>
            }
            back={
              <>
                <div className={s.hcBackTitle}>T-Score</div>
                <p className={s.hcBackText}>
                  Compares your bone density to a healthy 30-year-old. Above 0 is normal, above 1 is strong.
                </p>
              </>
            }
          />
        </div>
        <div className={s.healthCard}>
          <FlipCard
            front={
              <>
                <div className={s.hcFrontLabel}>A/G Ratio</div>
                <div style={{ marginTop: "auto" }}>
                  <div className={s.hcFrontValue}>{agRatio.value}</div>
                  <div style={{ marginTop: 8 }}>
                    <StatusTag status={agRatio.status} label="Watch" />
                  </div>
                </div>
              </>
            }
            back={
              <>
                <div className={s.hcBackTitle}>Android / Gynoid</div>
                <p className={s.hcBackText}>
                  Belly-to-hip fat ratio. Below 1.0 is ideal. Higher means more belly fat.
                </p>
              </>
            }
          />
        </div>
        <div className={s.healthCard}>
          <FlipCard
            front={
              <>
                <div className={s.hcFrontLabel}>ALMI</div>
                <div style={{ marginTop: "auto" }}>
                  <div className={s.hcFrontValue}>
                    {sarcopenia.almi}<span className={s.hcFrontUnit}> kg/m&sup2;</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <StatusTag status={sarcopenia.status} label="Good" />
                  </div>
                </div>
              </>
            }
            back={
              <>
                <div className={s.hcBackTitle}>Muscle Health</div>
                <p className={s.hcBackText}>
                  Appendicular Lean Mass Index. Above 7.0 means no sarcopenia risk.
                </p>
              </>
            }
          />
        </div>
      </div>

      {/* ── Visceral Fat Detail ── */}
      <div className={s.healthDetail}>
        <div className={s.healthDetailTitle}>Visceral Fat</div>
        <div className={s.healthDetailMetrics}>
          <div>
            <div className={s.hdLabel}>Mass</div>
            <div className={s.hdVal}>{visceralFat.mass}g</div>
          </div>
          <div>
            <div className={s.hdLabel}>Volume</div>
            <div className={s.hdVal}>{visceralFat.volume} cm&sup3;</div>
          </div>
          <div>
            <div className={s.hdLabel}>Area</div>
            <div className={s.hdVal}>{visceralFat.area} cm&sup2;</div>
          </div>
        </div>
        <div className={s.scaleWrap}>
          <span className={s.scaleYou} style={{ left: "24.7%" }}>You</span>
          <div
            className={s.scaleTrack}
            style={{
              background:
                "linear-gradient(90deg, #34d399 0%, #6ee7b7 25%, #fbbf24 50%, #fb923c 75%, #f87171 100%)",
            }}
          >
            <div className={s.scaleMarker} style={{ left: "24.7%" }} />
          </div>
          <div className={s.scaleTicks}>
            <span>0g</span><span>250g</span><span>500g</span><span>750g+</span>
          </div>
        </div>
        <p className={s.healthDetailNote}>{visceralFat.note}</p>
      </div>

      {/* ── Bone Health Detail ── */}
      <div className={s.healthDetail}>
        <div className={s.healthDetailTitle}>Bone Health</div>
        <div className={s.healthDetailMetrics}>
          <div>
            <div className={s.hdLabel}>T-Score</div>
            <div className={s.hdVal}>{boneHealth.tScore}</div>
            <div className={s.hdSub}>vs 30-yr-old</div>
          </div>
          <div>
            <div className={s.hdLabel}>Z-Score</div>
            <div className={s.hdVal}>{boneHealth.zScore}</div>
            <div className={s.hdSub}>vs age group</div>
          </div>
          <div>
            <div className={s.hdLabel}>Total BMD</div>
            <div className={s.hdVal}>{boneHealth.totalBMD}</div>
            <div className={s.hdSub}>g/cm&sup2;</div>
          </div>
        </div>

        {/* Skeleton diagram with BMD values */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", margin: "16px 0" }}>
          <svg viewBox="0 0 100 220" style={{ width: 90, flexShrink: 0 }}>
            {/* Skull */}
            <ellipse cx="50" cy="22" rx="16" ry="18" fill="none" stroke="rgba(0,122,255,0.5)" strokeWidth="1.2" />
            <line x1="50" y1="40" x2="50" y2="50" stroke="rgba(0,122,255,0.3)" strokeWidth="1" />
            {/* Spine */}
            <line x1="50" y1="50" x2="50" y2="140" stroke="rgba(0,122,255,0.4)" strokeWidth="2" strokeDasharray="4 2" />
            {/* Ribs */}
            <path d="M50,58 Q32,62 28,70" fill="none" stroke="rgba(0,122,255,0.3)" strokeWidth="1" />
            <path d="M50,58 Q68,62 72,70" fill="none" stroke="rgba(0,122,255,0.3)" strokeWidth="1" />
            <path d="M50,66 Q30,72 26,80" fill="none" stroke="rgba(0,122,255,0.3)" strokeWidth="1" />
            <path d="M50,66 Q70,72 74,80" fill="none" stroke="rgba(0,122,255,0.3)" strokeWidth="1" />
            <path d="M50,74 Q32,80 28,88" fill="none" stroke="rgba(0,122,255,0.3)" strokeWidth="1" />
            <path d="M50,74 Q68,80 72,88" fill="none" stroke="rgba(0,122,255,0.3)" strokeWidth="1" />
            {/* Pelvis */}
            <path d="M36,130 Q30,140 32,148 L42,152 L50,146 L58,152 L68,148 Q70,140 64,130" fill="none" stroke="rgba(0,122,255,0.4)" strokeWidth="1.2" />
            {/* Arms */}
            <line x1="50" y1="54" x2="26" y2="60" stroke="rgba(0,122,255,0.3)" strokeWidth="1.5" />
            <line x1="26" y1="60" x2="16" y2="110" stroke="rgba(0,122,255,0.3)" strokeWidth="1.2" />
            <line x1="50" y1="54" x2="74" y2="60" stroke="rgba(0,122,255,0.3)" strokeWidth="1.5" />
            <line x1="74" y1="60" x2="84" y2="110" stroke="rgba(0,122,255,0.3)" strokeWidth="1.2" />
            {/* Legs */}
            <line x1="42" y1="152" x2="36" y2="210" stroke="rgba(0,122,255,0.4)" strokeWidth="1.5" />
            <line x1="58" y1="152" x2="64" y2="210" stroke="rgba(0,122,255,0.4)" strokeWidth="1.5" />
          </svg>

          <div className={s.boneGrid} style={{ flex: 1 }}>
            {boneHealth.regions.map((b) => (
              <div className={s.boneCard} key={b.name}>
                <div className={s.boneName}>{b.name}</div>
                <div className={s.boneVal}>{b.bmd}</div>
              </div>
            ))}
            <div className={s.boneCard} style={{ background: "rgba(0, 122, 255, 0.08)" }}>
              <div className={s.boneName} style={{ color: "var(--r-accent)" }}>Total</div>
              <div className={s.boneVal}>{boneHealth.totalBMD}</div>
            </div>
          </div>
        </div>

        <div className={s.scaleWrap}>
          <span className={s.scaleYou} style={{ left: "72%" }}>You</span>
          <div
            className={s.scaleTrack}
            style={{
              background:
                "linear-gradient(90deg, #f87171 0%, #fbbf24 35%, #34d399 65%, #34d399 100%)",
            }}
          >
            <div className={s.scaleMarker} style={{ left: "72%" }} />
          </div>
          <div className={s.scaleTicks}>
            <span>Osteoporosis</span><span>Osteopenia</span><span>Normal</span><span>Strong</span>
          </div>
        </div>
        <p className={s.healthDetailNote}>{boneHealth.note}</p>
      </div>

      {/* ── A/G Ratio Detail ── */}
      <div className={s.healthDetail}>
        <div className={s.healthDetailTitle}>A/G Ratio</div>
        <div className={s.scaleWrap}>
          <div
            className={s.scaleTrack}
            style={{
              background:
                "linear-gradient(90deg, #34d399 0%, #86efac 33%, #fde047 50%, #fca5a5 75%, #f87171 100%)",
            }}
          >
            <div className={s.scaleMarker} style={{ left: "53%" }} />
          </div>
          <div className={s.scaleTicks}>
            <span>0.5</span><span>0.8</span><span>1.0</span><span>1.5</span><span>2.0</span>
          </div>
        </div>
        <div className={s.verdict} style={{ color: clr(agRatio.status) }}>
          <span className={s.verdictDot} style={{ background: clr(agRatio.status) }} />
          {agRatio.verdict}
        </div>
        <p className={s.healthDetailNote}>{agRatio.note}</p>
      </div>

      {/* ── ALMI Detail ── */}
      <div className={s.healthDetail}>
        <div className={s.healthDetailTitle}>Muscle Health (ALMI)</div>
        <div className={s.scaleWrap}>
          <div
            className={s.scaleTrack}
            style={{
              background:
                "linear-gradient(90deg, #fca5a5 0%, #fde047 25%, #86efac 55%, #34d399 100%)",
            }}
          >
            <div className={s.scaleMarker} style={{ left: "75%" }} />
          </div>
          <div className={s.scaleTicks}>
            <span>5.0</span><span>7.0</span><span>9.0</span><span>11.0</span>
          </div>
        </div>
        <div className={s.verdict} style={{ color: clr(sarcopenia.status) }}>
          <span className={s.verdictDot} style={{ background: clr(sarcopenia.status) }} />
          {sarcopenia.verdict}
        </div>
        <p className={s.healthDetailNote} style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "var(--r-text-secondary)" }}>
          {sarcopenia.formula}
        </p>
        <p className={s.healthDetailNote}>{sarcopenia.note}</p>
      </div>
    </section>
  );
}
