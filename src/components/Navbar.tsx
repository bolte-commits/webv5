"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredToken, logout } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(getStoredToken() !== null);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "bi_token") {
        setLoggedIn(e.newValue !== null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav>
      <div className="nav-content">
        <Link href="/" className="logo">
          BODY INSIGHT
        </Link>

        {/* Desktop nav links */}
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
              {loggedIn ? (
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link href="/schedule">Login</Link>
              )}
            </>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {isHome ? (
            <>
              <a href="#how-it-works" onClick={closeMenu}>How it works</a>
              <a href="#scan" onClick={closeMenu}>The Scan</a>
              <a href="#pricing" onClick={closeMenu}>Pricing</a>
              <a href="#results" onClick={closeMenu}>Results</a>
              <Link href="/schedule" className="cta-button" onClick={closeMenu}>
                Book Your Scan
              </Link>
            </>
          ) : (
            <>
              <Link href="/#how-it-works" onClick={closeMenu}>How it works</Link>
              <Link href="/#pricing" onClick={closeMenu}>Pricing</Link>
              <Link href="/schedule" onClick={closeMenu}>Book</Link>
              {loggedIn ? (
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link href="/schedule" onClick={closeMenu}>Login</Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
