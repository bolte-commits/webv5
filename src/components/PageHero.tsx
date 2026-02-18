import BackLink from "./BackLink";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  titleId?: string;
  subtitleId?: string;
  backLinkId?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  backHref,
  backLabel,
  titleId,
  subtitleId,
  backLinkId,
  children,
}: PageHeroProps) {
  const backLinkEl = backHref && backLabel ? (
    backLinkId ? (
      <a id={backLinkId} href={backHref} className="back-link">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {backLabel}
      </a>
    ) : (
      <BackLink href={backHref} label={backLabel} />
    )
  ) : null;

  return (
    <section className="page-hero">
      {backLinkEl}
      <h1 id={titleId}>{title}</h1>
      {subtitle && <p id={subtitleId}>{subtitle}</p>}
      {children}
      <div style={{ width: 48, height: 4, background: 'var(--accent)', borderRadius: 2, margin: '1.5rem auto 0' }} />
    </section>
  );
}
