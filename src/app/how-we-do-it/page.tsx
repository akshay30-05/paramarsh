import ComingSoonPage, { pageMetadata } from "@/components/ComingSoonPage";
import { CHAPTERS } from "@/content/site";

export const metadata = pageMetadata("/how-we-do-it");

// The four principles come from the approved Beyond the Surface documents.
// Methods and evidence for each are added in G6, once Paramarsh supplies them.
export default function Page() {
  return (
    <ComingSoonPage href="/how-we-do-it">
      <ol className="grid gap-px border-y border-charcoal/15 md:grid-cols-2">
        {CHAPTERS.map((c) => (
          <li key={c.id} className="border-b border-charcoal/15 py-8 md:pr-10 md:odd:border-r md:odd:pr-10 md:even:pl-10">
            <p className="eyebrow-doc">{c.number}</p>
            <h2 className="mt-3 font-display text-4xl">{c.title}</h2>
            <p className="mt-2 font-display text-2xl leading-tight text-slate">{c.line}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed">{c.promise}</p>
          </li>
        ))}
      </ol>
    </ComingSoonPage>
  );
}
