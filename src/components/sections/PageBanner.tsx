/**
 * Page masthead for every inner page: a large display title set against its lead on a shared baseline, closed by a
 * fine gold rule. Type does the work; there is no ornament above the heading and nothing decorative to scale or drift.
 * The title and lead rise in once, from CSS alone, so they play before hydration.
 */
export function PageBanner({ title, body }: { title: string; body?: string }) {
  return (
    <section className="bg-petal pb-5 sm:pb-7">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-b border-gold/70 pb-10 pt-12 sm:pb-12 sm:pt-16 lg:grid-cols-12 lg:items-end lg:gap-14 lg:pb-14 lg:pt-24">
          <h1
            className="hero-in font-display text-[clamp(2.5rem,1.2rem+4vw,4.25rem)] font-medium leading-[1.03] tracking-[-0.022em] text-claret lg:col-span-7"
            style={{ textWrap: "balance" }}
          >
            {title}
          </h1>
          {body && (
            <p className="hero-in max-w-[40ch] text-lg leading-relaxed text-ink/75 sm:text-xl lg:col-span-5 lg:pb-2" style={{ ["--d" as string]: "0.2s" }}>
              {body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
