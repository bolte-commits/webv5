"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import PageHero from "@/components/PageHero";
import { sendOtp, verifyOtp } from "@/app/actions/auth";
import { createMembershipOrder, verifyMembership, type Plan } from "@/app/actions/memberships";
import { setStoredToken } from "@/lib/auth";
import styles from "./page.module.css";

const OTP_LENGTH = 6;

const PLANS: { value: Plan; title: string; sub: string; price: number }[] = [
  { value: "100d", title: "100-day", sub: "Up to 3 free DEXA scans", price: 5000 },
  { value: "6m", title: "6-month", sub: "Up to 4 free DEXA scans", price: 7500 },
  { value: "12m", title: "12-month", sub: "Up to 8 free DEXA scans", price: 10000 },
];

type Step = "phone" | "otp" | "profile" | "plan" | "success";

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

function ageFrom(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function MembersPage() {
  const [step, setStep] = useState<Step>("phone");
  const [token, setToken] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const [plan, setPlan] = useState<Plan>("100d");
  const [startDate, setStartDate] = useState(todayStr());
  const [couponCode, setCouponCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [confirmed, setConfirmed] = useState<{ plan: Plan; expiresAt: string } | null>(null);

  const isValidPhone = /^\d{10}$/.test(phone.trim());
  const isOtpFilled = otp.every((d) => d.length === 1);

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
      setStep("profile");
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
    setStep("profile");
  }

  // ── Step 3: profile ──
  function handleProfileNext() {
    setError("");
    if (!name.trim()) return setError("Please enter your name");
    if (!dob) return setError("Please enter your date of birth");
    const age = ageFrom(dob);
    if (age < 18) return setError("You must be 18 or older");
    if (age > 90) return setError("Please enter a valid date of birth");
    setStep("plan");
  }

  // ── Step 4: plan + checkout ──
  async function handlePay() {
    setError("");
    if (!couponCode.trim()) return setError("Coupon code is required");
    if (startDate < todayStr()) return setError("Start date cannot be in the past");
    if (!window.Razorpay) return setError("Payment library failed to load. Refresh and try again.");

    setSubmitting(true);
    const orderResult = await createMembershipOrder(token, {
      plan,
      startDate,
      couponCode: couponCode.trim().toUpperCase(),
      name: name.trim(),
      dateOfBirth: dob,
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
      description: `${PLANS.find((p) => p.value === plan)?.title} membership`,
      order_id: order.orderId,
      prefill: { name: name.trim(), contact: phone.trim() },
      theme: { color: "#000000" },
      handler: async (response) => {
        setSubmitting(true);
        const verify = await verifyMembership(token, {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          plan,
          startDate,
          couponCode: couponCode.trim().toUpperCase(),
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
    phone: { title: "Become a member", subtitle: "Enter your phone to get started." },
    otp: { title: "Verify your phone", subtitle: "We sent a 6-digit code on WhatsApp." },
    profile: { title: "Tell us about yourself", subtitle: "We need this to set up your membership." },
    plan: { title: "Pick your plan", subtitle: "All plans cover unlimited free DEXA scans, with a 45-day gap between scans." },
    success: { title: "You're a member!", subtitle: "" },
  };

  const planObj = PLANS.find((p) => p.value === plan)!;

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
        {step === "phone" && (
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
          </div>
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

        {step === "profile" && (
          <div className={styles.stepCard}>
            <h2>Tell us about yourself</h2>
            <p className={styles.subtitle}>This is what will appear on your invoice.</p>
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As on your ID"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Date of birth</label>
              <input
                type="date"
                className={styles.input}
                value={dob}
                max={todayStr()}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className="pill-btn" onClick={handleProfileNext} style={{ marginTop: "0.5rem" }}>
              Continue
            </button>
          </div>
        )}

        {step === "plan" && (
          <div className={styles.stepCard}>
            <h2>Pick your plan</h2>
            <p className={styles.subtitle}>You can change your plan after this purchase only by contacting us.</p>

            <div className={styles.planList}>
              {PLANS.map((p) => (
                <div
                  key={p.value}
                  className={plan === p.value ? styles.planOptionActive : styles.planOption}
                  onClick={() => setPlan(p.value)}
                >
                  <div>
                    <div className={styles.planTitle}>{p.title}</div>
                    <div className={styles.planSub}>{p.sub}</div>
                  </div>
                  <div className={styles.planPrice}>₹{p.price.toLocaleString("en-IN")}</div>
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

            <div className={styles.field}>
              <label className={styles.label}>Coupon code</label>
              <input
                type="text"
                className={styles.input}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter your code"
                style={{ textTransform: "uppercase", fontFamily: "monospace" }}
              />
            </div>

            <div className={styles.priceBox}>
              <div className={styles.priceRow}>
                <span>{planObj.title} membership</span>
                <span>₹{planObj.price.toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.priceTotal}>
                <span>Total</span>
                <span>₹{planObj.price.toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.priceRow} style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
                <span>Final amount calculated after coupon</span>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            <button className="pill-btn" disabled={submitting || !couponCode.trim()} onClick={handlePay}>
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
                Your <strong>{PLANS.find((p) => p.value === confirmed.plan)?.title}</strong> membership is active.
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
