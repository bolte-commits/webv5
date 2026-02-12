"use client";

import { useEffect, useState } from "react";

export function useCountUp(
  target: number,
  duration = 1400,
  decimals = 1,
  trigger = true,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, decimals, trigger]);

  return value;
}
