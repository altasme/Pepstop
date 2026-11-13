import { Link } from "react-router-dom";
import { api, label, peso, when } from "../api";
import type { Counts } from "../counts";
import { Badge, Empty, ErrorNote, Loading, PageHead, useLoad } from "../ui";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Work waiting for the administrator. Only items with something to do are listed. */
function Attention({ counts }: { counts: Counts }) {
  const rows = [
    counts.customers > 0 && { to: "/customers", text: `${plural(counts.customers, "registration is", "registrations are")} waiting for approval`, action: "Review registrations" },
    counts.orders > 0 && { to: "/orders?status=new_order", text: `${plural(counts.orders, "new order has", "new orders have")} not been reviewed yet`, action: "Open new orders" },
    counts.payments > 0 && { to: "/orders?payment=submitted", text: `${plural(counts.payments, "payment is", "payments are")} waiting to be verified`, action: "Verify payments" },
    counts.inquiries > 0 && { to: "/inquiries", text: `${plural(counts.inquiries, "inquiry is", "inquiries are")} waiting for a reply`, action: "Open inquiries" },
  ].filter(Boolean) as { to: string; text: string; action: string }[];
  return (
    <section className="card attention" aria-labelledby="att-h">
      <h2 id="att-h">Needs your attention</h2>
      {rows.length === 0 ? <p className="caught-up">You are all caught up. New registrations and orders will appear here and in the menu.</p> : (
        <ul className="attn-list">
          {rows.map((r) => (
            <li key={r.to}><span>{r.text}</span><Link className="btn sm" to={r.to}>{r.action}</Link></li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Dashboard({ counts }: { counts: Counts }) {
  const { data, error, loading } = useLoad(() => api<any>("GET", "/dashboard"), []);
  const c = data?.cards;
  return (
    <>
      <PageHead title="Dashboard">
        <Link className="btn ghost" to="/products/new">Add product</Link>
        <Link className="btn ghost" to="/coa">Upload COA</Link>
        <Link className="btn ghost" to="/content">Edit website content</Link>
      </PageHead>
      <ErrorNote text={error} />
      <Attention counts={counts} />
      {loading && !data ? <Loading /> : data && (
        <>
          <section className="card" aria-labelledby="glance-h">
            <h2 id="glance-h">At a glance</h2>
            <dl className="glance">
              <div><dt>Customers</dt><dd><Link to="/customers?status=approved">{c.approvedCustomers} approved</Link><span>{c.pendingCustomers} pending</span><span>{c.rejectedCustomers} rejected</span><span>{c.suspendedCustomers} suspended</span></dd></div>
              <div><dt>Products</dt><dd><Link to="/products?status=published">{c.published} published</Link><span>{c.unpublished} unpublished or draft</span><span>{c.totalProducts} in total</span></dd></div>
              <div><dt>Orders</dt><dd><Link to="/orders">{c.newOrders} new</Link><span>{c.reviewOrders} awaiting review</span><span>{c.pendingPayments} payments to verify</span></dd></div>
            </dl>
          </section>
          <div className="grid2">
            <section className="card"><h2>Latest orders</h2>
              {data.latestOrders.length === 0 ? <Empty>No orders yet. They appear here as soon as an approved customer checks out.</Empty> : data.latestOrders.map((o: any) => (
                <p key={o.id}><Link to={`/orders/${o.id}`}>{o.ref}</Link> {o.full_name} <Badge value={o.order_status} /> <span className="muted">{peso(o.total)} · {when(o.created_at)}</span></p>
              ))}
            </section>
            <section className="card"><h2>Registrations waiting</h2>
              {data.pendingList.length === 0 ? <Empty>No registrations are waiting for approval.</Empty> : data.pendingList.map((p: any) => <p key={p.id}><Link to={`/customers/${p.id}`}>{p.full_name}</Link> {p.phone} <span className="muted">{when(p.created_at)}</span></p>)}
            </section>
          </div>
          <section className="card"><h2>Recent activity</h2>
            {data.activity.length === 0 ? <Empty>No activity yet.</Empty> : data.activity.map((a: any, i: number) => <p key={i}>{label(a.action)} <span className="muted">by {a.username ?? "system"} · {when(a.at)}</span></p>)}
          </section>
        </>
      )}
    </>
  );
}
