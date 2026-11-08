"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { COMPANY, NAV } from "@/content/site";
import { getLenis } from "@/lib/smoothScroll";

const SCROLLED_AT = 24; // px before the header gets its backdrop
const SPY_IDS = [...NAV.map((n) => n.href.slice(1)), "contact"];
// A section counts as "current" while it crosses the middle band of the viewport.
const SPY_MARGIN = "-45% 0px -50% 0px";

/** Which in-page section the reader is in, for the nav's active state. */
function useActiveSection(): string {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = SPY_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        const leaving = entries.filter((e) => !e.isIntersecting).map((e) => `#${e.target.id}`);
        const entering = entries.find((e) => e.isIntersecting);
        setActive((prev) => {
          if (entering) return `#${entering.target.id}`;
          return leaving.includes(prev) ? "" : prev;
        });
      },
      { rootMargin: SPY_MARGIN },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function BrandMark({ tone = "auto" }: { tone?: "auto" | "light" }) {
  // "auto" crossfades the light and dark logo with the page's --dark variable.
  const light = tone === "light" ? 1 : "var(--dark, 1)";
  const dark = tone === "light" ? 0 : "calc(1 - var(--dark, 1))";
  return (
    <span className="flex items-center gap-3">
      <span className="relative block h-9 w-[1.75rem] shrink-0">
        <Image
          src="/brand/symbol-light.png"
          alt=""
          fill
          sizes="28px"
          priority
          className="object-contain"
          style={{ opacity: light }}
        />
        {tone === "auto" && (
          <Image
            src="/brand/symbol.png"
            alt=""
            fill
            sizes="28px"
            priority
            className="object-contain"
            style={{ opacity: dark }}
          />
        )}
      </span>
      <span className="leading-none">
        <span className="block font-display text-[1.2rem] font-semibold tracking-tight">
          {COMPANY.name}
        </span>
        <span className="mt-1 block text-[0.6rem] font-medium uppercase tracking-[0.2em] opacity-70">
          {COMPANY.descriptor}
        </span>
      </span>
    </span>
  );
}

export default function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const current = (href: string) => (active === href ? "true" : undefined);

  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const onScroll = () => {
      el.dataset.scrolled = String(window.scrollY > SCROLLED_AT);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        ref={header}
        data-open={open}
        className="site-header fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-6 px-[6vw] py-4 lg:px-[4vw]">
          <a href="#top" aria-label={`${COMPANY.name}, back to top`} onClick={close}>
            <BrandMark />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="nav-link" aria-current={current(item.href)}>
                {item.label}
              </a>
            ))}
            <a href="#contact" className="btn btn-primary ml-4 !py-2.5" aria-current={current("#contact")}>
              Contact
            </a>
          </nav>

          <button
            type="button"
            className="-mr-2 grid size-11 place-items-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className="mobile-menu fixed inset-0 z-40 flex flex-col justify-between bg-deep-navy px-[6vw] pb-10 pt-28 text-cloud lg:hidden"
        data-open={open}
        inert={!open}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {[...NAV, { label: "Contact", href: "#contact" }].map((item, i) => (
              <li key={item.href} style={{ transitionDelay: `${open ? 80 + i * 50 : 0}ms` }}>
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={item.href}
                  aria-current={current(item.href)}
                  onClick={close}
                  className="block py-2 font-display text-[clamp(2rem,9vw,3rem)] font-semibold tracking-tight"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm opacity-80">
          <p>{COMPANY.location}</p>
          <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-4">
            {COMPANY.email}
          </a>
        </div>
      </div>
    </>
  );
}
