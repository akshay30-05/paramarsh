import type { LayerId } from "@/content/site";

// Shared, non-React state. Scroll and the layer buttons write it; the 3D scene
// reads it every frame, so scrolling never causes a React re-render.
export const journeyState: {
  /** Camera target along the journey: 0 = wide opening view, 1 = overview of the terrain. */
  target: number;
  /** The contextual layer in focus, or null. */
  layer: LayerId | null;
  /** Reduced motion: no camera travel, cuts instead of moves. */
  reduced: boolean;
} = {
  target: 0,
  layer: null,
  reduced: false,
};
