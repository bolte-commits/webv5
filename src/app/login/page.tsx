"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHero from "@/components/PageHero";
import styles from "./page.module.css";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const landmark = searchParams.get("landmark") || "";
  const day = searchParams.get("day") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const slot = searchParams.get("slot") || "";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isOtpFilled = otp.every((d) => d.length === 1);

  const stepContent: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: "Verify your email",
      subtitle: "Quick verification before we confirm your booking.",
    },
    2: {
      title: "Enter the code",
      subtitle: "We sent a 4-digit OTP to your email.",
    },
  };

  const backParams = new URLSearchParams({ landmark, day, date, time });

  const handleSendOtp = () => {
    setStep(2);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    if (cleaned && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    const newOtp = [...otp];
    for (let j = 0; j < 4 && j < pasted.length; j++) {
      newOtp[j] = pasted[j];
    }
    setOtp(newOtp);
    if (pasted.length >= 4) otpRefs.current[3]?.focus();
  };

  const handleVerify = () => {
    const confirmParams = new URLSearchParams({
      landmark,
      day,
      date,
      time,
      slot,
      email: email.trim(),
    });
    router.push("/confirm?" + confirmParams.toString());
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    otpRefs.current[0]?.focus();
  };

  return (
    <>
      <PageHero
        title={stepContent[step].title}
        subtitle={stepContent[step].subtitle}
        backHref={`/select-time?${backParams.toString()}`}
        backLabel="Back to time selection"
        backLinkId="back-link"
        titleId="hero-title"
        subtitleId="hero-subtitle"
      />

      {/* Step indicator */}
      <div className={styles.stepIndicator}>
        <div
          className={
            step === 1
              ? styles.stepCircleActive
              : styles.stepCircleCompleted
          }
        >
          {step > 1 ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            "1"
          )}
        </div>
        <div
          className={step >= 2 ? styles.stepLineActive : styles.stepLine}
        />
        <div
          className={
            step === 2 ? styles.stepCircleActive : styles.stepCircle
          }
        >
          2
        </div>
      </div>

      <section className={styles.contentSection}>
        {/* Step 1: Email */}
        <div
          className={step === 1 ? styles.stepCardActive : styles.stepCard}
        >
          <h2>Enter your email</h2>
          <p className={styles.subtitle}>
            We&apos;ll send you a one-time verification code.
          </p>
          <input
            type="email"
            className={styles.emailInput}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="pill-btn"
            disabled={!isValidEmail}
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        </div>

        {/* Step 2: OTP verification */}
        <div
          className={step === 2 ? styles.stepCardActive : styles.stepCard}
        >
          <h2>Verify OTP</h2>
          <p className={styles.subtitle}>
            Enter the 4-digit code sent to <strong>{email.trim()}</strong>
          </p>
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
          <div className={styles.resendLink}>
            <button onClick={handleResend}>Resend OTP</button>
          </div>
          <button
            className="pill-btn"
            disabled={!isOtpFilled}
            onClick={handleVerify}
          >
            Verify
          </button>
        </div>
      </section>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
