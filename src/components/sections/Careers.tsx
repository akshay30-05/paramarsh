import { ArrowUpRight } from "lucide-react";
import { CAREERS, COMPANY } from "@/content/site";
import ShardArt from "@/components/ShardArt";

const APPLY_HREF = `mailto:${COMPANY.email}?subject=${encodeURIComponent("Speculative application")}`;

export default function Careers() {
  return (
    <section
      id="careers"
      aria-labelledby="careers-title"
      className="relative z-20 overflow-hidden bg-deep-navy text-cloud"
    >
      <ShardArt
        variant="careers"
        className="pointer-events-none absolute -bottom-24 -right-24 w-[min(34rem,80vw)] opacity-[0.22] md:opacity-30"
      />
      <div className="section-wrap relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p data-reveal className="eyebrow !text-open-cyan">{CAREERS.eyebrow}</p>
          <h2 id="careers-title" data-reveal className="h2 mt-4 text-balance">
            {CAREERS.title}
          </h2>
          <p data-reveal className="lead mt-6 max-w-[40ch] !opacity-85">
            {CAREERS.text}
          </p>
        </div>

        <div data-reveal className="careers-card self-end lg:col-span-5">
          <h3 className="font-display text-2xl font-semibold tracking-tight">{CAREERS.openTitle}</h3>
          <p className="mt-3 leading-relaxed opacity-85">{CAREERS.openText}</p>
          <a href={APPLY_HREF} className="btn btn-light mt-8">
            Send an application
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
