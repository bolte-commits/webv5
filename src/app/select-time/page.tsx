"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHero from "@/components/PageHero";
import {
  fetchAppointments,
  type Appointment,
  type EventInfo,
} from "@/app/actions/schedule";
import { formatPrice } from "@/lib/constants";
import { getStoredToken, logout } from "@/lib/auth";
import styles from "./page.module.css";

function SelectTimeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = searchParams.get("eventId") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [event, setEvent] = useState<EventInfo | null>(null);

  useEffect(() => {
    logout();
    if (!eventId) {
      setError("Missing event. Please go back and select an event.");
      setLoading(false);
      return;
    }
    fetchAppointments(Number(eventId)).then((result) => {
      setLoading(false);
      if (result.success) {
        setAppointments(result.appointments);
        setEvent(result.event);
      } else {
        setError(result.error || "Failed to load appointments");
      }
    });
  }, [eventId]);

  const handleSelect = (appt: Appointment) => {
    const token = getStoredToken();
    if (token) {
      router.push("/confirm?appointmentId=" + appt._id);
    } else {
      router.push("/login?appointmentId=" + appt._id);
    }
  };

  return (
    <>
      <PageHero
        title="Select a time"
        subtitle="Pick a slot that works for you. Each scan takes about 15 minutes."
        backHref="/schedule"
        backLabel="Back to schedule"
      />

      <section className={styles.contentSection}>
        {/* Loading skeleton */}
        {loading && (
          <>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonLine} style={{ width: "60%" }} />
              <div className={styles.skeletonDetails}>
                <div className={styles.skeletonLine} style={{ width: "30%" }} />
                <div className={styles.skeletonLine} style={{ width: "40%" }} />
              </div>
            </div>
            <div className={styles.skeletonSlots}>
              <div className={styles.skeletonLine} style={{ width: "40%" }} />
              <div className={styles.skeletonGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={styles.skeletonSlot} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Error state */}
        {error && (
          <p style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>
            {error}
          </p>
        )}

        {/* Event card */}
        {!loading && !error && event && (
          <div className={styles.eventCard}>
            <h2>
              {event.locationUrl ? (
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.landmarkLink}
                >
                  {event.landmark}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : (
                event.landmark
              )}
            </h2>
            <div className={styles.eventDetails}>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Date</div>
                <div className={styles.detailValue}>{event.fullDate}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Area</div>
                <div className={styles.detailValue}>{event.area}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Price</div>
                <div className={styles.detailValue}>{formatPrice(event.amount)}</div>
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
        )}

        {/* Appointments grid */}
        {!loading && !error && appointments.length > 0 && (
          <div className={styles.timeSection}>
            <h2>Available slots</h2>
            <p>All times are in local time</p>
            <div className={styles.timeGrid}>
              {appointments.map((appt) => (
                <button
                  key={appt._id}
                  className={styles.timeSlot}
                  onClick={() => handleSelect(appt)}
                >
                  {appt.displayTime}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && appointments.length === 0 && event && (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <h3 className={styles.emptyTitle}>No slots available</h3>
            <p className={styles.emptySubtitle}>
              All time slots for this event are booked. Please check another
              date.
            </p>
          </div>
        )}
      </section>

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
