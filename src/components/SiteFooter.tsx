import Link from "next/link";
import { COMPANY, PAGES } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal text-paper">
      <div className="mx-auto grid max-w-[84rem] gap-12 py-16 pl-[6vw] pr-[4.5rem] md:grid-cols-[1.2fr_1fr] lg:pr-[11rem]">
        <div>
          <p className="font-display text-3xl">{COMPANY.name}</p>
          <p className="mt-2 text-sm opacity-75">{COMPANY.descriptor}</p>
          <p className="mt-6 text-sm leading-relaxed opacity-75">
            {COMPANY.legalName}
            <br />
            {COMPANY.location}
          </p>
          <a href={`mailto:${COMPANY.email}`} className="footer-link mt-3 text-sm">
            {COMPANY.email}
          </a>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="footer-link">
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="footer-link">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="footer-link">
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
