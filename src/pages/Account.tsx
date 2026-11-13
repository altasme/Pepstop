import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ACCOUNT as A } from "../content/site";
import { Seo } from "../lib/seo";
import { getRegistrationInfo, loginCustomer, registerCustomer, useRemote, type RegistrationInfo } from "../lib/remote";
import { Button } from "../components/ui/Button";
import { Sparkle } from "../components/ui/Sparkle";

const input = "mt-1 min-h-12 w-full rounded-xl border border-edge bg-white px-4 text-base text-ink";
/** Only same-site storefront paths are allowed as the post-login destination. */
const NEXT_OK = /^\/(shop|cart|checkout|coa|account|about|contact|health-beauty|education)?[a-z0-9\-_/?=&%.]*$/i;
const safeNext = (n: string | null) => (n && NEXT_OK.test(n) && !n.startsWith("//") ? n : "/shop");

function Password({ id, label, value, onChange, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">{label}</label>
      <div className="flex gap-2">
        <input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required className={input} />
        <button type="button" aria-pressed={show} onClick={() => setShow(!show)} className="mt-1 min-h-12 shrink-0 rounded-xl border border-edge px-4 text-sm font-semibold text-ink">{show ? A.hide : A.show}</button>
      </div>
    </div>
  );
}

/** Contact options are configured by the administrator. A channel without a value is not shown. */
export function ContactOptions({ info }: { info: RegistrationInfo | null }) {
  if (!info) return null;
  const wa = info.whatsapp.replace(/[^\d]/g, "");
  const tel = info.phone.replace(/[^\d+]/g, "");
  const items = [
    info.messenger ? { href: info.messenger, label: A.contactMessenger, external: true } : null,
    wa ? { href: `https://wa.me/${wa}`, label: A.contactWhatsapp, external: true } : null,
    tel ? { href: `tel:${tel}`, label: `${A.contactPhone} ${info.phone}`, external: false } : null,
  ].filter((x): x is { href: string; label: string; external: boolean } => !!x);
  if (!items.length) return null;
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-ink">{A.contactLead}</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {items.map((i) => <Button key={i.href} href={i.href} external={i.external} variant="secondary">{i.label}</Button>)}
      </div>
    </div>
  );
}

const paras = (s: string) => s.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);

