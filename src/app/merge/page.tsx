"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function MergeContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid merge link — no token provided.");
      return;
    }

    fetch(`${API_URL}/users/merge/${token}`, { method: "POST" })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Accounts merged successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Merge failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        {status === "loading" && (
          <>
            <div style={{ fontSize: 32, marginBottom: 16 }}>...</div>
            <p style={{ color: "#666" }}>Merging your accounts...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: 32, marginBottom: 16 }}>&#10003;</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Accounts Merged</h2>
            <p style={{ color: "#666" }}>{message}</p>
            <p style={{ color: "#999", fontSize: 13, marginTop: 16 }}>Your previous reports are now available on your new account.</p>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: 32, marginBottom: 16 }}>&#10007;</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#ef4444" }}>Merge Failed</h2>
            <p style={{ color: "#666" }}>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function MergePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <MergeContent />
    </Suspense>
  );
}
