import { html } from "lit";

// A stone's cut follows its socket, never the digit written on it. Source
// stones share a neutral irregular cut and can be taken any number of times.
const cuts = [
  "M32 3 C40 13 52 24 52 37 C52 50 43 60 31 61 C19 60 11 50 11 38 C11 26 23 12 32 3Z",
  "M31 4 C45 4 56 17 57 31 C57 46 47 59 32 60 C17 60 7 48 7 32 C7 17 17 4 31 4Z",
  "M27 4 L44 8 L58 25 L54 43 L37 60 L18 57 L5 40 L9 19Z",
  "M17 8 L46 6 L59 20 L56 47 L43 59 L17 57 L5 45 L6 22Z",
  "M31 2 C43 18 54 20 60 32 C48 40 46 52 32 62 C19 49 16 43 3 32 C16 21 19 16 31 2Z",
  "M22 5 L45 9 L59 27 L53 49 L35 62 L13 54 L4 36 L10 17Z",
] as const;

/** Faceted SVG with an organic silhouette and facets independent of the number. */
export const gemSvg = (socket?: number) => html`<svg
  class="gem-art"
  viewBox="0 0 64 64"
  focusable="false"
  aria-hidden="true"
>
  <path class="gem-shadow" d=${cuts[socket ?? 5]} transform="translate(0 2)" />
  <path class="gem-core" d=${cuts[socket ?? 5]} />
  <path class="gem-light" d="M30 7 L47 20 L37 29 L19 26Z" />
  <path class="gem-facet" d="M19 26 L37 29 L48 46 L32 57 L13 43Z" />
  <path class="gem-line" d="M30 7 L19 26 L32 57 M47 20 L37 29 L48 46 M19 26 L37 29" />
  <path class="gem-glint" d="M22 14 L29 8 M46 15 L51 22" />
</svg>`;
