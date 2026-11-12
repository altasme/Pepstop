import { useEffect, useState } from "react";
import { COA } from "../content/site";
import { Seo } from "../lib/seo";
import type { Coa } from "../lib/remote";
import { PageBanner } from "../components/sections/PageBanner";
import { ContactBlock } from "../components/sections/ContactBlock";
import { Disclaimer } from "../components/ui/Disclaimer";

/** Public directory of published certificates of analysis. Documents are never labeled verified. */
export default function CoaDirectory() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Coa[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/public/coa?q=${encodeURIComponent(q.trim())}`).then((r) => r.json()).then((d) => { setRows(d.rows); setFailed(false); }).catch(() => setFailed(true));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <>
      <Seo path="/coa" />
      <PageBanner title={COA.title} body={COA.body} />
      <section className="mx-auto max-w-page px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <label htmlFor="coa-search" className="mb-1.5 block text-sm font-semibold text-ink">{COA.searchLabel}</label>
        <input id="coa-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={COA.searchPlaceholder} className="min-h-12 w-full max-w-xl rounded-full border border-edge bg-white px-5 text-base text-ink placeholder:text-mute" />
        <p className="mt-5 text-sm text-mute" role="status" aria-live="polite">{rows ? COA.results(rows.length) : ""}</p>
        {rows && rows.length === 0 && <p className="mt-4 bg-petal p-6 text-ink">{q.trim() ? COA.empty : COA.emptyAll}</p>}
        {failed && <p className="mt-4 text-ink">Documents could not be loaded. Please try again.</p>}
        {rows && rows.length > 0 && (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {rows.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-semibold text-ink">{r.title}</p>
                  <p className="text-sm text-ink/80">{COA.product}: {r.product_name} · {COA.batch}: {r.batch}</p>
                </div>
                <a href={`/files/coa/${r.id}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-semibold text-raspberry underline">{COA.open}</a>
              </li>
            ))}
          </ul>
        )}
        <Disclaimer text={COA.note} className="mt-10" />
      </section>
      <ContactBlock />
    </>
  );
}
