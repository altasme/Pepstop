import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SHOP, UI } from "../content/site";
import { useRemote } from "../lib/remote";
import { getCategories, getProducts } from "../content/getContent";
import { Seo } from "../lib/seo";
import { PageBanner } from "../components/sections/PageBanner";
import { ContactBlock } from "../components/sections/ContactBlock";
import { ProductCard } from "../components/ui/ProductCard";
import { Button } from "../components/ui/Button";
import { Disclaimer } from "../components/ui/Disclaimer";

type Sort = keyof typeof SHOP.sorts;
const minPrice = (p: ReturnType<typeof getProducts>[number]) => Math.min(...p.variants.map((v) => v.pricePhp ?? Infinity));

export default function Shop() {
  const remote = useRemote();
  const all = getProducts();
  const categories = getCategories();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [params] = useSearchParams();
  useEffect(() => {
    const c = params.get("cat");
    if (c && categories.some((x) => x.id === c)) setCat(c);
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = all.filter((p) => (cat === "all" || p.categoryId === cat) && (!term || p.name.toLowerCase().includes(term)));
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "priceLow") list.sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "priceHigh") list.sort((a, b) => minPrice(b) - minPrice(a));
    return list;
  }, [all, cat, q, sort]);

  const chip = (active: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${active ? "border-raspberry bg-raspberry text-white" : "border-line text-ink hover:border-raspberry"}`;
  const field = "min-h-12 w-full rounded-full border border-edge bg-white px-5 text-base text-ink placeholder:text-mute";

  return (
    <>
      <Seo path="/shop" />
      <PageBanner title={SHOP.bannerTitle} body={SHOP.bannerBody} />
      <section className="mx-auto max-w-page px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        {remote.status === "loading" ? (
          <div aria-busy="true" className="mx-auto max-w-prose p-10 text-center text-mute">{UI.loading}</div>
        ) : all.length === 0 ? (
          <div className="mx-auto max-w-prose bg-petal p-10 text-center">
            <p className="font-sans text-h3 font-semibold text-ink">{SHOP.emptyStore}</p>
            <p className="mt-2 text-ink">{SHOP.emptyStoreHint}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-[1fr_14rem] md:items-end">
              <div>
                <label htmlFor="shop-search" className="mb-1.5 block text-sm font-semibold text-ink">{SHOP.searchLabel}</label>
                <input id="shop-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={SHOP.searchPlaceholder} className={field} />
              </div>
              <div>
                <label htmlFor="shop-sort" className="mb-1.5 block text-sm font-semibold text-ink">{SHOP.sortLabel}</label>
                <select id="shop-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={field}>
                  {(Object.keys(SHOP.sorts) as Sort[]).map((k) => <option key={k} value={k}>{SHOP.sorts[k]}</option>)}
                </select>
              </div>
            </div>
            <div role="group" aria-label={SHOP.categoryLabel} className="hide-scroll -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              <button type="button" aria-pressed={cat === "all"} className={chip(cat === "all")} onClick={() => setCat("all")}>{SHOP.allCategories}</button>
              {categories.map((c) => (
                <button key={c.id} type="button" aria-pressed={cat === c.id} className={chip(cat === c.id)} onClick={() => setCat(c.id)}>{c.name}</button>
              ))}
            </div>
            <p className="mt-6 text-sm text-mute" role="status" aria-live="polite">{SHOP.results(shown.length)}</p>
            {shown.length === 0 ? (
              <div className="mt-6 bg-petal p-8 text-center">
                <p className="text-ink">{SHOP.empty}</p>
                <div className="mt-4"><Button variant="secondary" onClick={() => { setQ(""); setCat("all"); }}>{SHOP.clear}</Button></div>
              </div>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6">
                {shown.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
              </ul>
            )}
          </>
        )}
        <Disclaimer text={SHOP.productDisclaimer} className="mt-12" />
      </section>
      <ContactBlock />
    </>
  );
}
