"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import {
  confirmBooking,
  checkPendingAppointment,
  cancelUpcomingAppointment,
  getAppointment,
  applyCouponCode,
  type AppointmentDetails,
  type PendingDetails,
  type BookingPricing,
} from "@/app/actions/booking";
import { getStoredProfile, getStoredToken, logout } from "@/lib/auth";
import { formatPrice } from "@/lib/constants";
import styles from "./page.module.css";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const appointmentId = searchParams.get("appointmentId") || "";

  const [appt, setAppt] = useState<AppointmentDetails | null>(null);
  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [token, setToken] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponPricing, setCouponPricing] = useState<BookingPricing | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pricing, setPricing] = useState<BookingPricing | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [hasPending, setHasPending] = useState(false);
  const [pendingDetails, setPendingDetails] = useState<PendingDetails | null>(null);
  const [checkingPending, setCheckingPending] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const redirectToLogin = () => {
    logout();
    router.push("/login?appointmentId=" + appointmentId);
  };

  useEffect(() => {
    const t = getStoredToken();
    if (t) {
      setToken(t);
      checkPendingAppointment(t).then((result) => {
        if (result.unauthorized) {
          redirectToLogin();
          return;
        }
        if (result.hasPending && result.details) {
          setHasPending(true);
          setPendingDetails(result.details);
        }
        setCheckingPending(false);
      });
    } else {
      setCheckingPending(false);
    }

    const profile = getStoredProfile();
    if (profile) {
      if (profile.email) setEmail(profile.email);
      if (profile.name) setName(profile.name);
      if (profile.phone) {
        const digits = profile.phone.replace(/\D/g, "");
        if (digits.length === 10) setPhone(digits);
      }
      if (profile.height) setHeight(String(profile.height));
      if (profile.weight) setWeight(String(profile.weight));
      if (profile.gender) setGender(profile.gender);
      if (profile.dateOfBirth) {
        const d = new Date(profile.dateOfBirth);
        if (!isNaN(d.getTime())) {
          setDateOfBirth(d.toISOString().split("T")[0]);
        }
      }
    }

    if (appointmentId) {
      getAppointment(appointmentId).then((result) => {
        if (result.success && result.details) {
          setAppt(result.details);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setLoading(true);
    const result = await confirmBooking({
      token,
      appointmentId,
      name,
      dateOfBirth,
      phone: phone || undefined,
      coupon: couponCode.trim().toUpperCase() || undefined,
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
      gender: gender || undefined,
    });
    setLoading(false);
    if (result.unauthorized) {
      redirectToLogin();
      return;
    }
    if (result.success) {
      if (result.pricing) setPricing(result.pricing);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setBookingError(result.error || "Booking failed. Please try again.");
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    if (!token) {
      redirectToLogin();
      return;
    }
    setCouponError("");
    setApplyingCoupon(true);
    const result = await applyCouponCode(token, appointmentId, code);
    setApplyingCoupon(false);
    if (result.unauthorized) {
      redirectToLogin();
      return;
    }
    if (result.success && result.pricing) {
      setCouponApplied(true);
      setCouponPricing(result.pricing);
    } else {
      setCouponApplied(false);
      setCouponPricing(null);
      setCouponError(result.error || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponPricing(null);
    setCouponError("");
  };

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
                    <span className={styles.summaryRowValue}>{pendingDetails.landmark}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Area</span>
                    <span className={styles.summaryRowValue}>{pendingDetails.area}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Date</span>
                    <span className={styles.summaryRowValue}>{pendingDetails.date}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Time</span>
                    <span className={styles.summaryRowValue}>{pendingDetails.time}</span>
                  </div>
                </div>
              )}
              <p className={styles.successSub}>
                Cancel it to book a new one, or use a different email if this booking is for someone else.
              </p>
              {cancelError && (
                <p className={styles.cancelError}>{cancelError}</p>
              )}
              <div className={styles.pendingActions}>
                <button
                  className={styles.cancelApptBtn}
                  disabled={cancelling}
                  onClick={async () => {
                    if (!pendingDetails?.pendingAppointmentId || !token) return;
                    setCancelError("");
                    setCancelling(true);
                    const result = await cancelUpcomingAppointment(token, pendingDetails.pendingAppointmentId);
                    setCancelling(false);
                    if (result.unauthorized) {
                      redirectToLogin();
                      return;
                    }
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
                  Use a different email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking details form */}
        {!success && !hasPending && !checkingPending && (
          <div className={styles.card}>
            <h2>Your details</h2>
            <p className={styles.subtitle}>
              Fill in your information to complete the booking.
            </p>

            <div className={styles.bookingSummary}>
              <div className={styles.summaryTitle}>Booking summary</div>
              <div className={styles.summaryLocation}>
                {appt ? appt.landmark : "Loading..."}
              </div>
              <div className={styles.summaryDetails}>
                {appt ? appt.date : "--"} at {appt ? appt.time : "--"}
              </div>
            </div>

            <form onSubmit={handleSubmit} autoComplete="on">
              <div className={styles.formGroup}>
                <label htmlFor="name-input">Full name</label>
                <input
                  type="text"
                  id="name-input"
                  placeholder="Your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone-input">Phone number</label>
                <input
                  type="tel"
                  id="phone-input"
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
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
                <label htmlFor="gender-input">Gender</label>
                <select
                  id="gender-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="height-input">Height (cm)</label>
                  <input
                    type="number"
                    id="height-input"
                    placeholder="170"
                    min={120}
                    max={210}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="weight-input">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight-input"
                    placeholder="70"
                    min={35}
                    max={135}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="coupon-input">Coupon code (optional)</label>
                <div className={styles.couponWrap}>
                  <input
                    type="text"
                    id="coupon-input"
                    placeholder="e.g. FIRST50"
                    value={couponCode}
                    disabled={couponApplied}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      className={styles.couponRemoveBtn}
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.couponApplyBtn}
                      disabled={!couponCode.trim() || applyingCoupon}
                      onClick={handleApplyCoupon}
                    >
                      {applyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className={styles.couponMsgError}>{couponError}</p>
                )}
                {couponApplied && couponPricing && (
                  <p className={styles.couponMsgSuccess}>
                    Coupon applied! You save {formatPrice(couponPricing.discount)}
                  </p>
                )}
              </div>
              <div className={styles.summaryPrice}>
                <span className={styles.priceLabel}>Price</span>
                <span className={styles.priceValue}>
                  {couponApplied && couponPricing ? (
                    <>
                      <span className={styles.priceOriginal}>
                        {formatPrice(couponPricing.basePrice)}
                      </span>
                      {formatPrice(couponPricing.finalPrice)}
                    </>
                  ) : (
                    appt ? formatPrice(appt.amount) : "--"
                  )}
                </span>
              </div>
              {bookingError && (
                <p style={{ color: "#dc2626", fontSize: "0.9rem", fontWeight: 600, marginTop: "0.75rem", textAlign: "center" }}>
                  {bookingError}
                </p>
              )}
              <button type="submit" className="pill-btn" disabled={loading}>
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
                    {appt?.landmark || "--"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Date</span>
                  <span className={styles.summaryRowValue}>
                    {appt?.date || "--"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Time slot</span>
                  <span className={styles.summaryRowValue}>{appt?.time || "--"}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Name</span>
                  <span className={styles.summaryRowValue}>{name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Email</span>
                  <span className={styles.summaryRowValue}>{email}</span>
                </div>
                {pricing && (
                  <>
                    {pricing.discount > 0 ? (
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryRowLabel}>Amount</span>
                        <span className={styles.summaryRowValue}>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#aaa",
                              marginRight: "0.4rem",
                            }}
                          >
                            {formatPrice(pricing.basePrice)}
                          </span>
                          {formatPrice(pricing.finalPrice)}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryRowLabel}>Amount</span>
                        <span className={styles.summaryRowValue}>
                          {formatPrice(pricing.finalPrice)}
                        </span>
                      </div>
                    )}
                  </>
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
