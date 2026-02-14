"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";
import FlipCard from "./shared/FlipCard";
import MetricRing from "./shared/MetricRing";
import StatusTag from "./shared/StatusTag";
import s from "../report.module.css";

type CompositionItem = {
  mass: number;
  desc: string;
  verdict: string;
  status: string;
  dotPosition: number;
};

export default function MetricSnapshot({
  lean,
  fat,
  bone,
  totalMass,
}: {
  lean: CompositionItem;
  fat: CompositionItem;
  bone: CompositionItem;
  totalMass: number;
}) {
  const ref = useScrollReveal<HTMLElement>();

  const items = [
    { key: "lean", label: "Lean Mass", item: lean, color: "#0a84ff", pct: lean.mass / totalMass * 100 },
    { key: "fat", label: "Fat Mass", item: fat, color: "#fbbf24", pct: fat.mass / totalMass * 100 },
    { key: "bone", label: "Bone", item: bone, color: "#8e8e93", pct: bone.mass / totalMass * 100 },
  ];

  return (
    <section ref={ref} className={`${s.section} ${s.snapshotSection}`}>
      <div className={s.sectionLabel}>Composition</div>
      <div className={s.sectionTitle}>What You&apos;re Made Of</div>
      <div className={s.sectionDesc}>{totalMass} kg total mass</div>

      <div className={s.snapshotGrid}>
        {items.map(({ key, label, item, color, pct }) => (
          <div key={key} className={s.snapshotCard}>
            <FlipCard
              front={
                <>
                  <div className={s.snapFrontTop}>
                    <div>
                      <div className={s.snapLabel}>{label}</div>
                      <div className={s.snapValue}>
                        {item.mass}
                        <span className={s.snapValueUnit}> kg</span>
                      </div>
                    </div>
                    <MetricRing
                      value={Math.round(pct)}
                      max={100}
                      size={64}
                      strokeWidth={4}
                      color={color}
                      unit="%"
                    />
                  </div>
                  <StatusTag status={item.status} label={item.verdict} />
                </>
              }
              back={
                <>
                  <div className={s.snapBackTitle}>{label}</div>
                  <p className={s.snapBackText}>{item.desc}</p>
                  <div style={{ marginTop: "auto", paddingTop: 12 }}>
                    <StatusTag status={item.status} label={item.verdict} />
                  </div>
                </>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
