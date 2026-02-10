"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { fetchSchedule, type ScheduleEvent } from "@/app/actions/schedule";
import styles from "./page.module.css";

interface EventEntry {
  eventId: number;
  landmark: string;
  day: string;
  date: string;
  time: string;
  full: boolean;
  isPrivate: boolean;
}

interface AreaGroup {
  area: string;
  entries: EventEntry[];
}

function groupByArea(events: ScheduleEvent[]): AreaGroup[] {
  // Events are pre-sorted by startTime from the API.
  // Map insertion order preserves earliest-first area ordering.
  const areaMap = new Map<string, EventEntry[]>();

  for (const ev of events) {
    if (!areaMap.has(ev.area)) areaMap.set(ev.area, []);
    areaMap.get(ev.area)!.push({
      eventId: ev.eventId,
      landmark: ev.landmark,
      day: ev.dayOfWeek,
      date: ev.date,
      time: ev.time,
      full: ev.isFull,
      isPrivate: ev.isPrivate || false,
    });
  }

  const groups: AreaGroup[] = [];
  for (const [area, entries] of areaMap) {
    groups.push({ area, entries });
  }
  return groups;
}

export default function SchedulePage() {
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [allEvents, setAllEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedule().then((result) => {
      setLoading(false);
      if (result.success) {
        setAllEvents(result.events);
      } else {
        setError(result.error || "Failed to load schedule");
      }
    });
  }, []);

  const groups = useMemo(() => {
    const filtered = allEvents.filter(
      (ev) => (ev.city || "Bengaluru") === selectedCity
    );
    return groupByArea(filtered);
  }, [allEvents, selectedCity]);

  return (
    <>
      <PageHero
        title="Book a scan"
        subtitle="For large groups, contact us at support@bodyinsight.in"
      >
        <div className={styles.citySelector}>
          <label htmlFor="city-select">City</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>
      </PageHero>

      <section className={styles.scheduleSection}>
        {loading && (
          <div className={styles.skeletonGroup}>
            <div className={styles.skeletonHeader} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeletonRow}>
                <div className={styles.skeletonInfo}>
                  <div className={styles.skeletonText} style={{ width: "40%" }} />
                  <div className={styles.skeletonText} style={{ width: "15%" }} />
                  <div className={styles.skeletonText} style={{ width: "15%" }} />
                  <div className={styles.skeletonText} style={{ width: "20%" }} />
                </div>
                <div className={styles.skeletonBtn} />
              </div>
            ))}
          </div>
        )}
        {error && (
          <p style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>
            {error}
          </p>
        )}
        {!loading && !error && groups.length === 0 && (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3 className={styles.emptyTitle}>
              We&apos;re updating our calendar for {selectedCity}
            </h3>
            <p className={styles.emptySubtitle}>
              New scan dates are being added soon. Please check back in a little while!
            </p>
          </div>
        )}
        {groups.map((group) => (
          <div key={group.area} className={styles.areaGroup}>
            <h2 className={styles.areaHeader}>{group.area}</h2>
            <div className={styles.datesList}>
              {group.entries.map((entry) => {
                const params = new URLSearchParams({
                  landmark: entry.landmark,
                  day: entry.day,
                  date: entry.date,
                  time: entry.time,
                });
                return (
                  <div key={entry.eventId} className={styles.dateRow}>
                    <div className={styles.dateInfo}>
                      <div className={styles.dateLandmark}>
                        {entry.landmark}
                        {entry.isPrivate && (
                          <span className={styles.privateTag}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Invite only
                          </span>
                        )}
                      </div>
                      <div className={styles.dateDay}>{entry.day}</div>
                      <div className={styles.dateDate}>{entry.date}</div>
                      <div className={styles.dateTime}>{entry.time}</div>
                    </div>
                    {entry.full ? (
                      <span className={styles.bookBtnFull}>Full</span>
                    ) : (
                      <Link
                        href={`/select-time?${params.toString()}`}
                        className={styles.bookBtn}
                      >
                        Book
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
