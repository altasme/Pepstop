import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, errorText, peso, when } from "../api";
import { Badge, ConfirmButton, Empty, ErrorNote, Field, ImageField, Loading, PageHead, Pager, RowMenu, SafeImg, useLoad, useToast, useUnsavedWarning } from "../ui";

export function ProductsList() {
  const toast = useToast();
  const [sp] = useSearchParams();
  const [q, setQ] = useState(""); const [category, setCategory] = useState(""); const [status, setStatus] = useState(sp.get("status") ?? "");
  const [availability, setAvail] = useState(""); const [sort, setSort] = useState("updated"); const [page, setPage] = useState(1);
  const cats = useLoad(() => api<any[]>("GET", "/categories"), []);
  const { data, error, loading, reload } = useLoad(() => {
    const p = new URLSearchParams({ q, category, status, availability, sort, page: String(page), per: "20" });
    return api<{ total: number; rows: any[] }>("GET", `/products?${p}`);
  }, [q, category, status, availability, sort, page]);
  const act = async (fn: () => Promise<unknown>, ok: string) => { try { await fn(); toast("ok", ok); reload(); } catch (e) { toast("error", errorText(e)); } };
  return (
    <>
      <PageHead title="Products"><Link className="btn ghost" to="/variants">All variants</Link><Link className="btn" to="/products/new">Add product</Link></PageHead>
      <div className="filters">
        <input aria-label="Search by product name" placeholder="Search by product name" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select aria-label="Category" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}><option value="">All categories</option>{cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select aria-label="Publication status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All except archived</option><option value="published">Published</option><option value="draft">Draft</option><option value="unpublished">Unpublished</option><option value="archived">Archived</option></select>
        <select aria-label="Availability" value={availability} onChange={(e) => { setAvail(e.target.value); setPage(1); }}><option value="">Any availability</option><option value="available">Available</option><option value="ask">Inquire</option><option value="unavailable">Unavailable</option></select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}><option value="updated">Latest update</option><option value="name">Name</option></select>
      </div>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.rows.length === 0 ? <Empty>No products match. Add your first product to get started.</Empty> : data && (
        <>
          <div className="tablewrap"><table>
            <thead><tr><th>Image</th><th>Product</th><th>Category</th><th className="num">Price</th><th className="num">Variants</th><th>Availability</th><th>Status</th><th>Last updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{data.rows.map((p) => (
              <tr key={p.id}>
                <td>{p.main_image ? <SafeImg className="thumb" src={p.main_image} tile="thumb" /> : <span className="thumb" />}</td>
                <td><Link to={`/products/${p.id}`}><b>{p.name}</b></Link></td>
                <td>{p.category ?? ""}</td>
                <td className="num">{peso(p.base_price)}</td>
                <td className="num">{p.variants}</td>
                <td><Badge value={p.availability} /></td>
                <td><Badge value={p.status} /></td>
                <td>{when(p.updated_at)}</td>
                <td className="rowact">
                  <RowMenu label={`More actions for ${p.name}`}>
                    <Link to={`/products/${p.id}`}>Edit</Link>
                    {p.status === "published" && <a href={`/shop/${p.slug}`} target="_blank" rel="noreferrer">View on website</a>}
                    <button onClick={() => act(() => api("POST", `/products/${p.id}/duplicate`), "Product duplicated as a draft.")}>Duplicate</button>
                    {p.status === "archived"
                      ? <button onClick={() => act(() => api("POST", `/products/${p.id}/status`, { status: "draft" }), "Product restored as a draft.")}>Restore</button>
                      : <button className="danger" onClick={() => { if (window.confirm(`Archive "${p.name}"? It will be removed from the private catalog.`)) act(() => api("POST", `/products/${p.id}/status`, { status: "archived" }), "Product archived."); }}>Archive</button>}
                  </RowMenu>
                </td>
              </tr>
            ))}</tbody>
          </table></div>
          <Pager page={page} per={20} total={data.total} onPage={setPage} />
        </>
      )}
    </>
  );
}

const blank = () => ({ name: "", slug: "", short_description: "", full_description: "", category_id: "", main_image: null as string | null, sort: 0,
  overview: "", protocol_image: null as string | null, composition: "", packaging: "", storage: "", notes: "", reg_type: "", reg_number: "", reg_holder: "",
  base_price: "" as string | number | null, availability: "ask", show_price: false, inquire_price: true, status: "draft", variants: [] as any[], images: [] as string[] });

