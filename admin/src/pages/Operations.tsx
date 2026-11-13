import { useEffect, useState } from "react";
import { api, errorText, label, when } from "../api";
import { Badge, ConfirmButton, Empty, ErrorNote, Field, Loading, PageHead, Pager, Switch, useLoad, useToast } from "../ui";

export function Inquiries() {
  const toast = useToast();
  const [status, setStatus] = useState(""); const [archived, setArchived] = useState(false); const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null); const [notes, setNotes] = useState<Record<string, string>>({});
  const { data, error, loading, reload } = useLoad(() => api<{ total: number; rows: any[] }>("GET", `/inquiries?${new URLSearchParams({ status, archived: archived ? "1" : "0", page: String(page), per: "20" })}`), [status, archived, page]);
  const save = async (id: string, body: object, ok: string) => { try { await api("PUT", `/inquiries/${id}`, body); toast("ok", ok); reload(); } catch (e) { toast("error", errorText(e)); } };
  return (
    <>
      <PageHead title="Customer Inquiries" />
      <p className="muted">Inquiries should not contain medical history. If a customer shares sensitive health information, do not copy it elsewhere.</p>
      <div className="filters">
        <select aria-label="Inquiry status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{["new", "in_progress", "responded", "closed"].map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
        <Switch checked={archived} onChange={(v) => { setArchived(v); setPage(1); }}>Show archived</Switch>
      </div>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.rows.length === 0 ? <Empty>No inquiries to show.</Empty> : data && (
        <>
          <div className="tablewrap"><table>
            <thead><tr><th>Customer</th><th>Contact</th><th>Subject</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{data.rows.map((i) => (
              <>
                <tr key={i.id}><td><b>{i.name}</b></td><td>{i.phone}<br />{i.email}</td><td>{i.subject}</td><td>{when(i.created_at)}</td><td><Badge value={i.status} /></td>
                  <td><button className="btn ghost sm" onClick={() => setOpen(open === i.id ? null : i.id)}>{open === i.id ? "Close" : "View"}</button></td></tr>
                {open === i.id && (
                  <tr key={i.id + "x"}><td colSpan={6}>
                    <p style={{ whiteSpace: "pre-wrap" }}>{i.message}</p>
                    <div className="form">
                      <Field label="Status"><select value={i.status} onChange={(e) => save(i.id, { status: e.target.value }, "Status updated.")}>{["new", "in_progress", "responded", "closed"].map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></Field>
                      <Field label="Internal notes" wide><textarea value={notes[i.id] ?? i.notes ?? ""} onChange={(e) => setNotes({ ...notes, [i.id]: e.target.value })} /></Field>
                    </div>
                    <div className="actions" style={{ marginTop: ".5rem" }}>
                      <button className="btn pink sm" onClick={() => save(i.id, { notes: notes[i.id] ?? i.notes ?? "" }, "Notes saved.")}>Save notes</button>
                      {i.archived ? <button className="btn ghost sm" onClick={() => save(i.id, { archived: false }, "Inquiry restored.")}>Restore</button>
                        : <ConfirmButton className="btn danger sm" message="Archive this inquiry?" onConfirm={() => save(i.id, { archived: true }, "Inquiry archived.")}>Archive</ConfirmButton>}
                    </div>
                  </td></tr>
                )}
              </>
            ))}</tbody>
          </table></div>
          <Pager page={page} per={20} total={data.total} onPage={setPage} />
        </>
      )}
    </>
  );
}

export function Logs() {
  const [page, setPage] = useState(1);
  const { data, error, loading } = useLoad(() => api<{ total: number; rows: any[] }>("GET", `/logs?page=${page}&per=50`), [page]);
  return (
    <>
      <PageHead title="Activity Logs" />
      <p className="muted">A read-only record of administrator actions. Logs cannot be edited or deleted from the panel.</p>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.rows.length === 0 ? <Empty>No activity recorded yet.</Empty> : data && (
        <>
          <div className="tablewrap"><table>
            <thead><tr><th>Time</th><th>Action</th><th>User</th><th>Record</th><th>Details</th><th>IP</th></tr></thead>
            <tbody>{data.rows.map((l) => <tr key={l.id}><td>{when(l.at)}</td><td>{label(l.action)}</td><td>{l.username ?? "system"}</td><td>{l.entity ? `${l.entity} ${l.entity_id ?? ""}` : ""}</td><td style={{ maxWidth: 280, overflowWrap: "anywhere" }}>{l.detail ?? ""}</td><td>{l.ip}</td></tr>)}</tbody>
          </table></div>
          <Pager page={page} per={50} total={data.total} onPage={setPage} />
        </>
      )}
    </>
  );
}

