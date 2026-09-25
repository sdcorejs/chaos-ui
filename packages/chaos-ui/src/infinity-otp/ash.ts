import { html } from "lit";

// Ash flakes for the success dissolve, sampled once over the glove silhouette
// in the stage's 500×560 coordinate system. A fixed seed keeps every render
// and instance identical. Each flake leaves when the dissolve edge, sweeping
// left to right (see `ash-sweep` in styles.ts), reaches its position.

const RIG_DELAY_MS = 350;
const SWEEP_MS = 1280;

let seed = 20_241;
const rand = () => (seed = (seed * 16_807) % 2_147_483_647) / 2_147_483_647;
const pick = <T>(items: readonly T[]) => items[Math.floor(rand() * items.length)]!;

const gold = ["#fff0bd", "#f6dc94", "#e0ae55", "#b07a32", "#6e4518"] as const;
const cuff = ["#6a4c97", "#45306e", "#d7a24b", "#8a5a20"] as const;
const gems = ["#70d8d4", "#e3a6ff", "#e89abb", "#9ee4a4", "#f3b37a", "#f1d680"];
// Finger and thumb axes (base x/y, tip x/y, half width), matching glove.ts.
const limbs = [
  [160, 268, 135, 88, 26],
  [250, 246, 246, 42, 28],
  [340, 256, 359, 73, 26],
  [430, 284, 464, 148, 22],
  [122, 320, 42, 193, 22],
] as const;
const sockets = [
  [160, 268],
  [250, 246],
  [340, 256],
  [430, 284],
  [140, 362],
  [295, 358],
] as const;

const points: [number, number, string][] = [];
for (const [x0, y0, x1, y1, h] of limbs) {
  const length = Math.hypot(x1 - x0, y1 - y0);
  for (let i = 0; i < 18; i++) {
    const along = rand(),
      side = (rand() * 2 - 1) * h;
    points.push([
      x0 + (x1 - x0) * along - ((y1 - y0) / length) * side,
      y0 + (y1 - y0) * along + ((x1 - x0) / length) * side,
      pick(gold),
    ]);
  }
}
for (let i = 0; i < 56; i++) {
  const angle = rand() * Math.PI * 2,
    radius = Math.sqrt(rand());
  points.push([295 + Math.cos(angle) * radius * 165, 330 + Math.sin(angle) * radius * 92, pick(gold)]);
}
for (let i = 0; i < 34; i++) {
  const y = 424 + rand() * 130,
    flare = (y - 424) / 136,
    left = 176 - 28 * flare,
    right = 406 + 26 * flare;
  points.push([left + rand() * (right - left), y, pick(cuff)]);
}
sockets.forEach(([x, y], index) => {
  for (let i = 0; i < 4; i++)
    points.push([x + (rand() * 2 - 1) * 22, y + (rand() * 2 - 1) * 22, gems[index]!]);
});

/** Number of flakes rendered while a success dissolve plays. */
export const ASH_FLAKE_COUNT = points.length;

/** Decorative flakes; the stage's `.dust` layer animates them (or holds them still under reduced motion). */
export const ashFlakes = points.map(([x, y, color], index) => {
  const across = x / 500,
    down = y / 560;
  // When the tilted sweep edge crosses this point.
  const leave = RIG_DELAY_MS + SWEEP_MS * (0.25 + across / 2 + 0.15 * (down - 0.5));
  const style = [
    `--x:${(across * 100).toFixed(1)}%`,
    `--y:${(down * 100).toFixed(1)}%`,
    `--dx:${Math.round(80 + rand() * 190)}px`,
    `--dy:${-Math.round(40 + rand() * 170)}px`,
    `--r:${Math.round((rand() < 0.5 ? -1 : 1) * (90 + rand() * 420))}deg`,
    `--s:${(3.5 + rand() * 7.5).toFixed(1)}px`,
    `--c:${color}`,
    `--d:${Math.round(leave - 60 + rand() * 120)}ms`,
    `--t:${Math.round(1300 + rand() * 900)}ms`,
  ].join(";");
  return html`<i class=${`k${index % 3}`} style=${style}></i>`;
});
