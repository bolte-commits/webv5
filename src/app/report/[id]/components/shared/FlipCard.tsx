"use client";

import { useState } from "react";
import s from "./FlipCard.module.css";

export default function FlipCard({
  front,
  back,
  className,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`${s.flipCard} ${flipped ? s.flipped : ""} ${className || ""}`}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className={s.inner}>
        <div className={s.front}>{front}</div>
        <div className={s.back}>{back}</div>
      </div>
      {!flipped && <span className={s.hint}>Tap to learn</span>}
    </div>
  );
}
