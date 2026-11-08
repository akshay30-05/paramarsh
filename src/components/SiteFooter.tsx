import Link from "next/link";
import { COMPANY, FOOTER_LINE, NAV } from "@/content/site";
import { BrandMark } from "@/components/SiteHeader";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-20 bg-deep-navy text-cloud">
      <div className="mx-auto max-w-[84rem] px-[6vw] pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#top" aria-label={`${COMPANY.name}, back to top`} className="inline-block">
              <BrandMark tone="light" />
            </a>
            <p className="mt-6 max-w-[34ch] leading-relaxed opacity-75">{FOOTER_LINE}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="footer-title">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="footer-title">Contact</p>
            <p className="mt-4 opacity-80">{COMPANY.location}</p>
            <a href={`mailto:${COMPANY.email}`} className="footer-link mt-2 inline-block">
              {COMPANY.email}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cloud/15 pt-6 text-sm opacity-70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="footer-link">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
