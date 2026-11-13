import { useState, type FormEvent } from "react";
import { CONTACT_PAGE as C } from "../../content/site";
import { Button } from "../ui/Button";

/** Sends an inquiry to the Worker API. A hidden field catches bots; the Worker also rate limits by address. */
export function InquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const field = "mt-1 min-h-12 w-full rounded-xl border border-edge bg-white px-4 text-base text-ink";
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!String(f.get("phone") ?? "").trim() && !String(f.get("email") ?? "").trim()) { setState("error"); return; }
    setState("sending");
    try {
      const r = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f.entries())),
      });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };
  return (
    <div>
      <div className="max-w-xl">
        <h2 className="font-sans text-h3 font-semibold text-ink">{C.formTitle}</h2>
        <p className="mt-2 text-ink">{C.formBody}</p>
        {state === "sent" ? (
          <p role="status" className="mt-5 rounded-xl bg-petal p-4 font-medium text-ink">{C.formSent}</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 grid gap-4">
            <label className="text-sm font-semibold text-ink">{C.formName}<input name="name" required maxLength={120} autoComplete="name" className={field} /></label>
            <label className="text-sm font-semibold text-ink">{C.formPhone}<input name="phone" type="tel" maxLength={30} autoComplete="tel" className={field} /></label>
            <label className="text-sm font-semibold text-ink">{C.formEmail}<input name="email" type="email" maxLength={160} autoComplete="email" className={field} /></label>
            <label className="text-sm font-semibold text-ink">{C.formSubject}<input name="subject" maxLength={160} className={field} /></label>
            <label className="text-sm font-semibold text-ink">{C.formMessage}<textarea name="message" required maxLength={2000} rows={5} className={`${field} py-3`} /></label>
            <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <p className="text-sm text-ink/80">{C.formHint}</p>
            {state === "error" && <p role="alert" className="text-sm font-medium text-raspberry-deep">{C.formError}</p>}
            <div><Button submit disabled={state === "sending"}>{state === "sending" ? C.formSending : C.formSend}</Button></div>
          </form>
        )}
      </div>
    </div>
  );
}
