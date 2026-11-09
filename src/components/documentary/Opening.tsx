"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OPENING } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// The question, in two beats, over the landscape. Both lines are always in the
// HTML; with reduced motion (or before scripts run) they simply sit together.
export default function Opening() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".q-line2", { autoAlpha: 0, y: 28 });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 },
        })
        .to(".q-cue", { autoAlpha: 0, duration: 0.08 }, 0)
        .to(".q-line1", { opacity: 0.35, duration: 0.2 }, 0.28)
        .to(".q-line2", { autoAlpha: 1, y: 0, duration: 0.25 }, 0.36)
        .to(".q-text", { autoAlpha: 0, y: -24, duration: 0.16 }, 0.84);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="opening" ref={root} aria-label="Opening" className="relative h-[240svh]">
      <div className="sticky top-0 h-svh overflow-hidden text-paper">
        <div className="q-text absolute inset-0 flex flex-col justify-center pb-[8vh] pl-[6vw] pr-[4.5rem]">
          <p className="eyebrow-doc mb-6">Beyond the surface</p>
          <h1>
            <span className="q-line1 opening-line block max-w-[17ch] md:max-w-[22ch]">{OPENING.line1}</span>
            <span className="q-line2 opening-line mt-6 block max-w-[20ch] text-sage md:max-w-[26ch]">
              {OPENING.line2}
            </span>
          </h1>
        </div>

        <p className="q-cue absolute bottom-8 left-[6vw] text-xs font-bold uppercase tracking-[0.24em] opacity-70">
          Scroll to begin
        </p>
        <p className="absolute bottom-8 right-[6vw] hidden max-w-[22rem] text-right text-xs opacity-60 sm:block">
          {OPENING.placeholderNote}
        </p>
      </div>
    </section>
  );
}
