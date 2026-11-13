import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api, errorText, label, peso, when } from "../api";
import { Badge, Empty, ErrorNote, Field, Loading, PageHead, Pager, useLoad, useToast } from "../ui";

const STATUSES = ["new_order", "under_review", "awaiting_payment", "payment_submitted", "payment_verified", "processing", "ready_for_dispatch", "shipped", "completed", "cancelled"];
const METHOD: Record<string, string> = { gcash: "GCash", maya: "Maya", bank: "Bank transfer", cod: "Cash on delivery" };

export function Orders() {
  const [sp] = useSearchParams();
  const [q, setQ] = useState(""); const [status, setStatus] = useState(sp.get("status") ?? ""); const [payment, setPayment] = useState(sp.get("payment") ?? ""); const [page, setPage] = useState(1);
  const { data, error, loading } = useLoad(() => api<{ total: number; rows: any[] }>("GET", `/orders?${new URLSearchParams({ q, status, payment, page: String(page), per: "20" })}`), [q, status, payment, page]);
  return (
    <>
      <PageHead title="Orders" />
      <div className="filters">
        <input aria-label="Search orders" placeholder="Search reference, name or mobile" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select aria-label="Order status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All order statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
        <select aria-label="Payment status" value={payment} onChange={(e) => { setPayment(e.target.value); setPage(1); }}><option value="">All payment statuses</option>{["pending", "submitted", "verified", "rejected"].map((s) => <option key={s} value={s}>{label(s)}</option>)}</select>
      </div>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.rows.length === 0 ? <Empty>No orders match. Orders placed on the website appear here.</Empty> : data && (
        <>
          <div className="tablewrap"><table>
            <thead><tr><th>Order</th><th>Customer</th><th>Placed</th><th className="num">Items</th><th className="num">Total</th><th>Status</th></tr></thead>
            <tbody>{data.rows.map((o) => (
              <tr key={o.id}><td><Link to={`/orders/${o.id}`}><b>{o.ref}</b></Link></td><td>{o.full_name}</td><td>{when(o.created_at)}</td><td className="num">{o.items}</td>
                <td className="num">{o.has_unpriced ? `${peso(o.total)} + unpriced` : peso(o.total)}</td>
                <td><Badge value={o.order_status} /><span className="subline">{METHOD[o.payment_method] ?? o.payment_method} · payment {o.payment_status}</span></td></tr>
            ))}</tbody>
          </table></div>
          <Pager page={page} per={20} total={data.total} onPage={setPage} />
        </>
      )}
    </>
  );
}

