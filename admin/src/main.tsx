import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./admin.css";
import { api, errorText, onUnauthorized } from "./api";
import { ToastProvider } from "./ui";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ProductsList, ProductForm } from "./pages/Products";
import { Categories, Variants } from "./pages/Catalog";
import { CoaLibrary, ProductInformation } from "./pages/Documents";
import { Orders, OrderDetail } from "./pages/Orders";
import { Inquiries, Logs, Settings } from "./pages/Operations";
import { WebsiteContent } from "./pages/Content";
import { CustomerList, CustomerProfile } from "./pages/Customers";

type Me = { username: string; mustChange: boolean };

const NAV: [string, string][] = [
  ["/", "Dashboard"], ["/customers", "Customers"], ["/products", "Products"], ["/categories", "Categories"], ["/variants", "Product Variants"],
  ["/coa", "COA Library"], ["/information", "Product Information"], ["/orders", "Orders"], ["/inquiries", "Customer Inquiries"],
  ["/content", "Website Content"], ["/logs", "Activity Logs"], ["/settings", "Settings"],
];

function Shell({ me, onLogout }: { me: Me; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <div className="layout">
      <aside className={`side${open ? " open" : ""}`}>
        <div className="brand">The Pep Stop<small>ADMIN PANEL</small></div>
        <button className="btn ghost menu-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <nav aria-label="Admin">
          {NAV.map(([to, text]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "active" : "")}>{text}</NavLink>)}
          <button onClick={async () => { await api("POST", "/logout").catch(() => {}); onLogout(); nav("/"); }}>Logout ({me.username})</button>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
    <div className="login"><form className="card" onSubmit={async (e) => {
      e.preventDefault(); setErr("");
      if (next !== again) return setErr("The new passwords do not match.");
      setBusy(true);
      try { await api("POST", "/change-password", { current: cur, next }); onDone(); } catch (x) { setErr(errorText(x)); }
      setBusy(false);
    }}>
      <h1>Choose a new password</h1>
      <p className="muted">For security, the temporary password must be changed before you continue. Use at least 10 characters with letters and numbers.</p>
      <div className="stack">
        <label className="field"><span>Current (temporary) password</span><input type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} required /></label>
        <label className="field"><span>New password</span><input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={10} /></label>
        <label className="field"><span>Repeat new password</span><input type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} required /></label>
        {err && <p className="note error" role="alert">{err}</p>}
        <button className="btn pink" disabled={busy}>{busy ? "Saving..." : "Save password"}</button>
      </div>
    </form></div>
  );
}

function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const load = () => api<Me>("GET", "/me").then(setMe).catch(() => setMe(null));
  useEffect(() => { load(); const off = onUnauthorized(() => setMe(null)); return () => { off(); }; }, []);
  if (me === undefined) return <p className="muted" style={{ padding: "2rem" }}>Loading...</p>;
  if (!me) return <Login onDone={load} />;
  if (me.mustChange) return <ChangePassword onDone={load} />;
  return <Shell me={me} onLogout={() => setMe(null)} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><BrowserRouter basename="/admin"><ToastProvider><App /></ToastProvider></BrowserRouter></StrictMode>,
);
