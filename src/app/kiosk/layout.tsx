"use client";

import { useEffect } from "react";
import styles from "./layout.module.css";

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hide the global navbar and footer on kiosk pages
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  return (
    <div className={styles.kioskWrapper}>
      <div className={styles.logoBar}>
        <span className={styles.logo}>BODY INSIGHT</span>
      </div>
      {children}
    </div>
  );
}
