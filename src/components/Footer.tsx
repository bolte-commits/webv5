import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div>
          <div className="footer-logo">BODY INSIGHT</div>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: "1rem",
              maxWidth: "300px",
            }}
          >
            Medical-grade DEXA scanning across India. Know your body. Track real
            progress.
          </p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <Link href="/#scan">The Scan</Link>
          <Link href="/#how-it-works">How it Works</Link>
          <Link href="/#pricing">Pricing</Link>
          <a href="#">Sample Report</a>
        </div>

<div className="footer-section">
          <h4>Support</h4>
          <a href="#">FAQ</a>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2024 Body Insight. Medical measurements, not medical advice.
          Consult your physician for health decisions.
        </p>
      </div>
    </footer>
  );
}
