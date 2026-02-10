"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHero from "@/components/PageHero";
import styles from "./page.module.css";

function parseTime(str: string): number | null {
  str = str.trim();
  const match = str.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function SelectTimeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const landmark = searchParams.get("landmark") || "Unknown Location";
  const day = searchParams.get("day") || "--";
  const date = searchParams.get("date") || "--";
  const time = searchParams.get("time") || "9 AM - 5 PM";

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = useMemo(() => {
    const parts = time.split("-").map((s) => s.trim());
    const startMin = parseTime(parts[0]);
    const endMin = parseTime(parts[1]);

    if (startMin === null || endMin === null) return [];

    const result: { label: string; unavailable: boolean }[] = [];
    for (let t = startMin; t <= endMin - 15; t += 15) {
      const seed = (t * 7 + landmark.length * 13) % 10;
      result.push({
        label: formatTime(t),
        unavailable: seed === 3 || seed === 7,
      });
    }
    return result;
  }, [time, landmark]);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    const confirmParams = new URLSearchParams({
      landmark,
      day,
      date,
      time,
      slot: selectedSlot,
    });
    router.push("/login?" + confirmParams.toString());
  };

  const backParams = new URLSearchParams({ landmark, day, date, time });

  return (
    <>
      <PageHero
        title="Select a time"
        subtitle="Pick a slot that works for you. Each scan takes about 15 minutes."
        backHref={`/schedule`}
        backLabel="Back to schedule"
      />

      <section className={styles.contentSection}>
        <div className={styles.eventCard}>
          <h2>{landmark}</h2>
          <div className={styles.eventDetails}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Day</div>
              <div className={styles.detailValue}>{day}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Date</div>
              <div className={styles.detailValue}>{date}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Hours</div>
              <div className={styles.detailValue}>{time}</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Duration</div>
              <div className={styles.detailValue}>~15 min</div>
            </div>
          </div>
          <div className={styles.scanInfo}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Medical-grade DEXA scan in our mobile van. No preparation needed —
            just show up in comfortable clothing.
          </div>
        </div>

        <div className={styles.timeSection}>
          <h2>Available slots</h2>
          <p>All times are in local time</p>
          <div className={styles.timeGrid}>
            {slots.map((slot) => {
              if (slot.unavailable) {
                return (
                  <button
                    key={slot.label}
                    className={styles.timeSlotUnavailable}
                    disabled
                  >
                    {slot.label}
                  </button>
                );
              }
              const isSelected = selectedSlot === slot.label;
              return (
                <button
                  key={slot.label}
                  className={
                    isSelected ? styles.timeSlotSelected : styles.timeSlot
                  }
                  onClick={() => setSelectedSlot(slot.label)}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div
        className={
          selectedSlot ? styles.confirmBarVisible : styles.confirmBar
        }
      >
        <div className={styles.selectedTime}>
          Your slot: <span>{selectedSlot || "--"}</span>
        </div>
        <button className={styles.confirmBtn} onClick={handleConfirm}>
          Confirm booking
        </button>
      </div>
    </>
  );
}

export default function SelectTimePage() {
  return (
    <Suspense>
      <SelectTimeContent />
    </Suspense>
  );
}
