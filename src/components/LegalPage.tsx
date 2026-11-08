import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { COMPANY } from "@/content/site";

// Shared shell for the privacy and terms pages. The legal text itself must
// come from the company; this page only says that it is being prepared.
export default function LegalPage({ title }: { title: string }) {
  return (
    <main className="min-h-svh bg-cloud px-[6vw] py-16 text-ink md:py-24">
      <div className="mx-auto max-w-[44rem]">
        <Link href="/" className="text-link inline-flex min-h-6 items-center gap-2 text-sm">
          <ArrowLeft size={16} aria-hidden="true" /> Back to {COMPANY.name}
        </Link>
        <h1 className="mt-10 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold tracking-tight text-deep-navy">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed">
          This page is being prepared. For any question about how {COMPANY.legalName} handles
          information, please write to{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-link">
            {COMPANY.email}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
