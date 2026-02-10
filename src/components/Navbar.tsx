"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav>
      <div className="nav-content">
        <Link href="/" className="logo">
          BODY INSIGHT
        </Link>
        <div className="nav-links">
          {isHome ? (
            <>
              <a href="#how-it-works">How it works</a>
              <a href="#scan">The Scan</a>
              <a href="#pricing">Pricing</a>
              <a href="#results">Results</a>
              <Link href="/schedule" className="cta-button">
                Book Your Scan
              </Link>
            </>
          ) : (
            <>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/schedule">Book</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
