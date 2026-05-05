"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import PageHero from "@/components/PageHero";
import { sendOtp, verifyOtp } from "@/app/actions/auth";
import {
  createMembershipOrder,
  lookupMembershipCoupon,
  verifyMembership,
  type CouponPlan,
  type Plan,
} from "@/app/actions/memberships";
import { setStoredToken } from "@/lib/auth";
import styles from "./page.module.css";

const OTP_LENGTH = 6;

const PLAN_TITLES: Record<Plan, string> = {
  "100d": "100-day",
  "6m": "6-month",
  "12m": "12-month",
};
const PLAN_SUBS: Record<Plan, string> = {
  "100d": "Up to 3 free DEXA scans",
  "6m": "Up to 4 free DEXA scans",
  "12m": "Up to 8 free DEXA scans",
};

type Step = "coupon" | "phone" | "otp" | "plan" | "success";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
}

interface RazorpayInstance {
  open(): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function MembersPage() {
  const [step, setStep] = useState<Step>("coupon");
  const [token, setToken] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; description: string | null; plans: CouponPlan[] } | null>(null);

  const [plan, setPlan] = useState<Plan | "">("");
  const [startDate, setStartDate] = useState(todayStr());

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [confirmed, setConfirmed] = useState<{ plan: Plan; expiresAt: string } | null>(null);

  const isValidPhone = /^\d{10}$/.test(phone.trim());
  const isOtpFilled = otp.every((d) => d.length === 1);
  const planEntry = coupon?.plans.find((p) => p.plan === plan);

  // ── Step 0: coupon ──
  async function handleCouponSubmit() {
    setError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return setError("Enter a coupon code");
    setSubmitting(true);
    const result = await lookupMembershipCoupon(code);
    setSubmitting(false);
    if (!result.success || !result.coupon) {
      return setError(result.error || "Invalid coupon");
    }
    setCoupon(result.coupon);
    if (result.coupon.plans.length > 0) setPlan(result.coupon.plans[0].plan);
    setStep("phone");
  }

