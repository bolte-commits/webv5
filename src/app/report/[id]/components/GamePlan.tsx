"use client";

import { useEffect, useRef } from "react";
import s from "../report.module.css";

type ActionItem = {
  title: string;
  desc: string;
};

export default function GamePlan({ actions }: { actions: ActionItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          // Stagger card reveals
          cardsRef.current.forEach((card, i) => {
            if (card) {
              setTimeout(() => {
                card.classList.add("visible");
              }, i * 120);
            }
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section ref={sectionRef} className={`${s.section} ${s.gamePlanSection}`}>
        <div className={s.sectionLabel}>Game Plan</div>
        <div className={s.sectionTitle}>What to Do Next</div>

        <div className={s.actionStack}>
          {actions.map((item, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={s.actionCard}
            >
              <div className={s.actionNum}>{i + 1}</div>
              <div>
                <div className={s.actionTitle}>{item.title}</div>
                <div className={s.actionDesc}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat CTA */}
      <section className={s.ctaSection}>
        <div className={s.ctaCard}>
          <div className={s.ctaTitle}>Questions about your report?</div>
          <div className={s.ctaDesc}>
            AI-powered chat is coming soon. In the meantime, reach out at{" "}
            <strong>support@bodyinsight.in</strong>
          </div>
        </div>
        <p className={s.disclaimer}>
          This report is generated from DEXA scan data and is intended for
          informational purposes only. It does not constitute medical advice.
        </p>
      </section>
    </>
  );
}
