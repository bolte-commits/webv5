"use client";

import { useEffect, useState } from "react";
import { mockReport } from "@/lib/mockReportData";
import ScoreReveal from "./components/ScoreReveal";
import MetricSnapshot from "./components/MetricSnapshot";
import BodyMap from "./components/BodyMap";
import { AnimatedChart } from "./components/Timeline";
import FuelStation from "./components/FuelStation";
import GamePlan from "./components/GamePlan";
import SectionNav from "./components/SectionNav";
import FlipCard from "./components/shared/FlipCard";
import StatusTag from "./components/shared/StatusTag";
import s from "./report.module.css";

function clr(status: string) {
  if (status === "green") return "var(--r-green, #34d399)";
  if (status === "yellow") return "var(--r-yellow, #fbbf24)";
  if (status === "red") return "var(--r-red, #f87171)";
  return "var(--r-text-secondary, #8e8e93)";
}

export default function ReportView({ id }: { id: string }) {
  const d = mockReport;
  const [tab, setTab] = useState("composition");

  // Hide site navbar & footer
  useEffect(() => {
    const nav = document.querySelector(".nav-content")?.parentElement as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  return (
    <div className={s.app}>
      <div className={s.scrollContainer}>
        <div key={tab} className={s.tabContent}>

          {/* ═══ Tab 1: Composition ═══ */}
          {tab === "composition" && (
            <>
              <ScoreReveal
                bodyFatPercent={d.summary.bodyFatPercent}
                rating={d.summary.bodyFatRating}
                status={d.summary.bodyFatStatus}
                patient={d.patient}
                scanDate={d.scanDate}
                overallNote={d.summary.overallNote}
              />
              <MetricSnapshot
                lean={d.composition.lean}
                fat={d.composition.fat}
                bone={d.composition.bone}
                totalMass={d.summary.totalMass}
              />
              <section
                className={`${s.section} ${s.timelineSection}`}
                style={{ opacity: 1, transform: "none" }}
              >
                <div className={s.sectionLabel}>Trends</div>
                <div className={s.sectionTitle}>How You&apos;ve Changed</div>
                <div className={s.sectionDesc}>
                  Across {d.scanNumber} DEXA scans since {d.trends.dates[0]}.
                </div>
                <div style={{ marginTop: 16 }}>
                  <AnimatedChart
                    title="Body Fat %"
                    data={d.trends.bodyFat}
                    labels={d.trends.dates}
                    unit="%"
                    color="#007aff"
                    decreaseIsGood
                  />
                  <AnimatedChart
                    title="Lean Mass (kg)"
                    data={d.trends.leanMass}
                    labels={d.trends.dates}
                    unit=""
                    color="#60a5fa"
                  />
                  <AnimatedChart
                    title="Fat Mass (kg)"
                    data={d.trends.fatMass}
                    labels={d.trends.dates}
                    unit=""
                    color="#fbbf24"
                    decreaseIsGood
                  />
                </div>
              </section>
            </>
          )}

          {/* ═══ Tab 2: Regions ═══ */}
          {tab === "regions" && (
            <BodyMap regions={d.regions} trendLabels={d.trends.dates} />
          )}

          {/* ═══ Tab 3: Symmetry ═══ */}
          {tab === "symmetry" && (
            <section
              className={`${s.section} ${s.bodyMapSection}`}
              style={{ opacity: 1, transform: "none" }}
            >
              <div className={s.sectionLabel}>Symmetry</div>
              <div className={s.sectionTitle}>Left vs Right</div>

              {d.symmetry.map((sym) => {
                const leftTotal = sym.left.total;
                const rightTotal = sym.right.total;
                const leftPct = (leftTotal / (leftTotal + rightTotal)) * 100;
                const rightPct = (rightTotal / (leftTotal + rightTotal)) * 100;

                return (
                  <div className={s.symCard2} key={sym.name}>
                    {/* Header */}
                    <div className={s.symCard2Header}>
                      <div className={s.symCard2Name}>{sym.name}</div>
                      <StatusTag status={sym.status} label="Balanced" />
                    </div>

                    {/* Balance bar */}
                    <div className={s.balanceBarWrap}>
                      <div className={s.balanceLabel}>
                        <span>L</span>
                        <span>R</span>
                      </div>
                      <div className={s.balanceTrack}>
                        <div
                          className={s.balanceLeft}
                          style={{ width: `${leftPct}%` }}
                        />
                        <div
                          className={s.balanceRight}
                          style={{ width: `${rightPct}%` }}
                        />
                        <div className={s.balanceCenter} />
                      </div>
                      <div className={s.balancePcts}>
                        <span>{leftTotal} kg</span>
                        <span>{rightTotal} kg</span>
                      </div>
                    </div>

                    {/* Side-by-side metric cards */}
                    <div className={s.symSides}>
                      <div className={s.symSide}>
                        <div className={s.symSideLabel}>Left</div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Fat %</span>
                          <span className={s.symMetricVal}>{sym.left.fatPercent}%</span>
                        </div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Lean</span>
                          <span className={s.symMetricVal}>{sym.left.lean} kg</span>
                        </div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Fat</span>
                          <span className={s.symMetricVal}>{sym.left.fat} kg</span>
                        </div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Bone</span>
                          <span className={s.symMetricVal}>{sym.left.bone} kg</span>
                        </div>
                      </div>
                      <div className={s.symDivider} />
                      <div className={s.symSide}>
                        <div className={s.symSideLabel}>Right</div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Fat %</span>
                          <span className={s.symMetricVal}>{sym.right.fatPercent}%</span>
                        </div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Lean</span>
                          <span className={s.symMetricVal}>{sym.right.lean} kg</span>
                        </div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Fat</span>
                          <span className={s.symMetricVal}>{sym.right.fat} kg</span>
                        </div>
                        <div className={s.symMetricRow}>
                          <span className={s.symMetricName}>Bone</span>
                          <span className={s.symMetricVal}>{sym.right.bone} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Verdict */}
                    <div className={s.symVerdict2}>{sym.verdict}</div>
                  </div>
                );
              })}
            </section>
          )}

          {/* ═══ Tab 4: Visceral Fat ═══ */}
          {tab === "visceral" && (
            <section
              className={`${s.section} ${s.healthSection}`}
              style={{ opacity: 1, transform: "none" }}
            >
              <div className={s.sectionLabel}>Health Signals</div>
              <div className={s.sectionTitle}>Visceral Fat</div>

              {/* Quick-glance flip cards */}
              <div className={s.healthGrid}>
                <div className={s.healthCard}>
                  <FlipCard
                    front={
                      <>
                        <div className={s.hcFrontLabel}>Visceral Fat</div>
                        <div style={{ marginTop: "auto" }}>
                          <div className={s.hcFrontValue}>
                            {d.visceralFat.mass}<span className={s.hcFrontUnit}>g</span>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <StatusTag status={d.visceralFat.status} label={d.visceralFat.rating} />
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
                        <div className={s.hcFrontLabel}>Subcutaneous</div>
                        <div style={{ marginTop: "auto" }}>
                          <div className={s.hcFrontValue}>
                            {d.subcutaneousFat.mass}<span className={s.hcFrontUnit}> kg</span>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <StatusTag status={d.subcutaneousFat.status} label={d.subcutaneousFat.rating} />
                          </div>
                        </div>
                      </>
                    }
                    back={
                      <>
                        <div className={s.hcBackTitle}>Subcutaneous Fat</div>
                        <p className={s.hcBackText}>
                          Fat stored under your skin. Provides insulation and energy reserves. Less risky than visceral fat.
                        </p>
                      </>
                    }
                  />
                </div>
              </div>

              {/* Visceral Fat Detail */}
              <div className={s.healthDetail}>
                <div className={s.healthDetailTitle}>Visceral Fat</div>
                <div className={s.healthDetailMetrics}>
                  <div>
                    <div className={s.hdLabel}>Mass</div>
                    <div className={s.hdVal}>{d.visceralFat.mass}g</div>
                  </div>
                  <div>
                    <div className={s.hdLabel}>Volume</div>
                    <div className={s.hdVal}>{d.visceralFat.volume} cm&sup3;</div>
                  </div>
                  <div>
                    <div className={s.hdLabel}>Area</div>
                    <div className={s.hdVal}>{d.visceralFat.area} cm&sup2;</div>
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
                <p className={s.healthDetailNote}>{d.visceralFat.note}</p>
              </div>

              {/* Visceral Fat Trend */}
              <div style={{ marginTop: 12 }}>
                <AnimatedChart
                  title="Visceral Fat (g)"
                  data={d.visceralFat.trend}
                  labels={d.trends.dates}
                  unit="g"
                  color="#f87171"
                  decreaseIsGood
                />
              </div>

              {/* Subcutaneous Fat Detail */}
              <div className={s.healthDetail}>
                <div className={s.healthDetailTitle}>Subcutaneous Fat</div>
                <div className={s.healthDetailMetrics}>
                  <div>
                    <div className={s.hdLabel}>Mass</div>
                    <div className={s.hdVal}>{d.subcutaneousFat.mass} kg</div>
                  </div>
                  <div>
                    <div className={s.hdLabel}>% of Body</div>
                    <div className={s.hdVal}>{d.subcutaneousFat.percent}%</div>
                  </div>
                </div>
                <p className={s.healthDetailNote}>{d.subcutaneousFat.note}</p>
              </div>
            </section>
          )}

          {/* ═══ Tab 5: Bone Health ═══ */}
          {tab === "bone" && (
            <section
              className={`${s.section} ${s.healthSection}`}
              style={{ opacity: 1, transform: "none" }}
            >
              <div className={s.sectionLabel}>Health Signals</div>
              <div className={s.sectionTitle}>Bone Health</div>

              {/* Quick-glance flip cards */}
              <div className={s.healthGrid}>
                <div className={s.healthCard}>
                  <FlipCard
                    front={
                      <>
                        <div className={s.hcFrontLabel}>Bone Health</div>
                        <div style={{ marginTop: "auto" }}>
                          <div className={s.hcFrontValue}>
                            {d.boneHealth.tScore}<span className={s.hcFrontUnit}> T</span>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <StatusTag status="green" label={d.boneHealth.tScoreRating} />
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
                        <div className={s.hcFrontLabel}>Z-Score</div>
                        <div style={{ marginTop: "auto" }}>
                          <div className={s.hcFrontValue}>
                            {d.boneHealth.zScore}<span className={s.hcFrontUnit}> Z</span>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <StatusTag status="green" label={d.boneHealth.zScoreRating} />
                          </div>
                        </div>
                      </>
                    }
                    back={
                      <>
                        <div className={s.hcBackTitle}>Z-Score</div>
                        <p className={s.hcBackText}>
                          Compares your bone density to others your age and sex. Above 0 is better than average.
                        </p>
                      </>
                    }
                  />
                </div>
              </div>

              {/* Bone Health Detail */}
              <div className={s.healthDetail}>
                <div className={s.healthDetailTitle}>Bone Health</div>
                <div className={s.healthDetailMetrics}>
                  <div>
                    <div className={s.hdLabel}>T-Score</div>
                    <div className={s.hdVal}>{d.boneHealth.tScore}</div>
                    <div className={s.hdSub}>vs 30-yr-old</div>
                  </div>
                  <div>
                    <div className={s.hdLabel}>Z-Score</div>
                    <div className={s.hdVal}>{d.boneHealth.zScore}</div>
                    <div className={s.hdSub}>vs age group</div>
                  </div>
                  <div>
                    <div className={s.hdLabel}>Total BMD</div>
                    <div className={s.hdVal}>{d.boneHealth.totalBMD}</div>
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
                    {d.boneHealth.regions.map((b) => (
                      <div className={s.boneCard} key={b.name}>
                        <div className={s.boneName}>{b.name}</div>
                        <div className={s.boneVal}>{b.bmd}</div>
                      </div>
                    ))}
                    <div className={s.boneCard} style={{ background: "rgba(0, 122, 255, 0.08)" }}>
                      <div className={s.boneName} style={{ color: "var(--r-accent)" }}>Total</div>
                      <div className={s.boneVal}>{d.boneHealth.totalBMD}</div>
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
                <p className={s.healthDetailNote}>{d.boneHealth.note}</p>
              </div>

              {/* T-Score Trend */}
              <div style={{ marginTop: 12 }}>
                <AnimatedChart
                  title="T-Score Trend"
                  data={d.boneHealth.tScoreTrend}
                  labels={d.trends.dates}
                  unit=""
                  color="#a78bfa"
                />
              </div>

            </section>
          )}

          {/* ═══ Tab 6: Nutrition ═══ */}
          {tab === "nutrition" && (
            <FuelStation
              rmr={d.metabolism.rmr}
              aboveAvg={d.metabolism.aboveAvg}
              tdee={d.metabolism.tdee}
              breakdown={d.metabolism.breakdown}
              plans={d.nutrition.plans}
              recommendation={d.nutrition.recommendation}
              activities={d.metabolism.activities}
              rmrTrend={d.metabolism.trend}
              trendLabels={d.trends.dates}
            />
          )}

          {/* ═══ Tab 7: Other Risks ═══ */}
          {tab === "risks" && (
            <section
              className={`${s.section} ${s.healthSection}`}
              style={{ opacity: 1, transform: "none" }}
            >
              <div className={s.sectionLabel}>Risk Markers</div>
              <div className={s.sectionTitle}>Other Risks</div>

              {/* Quick-glance flip cards */}
              <div className={s.healthGrid}>
                <div className={s.healthCard}>
                  <FlipCard
                    front={
                      <>
                        <div className={s.hcFrontLabel}>A/G Ratio</div>
                        <div style={{ marginTop: "auto" }}>
                          <div className={s.hcFrontValue}>{d.agRatio.value}</div>
                          <div style={{ marginTop: 8 }}>
                            <StatusTag status={d.agRatio.status} label="Watch" />
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
                            {d.sarcopenia.almi}<span className={s.hcFrontUnit}> kg/m&sup2;</span>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <StatusTag status={d.sarcopenia.status} label="Good" />
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

              {/* A/G Ratio Detail */}
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
                <div className={s.verdict} style={{ color: clr(d.agRatio.status) }}>
                  <span className={s.verdictDot} style={{ background: clr(d.agRatio.status) }} />
                  {d.agRatio.verdict}
                </div>
                <p className={s.healthDetailNote}>{d.agRatio.note}</p>
              </div>

              {/* ALMI Detail */}
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
                <div className={s.verdict} style={{ color: clr(d.sarcopenia.status) }}>
                  <span className={s.verdictDot} style={{ background: clr(d.sarcopenia.status) }} />
                  {d.sarcopenia.verdict}
                </div>
                <p className={s.healthDetailNote} style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "var(--r-text-secondary)" }}>
                  {d.sarcopenia.formula}
                </p>
                <p className={s.healthDetailNote}>{d.sarcopenia.note}</p>
              </div>
            </section>
          )}

          {/* ═══ Tab 8: Game Plan ═══ */}
          {tab === "gameplan" && (
            <GamePlan actions={d.actionPlan} />
          )}

        </div>
      </div>

      {/* Floating Section Nav */}
      <SectionNav tab={tab} onTabChange={setTab} />
    </div>
  );
}
