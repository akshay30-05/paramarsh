import { FOCUS_AREAS } from "@/content/site";

// Cards step down unevenly on wide screens: fragmented, asymmetric rhythm.
const OFFSETS = ["lg:mt-0", "lg:mt-20", "lg:mt-8", "lg:mt-28"];

export default function FocusAreas() {
  return (
    <section
      id="focus"
      data-after-scene
      aria-labelledby="focus-title"
      className="relative z-20 bg-cloud text-ink"
    >
      <div className="section-wrap">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p data-reveal className="eyebrow">What we do</p>
            <h2 id="focus-title" data-reveal className="h2 mt-4">
              Our focus areas
            </h2>
          </div>
          <p data-reveal className="lead md:col-span-5 md:pb-2">
            Four of the UN Sustainable Development Goals guide where we put our research and effort.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {FOCUS_AREAS.map((area, i) => (
            <li key={area.sdg} data-reveal className={`focus-card group ${OFFSETS[i]}`}>
              <span
                className="focus-shard"
                style={{ background: area.color }}
                aria-hidden="true"
              />
              <p className="flex items-baseline gap-2 text-deep-navy">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                  SDG
                </span>
                <span className="font-display text-[3.4rem] font-semibold leading-none tracking-tight">
                  {area.sdg}
                </span>
              </p>
              <h3 className="mt-10 font-display text-xl font-semibold leading-snug tracking-tight text-deep-navy text-balance">
                {area.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed opacity-80">{area.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
