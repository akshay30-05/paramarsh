"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from "@/content/site";

const STOPS = [
  { id: "opening", label: "Opening" },
  ...CHAPTERS.map((c) => ({ id: c.id, label: c.title })),
  { id: "conclusion", label: "Conclusion" },
];

// Shows where the visitor is in the documentary and allows direct chapter jumps.
export default function ChapterIndicator() {
  const [active, setActive] = useState("opening");

  useEffect(() => {
    // A chapter can span several sections: its anchor plus any section marked
    // data-chapter="<id>" (e.g. the editorial text that follows the terrain).
    const owner = new Map<Element, string>();
    for (const s of STOPS) {
      const anchor = document.getElementById(s.id);
      if (anchor) owner.set(anchor, s.id);
      document.querySelectorAll(`[data-chapter="${s.id}"]`).forEach((el) => owner.set(el, s.id));
    }
    const inView = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target);
          else inView.delete(e.target);
        }
        const ids = new Set([...inView].map((el) => owner.get(el)));
        const current = STOPS.find((s) => ids.has(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    owner.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="chapter-indicator" aria-label="Documentary chapters">
      {STOPS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={active === s.id ? "true" : undefined}
          aria-label={s.label}
        >
          <span className="label">{s.label}</span>
          <span className="dot" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
