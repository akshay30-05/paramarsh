import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/content/site";

// Conventional navigation stays available at all times: immersion must never
// block the way to contact details or the end of the documentary.
export default function SiteNav({ home = false }: { home?: boolean }) {
  return (
    <header className="doc-nav">
      <Link href={home ? "#opening" : "/"} className="wordmark" aria-label={`${COMPANY.name}, ${home ? "back to the start" : "home"}`}>
        {COMPANY.name}
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-8">
        {home && (
          <a href="#conclusion" className="nav-text">
            Skip documentary
          </a>
        )}
        {NAV_LINKS.map((l) => (
          <Link key={l.label} href={l.href} className="nav-text">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
