import { APPROACH } from "@/content/site";
import ShardArt from "@/components/ShardArt";

// Steps climb on wide screens: research, then innovation, then scale.
const STEP_OFFSETS = ["md:mt-40", "md:mt-20", "md:mt-0"];
const STEP_COLORS = ["#246BFE", "#56C8E8", "#F5C451"];

export default function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="relative z-20 overflow-hidden bg-human-mint text-deep-navy"
    >
      <ShardArt
        variant="approach"
        className="pointer-events-none absolute -right-14 -top-6 w-[44vw] opacity-60 md:right-[4vw] md:top-16 md:w-[min(26rem,40vw)] md:opacity-90"
      />
      <div className="section-wrap relative">
        <div className="max-w-[40rem]">
          <p data-reveal className="eyebrow">How we do it</p>
          <h2 id="approach-title" data-reveal className="h2 mt-4">
            {APPROACH.title}
          </h2>
          <p data-reveal className="lead mt-6 max-w-[32ch]">
            {APPROACH.intro}
          </p>
        </div>

        <ol className="mt-16 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
          {APPROACH.steps.map((step, i) => (
            <li key={step.name} data-reveal className={`approach-step ${STEP_OFFSETS[i]}`}>
              <div className="flex items-center gap-4">
                <span className="font-display text-sm font-semibold tabular-nums tracking-[0.2em]">
                  0{i + 1}
                </span>
                <span className="h-px flex-1 bg-deep-navy/25" aria-hidden="true" />
                <span
                  className="shard-key"
                  style={{ background: STEP_COLORS[i] }}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-8 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-none tracking-tight">
                {step.name}
              </h3>
              <p className="mt-4 max-w-[30ch] text-[1.02rem] leading-relaxed opacity-85">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