  // ── Step 1: phone ──
  async function handlePhoneSubmit() {
    setError("");
    if (!isValidPhone) return setError("Enter a 10-digit phone number");
    setSubmitting(true);
    const result = await sendOtp(phone.trim());
    setSubmitting(false);
    if (!result.success) return setError(result.error || "Could not send OTP");
    if (result.newUser && result.token) {
      // Skip OTP for new users
      setToken(result.token);
      setStoredToken(result.token);
      setStep("plan");
    } else {
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }

  // ── Step 2: OTP ──
  function handleOtpChange(i: number, value: string) {
    const cleaned = value.replace(/\D/g, "");
    const next = [...otp];
    next[i] = cleaned;
    setOtp(next);
    if (cleaned && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
  }
  function handleOtpKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }
  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    const next = [...otp];
    for (let i = 0; i < OTP_LENGTH && i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    if (pasted.length >= OTP_LENGTH) otpRefs.current[OTP_LENGTH - 1]?.focus();
  }
  async function handleOtpVerify() {
    setError("");
    setSubmitting(true);
    const result = await verifyOtp(phone.trim(), otp.join(""));
    setSubmitting(false);
    if (!result.success || !result.token) return setError(result.error || "Invalid OTP");
    setToken(result.token);
    setStoredToken(result.token);
    setStep("plan");
  }

  // ── Step 3: plan + checkout ──
  async function handlePay() {
    setError("");
    if (!coupon || !plan) return setError("Pick a plan");
    if (startDate < todayStr()) return setError("Start date cannot be in the past");
    if (!window.Razorpay) return setError("Payment library failed to load. Refresh and try again.");

    setSubmitting(true);
    const orderResult = await createMembershipOrder(token, {
      plan,
      startDate,
      couponCode: coupon.code,
    });
    setSubmitting(false);
    if (!orderResult.success || !orderResult.order) {
      return setError(orderResult.error || "Could not create order");
    }
    const order = orderResult.order;

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount * 100,
      currency: order.currency,
      name: "Body Insight",
      description: `${PLAN_TITLES[plan]} membership`,
      order_id: order.orderId,
      prefill: { contact: phone.trim() },
      theme: { color: "#000000" },
      handler: async (response) => {
        setSubmitting(true);
        const verify = await verifyMembership(token, {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          plan,
          startDate,
          couponCode: coupon.code,
        });
        setSubmitting(false);
        if (!verify.success || !verify.membership) {
          setError(verify.error || "Payment verification failed. Please contact support.");
          return;
        }
        setConfirmed({ plan: verify.membership.plan, expiresAt: verify.membership.expiresAt });
        setStep("success");
      },
    });
    rzp.open();
  }

  const stepContent: Record<Step, { title: string; subtitle: string }> = {
    coupon: { title: "Become a member", subtitle: "Enter your invite code to see what's available." },
    phone: { title: "Become a member", subtitle: "Enter your phone to get started." },
    otp: { title: "Verify your phone", subtitle: "We sent a 6-digit code on WhatsApp." },
    plan: { title: "Pick your plan", subtitle: "All plans cover unlimited free DEXA scans, with a 45-day gap between scans." },
    success: { title: "You're a member!", subtitle: "" },
  };

  useEffect(() => {
    if (step === "otp") otpRefs.current[0]?.focus();
  }, [step]);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <PageHero
        title={stepContent[step].title}
        subtitle={stepContent[step].subtitle}
        backHref={step === "success" ? "/" : undefined}
        backLabel={step === "success" ? "Back to home" : undefined}
        backLinkId="back-link"
        titleId="hero-title"
        subtitleId="hero-subtitle"
      />

      <section className={styles.contentSection}>
        {step === "coupon" && (
          <div className={styles.stepCard}>
            <h2>Enter your invite code</h2>
            <p className={styles.subtitle}>Memberships are invite-only. Have a code? Enter it below to continue.</p>
            <input
              type="text"
              className={styles.input}
              placeholder="EARLYBIRD"
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setError(""); }}
              style={{ textTransform: "uppercase", fontFamily: "monospace" }}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button
              className="pill-btn"
              disabled={!couponCode.trim() || submitting}
              onClick={handleCouponSubmit}
              style={{ marginTop: "1.25rem" }}
            >
              {submitting ? "Checking..." : "Continue"}
            </button>
          </div>
        )}

        {step === "phone" && coupon && (
          <>
            <div className={styles.pricingCard}>
              <h2 style={{ marginBottom: "0.5rem" }}>Your membership pricing</h2>
              <p className={styles.subtitle} style={{ marginBottom: "1.25rem" }}>
                Code <strong>{coupon.code}</strong> unlocks the following plans.
              </p>
              <div className={styles.pricingGrid}>
                {coupon.plans.map((p) => (
                  <div key={p.plan} className={styles.pricingTile}>
                    <div className={styles.pricingTitle}>{PLAN_TITLES[p.plan]}</div>
                    <div className={styles.pricingPrice}>₹{Number(p.price).toLocaleString("en-IN")}</div>
                    <div className={styles.pricingSub}>{PLAN_SUBS[p.plan]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.stepCard}>
            <h2>Enter your phone number</h2>
            <p className={styles.subtitle}>We&apos;ll send a one-time code via WhatsApp.</p>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10 digit phone number"
              className={styles.input}
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button
              className="pill-btn"
              disabled={!isValidPhone || submitting}
              onClick={handlePhoneSubmit}
              style={{ marginTop: "1.25rem" }}
            >
              {submitting ? "Sending..." : "Continue"}
            </button>
            <p className={styles.subtitle} style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
              By continuing, you confirm you are at least 18 years old.
            </p>
            </div>
          </>
        )}

        {step === "otp" && (
          <div className={styles.stepCard}>
            <h2>Enter the code</h2>
            <p className={styles.subtitle}>Sent to <strong>{phone.trim()}</strong></p>
            <div className={styles.otpInputs}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  className={styles.otpDigit}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                />
              ))}
            </div>
            {error && <p className={styles.error} style={{ textAlign: "center" }}>{error}</p>}
            <button
              className="pill-btn"
              disabled={!isOtpFilled || submitting}
              onClick={handleOtpVerify}
              style={{ marginTop: "1rem" }}
            >
              {submitting ? "Verifying..." : "Verify"}
            </button>
            <button
              type="button"
              className={styles.linkButton}
              onClick={async () => { setOtp(Array(OTP_LENGTH).fill("")); setError(""); await sendOtp(phone.trim()); otpRefs.current[0]?.focus(); }}
              style={{ marginTop: "0.75rem", display: "block", textAlign: "center", width: "100%" }}
            >
              Resend code
            </button>
          </div>
        )}

        {step === "plan" && coupon && (
          <div className={styles.stepCard}>
            <h2>Pick your plan</h2>
            <p className={styles.subtitle}>You can change your plan after this purchase only by contacting us.</p>

            <div className={styles.planList}>
              {coupon.plans.map((p) => (
                <div
                  key={p.plan}
                  className={plan === p.plan ? styles.planOptionActive : styles.planOption}
                  onClick={() => setPlan(p.plan)}
                >
                  <div>
                    <div className={styles.planTitle}>{PLAN_TITLES[p.plan]}</div>
                    <div className={styles.planSub}>{PLAN_SUBS[p.plan]}</div>
                  </div>
                  <div className={styles.planPrice}>₹{Number(p.price).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Membership starts on</label>
              <input
                type="date"
                className={styles.input}
                value={startDate}
                min={todayStr()}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {planEntry && (
              <div className={styles.priceBox}>
                <div className={styles.priceRow}>
                  <span>{PLAN_TITLES[planEntry.plan]} membership</span>
                  <span>₹{Number(planEntry.price).toLocaleString("en-IN")}</span>
                </div>
                <div className={styles.priceTotal}>
                  <span>Total</span>
                  <span>₹{Number(planEntry.price).toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
            <button className="pill-btn" disabled={submitting || !plan} onClick={handlePay}>
              {submitting ? "Processing..." : "Pay & activate"}
            </button>
          </div>
        )}

        {step === "success" && confirmed && (
          <div className={styles.stepCard}>
            <div className={styles.success}>
              <div className={styles.successCheck}>✓</div>
              <h2>Welcome to Body Insight</h2>
              <p style={{ color: "var(--text-light)", marginTop: "0.5rem" }}>
                Your <strong>{PLAN_TITLES[confirmed.plan]}</strong> membership is active.
              </p>
              <p style={{ color: "var(--text-light)", marginTop: "0.5rem", fontSize: "0.95rem" }}>
                Active through <strong>{new Date(confirmed.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
              </p>
              <p style={{ marginTop: "1.5rem", color: "var(--text-light)", fontSize: "0.9rem" }}>
                Book your first scan from the schedule. Your scan will be free — just pick &ldquo;use membership&rdquo; at checkout.
              </p>
              <a href="/schedule" className="pill-btn" style={{ marginTop: "1.5rem", display: "inline-block" }}>
                Book a scan
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
