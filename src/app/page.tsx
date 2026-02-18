"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  useEffect(() => {
    // Smooth scroll for anchor links
    function handleClick(this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    const anchors = document.querySelectorAll<HTMLAnchorElement>(
      'a[href^="#"]'
    );
    anchors.forEach((anchor) => anchor.addEventListener("click", handleClick));

    return () => {
      anchors.forEach((anchor) =>
        anchor.removeEventListener("click", handleClick)
      );
    };
  }, []);

  useEffect(() => {
    // Intersection Observer for card animations
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll(
      `.${styles.infoCard}, .${styles.stepCard}, .${styles.pricingCard}, .${styles.pricingCardFeatured}, .${styles.testimonialCard}`
    );
    cards.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateY(40px)";
      htmlEl.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Know your body like{" "}
              <span className={styles.highlight}>never before</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Medical-grade DEXA scans in our mobile van. See your fat, muscle,
              and bone in pixel-level detail. Track real progress, not
              guesswork.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/schedule" className="cta-button">
                Book Your Scan
              </Link>
              <a href="#" className={styles.ctaButtonOutline}>
                See Sample Report
              </a>
              <span className={styles.priceTag}>Starting at ₹2,999</span>
            </div>

            <div className={styles.trustSection}>
              <div className={styles.trustText}>
                Trusted by the best
              </div>
              <div className={styles.clientGrid}>
                <img className={styles.clientLogo} src="/images/clients/bcci-icon.png" alt="BCCI" style={{ height: '52px' }} />
                <img className={styles.clientLogo} src="/images/clients/rcb-icon.png" alt="RCB" style={{ height: '62px' }} />
                <img className={styles.clientLogo} src="/images/clients/lsg.svg" alt="LSG" />
                <img className={styles.clientLogo} src="/images/clients/sai.png" alt="SAI" />
                <img className={styles.clientLogo} src="/images/clients/hockey.png" alt="Hockey India" style={{ height: '50px' }} />
                <img className={styles.clientLogo} src="/images/clients/gosports.png" alt="GoSports" />
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop"
              alt="DEXA Body Scan"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statsContent}>
          <div className={styles.statItem}>
            <h3>15,000+</h3>
            <p>Scans completed across India</p>
          </div>
          <div className={styles.statItem}>
            <h3>Mobile</h3>
            <p>We bring DEXA to your location</p>
          </div>
          <div className={styles.statItem}>
            <h3>100+</h3>
            <p>Communities served</p>
          </div>
        </div>
      </div>

      {/* Why DEXA Section */}
      <section className={styles.section} id="scan">
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2>Scales lie. DEXA doesn&apos;t.</h2>
            <p>Stop guessing. Start measuring what actually matters.</p>
          </div>

          <div className={styles.cardsGrid}>
            <div className={styles.infoCard}>
              <h3>See Everything</h3>
              <p>
                Pixel-level breakdown of fat, muscle, and bone across every body
                region. Arms, legs, trunk, core—nothing hidden.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Track Real Progress</h3>
              <p>
                Know if you&apos;re losing fat or muscle. See exactly where
                changes happen. No more scale frustration.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>Prevent Problems Early</h3>
              <p>
                Measure visceral fat and bone density before they become health
                issues. Especially crucial for women 35+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.sectionContent}>
          <div className={styles.featureGrid}>
            <div className={styles.featureText}>
              <h2>Your body mapped in detail</h2>
              <p>
                DEXA uses low-dose X-rays to measure your exact body
                composition. See fat distribution, muscle mass, and bone density
                with clinical precision — whether you&apos;re tracking fitness
                goals, monitoring age-related changes, or simply understanding
                your body better.
              </p>
            </div>
            <div className={styles.featureImage}>
              <img
                src="/images/mapped.jpg"
                alt="DEXA Technology"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Your Data Section */}
      <section className={`${styles.section} ${styles.sectionAccent}`}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2>One scan. Complete picture.</h2>
            <p>Every metric that matters, measured with precision.</p>
          </div>

          <div className={styles.dataGrid}>
            <div className={styles.dataCard}>
              <div className={styles.dataValue}>28.5%</div>
              <div className={styles.dataLabel}>Body Fat</div>
              <div className={styles.dataSublabel}>Regional breakdown</div>
            </div>
            <div className={styles.dataCard}>
              <div className={styles.dataValue}>46.2kg</div>
              <div className={styles.dataLabel}>Lean Mass</div>
              <div className={styles.dataSublabel}>Left-right balance</div>
            </div>
            <div className={styles.dataCard}>
              <div className={styles.dataValue}>5/10</div>
              <div className={styles.dataLabel}>Visceral Fat</div>
              <div className={styles.dataSublabel}>Health risk indicator</div>
            </div>
            <div className={styles.dataCard}>
              <div className={styles.dataValue}>1.104</div>
              <div className={styles.dataLabel}>Bone Density</div>
              <div className={styles.dataSublabel}>g/cm² T-score</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.section} id="how-it-works">
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2>Get scanned in 20 minutes</h2>
            <p>
              Our mobile DEXA van brings the medical-grade scanner to you. No
              hospitals. No waiting. No travel.
            </p>
          </div>

          <div className={styles.stepsContainer}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Book</h3>
              <p>
                Choose your location and time slot. We&apos;ll bring our mobile
                DEXA van to your office, apartment, or gym.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Scan</h3>
              <p>
                Lie down fully clothed for 6-8 minutes. Painless. Silent. Lower
                radiation than a flight.
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Understand</h3>
              <p>
                Get your detailed report same day with AI insights and a 60-day
                action plan tailored to your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Van Section */}
      <section className={`${styles.section} ${styles.sectionAccent}`}>
        <div className={styles.sectionContent}>
          <div className={styles.featureGrid}>
            <div className={styles.featureText}>
              <h2>We come to you</h2>
              <p>
                Our mobile DEXA van brings medical-grade scanning to your
                doorstep. Book a slot and we handle the rest.
              </p>
              <div className={styles.perfectForList} style={{ marginTop: "2rem" }}>
                <h3>Perfect for:</h3>
                <p>• Corporate wellness programs &amp; office health days</p>
                <p>• Apartment communities &amp; residential societies</p>
                <p>• Sports teams &amp; athletic academies</p>
                <p>• Fitness centers &amp; training facilities</p>
              </div>
            </div>
            <div className={styles.featureImage}>
              <img
                src="/images/truck.jpg"
                alt="Body Insight Mobile DEXA Van"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <div className={styles.featureGridReverse}>
            <div className={styles.featureText}>
              <h2>Built for anyone serious about their health</h2>
              <p>
                Whether you&apos;re staying active in your 20s, managing weight
                in your 40s, or monitoring bone density in your 60s — DEXA gives
                you the data you need to make informed decisions at every stage
                of life.
              </p>
            </div>
            <div className={styles.featureImage}>
              <img
                src="/images/built_for.jpg"
                alt="Health for every age"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section
        className={`${styles.section} ${styles.sectionDark}`}
        id="results"
      >
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2>Real results from real people</h2>
            <p>See what changes when you measure what matters.</p>
          </div>

          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                &ldquo;Discovered a left-right leg imbalance that was causing my
                sprint times to plateau. Fixed it, dropped 0.2 seconds.&rdquo;
              </div>
              <div className={styles.testimonialAuthor}>Priya R.</div>
              <div className={styles.testimonialRole}>National Sprinter</div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                &ldquo;My weight didn&apos;t budge for 3 months. DEXA showed I
                lost 4kg fat and gained 3kg muscle. Scale was lying the whole
                time.&rdquo;
              </div>
              <div className={styles.testimonialAuthor}>Arjun M.</div>
              <div className={styles.testimonialRole}>Tech Professional</div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                &ldquo;Found out my mother had low bone density at 58. Started
                treatment early. Could have saved her from a fracture.&rdquo;
              </div>
              <div className={styles.testimonialAuthor}>Kavya S.</div>
              <div className={styles.testimonialRole}>
                Family Health Advocate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.section} id="pricing">
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2>Transparent pricing. Zero hidden fees.</h2>
            <p>
              We measure bodies, not wallets. No supplement sales. Just pure
              data.
            </p>
          </div>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>Single Scan</h3>
              <div className={styles.price}>₹2,999</div>
              <ul className={styles.pricingFeatures}>
                <li>Full-body DEXA scan</li>
                <li>Detailed PDF report</li>
                <li>AI insights &amp; analysis</li>
                <li>At a location close to you</li>
              </ul>
              <Link
                href="/schedule"
                className="cta-button"
                style={{ width: "100%", textAlign: "center" }}
              >
                Book Now
              </Link>
            </div>

            <div className={styles.pricingCardFeatured}>
              <h3>Communities</h3>
              <div className={styles.price}>Custom</div>
              <ul className={styles.pricingFeatures}>
                <li>Mobile DEXA van to your location</li>
                <li>Group pricing for residents</li>
                <li>Live Q&amp;A session</li>
                <li>Perfect for apartments &amp; companies</li>
              </ul>
              <a
                href="/contact"
                className="cta-button"
                style={{ width: "100%", textAlign: "center" }}
              >
                Contact Us
              </a>
            </div>

            <div className={styles.pricingCard}>
              <h3>Sports Teams</h3>
              <div className={styles.price}>Custom</div>
              <ul className={styles.pricingFeatures}>
                <li>Bulk team pricing</li>
                <li>Performance tracking</li>
                <li>Aggregate reports</li>
                <li>Integrated with training programs</li>
              </ul>
              <a
                href="/contact"
                className="cta-button"
                style={{ width: "100%", textAlign: "center" }}
              >
                Talk to Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection} id="contact">
        <h2>Stop guessing. Start knowing.</h2>
        <p>
          Join 15,000+ people who&apos;ve discovered what their body is really
          made of. Our mobile van brings medical-grade DEXA scanning to your
          doorstep.
        </p>
        <Link href="/schedule" className={styles.ctaSectionButton}>
          Book Your DEXA Scan
        </Link>
      </section>
    </>
  );
}
