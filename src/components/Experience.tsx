"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, ArrowRight } from "lucide-react";
import { sceneState as S } from "@/lib/sceneState";
import { getLenis, setLenis } from "@/lib/smoothScroll";
import { APPROACH, HERO, PILLARS } from "@/content/site";
import SiteHeader from "./SiteHeader";

// The 3D scene only exists in the browser.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

const NAVY = "#13233A";
const CLOUD = "#F4F7FA";
const PIN_LENGTH = 3.8; // viewport heights of scrolling while the pillars are pinned
const HEADER_OFFSET = -76; // px, so anchored sections clear the fixed header

export default function Experience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneLive, setSceneLive] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const q = gsap.utils.selector(root);

    // A reload starts at the hero (the story reads top-down), unless the URL
    // points at a section.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Smooth, "warm" scrolling, driven by GSAP's own clock.
      const lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.9,
        anchors: { offset: HEADER_OFFSET },
      });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const onMove = (e: PointerEvent) => {
        S.px = (e.clientX / window.innerWidth) * 2 - 1;
        S.py = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove);

      // The one entrance: the headline settles in as the shards open out.
      gsap.from(q("[data-intro]"), {
        y: 34,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3,
      });

      // Window 1 leaves: background turns navy to cloud, shards start to join.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: q("[data-hero]")[0],
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              S.progress = self.progress * 0.3;
            },
          },
        })
        .to(q("[data-hero-copy]"), { opacity: 0, y: -60, ease: "none", duration: 0.5 }, 0.1)
        .to(root.current, { "--bg": CLOUD, "--fg": NAVY, "--dark": 0, ease: "none", duration: 0.6 }, 0.35);

      // Window 2: pinned. Shards join, then each pillar is read in turn.
      const pillarsEl = q("[data-pillars]")[0] as HTMLElement;
      const pin = gsap.timeline({
        scrollTrigger: {
          trigger: pillarsEl,
          start: "top top",
          end: `+=${PIN_LENGTH * 100}%`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            S.progress = 0.3 + 0.7 * Math.min(1, p / 0.28);
            S.active =
              p >= 0.88 ? -1 : p >= 0.3 ? Math.min(3, Math.floor((p - 0.3) / 0.14)) : -1;
            // Drives the 01-04 progress marker through CSS (no React render).
            const step = p >= 0.88 ? "all" : S.active >= 0 ? String(S.active) : "";
            if (pillarsEl.dataset.step !== step) pillarsEl.dataset.step = step;
          },
        },
      });
      const blocks = q("[data-pillar]");
      pin.fromTo(
        q("[data-pillars-head]"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
        0.06,
      );
      blocks.forEach((b, i) => {
        const at = 0.3 + 0.14 * i;
        pin.fromTo(
          b,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          at,
        );
        if (i > 0) pin.to(blocks[i - 1], { opacity: 0.72, duration: 0.06 }, at);
      });
      pin.to(blocks, { opacity: 1, duration: 0.06 }, 0.88); // all four, resolved
      pin.to({}, { duration: 1 }, 0); // pin timeline is exactly 0..1

      // Later sections: content eases in as it reaches the viewport.
      const reveals = q("[data-reveal]");
      gsap.set(reveals, { opacity: 0, y: 32 });
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh).catch(() => undefined);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("load", refresh);
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
        S.progress = 0;
        S.active = -1;
      };
    });

    // Reduced motion: no smooth scroll, no pinning, shards already joined.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      S.reduced = true;
      S.progress = 0.85;
      S.active = -1;
      gsap.set(root.current, { "--bg": CLOUD, "--fg": NAVY, "--dark": 0 });
      return () => {
        S.reduced = false;
      };
    });

    // Pause the 3D canvas once page content fully covers it. Created after the
    // pin so its start position accounts for the pin spacing.
    const after = q("[data-after-scene]")[0];
    const sceneToggle = after
      ? ScrollTrigger.create({
          trigger: after,
          start: "top top",
          end: "max",
          onToggle: (self) => setSceneLive(!self.isActive),
        })
      : null;

    return () => {
      sceneToggle?.kill();
      mm.revert();
    };
  }, []);

  const goToPillars = () => {
    const top = window.innerHeight * (1 + PIN_LENGTH * 0.3);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top, { duration: 2.4 });
    else document.getElementById("pillars")?.scrollIntoView();
  };

  return (
    <div
      ref={root}
      className="relative"
      style={
        {
          "--bg": NAVY,
          "--fg": CLOUD,
          "--dark": 1,
          color: "var(--fg)",
        } as React.CSSProperties
      }
    >
      {/* Background and 3D layer stay fixed while the page scrolls over them */}
      <div className="fixed inset-0 z-0" style={{ background: "var(--bg)" }} />
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-[1400ms]"
        style={{ opacity: sceneReady ? 1 : 0, visibility: sceneLive ? "visible" : "hidden" }}
      >
        <Scene live={sceneLive} onReady={() => setSceneReady(true)} />
      </div>

      <SiteHeader />

      <main id="main" tabIndex={-1} className="outline-none">
        {/* Window 1 */}
        <section
          id="top"
          data-hero
          aria-labelledby="hero-title"
          className="relative z-20 flex h-svh min-h-[34rem] items-start px-[6vw] pt-[17vh] md:items-center md:pt-0"
        >
          <div data-hero-copy className="max-w-[46rem]">
            <p data-intro className="eyebrow !text-open-cyan">
              {APPROACH.steps.map((s) => s.name).join(" · ")}
            </p>
            <h1
              id="hero-title"
              data-intro
              className="mt-5 font-display text-[clamp(2.7rem,6.6vw,6.4rem)] font-semibold leading-[0.96] tracking-[-0.025em] text-balance"
            >
              {HERO.title}
            </h1>
            <p
              data-intro
              className="mt-6 max-w-[34ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed opacity-85"
            >
              {HERO.subline}
            </p>
            <div data-intro className="mt-9 flex flex-wrap items-center gap-3">
              <button type="button" onClick={goToPillars} className="btn btn-primary">
                See what we stand on
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <a href="#focus" className="btn btn-outline">
                Our focus areas
              </a>
            </div>
          </div>

          <a
            href="#pillars"
            onClick={(e) => {
              e.preventDefault();
              goToPillars();
            }}
            className="scroll-cue absolute bottom-7 left-[6vw] hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] opacity-70 md:flex"
          >
            <ArrowDown size={16} aria-hidden="true" /> Scroll
          </a>
        </section>

        {/* Window 2 */}
        <section
          id="pillars"
          data-pillars
          aria-labelledby="pillars-title"
          className="relative z-20 h-svh min-h-[36rem] overflow-hidden"
        >
          <div
            data-pillars-head
            className="absolute left-[6vw] top-[12vh] max-w-[30rem] md:top-[14vh]"
          >
            <h2
              id="pillars-title"
              className="font-display text-[clamp(2rem,4.2vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-balance"
            >
              Trust is built from four things.
            </h2>
            <p className="mt-4 max-w-[32ch] text-lg leading-relaxed opacity-80">
              Take one away and the other three hold less.
            </p>
          </div>

          {PILLARS.map((p, i) => (
            <article key={p.name} data-pillar className={`pillar pillar-${i}`}>
              <h3 className="flex items-center gap-2.5 font-display text-[clamp(1.15rem,1.8vw,1.6rem)] font-semibold tracking-tight">
                <span
                  className="shard-key"
                  style={{ background: p.color }}
                  aria-hidden="true"
                />
                {p.name}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed opacity-90 md:text-base">
                {p.line}
              </p>
            </article>
          ))}

          <ol className="pillar-steps" aria-hidden="true">
            {PILLARS.map((p, i) => (
              <li key={p.name}>0{i + 1}</li>
            ))}
          </ol>
        </section>

        {children}
      </main>
    </div>
  );
}
