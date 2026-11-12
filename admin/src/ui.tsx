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
export const ErrorNote = ({ text }: { text: string | null }) => (text ? <p className="note error" role="alert">{text}</p> : null);

/* ---- small parts ---- */
export function Badge({ value }: { value: string }) {
  const tone = ["published", "available", "verified", "completed", "responded", "reviewed"].includes(value) ? "good"
    : ["draft", "new", "new_order", "pending", "ask", "in_review", "not_reviewed", "submitted", "in_progress"].includes(value) ? "warn"
    : ["archived", "unavailable", "rejected", "cancelled", "closed"].includes(value) ? "bad" : "info";
  return <span className={`badge ${tone}`}>{label(value)}</span>;
}

export function PageHead({ title, crumbs, children }: { title: string; crumbs?: string[]; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div>
        <nav aria-label="Breadcrumb" className="crumbs">{["Admin", ...(crumbs ?? [title])].join(" / ")}</nav>
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

/* ---- image upload ---- */
export function ImageField({ value, onChange, label: l }: { value: string | null; onChange: (url: string | null) => void; label: string }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="imgfield">
      <span className="lbl">{l}</span>
      <div className="imgrow">
        {value ? <img src={value} alt="" /> : <div className="noimg">No image</div>}
        <div>
          <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setBusy(true);
            try { const r = await uploadFile("image", f); onChange(r.url); } catch (x) { toast("error", errorText(x)); }
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
