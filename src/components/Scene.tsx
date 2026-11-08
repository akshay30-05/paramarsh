"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { sceneState as S } from "@/lib/sceneState";

// One shard per pillar: competence, transparency, benevolence, consistency.
// Colours are the company tokens: Clarity Blue, Open Cyan, Human Mint, Insight Yellow.
const SHARD_COLORS = ["#246BFE", "#56C8E8", "#CDEFE5", "#F5C451"];

// Faces of one icosahedron are dealt out unevenly so the four shards are
// different sizes. Joined together they form the whole.
const GROUP_SIZES = [7, 5, 5, 3];

// Where each shard drifts to when scattered, and how it is turned.
const SCATTER: [number, number, number][] = [
  [-3.2, 1.7, 0.9],
  [2.8, 2.4, -0.7],
  [-2.1, -2.5, 1.3],
  [3.5, -1.8, 0.5],
];
const SPIN: [number, number, number][] = [
  [0.9, 0.6, 0.3],
  [-0.7, 1.1, -0.4],
  [0.5, -0.9, 0.8],
  [-1.0, -0.5, 0.6],
];

const EDGE_ON_NAVY = new THREE.Color("#F4F7FA");
const EDGE_ON_CLOUD = new THREE.Color("#13233A");

type Shard = { geometry: THREE.BufferGeometry; centroid: THREE.Vector3 };

function buildShards(): Shard[] {
  const base = new THREE.IcosahedronGeometry(1.5, 0); // non-indexed: 20 flat faces
  const pos = base.getAttribute("position");
  const faces: { v: THREE.Vector3[]; c: THREE.Vector3 }[] = [];
  for (let f = 0; f < pos.count / 3; f++) {
    const v = [0, 1, 2].map((k) =>
      new THREE.Vector3().fromBufferAttribute(pos, f * 3 + k),
    );
    const c = new THREE.Vector3()
      .add(v[0])
      .add(v[1])
      .add(v[2])
      .divideScalar(3);
    faces.push({ v, c });
  }
  const axis = new THREE.Vector3(0.6, 0.8, 0.3).normalize();
  faces.sort((a, b) => a.c.dot(axis) - b.c.dot(axis));

  const shards: Shard[] = [];
  let cursor = 0;
  for (const size of GROUP_SIZES) {
    const group = faces.slice(cursor, cursor + size);
    cursor += size;
    const centroid = new THREE.Vector3();
    group.forEach((f) => centroid.add(f.c));
    centroid.divideScalar(group.length);

    const arr: number[] = [];
    group.forEach((f) =>
      f.v.forEach((p) => arr.push(p.x - centroid.x, p.y - centroid.y, p.z - centroid.z)),
    );
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    geometry.computeVertexNormals();
    shards.push({ geometry, centroid });
  }
  base.dispose();
  return shards;
}

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function Shards() {
  const shards = useMemo(() => buildShards(), []);
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const local = useRef({ p: 0, intro: 0, px: 0, py: 0, act: [0, 0, 0, 0] });
  const { size } = useThree();
  const narrow = size.width < 768;
  // Tablets and square-ish windows: shrink so the shards stay beside the copy.
  const aspect = size.width / size.height;
  const fit = narrow ? 1 : Math.min(1, aspect / 1.6);
  // Phones in portrait: scattered shards shrink so they sit under the buttons.
  const phoneFit = narrow ? THREE.MathUtils.clamp(aspect / 0.75, 0.55, 1) : 1;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const s = local.current;
    const t = state.clock.elapsedTime;
    const calm = S.reduced ? 0 : 1;
    const { damp } = THREE.MathUtils;

    s.p = damp(s.p, S.progress, 3.2, dt);
    s.intro = damp(s.intro, 1, 1.5, dt);
    s.px = damp(s.px, S.reduced ? 0 : S.px, 3, dt);
    s.py = damp(s.py, S.reduced ? 0 : S.py, 3, dt);

    const e = s.p * s.p * (3 - 2 * s.p); // eased join amount
    const loose = 1 - e;
    const spread = 1 + (1 - s.intro) * 0.8; // opening move on page load

    // Composition: shards sit right of the headline (below it on phones),
    // then centre as they join.
    const hx = narrow ? 0 : 3.05 * fit;
    const hy = narrow ? -2.0 : 0.1;
    const reach = narrow ? 0.5 : 0.62; // how far apart the shards drift
    g.position.set(hx * loose, hy * loose + (narrow ? 0.45 : 0) * e, 0);
    const base = narrow
      ? THREE.MathUtils.lerp(0.75, 0.52, e)
      : THREE.MathUtils.lerp(0.85, 1, e);
    const looseFit = THREE.MathUtils.lerp(phoneFit, 1, e);
    g.scale.setScalar(base * fit * looseFit * (0.88 + 0.12 * s.intro));
    g.rotation.y = t * 0.12 * calm + s.px * 0.35;
    g.rotation.x = -s.py * 0.2;

    // Edge colour follows the background (navy to cloud).
    const bg = smooth(0.1, 0.4, S.progress);

    shards.forEach((sh, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const sc = SCATTER[i];
      const sp = SPIN[i];
      const float = Math.sin(t * 0.7 + i * 1.7) * 0.12 * loose * calm;
      m.position.set(
        sh.centroid.x + sc[0] * loose * spread * reach,
        sh.centroid.y + sc[1] * loose * spread * reach + float,
        sh.centroid.z + sc[2] * loose * spread * reach,
      );
      const wob = Math.sin(t * 0.5 + i) * 0.06 * loose * calm;
      m.rotation.set(sp[0] * loose + wob, sp[1] * loose, sp[2] * loose);

      // Highlight the shard whose pillar is being read.
      s.act[i] = damp(s.act[i], S.active === i ? 1 : 0, 6, dt);
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = s.act[i] * 0.22;
      m.scale.setScalar(0.985 * (1 + 0.05 * s.act[i]));

      // Edges stay faint on navy and become firm on cloud, and strengthen on
      // the active shard, so pale shards (Human Mint) never disappear.
      const lines = m.children[0] as THREE.LineSegments | undefined;
      if (lines) {
        const lm = lines.material as THREE.LineBasicMaterial;
        lm.transparent = true;
        lm.opacity = Math.min(1, 0.5 + 0.35 * bg + 0.3 * s.act[i]);
        lm.color.lerpColors(EDGE_ON_NAVY, EDGE_ON_CLOUD, bg);
      }
    });
  });

  return (
    <group ref={group}>
      {shards.map((sh, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          geometry={sh.geometry}
        >
          <meshStandardMaterial
            color={SHARD_COLORS[i]}
            emissive={SHARD_COLORS[i]}
            emissiveIntensity={0}
            roughness={0.38}
            metalness={0.05}
            flatShading
            side={THREE.DoubleSide}
          />
          <Edges threshold={20} color="#F4F7FA" />
        </mesh>
      ))}
    </group>
  );
}

interface SceneProps {
  onReady?: () => void;
  /** False once page content fully covers the canvas: rendering pauses. */
  live?: boolean;
}

export default function Scene({ onReady, live = true }: SceneProps) {
  const [maxDpr, setMaxDpr] = useState(1.75);
  return (
    <Canvas
      flat
      frameloop={live ? "always" : "never"}
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 7.5], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setMaxDpr(1)}
        onIncline={() => setMaxDpr(1.75)}
      />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 6]} intensity={2.4} />
      <directionalLight position={[-5, -2, 3]} intensity={0.9} color="#56C8E8" />
      <Shards />
    </Canvas>
  );
}
