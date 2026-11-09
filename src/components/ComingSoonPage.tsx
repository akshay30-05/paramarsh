import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { PAGES } from "@/content/site";

type PageHref = (typeof PAGES)[number]["href"];

function pageFor(href: PageHref) {
  const page = PAGES.find((p) => p.href === href);
  if (!page) throw new Error(`Unknown page: ${href}`);
  return page;
}

export function pageMetadata(href: PageHref): Metadata {
  const page = pageFor(href);
  return { title: page.label, description: page.purpose, alternates: { canonical: href } };
}

// A corporate page whose real content arrives in G6. It says plainly what the
// page will hold, so nothing is invented in the meantime.
export default function ComingSoonPage({ href, children }: { href: PageHref; children?: ReactNode }) {
  const page = pageFor(href);
  return (
    <PageShell
      eyebrow={page.label}
      title={page.label}
      intro={page.purpose}
      note="This page is being prepared with Paramarsh. Its content will be added once it is approved."
    >
      {children}
      <Link href="/" className="btn btn-line mt-10">
        Return to the documentary
      </Link>
    </PageShell>
  );
}
