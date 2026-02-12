"use client";

import { useEffect, useState, type RefObject } from "react";

export function useActiveSection(
  sectionRefs: RefObject<(HTMLElement | null)[]>,
  sectionIds: string[],
) {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const refs = sectionRefs.current;
    if (!refs) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // find the most-visible section
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!best || entry.intersectionRatio > best.intersectionRatio)
          ) {
            best = entry;
          }
        }
        if (best) {
          const idx = refs.indexOf(best.target as HTMLElement);
          if (idx >= 0) setActive(sectionIds[idx]);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75] },
    );

    refs.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionRefs, sectionIds]);

  return active;
}
