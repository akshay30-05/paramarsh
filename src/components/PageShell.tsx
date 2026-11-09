import type { ReactNode } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Shown under the intro, e.g. that a page is still being prepared. */
  note?: string;
  children?: ReactNode;
};

// Frame for the conventional corporate pages: same navigation and footer as
// the documentary, quiet editorial layout on the paper ground.
export default function PageShell({ eyebrow, title, intro, note, children }: Props) {
  return (
    <>
      <SiteNav />
      <main id="main" className="min-h-svh bg-paper text-charcoal">
        <div className="mx-auto max-w-[84rem] px-[6vw] pb-24 pt-[clamp(8rem,18vh,11rem)]">
          {eyebrow && <p className="eyebrow-doc">{eyebrow}</p>}
          <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.98]">{title}</h1>
          {intro && <p className="reading mt-8">{intro}</p>}
          {note && <p className="mt-6 text-sm text-slate">{note}</p>}
          {children && <div className="mt-14">{children}</div>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
