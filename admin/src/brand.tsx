import type { ReactNode } from "react";

/** Four-point sparkle drawn from the logo's own stars. Decorative only. */
export function Sparkle({ className = "", fill = "#ECB86C" }: { className?: string; fill?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className}>
      <path d="M12 0c.7 6.2 5.8 11.3 12 12-6.2.7-11.3 5.8-12 12-.7-6.2-5.8-11.3-12-12C6.2 11.3 11.3 6.2 12 0Z" fill={fill} />
    </svg>
  );
}

/** Supplied badge plus live wordmark, the same lockup as the public site. The badge sits on a white disc on dark grounds. */
export function BrandMark({ onDark = false, size = 48 }: { onDark?: boolean; size?: number }) {
  return (
    <span className="brandmark">
      <span className={`badge-disc${onDark ? " on-dark" : ""}`}>
        <img src="/images/logo-160.webp" srcSet="/images/logo-160.webp 160w, /images/logo-320.webp 320w" sizes={`${size}px`} width={size} height={size} alt="" />
      </span>
      <span className="wordmark">
        <b>The Pep Stop</b>
        <small>Admin panel</small>
      </span>
    </span>
  );
}

/** Full-screen layout for sign-in, password change and reset: a claret brand panel beside the form. */
export function AuthShell({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <main className="auth">
      <section className="auth-panel" aria-hidden="false">
        <div className="auth-sparkles" aria-hidden="true">
          <Sparkle className="sp s1" /><Sparkle className="sp s2" fill="#F8CDD9" /><Sparkle className="sp s3" /><Sparkle className="sp s4" fill="#F8CDD9" />
        </div>
        <BrandMark onDark size={56} />
        <div className="auth-copy">
          <p className="auth-kicker">Health &amp; Beauty</p>
          <p className="auth-line">Everything behind the shop, kept in one calm place.</p>
          <p className="auth-sub">Approve customers, manage the catalog, and look after every order.</p>
        </div>
      </section>
      <section className="auth-form">
        <div className="auth-card">
          <Sparkle className="auth-mark" fill="#C30239" />
          <h1>{title}</h1>
          {lead && <p className="muted">{lead}</p>}
          {children}
        </div>
        <p className="auth-foot">Private area. Activity is recorded.</p>
      </section>
    </main>
  );
}
