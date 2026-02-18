import PageHero from "@/components/PageHero";
import Link from "next/link";
import styles from "./page.module.css";

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" />

      <section className={styles.contentSection}>
        <div className={styles.card}>
          <p className={styles.lastUpdated}>Last updated: February 2025</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using the Body Insight website and services, you
            agree to be bound by these terms. If you do not agree, please do
            not use our services.
          </p>

          <h2>Our Services</h2>
          <p>
            Body Insight provides medical-grade DEXA (Dual-Energy X-ray
            Absorptiometry) body composition scans through our mobile scanning
            van across India. Our services include full-body DEXA scans,
            detailed PDF reports, and AI-powered insights and analysis.
          </p>

          <h2>Medical Disclaimer</h2>
          <p>
            <strong>
              Body Insight provides medical measurements, not medical advice.
            </strong>{" "}
            Our scans and reports are for informational and educational purposes
            only. They are not intended to diagnose, treat, cure, or prevent any
            disease or medical condition. Always consult your physician or a
            qualified healthcare professional before making health decisions
            based on your scan results.
          </p>

          <h2>Bookings and Payments</h2>
          <ul>
            <li>
              All bookings are subject to availability at your selected location
              and time.
            </li>
            <li>
              Prices are listed in Indian Rupees (INR) and are subject to
              change.
            </li>
            <li>
              Discount coupons are subject to their specific terms and may be
              withdrawn at any time.
            </li>
            <li>
              You may cancel or reschedule your appointment through the link
              provided in your confirmation email.
            </li>
          </ul>

          <h2>DEXA Scan Safety</h2>
          <p>
            DEXA scans use very low-dose X-rays and are considered safe for
            routine use. However, DEXA scans are not recommended for individuals
            who are pregnant. Please inform our staff of any relevant medical
            conditions before your scan.
          </p>

          <h2>Your Account and Data</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials. You agree to provide accurate and complete
            personal information when booking a scan. Your use of our services
            is also governed by our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and
            software, is the property of Body Insight and is protected by
            applicable intellectual property laws. You may not reproduce,
            distribute, or modify any content without our written permission.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Body Insight shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of our services. Our
            total liability for any claim shall not exceed the amount you paid
            for the specific service giving rise to the claim.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of our
            services after changes constitutes acceptance of the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these terms, please{" "}
            <Link href="/contact">contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
