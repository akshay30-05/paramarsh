// Pure, deterministic terrain maths shared by the 3D scene and its tests.
// The landscape is illustrative: generated from noise, not a real place.

export interface Point2 {
  x: number;
  z: number;
}

export interface Settlement extends Point2 {
  y: number;
}

/** World-space bounds of the terrain plane. */
export const TERRAIN = {
  minX: -130,
  maxX: 130,
  minZ: -230,
  maxZ: 50,
  // About 13% of the study area sits below this: the river channel, not a lake.
  waterLevel: -5,
} as const;

/** Area the overview camera frames; settlements and routes live here. */
export const STUDY_AREA = { minX: -46, maxX: 46, minZ: -58, maxZ: 12 } as const;

const SEED = 1931;

function hash(ix: number, iz: number): number {
  let h = (ix * 374761393 + iz * 668265263 + SEED * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Smooth value noise in [0, 1]. */
export function valueNoise(x: number, z: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = smooth(x - ix);
  const fz = smooth(z - iz);
  const a = hash(ix, iz);
  const b = hash(ix + 1, iz);
  const c = hash(ix, iz + 1);
  const d = hash(ix + 1, iz + 1);
  return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
}

/** Fractal noise in roughly [-1, 1]. */
export function fbm(x: number, z: number, octaves = 5): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += (valueNoise(x * freq, z * freq) * 2 - 1) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

/** The river's centre line: a slow meander through the valley. */
export function riverX(z: number): number {
  return 14 * Math.sin(z * 0.034 + 0.6) + 6 * Math.sin(z * 0.011);
}

function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

/** Terrain height at a world position. */
export function heightAt(x: number, z: number): number {
  const rolling = fbm(x * 0.018, z * 0.018) * 9;
  const detail = fbm(x * 0.08 + 40, z * 0.08 - 12, 3) * 1.2;

  // Distant ridges rise towards the horizon.
  const far = clamp01((-z - 70) / 120);
  const ridge = (1 - Math.abs(fbm(x * 0.012 + 7, z * 0.012 + 3, 4))) * 34 * far * far;

  // Valley carved by the river.
  const d = (x - riverX(z)) / 10;
  const valley = 7.5 * Math.exp(-d * d);

  return rolling + detail + ridge - valley + 2;
}

/** Steepness 0 (flat) .. 1 (very steep), from central differences. */
export function slopeAt(x: number, z: number): number {
  const e = 1;
  const dx = heightAt(x + e, z) - heightAt(x - e, z);
  const dz = heightAt(x, z + e) - heightAt(x, z - e);
  return clamp01(Math.hypot(dx, dz) / (2 * e) / 1.5);
}

/**
 * Places illustrative settlements on gentle, dry ground near the river,
 * keeping a minimum spacing. Deterministic for a given area.
 */
export function findSettlements(area = STUDY_AREA, minSpacing = 9, max = 26): Settlement[] {
  const found: Settlement[] = [];
  const step = 3;
  for (let z = area.minZ; z <= area.maxZ && found.length < max; z += step) {
    for (let x = area.minX; x <= area.maxX && found.length < max; x += step) {
      const jx = x + (hash(x, z) - 0.5) * step;
      const jz = z + (hash(z, x) - 0.5) * step;
      const y = heightAt(jx, jz);
      const nearRiver = Math.abs(jx - riverX(jz));
      const suitable =
        y > TERRAIN.waterLevel + 1 && y < 7 && slopeAt(jx, jz) < 0.35 && nearRiver > 5 && nearRiver < 34;
      if (!suitable) continue;
      const crowded = found.some((s) => Math.hypot(s.x - jx, s.z - jz) < minSpacing);
      if (crowded) continue;
      found.push({ x: jx, y, z: jz });
    }
  }
  return found;
}

/** Links each settlement to its nearest neighbours; returns unique index pairs. */
export function linkSettlements(points: readonly Point2[], neighbours = 2): Array<[number, number]> {
  const keys = new Set<string>();
  const edges: Array<[number, number]> = [];
  points.forEach((p, i) => {
    const nearest = points
      .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.z - q.z) }))
      .filter((n) => n.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, neighbours);
    for (const { j } of nearest) {
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = `${a}-${b}`;
      if (keys.has(key)) continue;
      keys.add(key);
      edges.push([a, b]);
    }
  });
  return edges;
}
