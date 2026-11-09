"use client";

import { useEffect, useState } from "react";
import { CHAPTERS, COMPETENCE_EXPLORE, LAYERS, type LayerId } from "@/content/site";
import { journeyState } from "@/lib/journeyState";

const competence = CHAPTERS[0];

// Chapter 01, the explorable terrain. Each layer changes what the scene
// emphasises and explains what that perspective reveals. Everything a visitor
// needs is in this HTML panel, so the chapter reads without the 3D scene.
export default function CompetenceExplore() {
  const [layer, setLayer] = useState<LayerId | null>(null);
  const current = LAYERS.find((l) => l.id === layer);

  useEffect(() => {
    journeyState.layer = layer;
  }, [layer]);
  useEffect(() => () => void (journeyState.layer = null), []);

  return (
    <section
      id={competence.id}
      aria-labelledby="competence-title"
      className="relative h-[190svh] text-paper"
    >
      <div className="sticky top-0 flex h-svh items-end pb-[clamp(1rem,5vh,3.5rem)] pl-[6vw] pr-[3.6rem] pt-24 sm:pr-[4.5rem] lg:pr-[11rem]">
        <div className="explore-panel w-full max-w-[29rem]">
          <p className="eyebrow-doc">Chapter {competence.number}</p>
          <h2 id="competence-title" className="mt-2 font-display text-[clamp(2.6rem,5vw,4rem)] leading-none">
            {competence.title}
          </h2>
          <p className="mt-2 font-display text-[clamp(1.35rem,2.2vw,1.8rem)] leading-tight text-sage">
            {competence.line}
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed opacity-90">{COMPETENCE_EXPLORE.intro}</p>

          <div role="group" aria-label="Contextual layers" className="mt-5 grid grid-cols-2 gap-2">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="layer-btn"
                aria-pressed={layer === l.id}
                onClick={() => setLayer((v) => (v === l.id ? null : l.id))}
              >
                <span className="layer-swatch" data-layer={l.id} aria-hidden="true" />
                {l.label}
              </button>
            ))}
          </div>

          <p aria-live="polite" className="mt-4 min-h-[6.5rem] text-[0.95rem] leading-relaxed sm:min-h-[5.5rem]">
            {current ? current.text : COMPETENCE_EXPLORE.prompt}
          </p>

          <p className="mt-3 border-t border-paper/20 pt-3 text-[0.9rem] italic leading-snug text-sage">
            {COMPETENCE_EXPLORE.close}
          </p>
          <p className="mt-2 text-xs opacity-60">{COMPETENCE_EXPLORE.note}</p>
        </div>
      </div>
    </section>
  );
}
