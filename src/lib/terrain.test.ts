import { test } from "node:test";
import assert from "node:assert/strict";
import {
  STUDY_AREA,
  TERRAIN,
  fbm,
  findSettlements,
  heightAt,
  linkSettlements,
  riverX,
  valueNoise,
} from "./terrain.ts";

test("value noise stays within 0..1", () => {
  for (let i = 0; i < 500; i++) {
    const v = valueNoise(i * 0.37 - 40, i * 0.71 + 3);
    assert.ok(v >= 0 && v <= 1, `out of range: ${v}`);
  }
});

test("fbm stays within -1..1", () => {
  for (let i = 0; i < 500; i++) {
    const v = fbm(i * 0.13, -i * 0.29);
    assert.ok(v >= -1 && v <= 1, `out of range: ${v}`);
  }
});

test("heights are deterministic", () => {
  assert.equal(heightAt(12.5, -30), heightAt(12.5, -30));
});

test("the river centre sits lower than the ground beside it", () => {
  for (const z of [-50, -20, 0]) {
    const x = riverX(z);
    assert.ok(heightAt(x, z) < heightAt(x + 25, z), `no valley at z=${z}`);
  }
});

test("settlements sit inside the study area, above water, with spacing", () => {
  const s = findSettlements();
  assert.ok(s.length >= 8, `too few settlements: ${s.length}`);
  for (const p of s) {
    assert.ok(p.x >= STUDY_AREA.minX - 2 && p.x <= STUDY_AREA.maxX + 2);
    assert.ok(p.z >= STUDY_AREA.minZ - 2 && p.z <= STUDY_AREA.maxZ + 2);
    assert.ok(p.y > TERRAIN.waterLevel);
  }
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      assert.ok(Math.hypot(s[i].x - s[j].x, s[i].z - s[j].z) >= 9);
    }
  }
});

test("links are unique pairs of distinct settlements", () => {
  const pts = [
    { x: 0, z: 0 },
    { x: 1, z: 0 },
    { x: 5, z: 0 },
    { x: 9, z: 0 },
  ];
  const edges = linkSettlements(pts, 2);
  const keys = edges.map(([a, b]) => `${a}-${b}`);
  assert.equal(new Set(keys).size, keys.length);
  for (const [a, b] of edges) assert.ok(a < b);
  assert.ok(edges.length >= pts.length - 1);
});

test("linkSettlements returns nothing for a single point", () => {
  assert.deepEqual(linkSettlements([{ x: 0, z: 0 }]), []);
});
