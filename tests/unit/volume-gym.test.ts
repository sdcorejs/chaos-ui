import { describe, expect, it } from "vitest";
import {
  decayVolumePosition,
  normalizeVolume,
} from "../../packages/chaos-ui/src/volume-gym/math.js";

describe("Volume Gym value math", () => {
  it("clamps to both endpoints and uses steps anchored at min", () => {
    expect(normalizeVolume(-4, 10, 95, 10)).toBe(10);
    expect(normalizeVolume(28, 10, 95, 10)).toBe(30);
    expect(normalizeVolume(94, 10, 95, 10)).toBe(95);
    expect(normalizeVolume(200, 10, 95, 10)).toBe(95);
  });

  it("keeps decimal steps exact and uses safe defaults for invalid bounds", () => {
    expect(normalizeVolume(0.3, 0, 1, 0.1)).toBe(0.3);
    expect(normalizeVolume(0.36, 0.05, 0.95, 0.1)).toBe(0.35);
    expect(normalizeVolume(Number.NaN, 0, 100, 1)).toBe(0);
    expect(normalizeVolume(48.6, 100, 0, 0)).toBe(49);
  });

  it("decays by elapsed seconds rather than a fixed amount per frame", () => {
    const oneFrame = decayVolumePosition(80, 20, 50, 0);
    const twoFrames = decayVolumePosition(
      decayVolumePosition(80, 20, 16, 0),
      20,
      34,
      0,
    );
    expect(oneFrame).toBe(79);
    expect(oneFrame).toBeCloseTo(twoFrames);
    expect(decayVolumePosition(4, 20, 300, 0)).toBe(0);
  });
});
