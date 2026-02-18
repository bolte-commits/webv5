"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import styles from "./page.module.css";

const faqs = [
  {
    category: "About the Scan",
    items: [
      {
        q: "What is a DEXA scan?",
        a: "DEXA (Dual-Energy X-ray Absorptiometry) is a medical-grade imaging technology that measures your body composition with clinical precision. It shows your exact fat distribution, lean muscle mass, and bone density across every region of your body.",
      },
      {
        q: "Is the scan safe?",
        a: "Yes. DEXA uses very low-dose X-rays — about 1/10th the radiation of a chest X-ray. It is widely considered safe for routine use. However, it is not recommended for individuals who are pregnant.",
      },
      {
        q: "How long does the scan take?",
        a: "The scan itself takes about 6-8 minutes. Including check-in and brief preparation, plan for about 10 minutes total.",
      },
      {
        q: "Does it hurt?",
        a: "Not at all. The scan is completely painless and silent. You simply lie still on the scanning bed while the machine does the rest.",
      },
    ],
  },
  {
    category: "Preparation",
    items: [
      {
        q: "What should I wear?",
        a: "Wear comfortable activewear or gym clothes. Avoid clothing with zippers, underwires, or metal buttons. You will need to remove jewelry, watches, and glasses.",
      },
      {
        q: "Do I need to fast before the scan?",
        a: "No fasting is required. You can eat and drink normally before your scan.",
      },
      {
        q: "Should I arrive early?",
        a: "Please arrive 5 minutes before your scheduled time for a smooth check-in.",
      },
    ],
  },
  {
    category: "Results & Reports",
    items: [
      {
        q: "When will I get my report?",
        a: "Your detailed PDF report with AI-powered insights is delivered to your email within 2 minutes of your scan.",
      },
      {
        q: "What does the report include?",
        a: "Your report includes a full body composition breakdown (fat vs. lean mass by region), visceral fat analysis, bone density scoring, and a personalised action plan tailored to your goals.",
      },
      {
        q: "Is this a medical diagnosis?",
        a: "No. Body Insight provides medical measurements, not medical advice. Our scans and reports are for informational purposes only. Always consult your physician before making health decisions based on your results.",
      },
    ],
  },
  {
    category: "Booking & Pricing",
    items: [
      {
        q: "How much does a scan cost?",
        a: "A single scan costs \u20B92,999. We also offer custom pricing for communities, apartments, and sports teams.",
      },
      {
        q: "How do I book a scan?",
        a: "You can book directly through our website. Select your city, choose a location and time slot, and confirm your booking.",
      },
      {
        q: "Can I cancel or reschedule?",
        a: "Yes. You can manage your appointment through the link in your confirmation email.",
      },
      {
        q: "Do you offer group or corporate scans?",
        a: "Yes! We bring our mobile DEXA van to apartment communities, offices, and sports facilities. Contact us for custom group pricing.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <>
      <PageHero
        title="Frequently asked questions"
        subtitle="Everything you need to know about DEXA scanning with Body Insight."
      />

      <section className={styles.contentSection}>
        {faqs.map((section) => (
          <div key={section.category} className={styles.categoryBlock}>
            <h2 className={styles.categoryTitle}>{section.category}</h2>
            {section.items.map((item, i) => {
              const id = `${section.category}-${i}`;
              const isOpen = openIndex === id;
              return (
                <button
                  key={id}
                  className={styles.faqItem}
                  onClick={() => toggle(id)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.faqQuestion}>
                    <span>{item.q}</span>
                    <svg
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {isOpen && (
                    <div className={styles.faqAnswer}>{item.a}</div>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        <div className={styles.contactPrompt}>
          <p>
            Still have questions?{" "}
            <Link href="/contact">Get in touch</Link> and we&apos;ll be happy
            to help.
          </p>
        </div>
      </section>
    </>
  );
}
