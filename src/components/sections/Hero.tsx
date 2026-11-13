import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { HOME } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SlotImage } from "../ui/SlotImage";
import { Button } from "../ui/Button";
import { Sparkle } from "../ui/Sparkle";
import { SparkleField } from "../ui/SparkleField";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Headline set word by word, each rising out of its own mask. The words stay one readable sentence. */
function Words({ text, start = 0.15, step = 0.1 }: { text: string; start?: number; step?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word"><span style={d(start + i * step)}>{w}</span></span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
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
      {/* Under 1280: image first, full width */}
      <div className="hero-photo relative aspect-[6/5] overflow-hidden sm:aspect-[16/9] md:aspect-[2/1] xl:hidden">
        <div className="kenburns h-full w-full">
          <SlotImage slot="heroMobile" priority fill objectPosition="50% 36%" sizes="100vw" />
        </div>
      </div>
      {/* 1280 and up: image fills the section, with a touch of pointer depth */}
      <div className="hero-photo absolute inset-0 hidden overflow-hidden xl:block">
        <div
          className="depth h-full w-full"
          style={{ transform: "translate3d(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -6px), 0) scale(1.02)" }}
        >
          <div className="kenburns h-full w-full">
            <SlotImage slot="hero" priority fill objectPosition="100% 20%" sizes="100vw" />
          </div>
        </div>
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
            { x: "88%", y: "14%", size: 18, delay: 0.7, fill: "#C30239" },
            { x: "44%", y: "30%", size: 12, delay: 1.4 },
          ]}
        />
      </div>

      <div className="relative xl:absolute xl:inset-0">
        <div className="mx-auto flex h-full max-w-page items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full py-10 sm:py-12 xl:max-w-[34rem] xl:py-0">
            <span className="hero-in mb-5 block h-6 w-6">
              <span className="twinkle block h-full w-full"><Sparkle className="h-full w-full" fill="#C30239" /></span>
            </span>
            <h1 className="font-display text-display font-medium text-claret">
              <Words text={HOME.heroTitle} />
            </h1>
            <p className="hero-in mt-5 max-w-[36ch] text-lg text-ink/80 sm:text-xl" style={d(0.75)}>{HOME.heroSupport}</p>
            <div className="hero-in mt-7 flex flex-col gap-3 sm:flex-row" style={d(0.95)}>
              <Button to={HOME.heroShop.to}>{HOME.heroShop.label}</Button>
              <CtaButton
                variant="secondary"
                channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
                label={HOME.heroTalk}
              />
            </div>
            <p className="hero-in mt-5 max-w-[40ch] text-sm text-ink/80" style={d(1.15)}>{HOME.heroNote}</p>
            <nav aria-label={HOME.heroCollectionsLabel} className="hero-in mt-5 border-t border-gold pt-4 lg:hidden" style={d(1.3)}>
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
