import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, errorText, label, when } from "../api";
import { Badge, Empty, ErrorNote, Field, Loading, PageHead, Pager, useLoad, useToast } from "../ui";

const STATUSES = ["pending", "approved", "rejected", "suspended"];

export function CustomerList() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [q, setQ] = useState(""); const [status, setStatus] = useState(sp.get("status") ?? "pending"); const [page, setPage] = useState(1);
  const { data, error, loading } = useLoad(() => api<{ total: number; rows: any[] }>("GET", `/customers?${new URLSearchParams({ q, status, page: String(page), per: "20" })}`), [q, status, page]);
  return (
    <>
      <PageHead title="Customers" />
      <p className="muted">Customers register on the website and wait here. Only you can approve, reject, suspend or restore access. Approving an account never publishes a product.</p>
      <div className="filters">
        <input aria-label="Search customers" placeholder="Search name or phone number" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select aria-label="Account status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
      </div>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.rows.length === 0 ? <Empty>{status === "pending" ? "No registrations are waiting for approval." : "No customers match."}</Empty> : data && (
        <>
          <div className="tablewrap"><table>
            <thead><tr><th>Full name</th><th>Phone number</th><th>Registered</th><th>Status</th><th>Last login</th><th>Actions</th></tr></thead>
            <tbody>{data.rows.map((c) => (
              <tr key={c.id}><td><Link to={`/customers/${c.id}`}><b>{c.full_name}</b></Link></td><td>{c.phone}</td><td>{when(c.created_at)}</td><td><Badge value={c.status} /></td><td>{c.last_login_at ? when(c.last_login_at) : "Never"}</td>
                <td><button className="btn ghost sm" onClick={() => nav(`/customers/${c.id}`)}>{c.status === "pending" ? "Review" : "Open"}</button></td></tr>
            ))}</tbody>
          </table></div>
          <Pager page={page} per={20} total={data.total} onPage={setPage} />
        </>
      )}
    </>
  );
}

const ACTIONS: Record<string, { action: string; text: string; cls: string; confirm: (n: string) => string; ok: string }[]> = {
  pending: [
    { action: "approve", text: "Approve", cls: "btn pink", confirm: (n) => `Approve ${n}? They will be able to sign in and view the private catalog.`, ok: "Account approved." },
    { action: "reject", text: "Reject", cls: "btn danger", confirm: (n) => `Reject ${n}'s registration? They will be told their account was not approved.`, ok: "Account rejected." },
  ],
  approved: [{ action: "suspend", text: "Suspend", cls: "btn danger", confirm: (n) => `Suspend ${n}? They lose access to the catalog immediately and are signed out.`, ok: "Account suspended." }],
  rejected: [{ action: "approve", text: "Approve instead", cls: "btn pink", confirm: (n) => `Approve ${n}? They will be able to sign in and view the private catalog.`, ok: "Account approved." }],
  suspended: [{ action: "restore", text: "Restore access", cls: "btn pink", confirm: (n) => `Restore access for ${n}?`, ok: "Access restored." }],
};

export function CustomerProfile() {
  const { id = "" } = useParams();
  const toast = useToast();
  const { data: c, error, loading, reload } = useLoad(() => api<any>("GET", `/customers/${id}`), [id]);
  const [note, setNote] = useState(""); const [notes, setNotes] = useState("");
  useEffect(() => { if (c) setNotes(c.admin_notes ?? ""); }, [c]);
  if (loading && !c) return <Loading />;
  if (error || !c) return <ErrorNote text={error ?? "Customer not found."} />;
  const run = async (a: { action: string; confirm: (n: string) => string; ok: string }) => {
    if (!window.confirm(a.confirm(c.full_name))) return;
    try { await api("POST", `/customers/${id}/status`, { action: a.action, note }); toast("ok", a.ok); setNote(""); reload(); } catch (e) { toast("error", errorText(e)); }
  };
  return (
    <>
      <PageHead title={c.full_name} crumbs={["Customers", c.full_name]}><Link className="btn ghost" to="/customers">Back to customers</Link><Badge value={c.status} /></PageHead>
      <div className="grid2">
        <section className="card"><h2>Customer information</h2>
          <dl className="kv"><dt>Full name</dt><dd>{c.full_name}</dd><dt>Phone number</dt><dd>{c.phone}</dd><dt>Registered</dt><dd>{when(c.created_at)}</dd><dt>Account status</dt><dd><Badge value={c.status} /></dd>
            <dt>Last decision</dt><dd>{c.decided_at ? when(c.decided_at) : "None yet"}</dd><dt>Last login</dt><dd>{c.last_login_at ? when(c.last_login_at) : "Never"}</dd></dl>
          <p className="muted">The phone number was submitted by the customer and has not been verified by a code.</p>
        </section>
        <section className="card"><h2>Access decision</h2>
          <p className="muted">Every decision is confirmed first and recorded with your name and the time. Changes apply immediately.</p>
          <Field label="Note (kept in history; shown to the customer on rejection only if you enable that in Settings)"><input value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} /></Field>
          <div className="actions" style={{ marginTop: ".75rem" }}>{(ACTIONS[c.status] ?? []).map((a) => <button key={a.action} className={a.cls} onClick={() => run(a)}>{a.text}</button>)}</div>
        </section>
      </div>
      <section className="card"><h2>Administrative notes</h2>
        <Field label="Internal notes (never shown to the customer)"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        <p><button className="btn ghost" onClick={async () => { try { await api("PUT", `/customers/${id}`, { admin_notes: notes }); toast("ok", "Notes saved."); reload(); } catch (e) { toast("error", errorText(e)); } }}>Save notes</button></p>
      </section>
      <section className="card"><h2>Approval and rejection history</h2>
        {c.history.map((h: any) => <p key={h.id}><Badge value={h.to_status} /> {h.from_status ? `from ${label(h.from_status)}` : "registered"} <span className="muted">by {h.by_user} · {when(h.at)}{h.note ? ` · ${h.note}` : ""}</span></p>)}
      </section>
      <section className="card"><h2>Orders</h2>
        {c.orders.length === 0 ? <Empty>No orders yet.</Empty> : c.orders.map((o: any) => <p key={o.id}><Link to={`/orders/${o.id}`}>{o.ref}</Link> <Badge value={o.order_status} /> <span className="muted">{when(o.created_at)}</span></p>)}
      </section>
    </>
  );
}
