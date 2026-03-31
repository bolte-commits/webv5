"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageHero from "@/components/PageHero";
import { fetchSchedule, type ScheduleEvent } from "@/app/actions/schedule";
import styles from "./page.module.css";

const CITIES = ["Bengaluru", "Hyderabad"] as const;
const DEFAULT_CITY = CITIES[0];

interface EventEntry {
  eventId: number;
  name: string;
  area: string;
  displayDate: string;
  time: string;
  full: boolean;
  isPrivate: boolean;
  mapUrl?: string | null;
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div />}>
      <ScheduleContent />
    </Suspense>
  );
}

function ScheduleContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");
  const defaultCity = cityParam && (CITIES as readonly string[]).includes(cityParam) ? cityParam : DEFAULT_CITY;
  const [selectedCity, setSelectedCity] = useState(defaultCity);
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

  const entries = useMemo(() => {
    return allEvents
      .filter((ev) => (ev.city || DEFAULT_CITY) === selectedCity)
      .map((ev): EventEntry => ({
        eventId: ev.eventId,
        name: ev.name,
        area: ev.area,
        displayDate: ev.displayDate,
        time: ev.time,
        mapUrl: ev.mapUrl,
        full: ev.isFull,
        isPrivate: ev.isPrivate || false,
      }));
  }, [allEvents, selectedCity]);

  return (
    <>
      <PageHero
        title="Book a scan"
      >
        <p>For large groups, <Link href="/contact" style={{ color: 'white', textDecoration: 'underline' }}>contact us</Link></p>
        <div className={styles.citySelector}>
          <label htmlFor="city-select">City</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
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
        {!loading && !error && entries.length === 0 && (
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
        {entries.length > 0 && (
          <div className={styles.datesList}>
            {entries.map((entry) => (
              <div key={entry.eventId} className={styles.dateRow}>
                <div className={styles.rowLeft}>
                  <div className={styles.dateLandmark}>
                    {entry.name}, {entry.area}
                    {entry.mapUrl && (
                      <a href={entry.mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink} title="Open in Maps">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
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
                  <div className={styles.dateTimeLine}>
                    <span className={styles.dateDate}>{entry.displayDate}</span>
                    <span className={styles.dateSep}>&middot;</span>
                    <span className={styles.dateTime}>{entry.time}</span>
                  </div>
                </div>
                {entry.full ? (
                  <span className={styles.bookBtnFull}>Full</span>
                ) : (
                  <Link
                    href={`/select-time?eventId=${entry.eventId}`}
                    className={styles.bookBtn}
                  >
                    Book
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
