import { useEffect, useState } from "react";
import { api, errorText, label, when } from "../api";
import { Badge, ConfirmButton, Empty, ErrorNote, Field, ImageField, Loading, PageHead, RichText, useLoad, useToast, useUnsavedWarning } from "../ui";

type FieldDef = { key: string; label: string; kind?: "text" | "area" | "image"; hint?: string };
const DOCS: Record<string, { title: string; fields: FieldDef[] }> = {
  home: { title: "Homepage", fields: [
    { key: "announcement", label: "Promotional content (announcement bar)" },
    { key: "heroTitle", label: "Hero heading" }, { key: "heroSupport", label: "Hero supporting text", kind: "area" },
    { key: "heroPrimaryLabel", label: "Primary call to action label" }, { key: "heroSecondaryLabel", label: "Secondary call to action label" },
    { key: "heroImage", label: "Hero image, desktop (12:5)", kind: "image" }, { key: "heroImageMobile", label: "Hero image, phone (6:5)", kind: "image" },
    { key: "featuredSlugs", label: "Featured products (product slugs, comma separated)", hint: "Leave empty to feature the first products." },
    { key: "storyHeading", label: "Brand introduction heading" }, { key: "storyBody", label: "Brand introduction (blank line between paragraphs)", kind: "area" },
  ] },
  about: { title: "About Us", fields: [
    { key: "intro", label: "Company introduction (blank line between paragraphs)", kind: "area" }, { key: "mission", label: "Mission", kind: "area" }, { key: "vision", label: "Vision", kind: "area" },
    { key: "values", label: "Brand values (one per line: Title | Description)", kind: "area" }, { key: "image", label: "Supporting image", kind: "image" },
  ] },
  contact: { title: "Contact information", fields: [
    { key: "email", label: "Email address" }, { key: "facebookUrl", label: "Facebook URL" }, { key: "hours", label: "Business information (hours)", kind: "area" },
  ] },
  footer: { title: "Footer", fields: [
    { key: "brandDescription", label: "Brand description", kind: "area" }, { key: "disclaimer", label: "Disclaimer text", kind: "area" },
    { key: "copyright", label: "Copyright text" }, { key: "facebook", label: "Facebook link" }, { key: "instagram", label: "Instagram link" },
  ] },
};

