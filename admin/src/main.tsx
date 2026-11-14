import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";
import { api, errorText, onUnauthorized } from "./api";
import { ToastProvider, useToast } from "./ui";
import { useCounts, type Counts } from "./counts";
import { AuthShell, BrandMark } from "./brand";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ProductsList, ProductForm } from "./pages/Products";
import { Categories, Variants } from "./pages/Catalog";
import { CoaLibrary, ProductInformation } from "./pages/Documents";
import { Orders, OrderDetail } from "./pages/Orders";
import { Inquiries, Logs, Settings } from "./pages/Operations";
import PaymentsAndDelivery from "./pages/Payments";
import { WebsiteContent } from "./pages/Content";
import { CustomerList, CustomerProfile } from "./pages/Customers";

type Me = { username: string; mustChange: boolean };

type NavItem = [path: string, label: string, count?: keyof Counts];
/** Grouped by the job being done. Variants live inside Products; the overview is linked from there. */
const GROUPS: { title?: string; items: NavItem[] }[] = [
  { items: [["/", "Dashboard"]] },
  { title: "Work", items: [["/orders", "Orders", "orders"], ["/customers", "Customers", "customers"], ["/inquiries", "Inquiries", "inquiries"]] },
  { title: "Catalog", items: [["/products", "Products"], ["/categories", "Categories"], ["/coa", "Certificates (COA)"], ["/information", "Product information"]] },
  { title: "Website", items: [["/content", "Website content"]] },
  { title: "System", items: [["/payments", "Payments and delivery"], ["/logs", "Activity log"], ["/settings", "Settings"]] },
];

function Shell({ me, onLogout }: { me: Me; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const toast = useToast();
  const counts = useCounts(pathname, (what, by) => {
    const msg = what === "customers" ? `${by === 1 ? "A new registration is" : `${by} new registrations are`} waiting for approval.`
      : what === "orders" ? `${by === 1 ? "A new order has" : `${by} new orders have`} arrived.`
      : what === "payments" ? `${by === 1 ? "A payment is" : `${by} payments are`} waiting to be verified.`
      : `${by === 1 ? "A new inquiry has" : `${by} new inquiries have`} arrived.`;
    toast("ok", msg);
  });
  return (
    <div className="layout">
      <aside className={`side${open ? " open" : ""}`}>
        <NavLink to="/" className="brandlink" aria-label="The Pep Stop admin, dashboard"><BrandMark onDark /></NavLink>
        <button className="btn ghost menu-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <nav aria-label="Admin">
          {GROUPS.map((g, gi) => (
            <div className="navgroup" key={gi}>
              {g.title && <p className="navtitle" id={`nav-${gi}`}>{g.title}</p>}
              <ul aria-labelledby={g.title ? `nav-${gi}` : undefined}>
                {g.items.map(([to, text, key]) => {
                  const n = key ? counts[key] : 0;
                  return (
                    <li key={to}>
                      <NavLink to={to} end={to === "/"} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "active" : "")}>
                        {text}
                        {n > 0 && <span className="count" aria-label={`${n} waiting`}>{n > 99 ? "99+" : n}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="sidefoot">
          <p className="whoami">Signed in as <b>{me.username}</b></p>
          <button className="logout" onClick={async () => { await api("POST", "/logout").catch(() => {}); onLogout(); nav("/"); }}>Log out</button>
        </div>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard counts={counts} />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerProfile />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductForm />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/variants" element={<Variants />} />
          <Route path="/coa" element={<CoaLibrary />} />
          <Route path="/information" element={<ProductInformation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/content" element={<WebsiteContent />} />
          <Route path="/payments" element={<PaymentsAndDelivery />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function ChangePassword({ onDone }: { onDone: () => void }) {
  const [cur, setCur] = useState(""); const [next, setNext] = useState(""); const [again, setAgain] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  return (
    <AuthShell title="Choose a new password" lead="For security, the temporary password must be changed before you continue. Use at least 10 characters with letters and numbers.">
      <form className="stack" onSubmit={async (e) => {
        e.preventDefault(); setErr("");
        if (next !== again) return setErr("The new passwords do not match.");
        setBusy(true);
        try { await api("POST", "/change-password", { current: cur, next }); onDone(); } catch (x) { setErr(errorText(x)); }
        setBusy(false);
      }}>
        <label className="field"><span>Current (temporary) password</span><input type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} required /></label>
        <label className="field"><span>New password</span><input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={10} /></label>
        <label className="field"><span>Repeat new password</span><input type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} required /></label>
        {err && <p className="note error" role="alert">{err}</p>}
        <button className="btn pink" disabled={busy}>{busy ? "Saving..." : "Save password"}</button>
      </form>
    </AuthShell>
  );
}

function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const load = () => api<Me>("GET", "/me").then(setMe).catch(() => setMe(null));
  useEffect(() => { load(); const off = onUnauthorized(() => setMe(null)); return () => { off(); }; }, []);
  if (me === undefined) return <p className="muted" style={{ padding: "2rem" }} role="status">Loading...</p>;
  if (!me) return <Login onDone={load} />;
  if (me.mustChange) return <ChangePassword onDone={load} />;
  return <Shell me={me} onLogout={() => setMe(null)} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><BrowserRouter basename="/admin"><ToastProvider><App /></ToastProvider></BrowserRouter></StrictMode>,
);
