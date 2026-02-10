"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredToken, logout } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(getStoredToken() !== null);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "bi_token") {
        setLoggedIn(e.newValue !== null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
  };

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
      </div>
    </nav>
  );
}
