"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { confirmBooking } from "@/app/actions/booking";
import { fetchAppointments, type EventInfo } from "@/app/actions/schedule";
import { getStoredProfile, getStoredToken } from "@/lib/auth";
import { BASE_PRICE, VALID_COUPONS, formatPrice } from "@/lib/constants";
import styles from "./page.module.css";

function ConfirmContent() {
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId") || "";
  const appointmentId = searchParams.get("appointmentId") || "";
  const slot = searchParams.get("slot") || "--";
  const email = searchParams.get("email") || "";

  const [event, setEvent] = useState<EventInfo | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [token, setToken] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [finalPrice, setFinalPrice] = useState(BASE_PRICE);
  const [couponMsg, setCouponMsg] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });
  const [couponLocked, setCouponLocked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  useEffect(() => {
    const t = getStoredToken();
    if (t) setToken(t);

    const profile = getStoredProfile();
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.height) setHeight(String(profile.height));
      if (profile.weight) setWeight(String(profile.weight));
      if (profile.gender) setGender(profile.gender);
      if (profile.dateOfBirth) {
        const birthYear = new Date(profile.dateOfBirth).getFullYear();
        const currentYear = new Date().getFullYear();
        const calculatedAge = currentYear - birthYear;
        if (calculatedAge > 0 && calculatedAge < 150) {
          setAge(String(calculatedAge));
        }
      }
    }

    if (eventId) {
      fetchAppointments(Number(eventId)).then((result) => {
        if (result.success && result.event) {
          setEvent(result.event);
        }
      });
    }
  }, [eventId]);

  const backParams = new URLSearchParams({ eventId });

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMsg({ text: "", type: "" });
      return;
    }
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setFinalPrice(
        Math.round(BASE_PRICE * (1 - VALID_COUPONS[code].discount / 100))
      );
      setCouponMsg({
        text: `Coupon applied — ${VALID_COUPONS[code].label}`,
        type: "success",
      });
      setCouponLocked(true);
    } else {
      setAppliedCoupon("");
      setFinalPrice(BASE_PRICE);
      setCouponMsg({
        text: "Invalid coupon code. Please try again.",
        type: "error",
      });
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await confirmBooking({
      landmark: event?.landmark || "",
      day: "",
      date: event?.fullDate || "",
      slot,
      email,
      name,
      phone,
      age,
      gender,
      height,
      weight,
      couponCode: appliedCoupon,
      finalPrice,
      token,
      eventId: Number(eventId),
      appointmentId,
    });
    setLoading(false);
    if (result.success) {
      setRefNumber(result.refNumber);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const heroTitle = success ? "You\u2019re all set!" : "Complete your booking";
  const heroSubtitle = success
    ? "Your scan has been booked. See you there!"
    : "Fill in your details to confirm the scan.";

  return (
    <>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        backHref={success ? undefined : `/select-time?${backParams.toString()}`}
        backLabel={success ? undefined : "Back to time selection"}
        backLinkId="back-link"
        titleId="hero-title"
        subtitleId="hero-subtitle"
      />

      <section className={styles.contentSection}>
        {/* Booking details form */}
        {!success && (
          <div className={styles.card}>
            <h2>Your details</h2>
            <p className={styles.subtitle}>
              Fill in your information to complete the booking.
            </p>

            <div className={styles.bookingSummary}>
              <div className={styles.summaryTitle}>Booking summary</div>
              <div className={styles.summaryLocation}>
                {event ? event.landmark : "Loading..."}
              </div>
              <div className={styles.summaryDetails}>
                {event ? event.fullDate : "--"} at {slot}
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
                  placeholder="98765 43210"
                  maxLength={10}
                  inputMode="numeric"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="age-input">Age</label>
                  <input
                    type="number"
                    id="age-input"
                    placeholder="25"
                    min={10}
                    max={120}
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="gender-input">Gender</label>
                  <select
                    id="gender-input"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="height-input">Height (cm)</label>
                  <input
                    type="number"
                    id="height-input"
                    placeholder="170"
                    min={50}
                    max={250}
                    required
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
                    min={20}
                    max={300}
                    required
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
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponLocked}
                  />
                  <button
                    type="button"
                    className={styles.couponApplyBtn}
                    onClick={handleApplyCoupon}
                    disabled={couponLocked}
                  >
                    {couponLocked ? "Applied" : "Apply"}
                  </button>
                </div>
                {couponMsg.text && (
                  <div
                    className={
                      couponMsg.type === "success"
                        ? styles.couponMsgSuccess
                        : styles.couponMsgError
                    }
                  >
                    {couponMsg.text}
                  </div>
                )}
              </div>
              <div className={styles.summaryPrice}>
                <span className={styles.priceLabel}>Total</span>
                <span>
                  {appliedCoupon ? (
                    <>
                      <span className={styles.priceOriginal}>
                        {formatPrice(BASE_PRICE)}
                      </span>
                      <span className={styles.priceValue}>
                        {formatPrice(finalPrice)}
                      </span>
                      <span className={styles.priceDiscountTag}>
                        {VALID_COUPONS[appliedCoupon].discount}% off
                      </span>
                    </>
                  ) : (
                    <span className={styles.priceValue}>
                      {formatPrice(BASE_PRICE)}
                    </span>
                  )}
                </span>
              </div>
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
              <div className={styles.refNumber}>Ref: {refNumber}</div>
              <div className={styles.successSummary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Location</span>
                  <span className={styles.summaryRowValue}>
                    {event?.landmark || "--"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Date</span>
                  <span className={styles.summaryRowValue}>
                    {event?.fullDate || "--"}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Time slot</span>
                  <span className={styles.summaryRowValue}>{slot}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Name</span>
                  <span className={styles.summaryRowValue}>{name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Email</span>
                  <span className={styles.summaryRowValue}>{email}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabel}>Phone</span>
                  <span className={styles.summaryRowValue}>+91 {phone}</span>
                </div>
                {appliedCoupon && (
                  <>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryRowLabel}>Coupon</span>
                      <span
                        className={styles.summaryRowValue}
                        style={{ color: "#16a34a" }}
                      >
                        {appliedCoupon} — {VALID_COUPONS[appliedCoupon].label}
                      </span>
                    </div>
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
                          {formatPrice(BASE_PRICE)}
                        </span>
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </>
                )}
                {!appliedCoupon && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryRowLabel}>Amount</span>
                    <span className={styles.summaryRowValue}>
                      {formatPrice(BASE_PRICE)}
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
