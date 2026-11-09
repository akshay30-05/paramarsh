"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { TERRAIN, findSettlements, heightAt, linkSettlements } from "@/lib/terrain";
import { journeyState } from "@/lib/journeyState";

// Palette (creative blueprint). Shading mixes these; no other hues are added.
const C = {
  charcoal: "#111a24",
  slate: "#263d52",
  sage: "#a9b8b1",
  ochre: "#b58a52",
  paper: "#e9e8e2",
};
const FOG = new THREE.Color(C.slate).lerp(new THREE.Color(C.ochre), 0.45);
const SUN = new THREE.Vector3(-0.55, 0.42, -0.72).normalize();
const FOG_DENSITY = 0.0066;

// Camera path: wide dawn view -> forward travel -> descent to an overview.
const PATH_POS = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 9, 66),
  new THREE.Vector3(5, 13, 34),
  new THREE.Vector3(2, 26, 12),
  new THREE.Vector3(0, 60, 4),
]);
const PATH_LOOK = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 7, -90),
  new THREE.Vector3(0, 3, -70),
  new THREE.Vector3(0, 0, -40),
  new THREE.Vector3(0, 0, -21),
]);

const LAYER_DAMP = 3;
const CAMERA_DAMP = 2.2;

function damp(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

const fogChunk = /* glsl */ `
  float fogFactor(vec3 world) {
    float d = length(world - cameraPosition) * uFogDensity;
    return 1.0 - exp(-d * d);
  }
`;

// ---------- Terrain ----------

const terrainVertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vH = position.y;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const terrainFragment = /* glsl */ `
  uniform vec3 uLow; uniform vec3 uMid; uniform vec3 uHigh;
  uniform vec3 uSage; uniform vec3 uPaper; uniform vec3 uOchre; uniform vec3 uFog;
  uniform vec3 uSun; uniform float uFogDensity;
  uniform float uGeo; uniform float uEnv; uniform float uFocus;
  varying vec3 vWorld; varying vec3 vNormal; varying float vH;
  ${fogChunk}
  float isoLine(float v) {
    float w = fwidth(v);
    return 1.0 - min(abs(fract(v - 0.5) - 0.5) / max(w, 1e-4), 1.0);
  }
  void main() {
    vec3 n = normalize(vNormal);
    vec3 col = mix(uLow, uMid, smoothstep(-2.0, 9.0, vH));
    col = mix(col, uHigh, smoothstep(14.0, 36.0, vH));

    // Environment: vegetation on gentle, low ground.
    // Environment: vegetation along the river corridor and on gentle low ground.
    float veg = smoothstep(0.78, 0.94, n.y) * smoothstep(-4.8, -3.6, vH) * (1.0 - smoothstep(0.5, 4.5, vH));
    col = mix(col, uSage * 0.62, veg * uEnv * 0.9);

    float diff = max(dot(n, uSun), 0.0);
    vec3 lit = col * (0.36 + 0.95 * diff) + uOchre * 0.14 * diff;
    // Focus dims the ground, except what the environment layer is showing.
    lit *= mix(1.0, 0.6, uFocus * (1.0 - veg * uEnv));

    // Geography: contour lines, with a stronger line every fifth.
    float minor = isoLine(vH / 1.6);
    float major = isoLine(vH / 8.0);
    lit = mix(lit, uPaper, clamp(minor * 0.4 + major * 0.55, 0.0, 1.0) * uGeo);

    gl_FragColor = vec4(mix(lit, uFog, fogFactor(vWorld)), 1.0);
    #include <colorspace_fragment>
  }
`;

function useTerrainGeometry(segments: number): THREE.BufferGeometry {
  const geometry = useMemo(() => {
    const width = TERRAIN.maxX - TERRAIN.minX;
    const depth = TERRAIN.maxZ - TERRAIN.minZ;
    const g = new THREE.PlaneGeometry(width, depth, segments, Math.round(segments * (depth / width)));
    g.rotateX(-Math.PI / 2);
    g.translate((TERRAIN.minX + TERRAIN.maxX) / 2, 0, (TERRAIN.minZ + TERRAIN.maxZ) / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
    }
    g.computeVertexNormals();
    return g;
  }, [segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function sharedUniforms() {
  return {
    uFog: { value: FOG.clone() },
    uFogDensity: { value: FOG_DENSITY },
  };
}

function Terrain({ segments }: { segments: number }) {
  const geometry = useTerrainGeometry(segments);
  const def = useMemo<THREE.ShaderMaterialParameters>(
    () => ({
      vertexShader: terrainVertex,
      fragmentShader: terrainFragment,
      uniforms: {
        ...sharedUniforms(),
        uLow: { value: new THREE.Color(C.charcoal).lerp(new THREE.Color(C.slate), 0.35) },
        uMid: { value: new THREE.Color(C.slate) },
        uHigh: { value: new THREE.Color(C.slate).lerp(new THREE.Color(C.sage), 0.45) },
        uSage: { value: new THREE.Color(C.sage) },
        uPaper: { value: new THREE.Color(C.paper) },
        uOchre: { value: new THREE.Color(C.ochre) },
        uSun: { value: SUN.clone() },
        uGeo: { value: 0 },
        uEnv: { value: 0 },
        uFocus: { value: 0 },
      },
    }),
    [],
  );
  const material = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, dt) => {
    const m = material.current;
    if (!m) return;
    const layer = journeyState.layer;
    const u = m.uniforms;
    u.uGeo.value = damp(u.uGeo.value, layer === "geography" ? 1 : 0, LAYER_DAMP, dt);
    u.uEnv.value = damp(u.uEnv.value, layer === "environment" ? 1 : 0, LAYER_DAMP, dt);
    u.uFocus.value = damp(u.uFocus.value, layer ? 1 : 0, LAYER_DAMP, dt);
  });

  return (
    <mesh geometry={geometry}>
      <shaderMaterial ref={material} args={[def]} />
    </mesh>
  );
}

// ---------- Water ----------

const waterFragment = /* glsl */ `
  uniform vec3 uSlate; uniform vec3 uSage; uniform vec3 uFog; uniform float uFogDensity; uniform float uEnv;
  varying vec3 vWorld;
  ${fogChunk}
  void main() {
    vec3 col = mix(uSlate * 0.85, uSage, 0.12 + uEnv * 0.55);
    gl_FragColor = vec4(mix(col, uFog, fogFactor(vWorld)), 1.0);
    #include <colorspace_fragment>
  }
`;

const worldVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

function Water() {
  const def = useMemo<THREE.ShaderMaterialParameters>(
    () => ({
      vertexShader: worldVertex,
      fragmentShader: waterFragment,
      uniforms: {
        ...sharedUniforms(),
        uSlate: { value: new THREE.Color(C.slate) },
        uSage: { value: new THREE.Color(C.sage) },
        uEnv: { value: 0 },
      },
    }),
    [],
  );
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, dt) => {
    const m = material.current;
    if (!m) return;
    const u = m.uniforms.uEnv;
    u.value = damp(u.value, journeyState.layer === "environment" ? 1 : 0, LAYER_DAMP, dt);
  });
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[(TERRAIN.minX + TERRAIN.maxX) / 2, TERRAIN.waterLevel, (TERRAIN.minZ + TERRAIN.maxZ) / 2]}
    >
      <planeGeometry args={[TERRAIN.maxX - TERRAIN.minX, TERRAIN.maxZ - TERRAIN.minZ]} />
      <shaderMaterial ref={material} args={[def]} />
    </mesh>
  );
}