export function ProductForm() {
  const { id = "new" } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const toast = useToast();
  const cats = useLoad(() => api<any[]>("GET", "/categories"), []);
  const [f, setF] = useState<any>(blank());
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const { loading, error } = useLoad(async () => {
    if (isNew) { setF(blank()); return null; }
    const p = await api<any>("GET", `/products/${id}`);
    setF({ ...blank(), ...p, base_price: p.base_price ?? "", category_id: p.category_id ?? "", show_price: !!p.show_price && !p.inquire_price, inquire_price: !(!!p.show_price && !p.inquire_price), images: p.images.map((i: any) => i.image) });
    setSlugEdited(true); setDirty(false);
    return p;
  }, [id]);
  useUnsavedWarning(dirty);
  useEffect(() => { document.title = isNew ? "New product | The Pep Stop Admin" : "Edit product | The Pep Stop Admin"; }, [isNew]);
  const set = (k: string, v: unknown) => { setF((x: any) => ({ ...x, [k]: v })); setDirty(true); };
  const setVar = (i: number, k: string, v: unknown) => set("variants", f.variants.map((x: any, j: number) => (j === i ? { ...x, [k]: v } : x)));
  const move = (i: number, d: number) => { const a = [...f.variants]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set("variants", a); };

  const save = async (status?: string) => {
    if (!f.name.trim()) { toast("error", "Please enter a product name."); return; }
    setBusy(true);
    try {
      const body = { ...f, status: status ?? f.status, base_price: f.base_price === "" ? null : f.base_price };
      const r = await api<{ id: string }>(isNew ? "POST" : "PUT", isNew ? "/products" : `/products/${id}`, body);
      toast("ok", status === "published" ? "Product published." : status === "unpublished" ? "Product unpublished." : status === "draft" ? "Saved as draft." : "Product saved.");
      setDirty(false);
      if (isNew) nav(`/products/${r.id}`, { replace: true });
      else setF((x: any) => ({ ...x, status: body.status }));
    } catch (e) { toast("error", errorText(e)); }
    setBusy(false);
  };

  if (loading && !isNew) return <Loading />;
  return (
    <>
      <PageHead title={isNew ? "Add product" : f.name || "Edit product"} crumbs={["Products", isNew ? "Add" : "Edit"]}>
        <Link className="btn ghost" to="/products">Back to products</Link>
      </PageHead>
      <ErrorNote text={error} />

      <div className="split">
        <div className="split-main">
          <section className="card"><h2>Basics</h2>
            <div className="form">
              <Field label="Product name"><input value={f.name} onChange={(e) => { set("name", e.target.value); if (!slugEdited) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} /></Field>
              <Field label="Category"><select value={f.category_id} onChange={(e) => set("category_id", e.target.value)}><option value="">Choose a category</option>{cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
              <Field label="Short description" wide><input value={f.short_description} maxLength={400} onChange={(e) => set("short_description", e.target.value)} /></Field>
              <Field label="Full description" wide hint="Plain text."><textarea value={f.full_description} onChange={(e) => set("full_description", e.target.value)} /></Field>
            </div>
          </section>

          <section className="card"><h2>Photos</h2>
            <p className="muted">Private: shown only to approved customers.</p>
            <ImageField kind="catalog" label="Main photo" value={f.main_image} onChange={(u) => set("main_image", u)} />
            <div style={{ marginTop: "1rem" }}>
              <span className="lbl">More photos</span>
              <div className="imgrow" style={{ flexWrap: "wrap", marginTop: ".4rem" }}>
                {f.images.map((u: string, i: number) => <div key={u + i}><SafeImg src={u} tile="noimg" /><button type="button" className="btn ghost sm" onClick={() => set("images", f.images.filter((_: string, j: number) => j !== i))}>Remove</button></div>)}
                <ImageField kind="catalog" label="" value={null} onChange={(u) => u && set("images", [...f.images, u])} />
              </div>
            </div>
          </section>

          <section className="card"><h2>Price and availability</h2>
            <div className="form">
              <Field label="Base price (PHP)" hint="Used for variants without a price of their own."><input type="number" min={0} value={f.base_price ?? ""} onChange={(e) => set("base_price", e.target.value)} /></Field>
              <Field label="Availability"><select value={f.availability} onChange={(e) => set("availability", e.target.value)}><option value="available">Available</option><option value="ask">Inquire for availability</option><option value="unavailable">Currently unavailable</option></select></Field>
              <fieldset className="wide choice"><legend>Price shown to customers</legend>
                <label className="check"><input type="radio" name="price_mode" checked={!!f.show_price} onChange={() => setF((x: any) => ({ ...x, show_price: true, inquire_price: false }))} /> Show the price to customers</label>
                <label className="check"><input type="radio" name="price_mode" checked={!f.show_price} onChange={() => setF((x: any) => ({ ...x, show_price: false, inquire_price: true }))} /> Ask customers to inquire for the price instead</label>
              </fieldset>
            </div>
          </section>

          <section className="card"><h2>Variants</h2>
            <p className="muted">Each variant has its own price and availability. Variants do not share stock.</p>
            {f.variants.length === 0 && <p className="muted">No variants yet. Add one if this product comes in different strengths or sizes.</p>}
            {f.variants.map((v: any, i: number) => (
              <div className="variant" key={v.id ?? i}>
                <Field label="Name"><input value={v.name ?? ""} onChange={(e) => setVar(i, "name", e.target.value)} /></Field>
                <Field label="Strength or size"><input value={v.strength ?? ""} onChange={(e) => setVar(i, "strength", e.target.value)} /></Field>
                <Field label="SKU"><input value={v.sku ?? ""} onChange={(e) => setVar(i, "sku", e.target.value)} /></Field>
                <Field label="Price (PHP)"><input type="number" min={0} value={v.price ?? ""} onChange={(e) => setVar(i, "price", e.target.value)} /></Field>
                <Field label="Availability"><select value={v.availability ?? "available"} onChange={(e) => setVar(i, "availability", e.target.value)}><option value="available">Available</option><option value="ask">Inquire</option><option value="unavailable">Unavailable</option></select></Field>
                <Field label="Shown to customers"><select value={v.status ?? "published"} onChange={(e) => setVar(i, "status", e.target.value)}><option value="published">Yes</option><option value="draft">No</option></select></Field>
                <div className="actions">
                  <button type="button" className="btn ghost sm" aria-label="Move up" onClick={() => move(i, -1)}>Up</button>
                  <button type="button" className="btn ghost sm" aria-label="Move down" onClick={() => move(i, 1)}>Down</button>
                  <ConfirmButton className="btn danger sm" message="Remove this variant?" onConfirm={() => set("variants", f.variants.filter((_: any, j: number) => j !== i))}>Remove</ConfirmButton>
                </div>
              </div>
            ))}
            <p><button type="button" className="btn ghost" onClick={() => set("variants", [...f.variants, { name: "", strength: "", price: "", availability: "available", status: "published" }])}>Add a variant</button></p>
          </section>

          <section className="card"><h2>Product details</h2>
            <p className="muted">Fill in only what applies. Empty sections are hidden from customers.</p>
            <div className="form">
              <Field label="Overview" wide><textarea value={f.overview} onChange={(e) => set("overview", e.target.value)} /></Field>
              <div className="wide"><ImageField label="Protocol" kind="catalog" value={f.protocol_image ?? null} onChange={(u) => set("protocol_image", u)} /><small className="muted">Upload the protocol as an image. Approved customers see it on the product page.</small></div>
              <Field label="Packaging"><textarea value={f.packaging} onChange={(e) => set("packaging", e.target.value)} /></Field>
              <Field label="Storage"><textarea value={f.storage} onChange={(e) => set("storage", e.target.value)} /></Field>
            </div>
            <details className="more"><summary>More details (optional)</summary>
              <div className="form">
                <Field label="Listed contents" wide><textarea value={f.composition} onChange={(e) => set("composition", e.target.value)} /></Field>
                <Field label="Additional notes" wide><textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
                <Field label="Registration type"><input value={f.reg_type ?? ""} onChange={(e) => set("reg_type", e.target.value)} /></Field>
                <Field label="Registration number"><input value={f.reg_number ?? ""} onChange={(e) => set("reg_number", e.target.value)} /></Field>
                <Field label="Registration holder"><input value={f.reg_holder ?? ""} onChange={(e) => set("reg_holder", e.target.value)} /></Field>
                <Field label="Web address (slug)" hint="Made from the name. Change only if you need to."><input value={f.slug} onChange={(e) => { setSlugEdited(true); set("slug", e.target.value); }} /></Field>
                <Field label="Display order" hint="Lower numbers appear first."><input type="number" value={f.sort} onChange={(e) => set("sort", e.target.value)} /></Field>
              </div>
            </details>
            {!isNew && <p><Link to={`/information?product=${id}`}>Edit the rich-text information sections and guidelines for this product</Link></p>}
          </section>
        </div>

        <aside className="rail" aria-label="Publishing">
          <section className="card">
            <h2>Publishing</h2>
            <p className="railrow"><span className="muted">Status</span><Badge value={f.status} /></p>
            <div className="stackbtns">
              <button className="btn" disabled={busy} onClick={() => save()}>{dirty ? "Save changes" : "Save"}</button>
              {f.status !== "published" && <button className="btn ghost" disabled={busy} onClick={() => save("published")}>Publish</button>}
              {f.status === "published" && <button className="btn ghost" disabled={busy} onClick={() => save("unpublished")}>Unpublish</button>}
              {f.status === "archived" && <button className="btn ghost" disabled={busy} onClick={() => save("draft")}>Restore as draft</button>}
              {!isNew && f.status !== "archived" && <ConfirmButton className="btn danger" message="Archive this product? It will be removed from the private catalog." onConfirm={() => save("archived")}>Archive</ConfirmButton>}
            </div>
            {dirty && <p className="muted small" role="status">You have unsaved changes.</p>}
            <p className="muted small">Products used by orders are never deleted, only archived. Draft, unpublished and archived products are never shown to customers.</p>
          </section>
        </aside>
      </div>
    </>
  );
}