function DocEditor({ k, row, onChange }: { k: string; row: any | undefined; onChange: () => void }) {
  const toast = useToast();
  const def = DOCS[k];
  const draft = row?.draft ? JSON.parse(row.draft) : row?.published ? JSON.parse(row.published) : {};
  const [v, setV] = useState<Record<string, string>>(draft);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  useUnsavedWarning(dirty);
  useEffect(() => { setV(draft); setDirty(false); /* eslint-disable-next-line */ }, [row?.updated_at, k]);
  const set = (key: string, val: string) => { setV((x) => ({ ...x, [key]: val })); setDirty(true); };
  const run = async (fn: () => Promise<unknown>, ok: string) => { try { await fn(); toast("ok", ok); setDirty(false); onChange(); } catch (e) { toast("error", errorText(e)); } };
  const live = !!row?.published;
  const changed = live && row.draft !== row.published;
  return (
    <section className="card"><h2>{def.title} <Badge value={live ? (changed ? "draft" : "published") : "draft"} /></h2>
      <p className="muted">{live ? (changed ? "Changes are saved as a draft and are not public yet." : "The published version is live.") : "Nothing is published here yet, so the site uses its built-in text."} Empty fields keep the built-in text.{row && ` Last saved ${when(row.updated_at)}.`}</p>
      <div className="form">
        {def.fields.map((f) => f.kind === "image"
          ? <ImageField key={f.key} label={f.label} value={v[f.key] || null} onChange={(u) => set(f.key, u ?? "")} />
          : <Field key={f.key} label={f.label} hint={f.hint} wide={f.kind === "area"}>{f.kind === "area" ? <textarea value={v[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} /> : <input value={v[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />}</Field>)}
      </div>
      {preview && (
        <div className="prose-preview" style={{ marginTop: "1rem" }}><b>Draft preview</b>
          {def.fields.filter((f) => v[f.key]).length === 0 ? <p className="muted">Nothing entered.</p> : def.fields.filter((f) => v[f.key]).map((f) => (
            <p key={f.key}><span className="muted">{f.label}:</span><br />{f.kind === "image" ? <img src={v[f.key]} alt="" style={{ maxWidth: 240, borderRadius: 8 }} /> : <span style={{ whiteSpace: "pre-wrap" }}>{v[f.key]}</span>}</p>
          ))}
        </div>
      )}
      <div className="actions" style={{ marginTop: "1rem" }}>
        <button className="btn ghost" onClick={() => run(() => api("PUT", `/content/${k}`, { draft: v }), "Draft saved.")}>Save Draft</button>
        <button className="btn ghost" onClick={() => setPreview(!preview)}>{preview ? "Hide Preview" : "Preview"}</button>
        <button className="btn pink" onClick={() => run(async () => { await api("PUT", `/content/${k}`, { draft: v }); await api("POST", `/content/${k}/publish`); }, "Published. Changes appear on the website within a minute.")}>Publish</button>
        {live && <ConfirmButton className="btn danger" message="Unpublish this section? The website will go back to its built-in text." onConfirm={() => run(() => api("POST", `/content/${k}/unpublish`), "Unpublished.")}>Unpublish</ConfirmButton>}
      </div>
    </section>
  );
}

function Journal() {
  const toast = useToast();
  const { data, error, loading, reload } = useLoad(() => api<any[]>("GET", "/articles"), []);
  const [a, setA] = useState<any | null>(null);
  const [dirty, setDirty] = useState(false);
  useUnsavedWarning(dirty);
  const save = async (status?: string) => {
    try {
      const r = await api<{ id: string }>(a.id ? "PUT" : "POST", a.id ? `/articles/${a.id}` : "/articles", { ...a, status: status ?? a.status });
      toast("ok", status === "published" ? "Article published." : "Article saved."); setA(null); setDirty(false); reload(); return r;
    } catch (e) { toast("error", errorText(e)); }
  };
  const set = (k: string, v: unknown) => { setA((x: any) => ({ ...x, [k]: v })); setDirty(true); };
  if (a) return (
    <section className="card"><h2>{a.id ? "Edit article" : "New article"}</h2>
      <div className="form">
        <Field label="Article title"><input value={a.title} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="Article slug"><input value={a.slug ?? ""} onChange={(e) => set("slug", e.target.value)} /></Field>
        <Field label="Publication date"><input type="date" value={(a.published_at ?? "").slice(0, 10)} onChange={(e) => set("published_at", e.target.value)} /></Field>
        <Field label="Summary" wide><input value={a.summary ?? ""} onChange={(e) => set("summary", e.target.value)} /></Field>
        <ImageField label="Article thumbnail" value={a.thumbnail} onChange={(u) => set("thumbnail", u)} />
      </div>
      <div style={{ marginTop: "1rem" }}><RichText label="Article content" value={a.content_html ?? ""} onChange={(h) => set("content_html", h)} /></div>
      <div className="actions" style={{ marginTop: "1rem" }}>
        <button className="btn ghost" onClick={() => save("draft")}>Save Draft</button>
        <button className="btn pink" onClick={() => save("published")}>Publish</button>
        <button className="btn ghost" onClick={() => { setA(null); setDirty(false); }}>Cancel</button>
      </div>
    </section>
  );
  return (
    <>
      <p><button className="btn pink" onClick={() => setA({ title: "", slug: "", summary: "", thumbnail: null, content_html: "", status: "draft", published_at: "" })}>New article</button></p>
      <ErrorNote text={error} />
      {loading && !data ? <Loading /> : data && data.length === 0 ? <Empty>No articles yet. The Wellness Journal shows its "coming soon" message until one is published.</Empty> : data && (
        <div className="tablewrap"><table><thead><tr><th>Title</th><th>Published</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{data.map((x) => (
            <tr key={x.id}><td><b>{x.title}</b><br /><span className="muted">/{x.slug}</span></td><td>{x.published_at ? when(x.published_at) : ""}</td><td><Badge value={x.status} /></td>
              <td><div className="actions"><button className="btn ghost sm" onClick={() => api<any>("GET", `/articles/${x.id}`).then(setA)}>Edit</button>
                {x.status !== "published" ? <button className="btn ghost sm" onClick={() => api("POST", `/articles/${x.id}/status`, { status: "published" }).then(() => { toast("ok", "Article published."); reload(); })}>Publish</button>
                  : <button className="btn ghost sm" onClick={() => api("POST", `/articles/${x.id}/status`, { status: "draft" }).then(() => { toast("ok", "Article unpublished."); reload(); })}>Unpublish</button>}
                {x.status !== "archived" && <ConfirmButton className="btn danger sm" message="Archive this article?" onConfirm={() => api("POST", `/articles/${x.id}/status`, { status: "archived" }).then(() => { toast("ok", "Article archived."); reload(); })}>Archive</ConfirmButton>}</div></td></tr>
          ))}</tbody></table></div>
      )}
    </>
  );
}

export function WebsiteContent() {
  const [tab, setTab] = useState("home");
  const { data, error, loading, reload } = useLoad(() => api<any[]>("GET", "/content"), []);
  const tabs = [...Object.keys(DOCS), "journal"];
  return (
    <>
      <PageHead title="Website Content" />
      <div className="tabs" role="tablist">{tabs.map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t === "journal" ? "Wellness Journal" : DOCS[t].title}</button>)}</div>
      <ErrorNote text={error} />
      {tab === "journal" ? <Journal /> : loading && !data ? <Loading /> : <DocEditor key={tab} k={tab} row={data?.find((r) => r.key === tab)} onChange={reload} />}
      <p className="muted">{label("changes")} to published sections appear on the public site within about a minute.</p>
    </>
  );
}
