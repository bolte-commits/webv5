"use client";

import { useState } from "react";
import s from "../report.module.css";

const SECTIONS = [
  { id: "composition", label: "Composition" },
  { id: "regions", label: "Regions" },
  { id: "symmetry", label: "Symmetry" },
  { id: "visceral", label: "Visceral Fat" },
  { id: "bone", label: "Bone Health" },
  { id: "nutrition", label: "Nutrition" },
  { id: "risks", label: "Other Risks" },
  { id: "gameplan", label: "Game Plan" },
];

export default function SectionNav({
  tab,
  onTabChange,
}: {
  tab: string;
  onTabChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const activeLabel =
    SECTIONS.find((sec) => sec.id === tab)?.label || "Composition";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${s.navDrawerBackdrop} ${open ? s.navDrawerBackdropOpen : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className={`${s.navDrawer} ${open ? s.navDrawerOpen : ""}`}>
        <div className={s.navDrawerHandle} />
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            className={s.navDrawerItem}
            onClick={() => {
              onTabChange(sec.id);
              setOpen(false);
            }}
          >
            <span
              className={`${s.navDrawerDot} ${
                sec.id === tab ? s.navDrawerDotActive : ""
              }`}
            />
            <span
              className={`${s.navDrawerLabel} ${
                sec.id === tab ? s.navDrawerLabelActive : ""
              }`}
            >
              {sec.label}
            </span>
          </button>
        ))}
      </div>

      {/* Pill */}
      <div className={s.navPill} onClick={() => setOpen((o) => !o)}>
        <span className={s.navPillDot} />
        <span className={s.navPillLabel}>{activeLabel}</span>
      </div>
    </>
  );
}
