import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, errorText, label, peso, when } from "../api";
import { Badge, ConfirmButton, Empty, ErrorNote, Field, ImageField, Loading, PageHead, Pager, Switch, useLoad, useToast, useUnsavedWarning } from "../ui";

export function ProductsList() {
  const toast = useToast();
  const [q, setQ] = useState(""); const [category, setCategory] = useState(""); const [status, setStatus] = useState("");
  const [availability, setAvail] = useState(""); const [regulatory, setReg] = useState(""); const [sort, setSort] = useState("updated"); const [page, setPage] = useState(1);
  const cats = useLoad(() => api<any[]>("GET", "/categories"), []);
  const { data, error, loading, reload } = useLoad(() => {
    const p = new URLSearchParams({ q, category, status, availability, regulatory, sort, page: String(page), per: "20" });
    return api<{ total: number; rows: any[] }>("GET", `/products?${p}`);
  }, [q, category, status, availability, regulatory, sort, page]);
  const nav = useNavigate();
  const act = async (fn: () => Promise<unknown>, ok: string) => { try { await fn(); toast("ok", ok); reload(); } catch (e) { toast("error", errorText(e)); } };
  return (
    <>
      <PageHead title="Products"><Link className="btn pink" to="/products/new">Add Product</Link></PageHead>
      <div className="filters">
        <input aria-label="Search by product name" placeholder="Search by product name" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select aria-label="Category" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}><option value="">All categories</option>{cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select aria-label="Publication status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All except archived</option><option value="published">Published</option><option value="draft">Draft</option><option value="unpublished">Unpublished</option><option value="archived">Archived</option></select>
        <select aria-label="Regulatory review" value={regulatory} onChange={(e) => { setReg(e.target.value); setPage(1); }}><option value="">Any regulatory status</option><option value="verified">Verified for intended sale</option><option value="pending_review">Pending review</option><option value="not_cleared">Not cleared</option></select>
        <select aria-label="Availability" value={availability} onChange={(e) => { setAvail(e.target.value); setPage(1); }}><option value="">Any availability</option><option value="available">Available</option><option value="ask">Inquire</option><option value="unavailable">Unavailable</option></select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}><option value="updated">Latest update</option><option value="name">Name</option></select>
      </div>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.rows.length === 0 ? <Empty>No products match. Add your first product to get started.</Empty> : data && (
        <>
          <div className="tablewrap"><table>
            <thead><tr><th>Image</th><th>Product</th><th>Category</th><th className="num">Price</th><th className="num">Variants</th><th>Availability</th><th>Regulatory review</th><th>Status</th><th>Last updated</th><th>Actions</th></tr></thead>
            <tbody>{data.rows.map((p) => (
              <tr key={p.id}>
                <td>{p.main_image ? <img className="thumb" src={p.main_image} alt="" /> : <span className="thumb" />}</td>
                <td><Link to={`/products/${p.id}`}><b>{p.name}</b></Link></td>
                <td>{p.category ?? ""}</td>
                <td className="num">{peso(p.base_price)}</td>
                <td className="num">{p.variants}</td>
                <td><Badge value={p.availability} /></td>
                <td><Badge value={p.regulatory_status} /></td>
                <td><Badge value={p.status} /></td>
                <td>{when(p.updated_at)}</td>
                <td><div className="actions">
                  <button className="btn ghost sm" onClick={() => nav(`/products/${p.id}`)}>Edit</button>
                  {p.status === "published" && <a className="btn ghost sm" href={`/shop/${p.slug}`} target="_blank" rel="noreferrer">View</a>}
                  <button className="btn ghost sm" onClick={() => act(() => api("POST", `/products/${p.id}/duplicate`), "Product duplicated as a draft.")}>Duplicate</button>
                  {p.status === "archived"
                    ? <button className="btn ghost sm" onClick={() => act(() => api("POST", `/products/${p.id}/status`, { status: "draft" }), "Product restored as a draft.")}>Restore</button>
                    : <ConfirmButton className="btn danger sm" message={`Archive "${p.name}"? It will be removed from the public catalog.`} onConfirm={() => act(() => api("POST", `/products/${p.id}/status`, { status: "archived" }), "Product archived.")}>Archive</ConfirmButton>}
                </div></td>
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
  overview: "", specifications: "", composition: "", packaging: "", storage: "", notes: "", reg_type: "", reg_number: "", reg_holder: "",
  base_price: "" as string | number | null, regulatory_status: "pending_review", availability: "ask", show_price: false, inquire_price: true, status: "draft", variants: [] as any[], images: [] as string[] });

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
    setF({ ...blank(), ...p, base_price: p.base_price ?? "", category_id: p.category_id ?? "", show_price: !!p.show_price, inquire_price: !!p.inquire_price, images: p.images.map((i: any) => i.image) });
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
      <PageHead title={isNew ? "Add Product" : f.name || "Edit Product"} crumbs={["Products", isNew ? "Add" : "Edit"]}>
        <Link className="btn ghost" to="/products">Back to products</Link>
        <Badge value={f.status} />
      </PageHead>
      <ErrorNote text={error} />

      <section className="card"><h2>A. Basic information</h2>
        <div className="form">
          <Field label="Product name"><input value={f.name} onChange={(e) => { set("name", e.target.value); if (!slugEdited) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} /></Field>
          <Field label="Product slug" hint="The web address of the product page."><input value={f.slug} onChange={(e) => { setSlugEdited(true); set("slug", e.target.value); }} /></Field>
          <Field label="Category"><select value={f.category_id} onChange={(e) => set("category_id", e.target.value)}><option value="">Choose a category</option>{cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Display order" hint="Lower numbers appear first."><input type="number" value={f.sort} onChange={(e) => set("sort", e.target.value)} /></Field>
          <Field label="Short description" wide><input value={f.short_description} maxLength={400} onChange={(e) => set("short_description", e.target.value)} /></Field>
          <Field label="Full description" wide hint="Plain text. Only supply content verified by the client."><textarea value={f.full_description} onChange={(e) => set("full_description", e.target.value)} /></Field>
          <ImageField kind="catalog" label="Main product image (private, shown only to approved customers)" value={f.main_image} onChange={(u) => set("main_image", u)} />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <span className="lbl">Additional product images</span>
          <div className="imgrow" style={{ flexWrap: "wrap", marginTop: ".4rem" }}>
            {f.images.map((u: string, i: number) => <div key={u + i}><img src={u} alt="" /><button type="button" className="btn ghost sm" onClick={() => set("images", f.images.filter((_: string, j: number) => j !== i))}>Remove</button></div>)}
            <ImageField kind="catalog" label="" value={null} onChange={(u) => u && set("images", [...f.images, u])} />
          </div>
        </div>
      </section>

      <section className="card"><h2>B. Product information</h2>
        <p className="muted">Only information supplied and verified by the client should be published.</p>
        <div className="form">
          <Field label="Product overview" wide><textarea value={f.overview} onChange={(e) => set("overview", e.target.value)} /></Field>
          <Field label="Specifications" wide hint="One line per item."><textarea value={f.specifications} onChange={(e) => set("specifications", e.target.value)} /></Field>
          <Field label="Composition or listed contents" wide><textarea value={f.composition} onChange={(e) => set("composition", e.target.value)} /></Field>
          <Field label="Packaging information"><textarea value={f.packaging} onChange={(e) => set("packaging", e.target.value)} /></Field>
          <Field label="Storage information"><textarea value={f.storage} onChange={(e) => set("storage", e.target.value)} /></Field>
          <Field label="Additional product notes" wide><textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
          <Field label="Registration type (optional)"><input value={f.reg_type ?? ""} onChange={(e) => set("reg_type", e.target.value)} /></Field>
          <Field label="Registration number (optional)"><input value={f.reg_number ?? ""} onChange={(e) => set("reg_number", e.target.value)} /></Field>
          <Field label="Registration holder (optional)"><input value={f.reg_holder ?? ""} onChange={(e) => set("reg_holder", e.target.value)} /></Field>
        </div>
        {!isNew && <p><Link to={`/information?product=${id}`}>Edit rich-text information sections and guidelines for this product</Link></p>}
      </section>

      <section className="card"><h2>C. Pricing and availability</h2>
        <div className="form">
          <Field label="Base price (PHP)" hint="Used for variants that have no price of their own."><input type="number" min={0} value={f.base_price ?? ""} onChange={(e) => set("base_price", e.target.value)} /></Field>
          <Field label="Product availability"><select value={f.availability} onChange={(e) => set("availability", e.target.value)}><option value="available">Available</option><option value="ask">Inquire for availability</option><option value="unavailable">Currently unavailable</option></select></Field>
          <div><Switch checked={f.show_price} onChange={(v) => set("show_price", v)}>Display price on the website</Switch>
            <Switch checked={f.inquire_price} onChange={(v) => set("inquire_price", v)}>Inquire for pricing (hides the price)</Switch>
            <small className="muted">A price is shown only when display price is on and inquire for pricing is off.</small></div>
        </div>
      </section>

      <section className="card"><h2>Product variants</h2>
        <p className="muted">Each variant has its own price and availability. Variants do not share stock.</p>
        {f.variants.length === 0 && <Empty>No variants yet. Add one if this product comes in different strengths or sizes.</Empty>}
        {f.variants.map((v: any, i: number) => (
          <div className="variant" key={v.id ?? i}>
            <Field label="Variant name"><input value={v.name ?? ""} onChange={(e) => setVar(i, "name", e.target.value)} /></Field>
            <Field label="Strength or specification"><input value={v.strength ?? ""} onChange={(e) => setVar(i, "strength", e.target.value)} /></Field>
            <Field label="SKU or internal reference"><input value={v.sku ?? ""} onChange={(e) => setVar(i, "sku", e.target.value)} /></Field>
            <Field label="Price (PHP)"><input type="number" min={0} value={v.price ?? ""} onChange={(e) => setVar(i, "price", e.target.value)} /></Field>
            <Field label="Availability"><select value={v.availability ?? "available"} onChange={(e) => setVar(i, "availability", e.target.value)}><option value="available">Available</option><option value="ask">Inquire</option><option value="unavailable">Unavailable</option></select></Field>
            <Field label="Variant"><select value={v.status ?? "published"} onChange={(e) => setVar(i, "status", e.target.value)}><option value="published">Enabled</option><option value="draft">Disabled</option></select></Field>
            <div className="actions">
              <button type="button" className="btn ghost sm" aria-label="Move up" onClick={() => move(i, -1)}>Up</button>
              <button type="button" className="btn ghost sm" aria-label="Move down" onClick={() => move(i, 1)}>Down</button>
              <ConfirmButton className="btn danger sm" message="Remove this variant?" onConfirm={() => set("variants", f.variants.filter((_: any, j: number) => j !== i))}>Remove</ConfirmButton>
            </div>
          </div>
        ))}
        <p><button type="button" className="btn ghost" onClick={() => set("variants", [...f.variants, { name: "", strength: "", price: "", availability: "available", status: "published" }])}>Add variant</button></p>
      </section>

      <section className="card"><h2>Regulatory review</h2>
        <p className="muted">Only products verified as legally authorized for their intended sale and promotion in the Philippines may be published. Account approval for a customer never makes a product available. Moving a product out of Verified takes it off the catalog immediately.</p>
        <div className="form">
          <Field label="Regulatory review status"><select value={f.regulatory_status} onChange={(e) => set("regulatory_status", e.target.value)}>
            <option value="pending_review">Pending review</option><option value="verified">Verified for intended sale</option><option value="not_cleared">Not cleared</option></select></Field>
          <div><span className="lbl">Current</span><p><Badge value={f.regulatory_status} /></p></div>
        </div>
        {f.regulatory_status !== "verified" && <p className="note">This product cannot be published until it is marked Verified for intended sale.</p>}
      </section>

      <section className="card"><h2>D. Publication controls</h2>
        <p className="muted">Draft, unpublished and archived products are never visible to customers. Current status: <Badge value={f.status} /></p>
        <div className="actions">
          <button className="btn ghost" disabled={busy} onClick={() => save("draft")}>Save as Draft</button>
          <button className="btn pink" disabled={busy || f.regulatory_status !== "verified"} title={f.regulatory_status !== "verified" ? "Mark the product Verified for intended sale first" : ""} onClick={() => save("published")}>{f.status === "published" ? "Save and Keep Published" : "Publish Product"}</button>
          {f.status === "published" && <button className="btn ghost" disabled={busy} onClick={() => save("unpublished")}>Unpublish Product</button>}
          {!isNew && f.status !== "archived" && <ConfirmButton className="btn danger" message="Archive this product? It will be removed from the private catalog." onConfirm={() => save("archived")}>Archive Product</ConfirmButton>}
          {f.status === "archived" && <button className="btn ghost" disabled={busy} onClick={() => save("draft")}>Restore as Draft</button>}
          {dirty && <span className="muted">Unsaved changes</span>}
        </div>
        <p className="muted">{label(f.status)} products can be changed at any time. Products referenced by orders are never deleted, only archived.</p>
      </section>
    </>
  );
}
