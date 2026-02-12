"use client";

import { useEffect, useState } from "react";
import { mockReport } from "@/lib/mockReportData";
import ScoreReveal from "./components/ScoreReveal";
import MetricSnapshot from "./components/MetricSnapshot";
import BodyMap from "./components/BodyMap";
import { AnimatedChart } from "./components/Timeline";
import FuelStation from "./components/FuelStation";
import GamePlan from "./components/GamePlan";
import SymmetryMap from "./components/SymmetryMap";
import SectionNav from "./components/SectionNav";
import FlipCard from "./components/shared/FlipCard";
import StatusTag from "./components/shared/StatusTag";
import Image from "next/image";
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
            <SymmetryMap symmetry={d.symmetry} />
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
                        <div className={s.hcFrontLabel}>Young Adult T-Score</div>
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
                        <div className={s.hcBackTitle}>Young Adult T-Score</div>
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
                        <div className={s.hcFrontLabel}>Age Matched Z-Score</div>
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
                        <div className={s.hcBackTitle}>Age Matched Z-Score</div>
                        <p className={s.hcBackText}>
                          Compares your bone density to others your age and sex. Above 0 is better than average.
                        </p>
                      </>
                    }
                  />
                </div>
              </div>

              {/* Bone Region BMD Grid */}
              <div className={s.healthDetail}>
                <div className={s.healthDetailTitle}>Regional BMD</div>
                <div className={s.boneGrid}>
                  {d.boneHealth.regions.map((b) => (
                    <div className={s.boneCard} key={b.name}>
                      <div className={s.boneImgWrap}>
                        <Image
                          src={`/images/bone/${b.name.toLowerCase()}.png`}
                          alt={b.name}
                          width={60}
                          height={60}
                          className={s.boneImg}
                        />
                      </div>
                      <div className={s.boneName}>{b.name}</div>
                      <div className={s.boneVal}>{b.bmd}</div>
                    </div>
                  ))}
                  <div className={s.boneCard} style={{ background: "rgba(0, 122, 255, 0.08)" }}>
                    <div className={s.boneImgWrap}>
                      <Image
                        src="/images/bone/total.png"
                        alt="Total"
                        width={60}
                        height={60}
                        className={s.boneImg}
                      />
                    </div>
                    <div className={s.boneName} style={{ color: "var(--r-accent)" }}>Total</div>
                    <div className={s.boneVal}>{d.boneHealth.totalBMD}</div>
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