// ---------- People and economics ----------

const pointVertex = /* glsl */ `
  uniform float uSize; uniform float uPixelRatio;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (60.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = 1.0 - smoothstep(0.16, 0.22, d);
    float halo = (1.0 - smoothstep(0.0, 0.5, d)) * 0.35;
    float a = max(core, halo) * uOpacity;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

const routeVertex = /* glsl */ `
  attribute float along;
  varying float vAlong;
  void main() {
    vAlong = along;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const routeFragment = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity; uniform float uTime;
  varying float vAlong;
  void main() {
    float dash = step(0.45, fract(vAlong * 0.22 - uTime * 0.5));
    gl_FragColor = vec4(uColor, uOpacity * (0.3 + 0.7 * dash));
    #include <colorspace_fragment>
  }
`;

const ROUTE_SAMPLES = 18;
const LIFT = 0.45;

function useSettlementData() {
  return useMemo(() => {
    const settlements = findSettlements();
    const edges = linkSettlements(settlements, 2);
    const points = new Float32Array(settlements.flatMap((s) => [s.x, s.y + LIFT, s.z]));

    const pos: number[] = [];
    const along: number[] = [];
    for (const [a, b] of edges) {
      const p = settlements[a];
      const q = settlements[b];
      let dist = 0;
      let prev: THREE.Vector3 | null = null;
      for (let i = 0; i < ROUTE_SAMPLES; i++) {
        const t = i / (ROUTE_SAMPLES - 1);
        const x = p.x + (q.x - p.x) * t;
        const z = p.z + (q.z - p.z) * t;
        const v = new THREE.Vector3(x, Math.max(heightAt(x, z), TERRAIN.waterLevel) + LIFT, z);
        if (prev) {
          const segStart = dist;
          dist += prev.distanceTo(v);
          pos.push(prev.x, prev.y, prev.z, v.x, v.y, v.z);
          along.push(segStart, dist);
        }
        prev = v;
      }
    }
    return { points, routes: new Float32Array(pos), along: new Float32Array(along) };
  }, []);
}

function PeopleAndRoutes() {
  const { points, routes, along } = useSettlementData();

  const pointDef = useMemo<THREE.ShaderMaterialParameters>(
    () => ({
      vertexShader: pointVertex,
      fragmentShader: pointFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color(C.ochre) },
        uOpacity: { value: 0 },
        uSize: { value: 34 },
        uPixelRatio: { value: 1 },
      },
    }),
    [],
  );
  const routeDef = useMemo<THREE.ShaderMaterialParameters>(
    () => ({
      vertexShader: routeVertex,
      fragmentShader: routeFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color(C.paper) },
        uOpacity: { value: 0 },
        uTime: { value: 0 },
      },
    }),
    [],
  );
  const pointMat = useRef<THREE.ShaderMaterial>(null);
  const routeMat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, dt) => {
    const p = pointMat.current;
    const r = routeMat.current;
    if (!p || !r) return;
    const layer = journeyState.layer;
    const people = layer === "people" ? 1 : layer === "economics" ? 0.55 : 0;
    p.uniforms.uPixelRatio.value = state.viewport.dpr;
    p.uniforms.uOpacity.value = damp(p.uniforms.uOpacity.value, people, LAYER_DAMP, dt);
    r.uniforms.uOpacity.value = damp(r.uniforms.uOpacity.value, layer === "economics" ? 0.9 : 0, LAYER_DAMP, dt);
    if (!journeyState.reduced) r.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[routes, 3]} />
          <bufferAttribute attach="attributes-along" args={[along, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={routeMat} args={[routeDef]} />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <shaderMaterial ref={pointMat} args={[pointDef]} />
      </points>
    </>
  );
}

// ---------- Sky and camera ----------

function makeSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const horizon = `#${FOG.getHexString(THREE.SRGBColorSpace)}`;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, C.charcoal);
    g.addColorStop(0.5, C.slate);
    g.addColorStop(0.78, horizon);
    g.addColorStop(1, horizon);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Sky() {
  const texture = useMemo(() => makeSkyTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <primitive attach="background" object={texture} />;
}

const FOV_WIDE = 45;
const FOV_PORTRAIT = 62;

function CameraRig() {
  const progress = useRef(journeyState.target);
  const look = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const fov = state.viewport.aspect < 0.9 ? FOV_PORTRAIT : FOV_WIDE;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    const target = journeyState.target;
    progress.current = journeyState.reduced
      ? target
      : damp(progress.current, target, CAMERA_DAMP, Math.min(dt, 0.1));
    const t = Math.min(1, Math.max(0, progress.current));
    PATH_POS.getPoint(t, camera.position);
    PATH_LOOK.getPoint(t, look.current);
    if (!journeyState.reduced) {
      // A slow, breathing drift: the place is alive, the camera never still.
      const time = state.clock.elapsedTime;
      camera.position.x += Math.sin(time * 0.12) * 0.8;
      camera.position.y += Math.sin(time * 0.17) * 0.35;
    }
    camera.lookAt(look.current);
  });
  return null;
}

// ---------- Canvas ----------

type Props = {
  live: boolean;
  onReady?: () => void;
};

export default function TerrainScene({ live, onReady }: Props) {
  const [dpr, setDpr] = useState(1.6);
  const [segments] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 150 : 230));

  return (
    <Canvas
      frameloop={live ? "always" : "never"}
      dpr={dpr}
      gl={{ antialias: true, toneMapping: THREE.NoToneMapping, powerPreference: "high-performance" }}
      camera={{ fov: 45, near: 0.5, far: 600, position: [0, 9, 66] }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Sky />
      <CameraRig />
      <Terrain segments={segments} />
      <Water />
      <PeopleAndRoutes />
    </Canvas>
  );
}
