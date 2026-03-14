"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cancelAppointment } from "@/app/actions/booking";
import styles from "./page.module.css";

function CancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId") || "";
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"confirm" | "cancelling" | "success" | "error">("confirm");
  const [errorMsg, setErrorMsg] = useState("");

  if (!appointmentId || !token) {
    return (
      <div className={styles.card}>
        <p className={styles.errorText}>Invalid cancellation link.</p>
      </div>
    );
  }

  const handleCancel = async () => {
    setStatus("cancelling");
    const result = await cancelAppointment(Number(appointmentId), token);
    if (result.success) {
      setStatus("success");
    } else {
      setErrorMsg(result.error || "Failed to cancel appointment");
      setStatus("error");
    }
  };

  return (
    <div className={styles.card}>
      {status === "confirm" && (
        <>
          <h2 className={styles.heading}>Cancel your appointment?</h2>
          <p className={styles.subtext}>This action cannot be undone. You can always book a new appointment later.</p>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Yes, cancel my appointment
          </button>
        </>
      )}

      {status === "cancelling" && (
        <p className={styles.subtext}>Cancelling...</p>
      )}

      {status === "success" && (
        <>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className={styles.heading}>Appointment cancelled</h2>
          <p className={styles.subtext}>Your appointment has been cancelled successfully.</p>
        </>
      )}

      {status === "error" && (
        <>
          <p className={styles.errorText}>{errorMsg}</p>
          <button className={styles.cancelBtn} onClick={() => setStatus("confirm")}>
            Try again
          </button>
        </>
      )}
    </div>
  );
}

export default function CancelPage() {
  return (
    <main>
      <section className={styles.container}>
        <Suspense fallback={<div className={styles.card}><p>Loading...</p></div>}>
          <CancelContent />
        </Suspense>
      </section>
    </main>
  );
}
