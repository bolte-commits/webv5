"use client";

import { useState } from "react";
import { kioskSignup } from "@/app/actions/kiosk";
import styles from "./page.module.css";

export default function KioskPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [height, setHeight] = useState(String(Math.round((5 * 12 + 6) * 2.54))); // stored as cm
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(6);
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const isFormValid =
    name.trim() &&
    /^\d{10}$/.test(phone.trim()) &&
    gender &&
    dateOfBirth &&
    weight &&
    Number(weight) >= 35 && Number(weight) <= 135;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const trimmedName = name.trim();
    const finalEmail = email.trim()
      ? email.trim().toLowerCase()
      : `${trimmedName.toLowerCase().replace(/\s+/g, "")}${Math.floor(10 + Math.random() * 90)}@dummy.com`;

    const result = await kioskSignup({
      name: trimmedName,
      email: finalEmail,
      phone: phone.trim(),
      gender,
      dateOfBirth,
      height: Number(height),
      weight: Number(weight),
    });
    setLoading(false);
    if (result.success) {
      setUserId(result._id!);
    } else {
      setError(result.error || "Signup failed");
    }
  };

  const handleNewSignup = () => {
    setName("");
    setEmail("");
    setPhone("");
    setGender("");
    setDateOfBirth("");
    setHeight(String(Math.round((5 * 12 + 6) * 2.54)));
    setHeightFt(5);
    setHeightIn(6);
    setWeight("");
    setError("");
    setUserId(null);
  };

  if (userId !== null) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successScreen}>
            <h2>Signup Successful</h2>
            <p className={styles.userId}>{userId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="John Doe"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value.toLowerCase()); setError(""); }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Phone (10 digits)</label>
          <input
            type="tel"
            className={styles.input}
            placeholder="9876543210"
            maxLength={10}
            value={phone}
            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Gender</label>
          <div className={styles.genderRow}>
            <button
              type="button"
              className={gender === "male" ? styles.genderBtnActive : styles.genderBtn}
              onClick={() => { setGender("male"); setError(""); }}
            >
              Male
            </button>
            <button
              type="button"
              className={gender === "female" ? styles.genderBtnActive : styles.genderBtn}
              onClick={() => { setGender("female"); setError(""); }}
            >
              Female
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Date of Birth</label>
          <input
            type="date"
            className={styles.input}
            value={dateOfBirth}
            onChange={(e) => { setDateOfBirth(e.target.value); setError(""); }}
          />
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
                  setHeight(String(Math.round((ft * 12 + heightIn) * 2.54)));
                  setError("");
                }}
              >
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
                  setHeight(String(Math.round((heightFt * 12 + inches) * 2.54)));
                  setError("");
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{i} in</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Weight (kg)</label>
          <input
            type="number"
            className={styles.input}
            placeholder="70"
            min={35}
            max={135}
            value={weight}
            onChange={(e) => { setWeight(e.target.value); setError(""); }}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className="pill-btn"
          disabled={!isFormValid || loading}
          onClick={handleSubmit}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
