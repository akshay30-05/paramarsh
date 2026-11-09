"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandscapePoster from "./LandscapePoster";
import { journeyState } from "@/lib/journeyState";

gsap.registerPlugin(ScrollTrigger);

// The 3D scene loads only in the browser, after the text is on screen.
const TerrainScene = dynamic(() => import("@/components/scenes/TerrainScene"), { ssr: false });

let webglSupport: boolean | null = null;
function hasWebGL(): boolean {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

// One continuous environment behind the opening and the Competence chapter:
// scroll moves the camera forward, then down into the terrain.
export default function Journey({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(true);

  // Render only while the journey is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const opening = document.getElementById("opening");
    const competence = document.getElementById("competence");
    if (!opening || !competence) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      journeyState.reduced = false;
      ScrollTrigger.create({
        trigger: opening,
        start: "top top",
        endTrigger: competence,
        end: "top top",
        onUpdate: (self) => {
          journeyState.target = self.progress;
        },
      });
    });

    // Reduced motion: no camera travel. The view cuts, with a short fade.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      journeyState.reduced = true;
      const cut = (to: number) => {
        journeyState.target = to;
        const el = stage.current;
        if (!el) return;
        el.classList.remove("cut");
        void el.offsetWidth;
        el.classList.add("cut");
      };
      ScrollTrigger.create({
        trigger: competence,
        start: "top 55%",
        onEnter: () => cut(1),
        onLeaveBack: () => cut(0),
      });
    });

    return () => {
      mm.revert();
      journeyState.target = 0;
    };
  }, []);

  return (
    <div ref={root} className="relative bg-charcoal">
      {/* The stage fills the journey; its sticky child pins the scene and
          releases it exactly when the Competence chapter ends. */}
      <div ref={stage} className="journey-stage absolute inset-0" aria-hidden="true">
        <div className="sticky top-0 h-svh overflow-hidden">
          <LandscapePoster />
          {webgl && (
            <div className="absolute inset-0 transition-opacity duration-[1400ms]" style={{ opacity: ready ? 1 : 0 }}>
              <TerrainScene live={live} onReady={() => setReady(true)} />
            </div>
          )}
          {/* Keeps text readable over the scene without hiding it. */}
          <div className="journey-shade absolute inset-0" />
        </div>
      </div>
      {children}
    </div>
  );
}
