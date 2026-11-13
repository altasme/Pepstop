import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { errorText, label, uploadFile } from "./api";

/* ---- toasts ---- */
type Toast = { id: number; kind: "ok" | "error"; text: string };
const ToastCtx = createContext<(kind: Toast["kind"], text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, kind, text }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 5000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} className={`toast ${t.kind}`}>{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---- data loading ---- */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    setLoading(true);
    fn().then((d) => { if (live) { setData(d); setError(null); } }).catch((e) => { if (live) setError(errorText(e)); }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  return { data, error, loading, reload: () => setTick((x) => x + 1), setData };
}

export const Loading = () => <p className="muted" role="status">Loading...</p>;
export const Empty = ({ children }: { children: ReactNode }) => <p className="empty">{children}</p>;

/** Overflow menu for the secondary actions of a table row. Closes on outside click and Escape. */
export function RowMenu({ label: l, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const place = () => {
    const d = ref.current, m = menu.current;
    if (!d?.open || !m) return;
    const r = d.getBoundingClientRect();
    const h = m.offsetHeight, w = m.offsetWidth;
    // Fixed position: a table's scroll box cannot clip it. Open upward when there is no room below.
    m.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w))}px`;
    m.style.top = `${r.bottom + h + 8 > window.innerHeight ? Math.max(8, r.top - h - 4) : r.bottom + 4}px`;
  };
  useEffect(() => {
    const close = () => { if (ref.current?.open) ref.current.open = false; };
    const outside = (e: Event) => { if (ref.current?.open && !(e.target instanceof Node && ref.current.contains(e.target))) close(); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && ref.current?.open) { close(); ref.current?.querySelector("summary")?.focus(); } };
    document.addEventListener("click", outside); document.addEventListener("keydown", esc);
    window.addEventListener("scroll", close, true); window.addEventListener("resize", close);
    return () => { document.removeEventListener("click", outside); document.removeEventListener("keydown", esc); window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close); };
  }, []);
  return (
    <details className="rowmenu" ref={ref} onToggle={place}>
      <summary aria-label={l}>More</summary>
      <div className="menu" ref={menu} onClick={() => { if (ref.current) ref.current.open = false; }}>{children}</div>
    </details>
  );
}
export const ErrorNote = ({ text }: { text: string | null }) => (text ? <p className="note error" role="alert">{text}</p> : null);

/* ---- small parts ---- */
export function Badge({ value }: { value: string }) {
  const tone = ["published", "available", "verified", "completed", "responded", "reviewed", "approved"].includes(value) ? "good"
    : ["draft", "new", "new_order", "pending", "ask", "in_review", "not_reviewed", "submitted", "in_progress", "pending_review", "unpublished"].includes(value) ? "warn"
    : ["archived", "unavailable", "rejected", "cancelled", "closed", "suspended", "not_cleared"].includes(value) ? "bad" : "info";
  return <span className={`badge ${tone}`}>{label(value)}</span>;
}

export function PageHead({ title, crumbs, children }: { title: string; crumbs?: string[]; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div>
        {crumbs && crumbs.length > 1 && <nav aria-label="Breadcrumb" className="crumbs">{crumbs.join(" / ")}</nav>}
        <h1>{title}</h1>
      </div>
      <div className="actions">{children}</div>
    </header>
  );
}

export function Pager({ page, per, total, onPage }: { page: number; per: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / per));
  if (total <= per) return null;
  return (
    <div className="pager">
      <button className="btn ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span>Page {page} of {pages} ({total} records)</span>
      <button className="btn ghost" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}

export function Field({ label: l, hint, children, wide }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`field${wide ? " wide" : ""}`}>
      <span>{l}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Switch({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return <label className="check"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /> {children}</label>;
}

export function ConfirmButton({ children, message, onConfirm, className = "btn ghost", disabled }: { children: ReactNode; message: string; onConfirm: () => void; className?: string; disabled?: boolean }) {
  return <button type="button" className={className} disabled={disabled} onClick={() => { if (window.confirm(message)) onConfirm(); }}>{children}</button>;
}

/** Warns before the tab closes while a form has unsaved changes. */
export function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
}

/** Image that never shows a broken-image icon: if the file cannot load, a quiet tile stands in. */
export function SafeImg({ src, className, tile }: { src: string; className?: string; tile: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className={tile} role="img" aria-label="Image unavailable" />;
  return <img src={src} alt="" className={className} onError={() => setFailed(true)} />;
}

/* ---- image upload ---- */
/** kind "catalog" stores private product images (approved customers only); "image" stores public site images. */
export function ImageField({ value, onChange, label: l, kind = "image" }: { value: string | null; onChange: (url: string | null) => void; label: string; kind?: "image" | "catalog" }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="imgfield">
      <span className="lbl">{l}</span>
      <div className="imgrow">
        {value ? <SafeImg src={value} tile="noimg" /> : <div className="noimg">No image</div>}
        <div>
          <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setBusy(true);
            try { const r = await uploadFile(kind, f); onChange(r.url); } catch (x) { toast("error", errorText(x)); }
            setBusy(false); if (ref.current) ref.current.value = "";
          }} />
          <button type="button" className="btn ghost" disabled={busy} onClick={() => ref.current?.click()}>{busy ? "Uploading..." : value ? "Replace" : "Upload"}</button>
          {value && <button type="button" className="btn ghost" onClick={() => onChange(null)}>Remove</button>}
        </div>
      </div>
    </div>
  );
}

/* ---- rich text (headings, paragraphs, lists, bold, italic, links) ---- */
export function RichText({ value, onChange, label: l }: { value: string; onChange: (html: string) => void; label: string }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => { if (el.current && el.current.innerHTML !== value) el.current.innerHTML = value; }, [value]);
  const cmd = (c: string, arg?: string) => { el.current?.focus(); document.execCommand(c, false, arg); onChange(el.current?.innerHTML ?? ""); };
  return (
    <div className="rich">
      <span className="lbl">{l}</span>
      <div className="toolbar" role="toolbar" aria-label={`${l} formatting`}>
        <button type="button" onClick={() => cmd("formatBlock", "h2")}>Heading</button>
        <button type="button" onClick={() => cmd("formatBlock", "h3")}>Subheading</button>
        <button type="button" onClick={() => cmd("formatBlock", "p")}>Paragraph</button>
        <button type="button" onClick={() => cmd("bold")}><b>B</b></button>
        <button type="button" onClick={() => cmd("italic")}><i>I</i></button>
        <button type="button" onClick={() => cmd("insertUnorderedList")}>Bullets</button>
        <button type="button" onClick={() => cmd("insertOrderedList")}>Numbers</button>
        <button type="button" onClick={() => { const u = window.prompt("Link address (https://...)"); if (u) cmd("createLink", u); }}>Link</button>
      </div>
      <div ref={el} className="editor" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label={l} onInput={() => onChange(el.current?.innerHTML ?? "")} />
    </div>
  );
}
