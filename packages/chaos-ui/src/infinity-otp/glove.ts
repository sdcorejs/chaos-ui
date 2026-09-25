import { html, svg } from "lit";

// The artwork shares the stage's 500×560 coordinate system, so socket
// percentages in styles.ts map directly onto the bezels drawn here. Every
// socket sits on rigid armor (knuckles, thumb root, back of hand); only the
// fingers move during the snap, so mounted stones never leave the glove.

type Finger = {
  name: "index" | "middle" | "ring" | "pinky";
  x: number;
  y: number;
  angle: number;
  width: number;
  length: number;
};

const n = (value: number) => Math.round(value * 10) / 10;
/** An armor plate from y0 up to y1 whose upper edge is domed. */
const plate = (y0: number, y1: number, h0: number, h1: number) =>
  `M${n(-h0)} ${n(y0)}L${n(-h1)} ${n(y1)}Q0 ${n(y1 - h1 * 0.9)} ${n(h1)} ${n(y1)}L${n(h0)} ${n(y0)}Z`;
/** A pointed fingertip plate from y0 up to the tip at y1. */
const tip = (y0: number, y1: number, h: number) => {
  const shoulder = n(y0 - (y0 - y1) * 0.62);
  return `M${n(-h)} ${n(y0)}C${n(-h)} ${shoulder} ${n(-h * 0.5)} ${n(y1 + 3)} 0 ${n(y1)}C${n(h * 0.5)} ${n(y1 + 3)} ${n(h)} ${shoulder} ${n(h)} ${n(y0)}Z`;
};
const diamond = (y: number, size = 7) =>
  `M0 ${n(y - size * 1.3)}L${size} ${n(y)}L0 ${n(y + size * 1.3)}L${-size} ${n(y)}Z`;

// Drawn back to front. The thumb follows the middle finger so, pressed
// against it, the thumb tip overlaps the curled fingertip; the index finger
// and back-of-hand armor are drawn later and hide the rest of the thumb.
const fingers: Finger[] = [
  { name: "pinky", x: 430, y: 284, angle: 14, width: 52, length: 140 },
  { name: "ring", x: 340, y: 256, angle: 6, width: 60, length: 184 },
  { name: "middle", x: 250, y: 246, angle: -1, width: 64, length: 204 },
  { name: "index", x: 160, y: 268, angle: -8, width: 60, length: 182 },
];

const finger = ({ name, x, y, angle, width, length: l }: Finger) => {
  const h = width / 2;
  return svg`<g transform=${`translate(${x} ${y}) rotate(${angle})`}>
    <g class=${`finger f-${name}`}>
      <rect class="joint" x=${n(-h * 0.82)} y=${n(-l * 0.98)} width=${n(h * 1.64)}
        height=${n(l * 0.98 + 12)} rx=${n(h * 0.8)} />
      <path class="plate" fill="url(#ig-plate)" d=${tip(-l * 0.64, -l, h * 0.88)} />
      <path class="plate" fill="url(#ig-plate)" d=${plate(-l * 0.38, -l * 0.68, h * 0.94, h * 0.9)} />
      <path class="plate" fill="url(#ig-plate)" d=${plate(12, -l * 0.42, h, h * 0.96)} />
      <path class="rivet" d=${diamond(-l * 0.3)} />
      <path class="shine" d=${`M${n(-h * 0.36)} ${n(-l * 0.1)}L${n(-h * 0.3)} ${n(-l * 0.38)}M${n(-h * 0.3)} ${n(-l * 0.48)}L${n(-h * 0.26)} ${n(-l * 0.64)}M${n(-h * 0.24)} ${n(-l * 0.72)}L${n(-h * 0.12)} ${n(-l * 0.88)}`} />
    </g>
  </g>`;
};

const thumb = svg`<g transform="translate(122 320) rotate(-32)">
  <g class="finger f-thumb">
    <rect class="joint" x="-21" y="-146" width="42" height="164" rx="20" />
    <path class="plate" fill="url(#ig-plate)" d=${tip(-74, -150, 22)} />
    <path class="plate" fill="url(#ig-plate)" d=${plate(18, -82, 25, 23.5)} />
    <path class="rivet" d=${diamond(-44)} />
    <path class="shine" d="M-9 -6L-8 -60M-8 -92L-5 -126" />
  </g>
</g>`;

const bezel = (x: number, y: number, prongs: "vertical" | "cross") => svg`<g
  class="bezel"
  transform=${`translate(${x} ${y})`}
>
  <path class="prong" d=${prongs === "cross"
    ? "M0 -50L8 -39L0 -33L-8 -39ZM0 50L8 39L0 33L-8 39ZM-50 0L-39 8L-33 0L-39 -8ZM50 0L39 8L33 0L39 -8Z"
    : "M0 -49L7 -39L0 -34L-7 -39ZM0 49L7 39L0 34L-7 39Z"} />
  <circle class="edge" r="38" fill="url(#ig-bezel)" />
  <circle class="bezel-hole" r="31" />
</g>`;