export default function Account() {
  const { customer, status } = useRemote();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const next = safeNext(params.get("next"));
  const [tab, setTab] = useState<"login" | "register">(params.get("mode") === "register" ? "register" : "login");
  const [info, setInfo] = useState<RegistrationInfo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState<{ code: string; reason?: string } | null>(null);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ fullName: "", phone: "", password: "", confirm: "", consent: false, website: "" });
  const set = (k: keyof typeof f) => (v: string | boolean) => setF((x) => ({ ...x, [k]: v }));
  useEffect(() => { getRegistrationInfo().then(setInfo); }, []);

  if (status === "ready" && customer) return <Navigate to={next} replace />;

  const onLogin = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError(""); setBlocked(null);
    const r = await loginCustomer({ phone: f.phone, password: f.password });
    setBusy(false);
    if (r.ok) { nav(next, { replace: true }); return; }
    if (["account_pending", "account_rejected", "account_suspended"].includes(r.code)) setBlocked({ code: r.code, reason: r.reason });
    else setError(A.errors[r.code] ?? A.errors.generic);
  };
  const onRegister = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    const r = await registerCustomer(f);
    setBusy(false);
    if (r.ok) { setDone(true); setF((x) => ({ ...x, password: "", confirm: "" })); } else setError(A.errors[r.code] ?? A.errors.generic);
  };

  const tabBtn = (t: "login" | "register", text: string) => (
    <button type="button" role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setError(""); setBlocked(null); setDone(false); }}
      className={`min-h-12 flex-1 rounded-full px-4 text-base font-semibold transition-colors ${tab === t ? "bg-raspberry text-white" : "text-ink hover:bg-petal"}`}>{text}</button>
  );

  return (
    <>
      <Seo path="/account" noindex />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 md:py-20">
        <Sparkle className="mb-4 h-5 w-5" fill="#C30239" />
        <h1 className="font-display text-display font-medium text-claret">{A.title}</h1>
        <p className="mt-3 text-lg text-ink/80">{A.intro}</p>
        <p className="mt-2 text-ink/80">{A.explain} <Link to="/contact" className="font-semibold text-raspberry underline">{A.explainLink}</Link></p>

        {done ? (
          <div role="status" className="mt-8 rounded-[28px] bg-petal p-6 sm:p-8">
            <h2 className="font-display text-h2 font-medium text-claret">{A.doneTitle}</h2>
            <div className="mt-3 space-y-3 text-ink">{paras(info?.message ?? "").filter((p) => !/^Your account has been created!?$/i.test(p)).map((p) => <p key={p}>{p}</p>)}</div>
            <ContactOptions info={info} />
            <div className="mt-6"><Button variant="secondary" onClick={() => { setDone(false); setTab("login"); }}>{A.backToLogin}</Button></div>
          </div>
        ) : (
          <div className="mt-8">
            <div role="tablist" className="flex gap-1 rounded-full border border-line p-1">{tabBtn("login", A.loginTab)}{tabBtn("register", A.registerTab)}</div>
            {blocked && (
              <div role="alert" className="mt-6 rounded-2xl bg-petal p-5">
                <h2 className="text-h3 font-semibold text-claret">{blocked.code === "account_pending" ? A.pendingTitle : blocked.code === "account_rejected" ? A.rejectedTitle : A.suspendedTitle}</h2>
                <p className="mt-2 text-ink">{blocked.code === "account_pending" ? A.pendingBody : blocked.code === "account_rejected" ? A.rejectedBody : A.suspendedBody}</p>
                {blocked.reason && <p className="mt-2 text-ink"><span className="font-semibold">{A.reasonLabel}:</span> {blocked.reason}</p>}
                <ContactOptions info={info} />
              </div>
            )}
            {tab === "login" ? (
              <form onSubmit={onLogin} className="mt-6 grid gap-4" noValidate>
                <div><label htmlFor="acc-phone" className="text-sm font-semibold text-ink">{A.phone}</label><input id="acc-phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone")(e.target.value)} required className={input} /></div>
                <Password id="acc-pass" label={A.password} value={f.password} onChange={set("password")} autoComplete="current-password" />
                {error && <p role="alert" className="text-sm font-semibold text-raspberry-deep">{error}</p>}
                <Button submit disabled={busy}>{busy ? A.working : A.loginButton}</Button>
              </form>
            ) : (
              <form onSubmit={onRegister} className="mt-6 grid gap-4" noValidate>
                <div><label htmlFor="reg-name" className="text-sm font-semibold text-ink">{A.fullName}</label><input id="reg-name" autoComplete="name" value={f.fullName} onChange={(e) => set("fullName")(e.target.value)} required maxLength={120} className={input} /></div>
                <div><label htmlFor="reg-phone" className="text-sm font-semibold text-ink">{A.phone}</label><input id="reg-phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone")(e.target.value)} required className={input} /><p className="mt-1 text-sm text-ink/80">{A.phoneHint}</p></div>
                <Password id="reg-pass" label={A.createPassword} value={f.password} onChange={set("password")} autoComplete="new-password" />
                <Password id="reg-confirm" label={A.confirmPassword} value={f.confirm} onChange={set("confirm")} autoComplete="new-password" />
                <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website")(e.target.value)} /></label></div>
                <p className="text-sm text-ink/80">{A.privacyLead} <Link to="/privacy" className="font-semibold text-raspberry underline">{A.privacyLink}</Link>.</p>
                <label className="flex items-start gap-3 text-sm text-ink"><input type="checkbox" checked={f.consent} onChange={(e) => set("consent")(e.target.checked)} className="mt-1 h-5 w-5 shrink-0" /> {A.consent}</label>
                {error && <p role="alert" className="text-sm font-semibold text-raspberry-deep">{error}</p>}
                <Button submit disabled={busy}>{busy ? A.working : A.registerButton}</Button>
              </form>
            )}
          </div>
        )}
      </section>
    </>
  );
}
