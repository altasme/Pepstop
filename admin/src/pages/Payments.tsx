import { useEffect, useState } from "react";
import { api, errorText, peso } from "../api";
import { Badge, ConfirmButton, Empty, ErrorNote, Field, ImageField, Loading, PageHead, SafeImg, Switch, useLoad, useToast } from "../ui";

const KINDS: [string, string][] = [["ewallet", "E-wallet (GCash, Maya)"], ["bank", "Bank transfer"], ["cod", "Cash on delivery"], ["other", "Other"]];
const blankMethod = (sort: number) => ({ label: "", kind: "ewallet", account_name: "", account_number: "", instructions: "", qr_image: null as string | null, enabled: 1, sort });
const blankOption = (sort: number) => ({ label: "", fee: "" as string | number, note: "", enabled: 1, sort });

function PaymentMethods() {
  const toast = useToast();
  const { data, error, loading, reload } = useLoad(() => api<any[]>("GET", "/payment-methods"), []);
  const [edit, setEdit] = useState<any | null>(null);
  const save = async () => {
    try {
      await api(edit.id ? "PUT" : "POST", edit.id ? `/payment-methods/${edit.id}` : "/payment-methods", edit);
      toast("ok", "Payment method saved."); setEdit(null); reload();
    } catch (e) { toast("error", errorText(e)); }
  };
  const toggle = async (m: any) => {
    try { await api("PUT", `/payment-methods/${m.id}`, { ...m, enabled: m.enabled ? 0 : 1 }); reload(); } catch (e) { toast("error", errorText(e)); }
  };
  const cod = data?.find((m) => m.kind === "cod");
  const toggleCod = async (on: boolean) => {
    try {
      if (cod) await api("PUT", `/payment-methods/${cod.id}`, { ...cod, enabled: on ? 1 : 0 });
      else await api("POST", "/payment-methods", { label: "Cash on Delivery", kind: "cod", instructions: "Pay in cash when your order arrives. We confirm your order and delivery details with you first.", enabled: on ? 1 : 0, sort: 99 });
      toast("ok", on ? "Cash on delivery is on." : "Cash on delivery is off."); reload();
    } catch (e) { toast("error", errorText(e)); }
  };
  const remove = async (m: any) => {
    try { await api("DELETE", `/payment-methods/${m.id}`); toast("ok", "Payment method deleted."); reload(); } catch (e) { toast("error", errorText(e)); }
  };
  return (
    <section className="card">
      <div className="cardhead">
        <h2>Payment methods</h2>
        <button className="btn pink" onClick={() => setEdit(blankMethod((data?.length ?? 0) + 1))}>Add payment method</button>
      </div>
      <p className="muted">Customers choose one when they check out. The account details and QR code are shown only to approved customers, after they place an order.</p>
      <ErrorNote text={error} />
      {data && (
        <div className="subcard">
          <Switch checked={!!cod?.enabled} onChange={toggleCod}>Cash on delivery</Switch>
          <small className="muted">Customers pay in cash when the order arrives. These orders reach you right away, with no payment screenshot to wait for. Delivery fees still apply.</small>
        </div>
      )}
      {edit && (
        <div className="subcard">
          <h3>{edit.id ? "Edit payment method" : "New payment method"}</h3>
          <div className="form">
            <Field label="Name shown to customers" hint="For example GCash or BPI."><input value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} /></Field>
            <Field label="Type"><select value={edit.kind} onChange={(e) => setEdit({ ...edit, kind: e.target.value })}>{KINDS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></Field>
            <Field label="Account name" hint="Optional. Leave empty if the QR code already shows it."><input value={edit.account_name} onChange={(e) => setEdit({ ...edit, account_name: e.target.value })} /></Field>
            <Field label="Account number" hint="Optional."><input value={edit.account_number} onChange={(e) => setEdit({ ...edit, account_number: e.target.value })} /></Field>
            <Field label="Instructions for the customer" wide hint="Shown after the order is placed."><textarea rows={3} value={edit.instructions} onChange={(e) => setEdit({ ...edit, instructions: e.target.value })} /></Field>
            <ImageField label="QR code (optional)" kind="catalog" value={edit.qr_image} onChange={(u) => setEdit({ ...edit, qr_image: u })} />
            <Field label="Display order"><input type="number" value={edit.sort} onChange={(e) => setEdit({ ...edit, sort: e.target.value })} /></Field>
            <div className="wide"><Switch checked={!!edit.enabled} onChange={(v) => setEdit({ ...edit, enabled: v ? 1 : 0 })}>Offer this at checkout</Switch></div>
          </div>
          <div className="actions" style={{ marginTop: "1rem" }}><button className="btn pink" onClick={save}>Save</button><button className="btn ghost" onClick={() => setEdit(null)}>Cancel</button></div>
        </div>
      )}
      {loading && !data ? <Loading /> : data && data.length === 0 ? <Empty>No payment methods yet. Customers cannot check out until you add one.</Empty> : data && (
        <div className="tablewrap"><table>
          <thead><tr><th>QR</th><th>Name</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{data.map((m) => (
            <tr key={m.id}>
              <td>{m.qr_image ? <SafeImg className="thumb" src={m.qr_image} tile="thumb" /> : <span className="thumb" />}</td>
              <td><b>{m.label}</b>{m.account_name && <><br /><span className="muted">{m.account_name}{m.account_number ? ` · ${m.account_number}` : ""}</span></>}</td>
              <td>{KINDS.find(([v]) => v === m.kind)?.[1] ?? m.kind}</td>
              <td><Badge value={m.enabled ? "published" : "draft"} /></td>
              <td><div className="actions">
                <button className="btn ghost sm" onClick={() => setEdit(m)}>Edit</button>
                <button className="btn ghost sm" onClick={() => toggle(m)}>{m.enabled ? "Turn off" : "Turn on"}</button>
                <ConfirmButton className="btn ghost sm" message={`Delete ${m.label}? Past orders keep their record. To pause it instead, use Turn off.`} onConfirm={() => remove(m)}>Delete</ConfirmButton>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </section>
  );
}

function DeliveryOptions() {
  const toast = useToast();
  const { data, error, loading, reload } = useLoad(() => api<any[]>("GET", "/delivery-options"), []);
  const settings = useLoad(() => api<Record<string, string>>("GET", "/settings"), []);
  const [edit, setEdit] = useState<any | null>(null);
  const [free, setFree] = useState("");
  useEffect(() => { if (settings.data) setFree(settings.data.free_delivery_min ?? ""); }, [settings.data]);
  const save = async () => {
    try {
      await api(edit.id ? "PUT" : "POST", edit.id ? `/delivery-options/${edit.id}` : "/delivery-options", edit);
      toast("ok", "Delivery option saved."); setEdit(null); reload();
    } catch (e) { toast("error", errorText(e)); }
  };
  const toggle = async (o: any) => {
    try { await api("PUT", `/delivery-options/${o.id}`, { ...o, enabled: o.enabled ? 0 : 1 }); reload(); } catch (e) { toast("error", errorText(e)); }
  };
  const remove = async (o: any) => {
    try { await api("DELETE", `/delivery-options/${o.id}`); toast("ok", "Delivery option deleted."); reload(); } catch (e) { toast("error", errorText(e)); }
  };
  return (
    <section className="card">
      <div className="cardhead">
        <h2>Delivery fees</h2>
        <button className="btn pink" onClick={() => setEdit(blankOption((data?.length ?? 0) + 1))}>Add delivery option</button>
      </div>
      <p className="muted">Add one option for each area or service you deliver to, for example Metro Manila or Outside Metro Manila. Customers pick one at checkout and the fee is added to their total. With no options, the delivery fee is confirmed on each order.</p>
      <ErrorNote text={error} />
      {edit && (
        <div className="subcard">
          <h3>{edit.id ? "Edit delivery option" : "New delivery option"}</h3>
          <div className="form">
            <Field label="Name shown to customers" hint="For example Metro Manila."><input value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} /></Field>
            <Field label="Delivery fee (PHP)" hint="Use 0 for free delivery."><input type="number" min={0} value={edit.fee} onChange={(e) => setEdit({ ...edit, fee: e.target.value })} /></Field>
            <Field label="Note" wide hint="Optional, shown under the name. For example how long delivery usually takes."><input value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} /></Field>
            <Field label="Display order"><input type="number" value={edit.sort} onChange={(e) => setEdit({ ...edit, sort: e.target.value })} /></Field>
            <div className="wide"><Switch checked={!!edit.enabled} onChange={(v) => setEdit({ ...edit, enabled: v ? 1 : 0 })}>Offer this at checkout</Switch></div>
          </div>
          <div className="actions" style={{ marginTop: "1rem" }}><button className="btn pink" onClick={save}>Save</button><button className="btn ghost" onClick={() => setEdit(null)}>Cancel</button></div>
        </div>
      )}
      {loading && !data ? <Loading /> : data && data.length === 0 ? <Empty>No delivery options yet. The delivery fee will be confirmed on each order.</Empty> : data && (
        <div className="tablewrap"><table>
          <thead><tr><th>Name</th><th className="num">Fee</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{data.map((o) => (
            <tr key={o.id}>
              <td><b>{o.label}</b>{o.note && <><br /><span className="muted">{o.note}</span></>}</td>
              <td className="num">{o.fee === 0 ? "Free" : peso(o.fee)}</td>
              <td><Badge value={o.enabled ? "published" : "draft"} /></td>
              <td><div className="actions">
                <button className="btn ghost sm" onClick={() => setEdit(o)}>Edit</button>
                <button className="btn ghost sm" onClick={() => toggle(o)}>{o.enabled ? "Turn off" : "Turn on"}</button>
                <ConfirmButton className="btn ghost sm" message={`Delete ${o.label}?`} onConfirm={() => remove(o)}>Delete</ConfirmButton>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      <div className="subcard">
        <h3>Free delivery</h3>
        <div className="form">
          <Field label="Free delivery on orders of (PHP)" hint="Optional. Orders at or above this subtotal pay no delivery fee. Leave empty to always charge the fee. Orders with unpriced items are not included."><input type="number" min={0} value={free} onChange={(e) => setFree(e.target.value)} /></Field>
        </div>
        <div className="actions" style={{ marginTop: "1rem" }}>
          <button className="btn pink" onClick={async () => { try { await api("PUT", "/settings", { free_delivery_min: free }); toast("ok", "Saved."); settings.reload(); } catch (e) { toast("error", errorText(e)); } }}>Save</button>
        </div>
      </div>
    </section>
  );
}

export default function PaymentsAndDelivery() {
  return (
    <>
      <PageHead title="Payments and delivery" />
      <PaymentMethods />
      <DeliveryOptions />
    </>
  );
}
