"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import {
  confirmBooking,
  checkPendingAppointment,
  cancelAppointment,
  validateCoupon,
  type PendingAppointment,
  type BookingResult,
  type CouponValidationResult,
} from "@/app/actions/booking";
import { getStoredToken, logout } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/constants";
import styles from "./page.module.css";

const BOOKING_CONTEXT_KEY = "bi_booking";

interface BookingContext {
  eventId: number;
  service: string;
  startTime: string;
  displayTime?: string;
  name?: string;
  area?: string;
  date?: string;
  displayDate?: string;
  amount?: string;
  mapUrl?: string | null;
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = Number(searchParams.get("eventId") || "0");
  const service = searchParams.get("service") || "dexa";
  const startTime = searchParams.get("startTime") || "";

  // Load booking context from sessionStorage
  const [bookingCtx, setBookingCtx] = useState<BookingContext | null>(null);

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState<number | "">("");
  const [heightIn, setHeightIn] = useState<number | "">("");
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [hasPending, setHasPending] = useState(false);
  const [pendingDetails, setPendingDetails] = useState<PendingAppointment | null>(null);
  const [checkingPending, setCheckingPending] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState("");

  const redirectToLogin = () => {
    logout();
    const params = new URLSearchParams();
    if (eventId) params.set("eventId", String(eventId));
    if (service) params.set("service", service);
    if (startTime) params.set("startTime", startTime);
    router.push("/login?" + params.toString());
  };

