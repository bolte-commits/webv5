"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import { contactUs } from "@/app/actions/contact";
import styles from "./page.module.css";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit =
    name.trim() && isValidEmail && subject.trim() && message.trim() && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    const result = await contactUs(email.trim(), subject.trim(), message.trim());
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <PageHero
        title="Contact us"
        subtitle="Have a question or want a custom quote? We'd love to hear from you."
      >
        <div className={styles.accentLine} />
      </PageHero>

      <section className={styles.contentSection}>
        {submitted ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Message sent</h2>
            <p>
              Thanks for reaching out! We&apos;ll get back to you within 24
              hours.
            </p>
          </div>
        ) : (
          <form className={styles.card} onSubmit={handleSubmit}>
            <h2>Send us a message</h2>
            <p className={styles.subtitle}>
              We typically respond within a day.
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className={styles.formInput}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={styles.formInput}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                className={styles.formInput}
                placeholder="e.g. Custom quote for my community"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className={styles.formTextarea}
                placeholder="Tell us more about what you need..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: "#dc2626", fontSize: "0.9rem", fontWeight: 600 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="pill-btn"
              disabled={!canSubmit}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
