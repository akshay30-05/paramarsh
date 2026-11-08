import { ABOUT } from "@/content/site";
import ShardArt from "@/components/ShardArt";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative z-20 bg-cloud text-ink">
      <div className="section-wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p data-reveal className="eyebrow">Who we are</p>
          <h2
            id="about-title"
            data-reveal
            className="mt-6 font-display text-[clamp(1.9rem,3.8vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-deep-navy text-balance"
          >
            {ABOUT.statement}
          </h2>
          <div data-reveal className="mt-10 flex max-w-[36rem] items-start gap-5 md:mt-14">
            <ShardArt variant="about" className="w-20 shrink-0 md:w-24" />
            <p className="lead">{ABOUT.sdgNote}</p>
          </div>
        </div>

        <dl className="self-end lg:col-span-4 lg:col-start-9">
          {ABOUT.facts.map((fact) => (
            <div
              key={fact.label}
              data-reveal
              className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-deep-navy/15 py-5 last:border-b"
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                {fact.label}
              </dt>
              <dd className="font-medium text-deep-navy">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