  useEffect(() => {
    // Load booking context from sessionStorage
    try {
      const stored = sessionStorage.getItem(BOOKING_CONTEXT_KEY);
      if (stored) {
        setBookingCtx(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }

    const t = getStoredToken();
    if (!t) {
      redirectToLogin();
      return;
    }
    setToken(t);

    checkPendingAppointment(t).then((result) => {
      if (result.unauthorized) {
        redirectToLogin();
        return;
      }
      if (result.pendingAppointment) {
        setHasPending(true);
        setPendingDetails(result.pendingAppointment);
      }
      if (result.profile) {
        const p = result.profile;
        if (p.name) setName(p.name);
        if (p.gender) setGender(p.gender);
        if (p.height) {
          setHeight(String(p.height));
          const totalIn = Math.round(Number(p.height) / 2.54);
          setHeightFt(Math.floor(totalIn / 12));
          setHeightIn(totalIn % 12);
        }
        if (p.weight) setWeight(String(p.weight));
        if (p.dateOfBirth) {
          const d = new Date(p.dateOfBirth);
          if (!isNaN(d.getTime())) {
            setDateOfBirth(d.toISOString().split("T")[0]);
          }
        }
      }
      setCheckingPending(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !token) return;
    setCouponError("");
    setCouponApplying(true);
    const result = await validateCoupon(token, {
      code: couponCode.trim(),
      eventId,
      service,
      amount: Number(displayAmount),
    });
    setCouponApplying(false);
    if (result.valid) {
      setCouponResult(result);
      setCouponError("");
    } else {
      setCouponResult(null);
      setCouponError(result.error || "Invalid coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    if (!gender) {
      setBookingError("Please select your gender.");
      return;
    }
    if (!height || heightFt === "" || heightIn === "") {
      setBookingError("Please select your height.");
      return;
    }
    if (!weight) {
      setBookingError("Please enter your weight.");
      return;
    }

    // Age validation
    if (dateOfBirth) {
      const birth = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 18) {
        setBookingError("You must be 18 or older to book a scan.");
        return;
      }
      if (age > 90) {
        setBookingError("Age must be 90 or below.");
        return;
      }
    }

    // Height validation
    const hCm = Number(height);
    if (hCm < 100 || hCm > 210) {
      setBookingError("Height must be between 100 and 210 cm.");
      return;
    }

    // Weight validation
    const w = Number(weight);
    if (w < 35 || w > 135) {
      setBookingError("Weight must be between 35 and 135 kg.");
      return;
    }

    const h = Number(height) / 100;
    const bmi = Number(weight) / (h * h);
    if (bmi > 39) {
      const proceed = window.confirm(
        "Visceral fat measurement is not clinically validated for BMI above 39 and will not be included in your report. All other metrics will be available. Do you wish to proceed?"
      );
      if (!proceed) return;
    }

    setLoading(true);
    const result = await confirmBooking(token, {
      eventId,
      service,
      startTime,
      name,
      gender,
      dateOfBirth,
      height,
      weight,
      ...(couponResult?.valid && couponResult.coupon ? { couponCode: couponResult.coupon.code } : {}),
    });
    setLoading(false);
    if (result.unauthorized) {
      redirectToLogin();
      return;
    }
    if (result.success) {
      if (result.appointment) setBookingResult(result.appointment);
      setSuccess(true);
      logout();
      sessionStorage.removeItem(BOOKING_CONTEXT_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setBookingError(result.error || "Booking failed. Please try again.");
    }
  };

  // Display info: prefer booking result (after success), then booking context, then fallback
  const displayName = bookingResult?.locationName || bookingCtx?.name || "";
  const displayArea = bookingResult?.locationArea || bookingCtx?.area || "";
  const rawDate = bookingResult?.date || bookingCtx?.date || "";
  const displayDate = rawDate ? formatDate(rawDate) : "";
  const displayTime = bookingResult?.time || bookingCtx?.displayTime || "";
  const displayAmount = bookingResult?.amountDue || bookingCtx?.amount || "";

  const heroTitle = hasPending
    ? "You already have a booking"
    : success
      ? "You\u2019re all set!"
      : "Complete your booking";
  const heroSubtitle = hasPending
    ? "You can only have one active appointment at a time."
    : success
      ? "Your scan has been booked. See you there!"
      : "Fill in your details to confirm the scan.";

  return (
    <>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        backHref={success || hasPending ? undefined : "/schedule"}
        backLabel={success || hasPending ? undefined : "Back to schedule"}
        backLinkId="back-link"
        titleId="hero-title"
        subtitleId="hero-subtitle"
      />

      <section className={styles.contentSection}>
        {/* Loading while checking pending appointment */}
        {checkingPending && (
          <div className={styles.card}>
            <div className={styles.skeletonLine} style={{ width: "40%", height: "1.5rem", marginBottom: "0.5rem" }} />
            <div className={styles.skeletonLine} style={{ width: "65%", height: "0.9rem", marginBottom: "2rem" }} />
            <div className={styles.skeletonBlock} />
            <div className={styles.skeletonLine} style={{ width: "30%", height: "0.85rem", marginBottom: "0.5rem" }} />
            <div className={styles.skeletonLine} style={{ width: "100%", height: "3rem", marginBottom: "1.2rem" }} />
            <div className={styles.skeletonLine} style={{ width: "30%", height: "0.85rem", marginBottom: "0.5rem" }} />
            <div className={styles.skeletonLine} style={{ width: "100%", height: "3rem", marginBottom: "1.2rem" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
              <div>
                <div className={styles.skeletonLine} style={{ width: "40%", height: "0.85rem", marginBottom: "0.5rem" }} />
                <div className={styles.skeletonLine} style={{ width: "100%", height: "3rem" }} />
              </div>
              <div>
                <div className={styles.skeletonLine} style={{ width: "40%", height: "0.85rem", marginBottom: "0.5rem" }} />
                <div className={styles.skeletonLine} style={{ width: "100%", height: "3rem" }} />
              </div>
            </div>
            <div className={styles.skeletonLine} style={{ width: "100%", height: "3.2rem", borderRadius: "50px", marginTop: "1rem" }} />
          </div>
        )}

        {/* Already has a pending booking */}
        {!checkingPending && hasPending && (
          <div className={styles.card}>
            <div className={styles.successState}>
              <div className={styles.pendingIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2>Existing appointment found</h2>
              {pendingDetails && (
                <div className={styles.pendingSummary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Location</span>
                    <span className={styles.summaryRowValue}>
                      {pendingDetails.locationName}, {pendingDetails.locationArea}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Date</span>
                    <span className={styles.summaryRowValue}>{formatDate(pendingDetails.date)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Time</span>
                    <span className={styles.summaryRowValue}>{pendingDetails.time}</span>
                  </div>
                </div>
              )}
              <p className={styles.successSub}>
                Cancel it to book a new one, or use a different phone number if this booking is for someone else.
              </p>
              {cancelError && (
                <p className={styles.cancelError}>{cancelError}</p>
              )}
              <div className={styles.pendingActions}>
                <button
                  className={styles.cancelApptBtn}
                  disabled={cancelling}
                  onClick={async () => {
                    if (!pendingDetails) return;
                    setCancelError("");
                    setCancelling(true);
                    const result = await cancelAppointment(pendingDetails.id, pendingDetails.token);
                    setCancelling(false);
                    if (result.success) {
                      setHasPending(false);
                    } else {
                      setCancelError(result.error || "Failed to cancel appointment");
                    }
                  }}
                >
                  {cancelling ? "Cancelling..." : "Cancel existing appointment"}
                </button>
                <button
                  className={styles.switchEmailBtn}
                  onClick={redirectToLogin}
                >
                  Use a different phone number
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking details form */}
        {!success && !hasPending && !checkingPending && (
          <div className={styles.card}>
            <div className={styles.bookingSummary}>
              <div className={styles.summaryTitle}>Booking summary</div>
              <div className={styles.summaryLocation}>
                {displayName || "Loading..."}
              </div>
              <div className={styles.summaryDetails}>
                {displayDate || "--"} at {displayTime || "--"}
              </div>
            </div>

            <form onSubmit={handleSubmit} autoComplete="on">
              <div className={styles.formGroup}>
                <label htmlFor="name-input">Full name</label>
                <input
                  type="text"
                  id="name-input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dob-input">Date of birth</label>
                <input
                  type="date"
                  id="dob-input"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Gender</label>
                <div className={styles.genderRow}>
                  <button
                    type="button"
                    className={gender === "male" ? styles.genderBtnActive : styles.genderBtn}
                    onClick={() => setGender("male")}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={gender === "female" ? styles.genderBtnActive : styles.genderBtn}
                    onClick={() => setGender("female")}
                  >
                    Female
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Height</label>
                <div className={styles.heightPicker}>
                  <div className={styles.heightSelect}>
                    <select
                      value={heightFt}
                      onChange={(e) => {
                        const ft = Number(e.target.value);
                        setHeightFt(ft);
                        const inches = heightIn || 0;
                        setHeight(String(Math.round((ft * 12 + inches) * 2.54)));
                      }}
                    >
                      <option value="" disabled>- ft</option>
                      {[4, 5, 6, 7].map((ft) => (
                        <option key={ft} value={ft}>{ft} ft</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.heightSelect}>
                    <select
                      value={heightIn}
                      onChange={(e) => {
                        const inches = Number(e.target.value);
                        setHeightIn(inches);
                        const ft = heightFt || 5;
                        if (!heightFt) setHeightFt(ft);
                        setHeight(String(Math.round((ft * 12 + inches) * 2.54)));
                      }}
                    >
                      <option value="" disabled>- in</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{i} in</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="weight-input">Weight (kg)</label>
                <input
                  type="number"
                  id="weight-input"
                  required
                  min={35}
                  max={135}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              {/* Coupon */}
              <div className={styles.formGroup}>
                <label>Have a coupon?</label>
                <div className={styles.couponWrap}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={!!couponResult?.valid}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); } }}
                  />
                  {couponResult?.valid ? (
                    <button type="button" className={styles.couponRemoveBtn} onClick={handleRemoveCoupon}>
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.couponApplyBtn}
                      onClick={handleApplyCoupon}
                      disabled={couponApplying || !couponCode.trim()}
                    >
                      {couponApplying ? "..." : "Apply"}
                    </button>
                  )}
                </div>
                {couponResult?.valid && couponResult.coupon && (
                  <p className={styles.couponMsgSuccess}>
                    {couponResult.coupon.code} applied — {formatPrice(couponResult.discount!)} off
                  </p>
                )}
                {couponError && (
                  <p className={styles.couponMsgError}>{couponError}</p>
                )}
              </div>

              <div className={styles.summaryPrice}>
                <span className={styles.priceLabel}>Price</span>
                <span className={styles.priceValue}>
                  {couponResult?.valid && displayAmount ? (
                    <>
                      <span className={styles.priceOriginal}>{formatPrice(Number(displayAmount))}</span>
                      {formatPrice(couponResult.finalAmount!)}
                      <span className={styles.priceDiscountTag}>
                        {couponResult.coupon?.discountType === "percentage" ? `${couponResult.coupon.discountValue}% off` : `${formatPrice(couponResult.discount!)} off`}
                      </span>
                    </>
                  ) : (
                    displayAmount ? formatPrice(Number(displayAmount)) : "--"
                  )}
                </span>
              </div>
              {bookingError && (
                <p style={{ color: "#dc2626", fontSize: "0.9rem", fontWeight: 600, marginTop: "0.75rem", textAlign: "center" }}>
                  {bookingError}
                </p>
              )}
              <button type="submit" className="pill-btn" disabled={loading || !name || !dateOfBirth || !gender || heightFt === "" || heightIn === "" || !weight}>
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        )}

        {/* Success state */}
        {success && (
          <div className={styles.card}>
            <div className={styles.successState}>
              <div className={styles.successCheckmark}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2>Booking confirmed!</h2>
              <p className={styles.successSub}>
                You&apos;re all set. A confirmation has been sent to your email.
              </p>
              <div className={styles.successSummary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Location</span>
                  <span className={styles.summaryRowValue}>
                    {bookingResult
                      ? `${bookingResult.locationName}, ${bookingResult.locationArea}`
                      : displayName || "--"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Date</span>
                  <span className={styles.summaryRowValue}>
                    {displayDate || "--"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Time slot</span>
                  <span className={styles.summaryRowValue}>
                    {bookingResult?.time || displayTime || "--"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Name</span>
                  <span className={styles.summaryRowValue}>{name}</span>
                </div>
                {bookingResult?.amountDue && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Amount</span>
                    <span className={styles.summaryRowValue}>
                      {formatPrice(Number(bookingResult.amountDue))}
                    </span>
                  </div>
                )}
              </div>
              <Link href="/schedule" className={styles.backHome}>
                Back to schedule
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  );
}