/** Articulated SVG gauntlet: fingers and thumb are separate groups that pivot at their bases. */
export const gloveArtwork = html`<svg
  part="gauntlet"
  class="gauntlet"
  viewBox="0 0 500 560"
  focusable="false"
  aria-hidden="true"
>
  <defs>
    <linearGradient id="ig-plate" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#4f300f" />
      <stop offset=".2" stop-color="#a8732c" />
      <stop offset=".42" stop-color="#f1cf7e" />
      <stop offset=".52" stop-color="#fff0bd" />
      <stop offset=".66" stop-color="#d49b45" />
      <stop offset=".88" stop-color="#7c5019" />
      <stop offset="1" stop-color="#3f250b" />
    </linearGradient>
    <linearGradient id="ig-armor" x1="0" y1="0" x2=".85" y2="1">
      <stop offset="0" stop-color="#f6dc94" />
      <stop offset=".32" stop-color="#d9a64e" />
      <stop offset=".68" stop-color="#9c6727" />
      <stop offset="1" stop-color="#553310" />
    </linearGradient>
    <linearGradient id="ig-band" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbe6a8" />
      <stop offset=".45" stop-color="#d4a04a" />
      <stop offset="1" stop-color="#7a4d1a" />
    </linearGradient>
    <radialGradient id="ig-bezel" cx=".38" cy=".32" r=".75">
      <stop offset="0" stop-color="#fff3c8" />
      <stop offset=".45" stop-color="#e0ae55" />
      <stop offset="1" stop-color="#6e4518" />
    </radialGradient>
    <linearGradient id="ig-cuff" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#6d4516" />
      <stop offset=".25" stop-color="#d7a24b" />
      <stop offset=".5" stop-color="#f7dd98" />
      <stop offset=".75" stop-color="#c38a37" />
      <stop offset="1" stop-color="#5c3a12" />
    </linearGradient>
    <linearGradient id="ig-inlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6a4c97" />
      <stop offset="1" stop-color="#2a1b47" />
    </linearGradient>
    <radialGradient id="ig-glow">
      <stop offset="0" stop-color="#fffef2" />
      <stop offset=".35" stop-color="#ffe7a3" />
      <stop offset="1" stop-color="#ffcf6e" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ig-streak" x1="1" x2="0" y1="0" y2="0">
      <stop offset="0" stop-color="#fff8dc" stop-opacity=".95" />
      <stop offset="1" stop-color="#ffd98c" stop-opacity="0" />
    </linearGradient>
  </defs>
  ${fingers.slice(0, 3).map(finger)} ${thumb} ${finger(fingers[3]!)}
  <path
    class="edge"
    fill="url(#ig-armor)"
    d="M116 244C160 218 208 206 250 206C308 204 400 226 470 266C480 322 456 380 410 432L172 432C140 384 114 324 116 244Z"
  />
  <path
    class="engrave"
    d="M140 334C160 354 178 384 182 414M452 324C430 350 410 384 402 414M238 358L198 406M352 358L392 402"
  />
  <path
    class="edge"
    fill="url(#ig-armor)"
    d="M164 264C116 266 82 300 84 340C86 380 116 414 166 432L204 432C176 394 166 336 190 292Z"
  />
  <path
    class="edge"
    fill="url(#ig-band)"
    d="M118 242C160 222 206 204 250 202C302 202 350 210 396 228C428 242 456 254 474 266C488 290 488 318 476 334C448 338 424 334 404 328C372 310 310 294 250 292C204 292 170 306 140 314C112 316 102 278 118 242Z"
  />
  <path class="edge" fill="url(#ig-band)" d="M295 300L352 358L295 428L238 358Z" />
  <path class="engrave" d="M257 320L275 338M333 320L315 338M257 396L275 378M333 396L315 378" />
  ${bezel(160, 268, "vertical")} ${bezel(250, 246, "vertical")}
  ${bezel(340, 256, "vertical")} ${bezel(430, 284, "vertical")}
  ${bezel(140, 362, "cross")} ${bezel(295, 358, "cross")}
  <path
    class="edge"
    fill="url(#ig-cuff)"
    d="M176 424L406 424C414 468 424 516 432 560L148 560C156 516 166 468 176 424Z"
  />
  <path fill="url(#ig-inlay)" d="M206 448L376 448C382 488 388 526 394 560L186 560C192 526 198 488 206 448Z" />
  <path class="edge" fill="url(#ig-band)" d="M283 440L299 440L309 480L299 560L283 560L273 480Z" />
  <path
    class="filigree"
    d="M232 468C256 478 260 510 240 534M350 468C326 478 322 510 342 534M214 520C228 512 244 516 248 530M368 520C354 512 338 516 334 530"
  />
  <path class="edge" fill="url(#ig-band)" d="M166 412C240 402 340 402 414 412L418 440C340 430 240 430 164 440Z" />
  <g transform="translate(208 132)">
    <circle class="contact-glow" r="18" fill="url(#ig-glow)" />
    <g class="snap-lines">
      <path d="M0 -26V-44M0 26V44M-26 0H-44M26 0H44M18 -18L31 -31M-18 -18L-31 -31M18 18L31 31M-18 18L-31 31" />
    </g>
  </g>
  <path class="flick-streak" stroke="url(#ig-streak)" d="M197 151A185 185 0 0 0 3 178" />
</svg>`;
