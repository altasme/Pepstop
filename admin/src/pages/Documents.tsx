import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, errorText, label, uploadFile, when } from "../api";
import { Badge, ConfirmButton, Empty, ErrorNote, Field, Loading, PageHead, Pager, RichText, useLoad, useToast } from "../ui";

const SECTIONS: [string, string][] = [
  ["overview", "Product overview"], ["general", "General product information"], ["specifications", "Technical specifications"],
  ["manufacturer", "Manufacturer information"], ["guidelines", "Client-provided product guidelines"], ["storage", "Storage information"], ["handling", "Handling information"],
  ["supporting", "Supporting documents"], ["notices", "Important notices"], ["notes", "Additional notes"],
];

export function CoaLibrary() {
  const toast = useToast();
  const [q, setQ] = useState(""); const [status, setStatus] = useState(""); const [page, setPage] = useState(1);
  const products = useLoad(() => api<{ rows: any[] }>("GET", "/products?per=100&status=&sort=name"), []);
  const { data, error, loading, reload } = useLoad(() => api<{ total: number; rows: any[] }>("GET", `/coa?${new URLSearchParams({ q, status, page: String(page), per: "20" })}`), [q, status, page]);
  const [edit, setEdit] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const save = async () => {
    setBusy(true);
    try {
      const f = file.current?.files?.[0];
      let up: { key: string; name: string; size: number } | null = null;
      if (f) up = await uploadFile("coa", f);
      await api(edit.id ? "PUT" : "POST", edit.id ? `/coa/${edit.id}` : "/coa", { ...edit, ...(up ? { file_key: up.key, file_name: up.name, size: up.size } : {}) });
      toast("ok", edit.id ? "COA updated." : "COA uploaded."); setEdit(null); reload();
    } catch (e) { toast("error", errorText(e)); }
    setBusy(false);
  };
  const setStatusOf = async (id: string, s: string, msg: string) => { try { await api("POST", `/coa/${id}/status`, { status: s }); toast("ok", msg); reload(); } catch (e) { toast("error", errorText(e)); } };

  return (
    <>
      <PageHead title="COA Library"><button className="btn pink" onClick={() => setEdit({ product_id: "", batch: "", title: "", doc_date: "", notes: "", status: "draft" })}>Upload COA</button></PageHead>
      <p className="note">A Certificate of Analysis is not proof of product approval, safety, efficacy, or authorization for sale. Verify that each document is authentic and applies to the listed product and batch before publishing. Documents are never labeled verified automatically.</p>
      {edit && (
        <section className="card" style={{ marginTop: "1rem" }}><h2>{edit.id ? "Edit COA" : "Upload COA"}</h2>
          <div className="form">
            <Field label="Product"><select value={edit.product_id} onChange={(e) => setEdit({ ...edit, product_id: e.target.value })}><option value="">Select a product</option>{products.data?.rows.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
            <Field label="Batch or lot number"><input value={edit.batch} onChange={(e) => setEdit({ ...edit, batch: e.target.value })} /></Field>
            <Field label="COA document title"><input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="Document date (if supplied)"><input type="date" value={edit.doc_date ?? ""} onChange={(e) => setEdit({ ...edit, doc_date: e.target.value })} /></Field>
            <Field label={edit.id ? "Replace PDF (optional)" : "PDF file"} hint="PDF only, up to 10 MB."><input ref={file} type="file" accept="application/pdf" /></Field>
            <Field label="Publication status"><select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field>
            <Field label="Additional notes" wide><textarea value={edit.notes ?? ""} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} /></Field>
          </div>
          <div className="actions" style={{ marginTop: "1rem" }}><button className="btn pink" disabled={busy} onClick={save}>{busy ? "Saving..." : "Save COA"}</button><button className="btn ghost" onClick={() => setEdit(null)}>Cancel</button></div>
        </section>
      )}
      <div className="filters" style={{ marginTop: "1rem" }}>
        <input aria-label="Search COAs" placeholder="Search product, batch or title" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">Draft and published</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
      </div>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.rows.length === 0 ? <Empty>No COA documents yet.</Empty> : data && (
        <>
          <div className="tablewrap"><table>
            <thead><tr><th>Document</th><th>Product</th><th>Batch or lot</th><th>Uploaded</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{data.rows.map((c) => (
              <tr key={c.id}><td><b>{c.title}</b><br /><span className="muted">{c.file_name}</span></td><td>{c.product_name}</td><td>{c.batch}</td><td>{when(c.uploaded_at)}</td><td><Badge value={c.status} /></td>
                <td><div className="actions">
                  <a className="btn ghost sm" href={`/api/admin/files/coa/${c.id}`} target="_blank" rel="noreferrer">Preview</a>
                  <a className="btn ghost sm" href={`/api/admin/files/coa/${c.id}`} download={c.file_name || "coa.pdf"}>Download</a>
                  <button className="btn ghost sm" onClick={() => setEdit(c)}>Edit or replace</button>
                  {c.status !== "published" && c.status !== "archived" && <button className="btn ghost sm" onClick={() => setStatusOf(c.id, "published", "COA published.")}>Publish</button>}
                  {c.status === "published" && <button className="btn ghost sm" onClick={() => setStatusOf(c.id, "draft", "COA unpublished.")}>Unpublish</button>}
                  {c.status === "archived" ? <button className="btn ghost sm" onClick={() => setStatusOf(c.id, "draft", "COA restored as a draft.")}>Restore</button>
                    : <ConfirmButton className="btn danger sm" message="Archive this COA? It will no longer appear publicly." onConfirm={() => setStatusOf(c.id, "archived", "COA archived.")}>Archive</ConfirmButton>}
                </div></td></tr>
            ))}</tbody>
          </table></div>
          <Pager page={page} per={20} total={data.total} onPage={setPage} />
        </>
      )}
    </>
  );
}

