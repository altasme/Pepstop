import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { HERO_INTERVAL_MS, HERO_SLIDES, HOME, IMAGE_SLOTS } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { Button } from "../ui/Button";
import { Sparkle } from "../ui/Sparkle";
import { SparkleField } from "../ui/SparkleField";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Headline set word by word, each rising out of its own mask. The words stay one readable sentence.
 * Text between asterisks is set in the display italic, the one expressive move in the headline. Without
 * asterisks (for example a title edited in the admin) everything after the first comma is italic.
 */
function Headline({ text, start = 0.15, step = 0.1 }: { text: string; start?: number; step?: number }) {
  const cut = text.indexOf(",");
  const segments: { t: string; italic: boolean }[] = text.includes("*")
    ? text.split("*").map((t, i) => ({ t, italic: i % 2 === 1 }))
    : cut === -1 ? [{ t: text, italic: false }] : [{ t: text.slice(0, cut + 1), italic: false }, { t: text.slice(cut + 1), italic: true }];
  const words = segments.flatMap((seg) => seg.t.split(" ").filter(Boolean).map((w) => ({ w, italic: seg.italic })));
  return (
    <>
      {words.map((x, i) => (
        <span key={i} className={x.italic ? "italic" : undefined}>
          <span className="word"><span style={d(start + i * step)}>{x.w}</span></span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

type Slide = { desktop: string; mobile: string; alt: string; mobilePosition: string };
const slides = (): Slide[] => [
  { desktop: IMAGE_SLOTS.hero.src ?? "", mobile: IMAGE_SLOTS.heroMobile.src ?? "", alt: IMAGE_SLOTS.hero.alt, mobilePosition: "50% 36%" },
  ...HERO_SLIDES,
];

/** One layer of the slideshow. Every photograph stays in the page and the active one fades in. */
function Layer({ items, kind, active }: { items: Slide[]; kind: "desktop" | "mobile"; active: number }) {
  const w = kind === "desktop" ? IMAGE_SLOTS.hero.width : IMAGE_SLOTS.heroMobile.width;
  const h = kind === "desktop" ? IMAGE_SLOTS.hero.height : IMAGE_SLOTS.heroMobile.height;
  return (
    <>
      {items.map((sl, i) => (
        <img
          key={i}
          src={kind === "desktop" ? sl.desktop : sl.mobile}
          width={w}
          height={h}
          alt={i === active ? sl.alt : ""}
          aria-hidden={i === active ? undefined : true}
          loading="eager"
          decoding="async"
          fetchPriority={i === 0 ? "high" : "low"}
          sizes="100vw"
          data-active={i === active}
          className="hero-slide absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: kind === "desktop" ? "100% 20%" : sl.mobilePosition }}
        />
      ))}
    </>
  );
}

/** Pause and slide buttons. A moving hero needs a way to stop it (WCAG 2.2.2). */
function Controls({ count, active, paused, onGo, onToggle, className = "" }: { count: number; active: number; paused: boolean; onGo: (i: number) => void; onToggle: () => void; className?: string }) {
  return (
    <div role="group" aria-label={HOME.heroSlideshow} className={`absolute z-10 flex items-center rounded-full bg-surface/85 px-1 shadow-lift backdrop-blur ${className}`}>
      <button type="button" onClick={onToggle} aria-label={paused ? HOME.heroPlay : HOME.heroPause} className="grid h-11 w-11 place-items-center rounded-full text-ink hover:text-raspberry">
        {paused ? <Play className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> : <Pause className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
      </button>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} type="button" onClick={() => onGo(i)} aria-label={HOME.heroGoTo(i + 1, count)} aria-current={i === active ? "true" : undefined} className="grid h-11 w-11 place-items-center">
          <span className={`block h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-raspberry" : "w-2 bg-ink/30"}`} />
        </button>
      ))}
    </div>
  );
}

/**
 * Hero. From 1280 px up: one wide photograph fills the section at its own 12:5 ratio (no crop), the group on
 * the right and a clean light wall on the left carrying the headline. Below 1280 px: the 6:5 photograph sits
 * above the text. Choreography: the photograph settles in, the headline rises word by word, sparkles bloom
 * into the empty wall and twinkle, the photograph drifts very slowly, and on desktop the layers shift a few
 * pixels with the pointer. All of it is CSS except the pointer, and all of it stops under reduced motion.
 */
export function Hero() {
  const areas = getFocusAreas();
  const root = useRef<HTMLElement>(null);
  const items = slides();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Autoplay. Off for people who ask for reduced motion; the timer restarts whenever a slide changes, so a manual pick gets the full interval.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPaused(true); return; }
  }, []);
  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => { if (!document.hidden) setActive((a) => (a + 1) % items.length); }, HERO_INTERVAL_MS);
    return () => clearInterval(t);
  }, [active, paused, items.length]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1280px)");
    if (!mq.matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", String(((e.clientX - r.left) / r.width - 0.5).toFixed(3)));
        el.style.setProperty("--my", String(((e.clientY - r.top) / r.height - 0.5).toFixed(3)));
      });
    };
    const leave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-petal xl:aspect-[12/5]">
      {/* Under 1280: image first, full width. The photographs never scale or drift: a still image stays as sharp as its file. */}
      <div className="hero-photo relative aspect-[6/5] overflow-hidden sm:aspect-[16/9] md:aspect-[2/1] xl:hidden">
        <Layer items={items} kind="mobile" active={active} />
        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />
        <Controls count={items.length} active={active} paused={paused} onGo={setActive} onToggle={() => setPaused((p) => !p)} className="bottom-3 left-1/2 -translate-x-1/2" />
      </div>
      {/* 1280 and up: image fills the section */}
      <div className="hero-photo absolute inset-0 hidden overflow-hidden xl:block">
        <Layer items={items} kind="desktop" active={active} />
        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0" />
        <Controls count={items.length} active={active} paused={paused} onGo={setActive} onToggle={() => setPaused((p) => !p)} className="bottom-5 right-8" />
      </div>

      {/* Sparkles bloom into the empty wall above the group and beside the text */}
      <div
        className="depth pointer-events-none absolute inset-0 hidden xl:block"
        style={{ transform: "translate3d(calc(var(--mx, 0) * 18px), calc(var(--my, 0) * 12px), 0)" }}
      >
        <SparkleField
          bloom
          spots={[
            { x: "52%", y: "12%", size: 24, delay: 0.2 },
            { x: "88%", y: "14%", size: 18, delay: 0.7, fill: "var(--raspberry)" },
            { x: "47%", y: "11%", size: 12, delay: 1.4 },
          ]}
        />
      </div>

      <div className="relative xl:pointer-events-none xl:absolute xl:inset-0">
        <div className="mx-auto flex h-full max-w-page items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full py-10 sm:py-12 xl:pointer-events-auto xl:max-w-[38rem] xl:py-0">
            <h1 className="font-display text-[clamp(2.5rem,1.2rem+2.7vw,3.5rem)] font-medium leading-[1.03] tracking-[-0.022em] text-claret">
              <Headline text={HOME.heroTitle} />
            </h1>
            <p className="hero-in mt-5 max-w-[46ch] text-lg leading-relaxed text-ink/80 xl:max-w-[44ch]" style={d(0.75)}>{HOME.heroSupport}</p>
            <div className="hero-in mt-7 flex flex-col gap-3 sm:flex-row" style={d(0.95)}>
              <Button to={HOME.heroShop.to}>{HOME.heroShop.label}</Button>
              <CtaButton
                variant="secondary"
                channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
                label={HOME.heroTalk}
              />
            </div>
            <nav aria-label={HOME.heroCollectionsLabel} className="hero-in mt-7 border-t border-gold/70 pt-3 lg:hidden" style={d(1.15)}>
              <ul className="grid grid-cols-2 gap-x-4 text-sm text-ink/80 sm:flex sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
                {areas.map((a, i) => (
                  <li key={a.id} className="flex items-center gap-3">
                    {i > 0 && <Sparkle className="hidden h-2.5 w-2.5 sm:block" />}
                    <Link to={`/shop?cat=${a.id}`} className="inline-flex min-h-11 items-center hover:text-raspberry hover:underline">{a.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
