// Shared, non-React state. GSAP ScrollTrigger writes it, the 3D scene reads it
// every frame, so scrolling never causes a React re-render.
export const sceneState = {
  /** 0 = shards scattered (hero), 1 = shards joined into one form */
  progress: 0,
  /** which pillar is highlighted (0-3), or -1 for none */
  active: -1,
  /** pointer position, -1..1 */
  px: 0,
  py: 0,
  reduced: false,
};
