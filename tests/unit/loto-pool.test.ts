import { expect, it } from "vitest";
import { createLotoPool } from "../../packages/chaos-ui/src/loto-otp/pool.js";

it("shuffles all ten reusable digits and guarantees a changed order on reroll", () => {
  const first = createLotoPool([], () => 0);
  const second = createLotoPool(first, () => 0);
  const values = (pool: typeof first) => pool.map((ball) => ball.digit);

  expect(values(first).sort()).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  expect(values(second).sort()).toEqual(values(first).sort());
  expect(values(second)).not.toEqual(values(first));
  expect(first.every(({ x, y, tilt }) => Math.abs(x) <= 7 && Math.abs(y) <= 6 && Math.abs(tilt) <= 14)).toBe(true);
});
