import Link from "next/link";
import { CHAPTERS, COMPETENCE_COPY, COMPETENCE_TRANSITION, CONCLUSION, COMPANY } from "@/content/site";

// G1: the Competence chapter ends in editorial text (the hand-off out of the
// terrain). The immersive scenes for the other chapters arrive in G3 and G4.
// All essential text stays in HTML so every chapter reads without 3D.

const [, ...rest] = CHAPTERS;

const SIDE = "pl-[6vw] pr-[4.5rem] lg:pr-[11rem]";

export function CompetenceStory() {
  const [lead, ...body] = COMPETENCE_COPY;
  return (
    <section aria-labelledby="competence-story-title" data-chapter="competence" className="bg-paper text-charcoal">
      <div className={`mx-auto grid max-w-[84rem] gap-12 py-[clamp(5rem,14vh,10rem)] lg:grid-cols-[1fr_1.15fr] ${SIDE}`}>
        <h3 id="competence-story-title" className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02]">
          {lead}
        </h3>
        <div className="reading space-y-6">
          {body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <blockquote className="border-t border-charcoal/15 pt-8 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight text-slate lg:col-span-2 lg:max-w-[40ch]">
          {COMPETENCE_TRANSITION}
        </blockquote>
      </div>
    </section>
  );
}

const TONES = ["bg-slate", "bg-charcoal", "bg-slate"] as const;

export function UpcomingChapters() {
  return (
    <>
      {rest.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          aria-labelledby={`${c.id}-title`}
          className={`flex min-h-svh items-center text-paper ${TONES[i]}`}
        >
          <div className={`mx-auto w-full max-w-[84rem] py-24 ${SIDE}`}>
            <p className="eyebrow-doc">Chapter {c.number}</p>
            <h2 id={`${c.id}-title`} className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] leading-none">
              {c.title}
            </h2>
            <p className="mt-6 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-sage">{c.line}</p>
            <p className="mt-6 max-w-[34rem] text-sm font-bold uppercase tracking-[0.16em] opacity-80">
              {c.promise}
            </p>
            <p className="mt-10 text-xs opacity-60">Immersive chapter in production.</p>
          </div>
        </section>
      ))}
    </>
  );
}

const ROUTES = [
  { label: "Explore our work", href: "/our-work", primary: false },
  { label: "Start a conversation", href: "/contact", primary: true },
  { label: "Who we are", href: "/who-we-are", primary: false },
] as const;

export function Conclusion() {
  return (
    <section id="conclusion" aria-labelledby="conclusion-title" className="flex min-h-svh items-center bg-paper text-charcoal">
      <div className={`mx-auto w-full max-w-[84rem] py-24 ${SIDE}`}>
        <p className="eyebrow-doc">{CONCLUSION.eyebrow}</p>
        <h2 id="conclusion-title" className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] leading-none">
          {CONCLUSION.title}
        </h2>
        <p className="mt-8 max-w-[30ch] font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-tight text-slate">
          {CONCLUSION.line}
        </p>
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em]">{CONCLUSION.pillars}</p>
        <p className="mt-2 text-sm opacity-75">{COMPANY.descriptor}</p>
        <p className="mt-10 font-display text-2xl">{CONCLUSION.invitation}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ROUTES.map((r) => (
            <Link key={r.href} href={r.href} className={r.primary ? "btn btn-ink" : "btn btn-line"}>
              {r.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
