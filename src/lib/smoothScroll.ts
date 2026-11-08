import type Lenis from "lenis";

// The page's single Lenis instance, shared so the header menu can pause
// scrolling and buttons can scroll smoothly. Null when reduced motion is on.
let current: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  current = lenis;
}

export function getLenis(): Lenis | null {
  return current;
}