function Section({ productId, section, title, row, onChange }: { productId: string; section: string; title: string; row: any | undefined; onChange: () => void }) {
  const toast = useToast();
  const [html, setHtml] = useState<string>(row?.body_html ?? "");
  const [review, setReview] = useState<string>(row?.review_status ?? "not_reviewed");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try { await api(row ? "PUT" : "POST", row ? `/info/${row.id}` : "/info", { product_id: productId, section, body_html: html, review_status: review }); toast("ok", "Saved as draft."); onChange(); } catch (e) { toast("error", errorText(e)); }
    setBusy(false);
  };
  const setStatus = async (s: string) => { try { await api("POST", `/info/${row.id}/status`, { status: s }); toast("ok", s === "published" ? "Published." : label(s)); onChange(); } catch (e) { toast("error", errorText(e)); } };
  return (
    <section className="card"><h2>{title} {row && <Badge value={row.status} />}</h2>
      {section === "guidelines" && <p className="note">Client-supplied guidelines, including any dosing or health-related content, need appropriate regulatory and professional review before publication. They can be published only after being marked Reviewed.</p>}
      <RichText label={title} value={html} onChange={setHtml} />
      <div className="actions" style={{ marginTop: ".75rem" }}>
        <Field label="Review status"><select value={review} onChange={(e) => setReview(e.target.value)}><option value="not_reviewed">Not reviewed</option><option value="in_review">In review</option><option value="reviewed">Reviewed</option></select></Field>
        <button className="btn ghost" disabled={busy} onClick={save}>Save draft</button>
        {row && row.status !== "published" && <button className="btn pink" onClick={() => setStatus("published")}>Publish</button>}
        {row && row.status === "published" && <button className="btn ghost" onClick={() => setStatus("draft")}>Unpublish</button>}
        {row && row.status !== "archived" && <ConfirmButton className="btn danger" message="Archive this section?" onConfirm={() => setStatus("archived")}>Archive</ConfirmButton>}
      </div>
      {row && <p className="muted">Last updated {when(row.updated_at)}. Editing a published section returns it to draft until you publish again.</p>}
    </section>
  );
}

export function ProductInformation() {
  const [sp, setSp] = useSearchParams();
  const productId = sp.get("product") ?? "";
  const products = useLoad(() => api<{ rows: any[] }>("GET", "/products?per=100&sort=name"), []);
  const info = useLoad(() => (productId ? api<any[]>("GET", `/products/${productId}/info`) : Promise.resolve([])), [productId]);
  return (
    <>
      <PageHead title="Product Information" />
      <div className="filters">
        <select aria-label="Product" value={productId} onChange={(e) => setSp(e.target.value ? { product: e.target.value } : {})}>
          <option value="">Choose a product</option>{products.data?.rows.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {!productId ? <Empty>Choose a product to edit its information sections.</Empty> : info.loading && !info.data ? <Loading /> : (
        <>
          <ErrorNote text={info.error} />
          {SECTIONS.map(([key, title]) => <Section key={`${productId}-${key}-${info.data?.find((r) => r.section === key)?.updated_at ?? "new"}`} productId={productId} section={key} title={title} row={info.data?.find((r) => r.section === key)} onChange={info.reload} />)}
        </>
      )}
    </>
  );
}