export function OrderDetail() {
  const { id = "" } = useParams();
  const toast = useToast();
  const { data: o, error, loading, reload } = useLoad(() => api<any>("GET", `/orders/${id}`), [id]);
  const [status, setStatus] = useState(""); const [note, setNote] = useState(""); const [fee, setFee] = useState<string>(""); const [internal, setInternal] = useState("");
  const [vnotes, setVnotes] = useState<Record<string, string>>({});
  useEffect(() => { if (o) { setStatus(o.order_status); setFee(o.delivery_fee ?? ""); setInternal(o.internal_notes ?? ""); } }, [o]);
  if (loading && !o) return <Loading />;
  if (error || !o) return <ErrorNote text={error ?? "Order not found."} />;
  const patch = async (body: object, ok: string) => { try { await api("PATCH", `/orders/${id}`, body); toast("ok", ok); setNote(""); reload(); } catch (e) { toast("error", errorText(e)); } };
  const verify = async (pid: string, action: "verify" | "reject") => { try { await api("POST", `/orders/${id}/payments/${pid}`, { action, notes: vnotes[pid] ?? "" }); toast("ok", action === "verify" ? "Payment marked as verified." : "Payment submission rejected."); reload(); } catch (e) { toast("error", errorText(e)); } };
  return (
    <>
      <PageHead title={`Order ${o.ref}`} crumbs={["Orders", o.ref]}><Link className="btn ghost" to="/orders">Back to orders</Link><Badge value={o.order_status} /></PageHead>
      <p className="note">An order submission is not an accepted order. Confirm availability, the final amount, delivery and payment instructions with the customer, then update the status. Never mark payment verified from a screenshot alone.</p>
      <div className="grid2" style={{ marginTop: "1rem" }}>
        <section className="card"><h2>Customer information</h2>
          <dl className="kv"><dt>Full name</dt><dd>{o.customer_id ? <Link to={`/customers/${o.customer_id}`}>{o.full_name}</Link> : o.full_name}</dd><dt>Mobile</dt><dd>{o.mobile}</dd><dt>Email</dt><dd>{o.email || "Not provided"}</dd></dl></section>
        <section className="card"><h2>Delivery information</h2>
          <dl className="kv"><dt>Street</dt><dd>{o.street}</dd><dt>Barangay</dt><dd>{o.barangay}</dd><dt>City or municipality</dt><dd>{o.city}</dd><dt>Province</dt><dd>{o.province}</dd><dt>Postal code</dt><dd>{o.postal}</dd></dl></section>
      </div>
      <section className="card"><h2>Order information</h2>
        <div className="tablewrap"><table><thead><tr><th>Product</th><th>Variant</th><th className="num">Qty</th><th className="num">Unit price</th><th className="num">Subtotal</th></tr></thead>
          <tbody>{o.items.map((i: any) => <tr key={i.id}><td>{i.product_name}</td><td>{i.variant_name}</td><td className="num">{i.qty}</td><td className="num">{i.unit_price === null ? "To be confirmed" : peso(i.unit_price)}</td><td className="num">{i.unit_price === null ? "" : peso(i.line_total)}</td></tr>)}</tbody></table></div>
        <dl className="kv"><dt>Order date</dt><dd>{when(o.created_at)}</dd><dt>Subtotal</dt><dd>{peso(o.subtotal)}{o.has_unpriced ? " (some items have no listed price)" : ""}</dd><dt>Delivery fee</dt><dd>{o.delivery_fee === null ? "To be confirmed" : peso(o.delivery_fee)}</dd><dt>Estimated total</dt><dd><b>{peso(o.total)}</b></dd><dt>Customer notes</dt><dd>{o.customer_notes || "None"}</dd></dl>
      </section>
      <section className="card"><h2>Update order</h2>
        <div className="form">
          <Field label="Order status"><select value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></Field>
          <Field label="Status note (kept in order history)"><input value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          <Field label="Delivery fee (PHP)" hint="Updates the estimated total."><input type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} /></Field>
          <Field label="Internal notes" wide><textarea value={internal} onChange={(e) => setInternal(e.target.value)} /></Field>
        </div>
        <div className="actions" style={{ marginTop: ".75rem" }}>
          <button className="btn pink" onClick={() => patch({ order_status: status, note, delivery_fee: fee === "" ? null : fee, internal_notes: internal }, "Order updated.")}>Save changes</button>
        </div>
      </section>
      <section className="card"><h2>Payment information</h2>
        <dl className="kv"><dt>Preferred method</dt><dd>{METHOD[o.payment_method] ?? o.payment_method}</dd><dt>Payment status</dt><dd><Badge value={o.payment_status} /></dd></dl>
        {o.payments.length === 0 ? <Empty>No payment reference submitted yet.</Empty> : o.payments.map((p: any) => (
          <div key={p.id} className="card" style={{ marginTop: ".75rem" }}>
            <dl className="kv"><dt>Reference</dt><dd>{p.reference || "None"}</dd><dt>Submitted</dt><dd>{when(p.created_at)}</dd><dt>Status</dt><dd><Badge value={p.status} /></dd><dt>Proof</dt><dd>{p.proof_key ? <a href={`/api/admin/files/proof/${p.id}`} target="_blank" rel="noreferrer">View payment proof</a> : "No file submitted"}</dd>{p.notes && <><dt>Verification notes</dt><dd>{p.notes}</dd></>}</dl>
            {p.status === "submitted" && (
              <div className="form" style={{ marginTop: ".75rem" }}>
                <Field label="Verification notes" wide><input value={vnotes[p.id] ?? ""} onChange={(e) => setVnotes({ ...vnotes, [p.id]: e.target.value })} /></Field>
                <div className="actions"><button className="btn pink" onClick={() => verify(p.id, "verify")}>Mark payment verified</button><button className="btn danger" onClick={() => verify(p.id, "reject")}>Reject submission</button></div>
              </div>
            )}
          </div>
        ))}
      </section>
      <section className="card"><h2>Order history</h2>
        {o.history.map((h: any) => <p key={h.id}><Badge value={h.status} /> {h.note} <span className="muted">by {h.by_user} · {when(h.at)}</span></p>)}
      </section>
    </>
  );
}
