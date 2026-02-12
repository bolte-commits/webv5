"use client";

import { useState, useEffect } from "react";
import { useCountUp } from "../hooks/useCountUp";
import s from "../report.module.css";

export default function ScoreReveal({
  bodyFatPercent,
  rating,
  status,
  patient,
  scanDate,
  overallNote,
}: {
  bodyFatPercent: number;
  rating: string;
  status: string;
  patient: { name: string; age: number; sex: string; height: number; weight: number };
  scanDate: string;
  overallNote: string;
}) {
  const count = useCountUp(bodyFatPercent, 1400, 1);
  const [typedRating, setTypedRating] = useState("");

  // Typewriter for rating
  useEffect(() => {
    const delay = 1200; // wait for count-up to finish
    const timer = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTypedRating(rating.slice(0, i));
        if (i >= rating.length) clearInterval(iv);
      }, 50);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timer);
  }, [rating]);

  const chips = [
    { label: patient.name, bold: true },
    { label: `${patient.age} / ${patient.sex}` },
    { label: `${patient.height} cm` },
    { label: `${patient.weight} kg` },
    { label: scanDate },
  ];

  const statusColor =
    status === "green" ? "var(--r-green, #34d399)" :
    status === "yellow" ? "var(--r-yellow, #fbbf24)" :
    status === "red" ? "var(--r-red, #f87171)" :
    "var(--r-text-secondary, #8e8e93)";

  return (
    <section className={s.hero}>
      <div className={s.heroBg} />

      <div className={s.heroScore}>
        {count}
        <span className={s.heroUnit}>%</span>
      </div>

      <div className={s.heroLabel}>Body Fat</div>

      <div className={s.heroRating} style={{ color: statusColor }}>
        {typedRating}
        {typedRating.length < rating.length && (
          <span style={{ opacity: 0.4 }}>|</span>
        )}
      </div>

      <div className={s.heroChips}>
        {chips.map((chip, i) => (
          <span
            key={i}
            className={s.heroChip}
            style={{ animationDelay: `${1.4 + i * 0.1}s` }}
          >
            {chip.bold ? <strong>{chip.label}</strong> : chip.label}
          </span>
        ))}
      </div>

      <p className={s.heroNote}>{overallNote}</p>
    </section>
  );
}
