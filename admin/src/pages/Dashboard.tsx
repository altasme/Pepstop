import { Link } from "react-router-dom";
import { api, label, peso, when } from "../api";
import { Badge, Empty, ErrorNote, Loading, PageHead, useLoad } from "../ui";

const CARDS: [string, string][] = [
  ["totalProducts", "Total products"], ["published", "Published products"], ["draft", "Draft products"], ["pendingOrders", "Pending orders"],
  ["processingOrders", "Processing orders"], ["completedOrders", "Completed orders"], ["pendingPayments", "Payments awaiting verification"], ["inquiries", "Customer inquiries"],
];

export default function Dashboard() {
  const { data, error, loading } = useLoad(() => api<any>("GET", "/dashboard"), []);
  return (
    <>
      <PageHead title="Dashboard" crumbs={["Dashboard"]}>
        <Link className="btn pink" to="/products/new">Add New Product</Link>
        <Link className="btn ghost" to="/coa">Upload COA</Link>
        <Link className="btn ghost" to="/orders?status=new_order">View Pending Orders</Link>
        <Link className="btn ghost" to="/products">Manage Products</Link>
        <Link className="btn ghost" to="/content">Edit Website Content</Link>
      </PageHead>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && (
        <>
          <div className="cards">{CARDS.map(([k, t]) => <div className="stat" key={k}><b>{data.cards[k]}</b><span>{t}</span></div>)}</div>
          <div className="grid2">
            <section className="card"><h2>Latest orders</h2>
              {data.latestOrders.length === 0 ? <Empty>No orders yet.</Empty> : data.latestOrders.map((o: any) => (
                <p key={o.id}><Link to={`/orders/${o.id}`}>{o.ref}</Link> {o.full_name} <Badge value={o.order_status} /> <span className="muted">{peso(o.total)} · {when(o.created_at)}</span></p>
              ))}
            </section>
            <section className="card"><h2>Recently added products</h2>
              {data.newProducts.length === 0 ? <Empty>No products yet.</Empty> : data.newProducts.map((p: any) => <p key={p.id}><Link to={`/products/${p.id}`}>{p.name}</Link> <Badge value={p.status} /> <span className="muted">{when(p.created_at)}</span></p>)}
            </section>
            <section className="card"><h2>Recently updated products</h2>
              {data.updatedProducts.length === 0 ? <Empty>No products yet.</Empty> : data.updatedProducts.map((p: any) => <p key={p.id}><Link to={`/products/${p.id}`}>{p.name}</Link> <span className="muted">{when(p.updated_at)}</span></p>)}
            </section>
            <section className="card"><h2>Recently uploaded COAs</h2>
              {data.coas.length === 0 ? <Empty>No COAs yet.</Empty> : data.coas.map((c: any) => <p key={c.id}>{c.title} <span className="muted">Batch {c.batch} · {when(c.uploaded_at)}</span></p>)}
            </section>
          </div>
          <section className="card"><h2>Recent administrative activity</h2>
            {data.activity.length === 0 ? <Empty>No activity yet.</Empty> : data.activity.map((a: any, i: number) => <p key={i}>{label(a.action)} <span className="muted">by {a.username ?? "system"} · {when(a.at)}</span></p>)}
          </section>
        </>
      )}
    </>
  );
}
