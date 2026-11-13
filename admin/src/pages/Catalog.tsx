import { useState } from "react";
import { Link } from "react-router-dom";
import { api, errorText, peso } from "../api";
import { SafeImg, Badge, Empty, ErrorNote, Field, ImageField, Loading, PageHead, useLoad, useToast } from "../ui";

export function Categories() {
  const toast = useToast();
  const { data, error, loading, reload } = useLoad(() => api<any[]>("GET", "/categories"), []);
  const [edit, setEdit] = useState<any | null>(null);
  const save = async () => {
    try {
      await api(edit.id ? "PUT" : "POST", edit.id ? `/categories/${edit.id}` : "/categories", edit);
      toast("ok", "Category saved."); setEdit(null); reload();
    } catch (e) { toast("error", errorText(e)); }
  };
  return (
    <>
      <PageHead title="Categories"><button className="btn pink" onClick={() => setEdit({ name: "", slug: "", description: "", image: null, sort: (data?.length ?? 0) + 1, status: "published" })}>Add Category</button></PageHead>
      <ErrorNote text={error} />
      {edit && (
        <section className="card"><h2>{edit.id ? "Edit category" : "New category"}</h2>
          <div className="form">
            <Field label="Category name"><input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Slug"><input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} disabled={!!edit.id} /></Field>
            <Field label="Display order"><input type="number" value={edit.sort} onChange={(e) => setEdit({ ...edit, sort: e.target.value })} /></Field>
            <Field label="Publication status"><select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}><option value="published">Published</option><option value="draft">Unpublished</option></select></Field>
            <Field label="Category description" wide><textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <ImageField label="Category image" value={edit.image} onChange={(u) => setEdit({ ...edit, image: u })} />
          </div>
          <div className="actions" style={{ marginTop: "1rem" }}><button className="btn pink" onClick={save}>Save category</button><button className="btn ghost" onClick={() => setEdit(null)}>Cancel</button></div>
        </section>
      )}
      {loading && !data ? <Loading /> : data && data.length === 0 ? <Empty>No categories yet.</Empty> : data && (
        <div className="tablewrap"><table>
          <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th className="num">Order</th><th className="num">Products</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{data.map((c) => (
            <tr key={c.id}>
              <td>{c.image ? <SafeImg className="thumb" src={c.image} tile="thumb" /> : <span className="thumb" />}</td>
              <td><b>{c.name}</b><br /><span className="muted">{c.description}</span></td><td>{c.slug}</td><td className="num">{c.sort}</td><td className="num">{c.products}</td>
              <td><Badge value={c.status === "draft" ? "draft" : "published"} /></td>
              <td><button className="btn ghost sm" onClick={() => setEdit(c)}>Edit</button></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </>
  );
}

export function Variants() {
  const { data, error, loading } = useLoad(() => api<any[]>("GET", "/variants"), []);
  return (
    <>
      <PageHead title="Product Variants" />
      <p className="muted">All variants across products. Add, edit, remove and reorder variants inside each product.</p>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.length === 0 ? <Empty>No variants yet.</Empty> : data && (
        <div className="tablewrap"><table>
          <thead><tr><th>Product</th><th>Variant</th><th>Strength</th><th className="num">Price</th><th>Availability</th><th>Status</th><th>Edit</th></tr></thead>
          <tbody>{data.map((v) => (
            <tr key={v.id}><td>{v.product_name}</td><td>{v.name}</td><td>{v.strength}</td><td className="num">{peso(v.price)}</td><td><Badge value={v.availability} /></td><td><Badge value={v.status} /></td><td><Link to={`/products/${v.product_id}`}>Open product</Link></td></tr>
          ))}</tbody>
        </table></div>
      )}
    </>
  );
}
