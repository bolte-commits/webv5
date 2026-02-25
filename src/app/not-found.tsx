import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "4rem 2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontSize: "6rem",
          fontWeight: 800,
          lineHeight: 1,
          color: "var(--primary)",
          marginBottom: "0.5rem",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: "0.5rem",
        }}
      >
        Page not found
      </p>
      <p
        style={{
          fontSize: "1rem",
          color: "var(--text-light)",
          marginBottom: "2rem",
          maxWidth: "400px",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          background: "var(--accent)",
          color: "white",
          padding: "0.8rem 2rem",
          borderRadius: "50px",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "1rem",
          transition: "all 0.3s",
        }}
      >
        Go home
      </Link>
    </div>
  );
}