export function Settings() {
  const toast = useToast();
  const { data, error, loading, reload } = useLoad(() => api<Record<string, string>>("GET", "/settings"), []);
  const [s, setS] = useState<Record<string, string>>({});
  useEffect(() => { if (data) setS(data); }, [data]);
  const [cur, setCur] = useState(""); const [next, setNext] = useState("");
  if (loading && !data) return <Loading />;
  return (
    <>
      <PageHead title="Settings" />
      <ErrorNote text={error} />
      <section className="card"><h2>Search engine visibility</h2>
        <p className="muted">Hidden adds noindex and nofollow to public pages and removes the sitemap. This asks search engines not to list the site. It is not access control: anyone with a direct link can still open a public page or published document.</p>
        <Field label="Public website visibility"><select value={s.search_visibility ?? "hidden"} onChange={(e) => setS({ ...s, search_visibility: e.target.value })}><option value="hidden">Hidden from search engines (noindex)</option><option value="visible">Visible to search engines</option></select></Field>
        <p className="muted">The admin panel, API and private files are always excluded from search engines.</p>
      </section>
      <section className="card"><h2>Customer registration</h2>
        <p className="muted">Shown to customers after they register. Account creation never grants access; you approve each account yourself.</p>
        <div className="form">
          <Field label="Registration confirmation message" wide hint="Blank lines separate paragraphs."><textarea rows={8} value={s.registration_message ?? ""} onChange={(e) => setS({ ...s, registration_message: e.target.value })} /></Field>
          <Field label="Messenger link" hint="A full https:// link, for example your m.me page. Leave empty to hide."><input value={s.contact_messenger ?? ""} onChange={(e) => setS({ ...s, contact_messenger: e.target.value })} /></Field>
          <Field label="WhatsApp number" hint="Digits with country code, for example 639910189669. Leave empty to hide."><input value={s.contact_whatsapp ?? ""} onChange={(e) => setS({ ...s, contact_whatsapp: e.target.value })} /></Field>
          <Field label="Phone number" hint="Leave empty to hide."><input value={s.contact_phone ?? ""} onChange={(e) => setS({ ...s, contact_phone: e.target.value })} /></Field>
          <div><Switch checked={s.disclose_rejection_reason === "1"} onChange={(v) => setS({ ...s, disclose_rejection_reason: v ? "1" : "0" })}>Show the rejection note to a rejected customer who tries to sign in</Switch></div>
        </div>
      </section>
      <section className="card"><h2>Ordering</h2>
        <div className="form">
          <Field label="Standard delivery fee (PHP)" hint="Leave empty to confirm the delivery fee per order."><input type="number" min={0} value={s.delivery_fee ?? ""} onChange={(e) => setS({ ...s, delivery_fee: e.target.value })} /></Field>
          <Field label="Payment instructions" wide hint="Shown to customers after they submit an order (GCash, Maya and bank transfer details). Supplied by The Pep Stop."><textarea rows={5} value={s.payment_instructions ?? ""} onChange={(e) => setS({ ...s, payment_instructions: e.target.value })} /></Field>
          <div><Switch checked={s.cod_enabled === "1"} onChange={(v) => setS({ ...s, cod_enabled: v ? "1" : "0" })}>Offer cash on delivery at checkout</Switch><small className="muted">Turn on only after The Pep Stop confirms it supports cash on delivery.</small></div>
        </div>
      </section>
      <p><button className="btn pink" onClick={async () => { try { await api("PUT", "/settings", { search_visibility: s.search_visibility, delivery_fee: s.delivery_fee ?? "", cod_enabled: s.cod_enabled ?? "0", registration_message: s.registration_message, contact_messenger: s.contact_messenger ?? "", contact_whatsapp: s.contact_whatsapp ?? "", contact_phone: s.contact_phone ?? "", disclose_rejection_reason: s.disclose_rejection_reason ?? "0", payment_instructions: s.payment_instructions ?? "" }); toast("ok", "Settings saved."); reload(); } catch (e) { toast("error", errorText(e)); } }}>Save settings</button></p>
      <section className="card"><h2>Change password</h2>
        <div className="form">
          <Field label="Current password"><input type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
          <Field label="New password" hint="At least 10 characters, with letters and numbers."><input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
        </div>
        <p><button className="btn ghost" onClick={async () => { try { await api("POST", "/change-password", { current: cur, next }); toast("ok", "Password changed. Other sessions were signed out."); setCur(""); setNext(""); } catch (e) { toast("error", errorText(e)); } }}>Change password</button></p>
      </section>
    </>
  );
}
