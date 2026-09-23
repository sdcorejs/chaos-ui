import { html } from "lit";

/** Inline artwork stays inside each shadow root and requires no remote assets. */
export const gloveSvg = html`<svg
  part="gauntlet"
  class="gauntlet"
  viewBox="0 0 500 560"
  aria-hidden="true"
>
  <defs>
    <linearGradient id="infinity-metal" x2="100%" y2="100%">
      <stop stop-color="#f9dc91" />
      <stop offset=".38" stop-color="#a77a43" />
      <stop offset=".76" stop-color="#594234" />
      <stop offset="1" stop-color="#d5ae65" />
    </linearGradient>
    <linearGradient id="infinity-edge" x2="90%" y2="100%">
      <stop stop-color="#fff0b8" />
      <stop offset=".53" stop-color="#ae8749" />
      <stop offset="1" stop-color="#574333" />
    </linearGradient>
    <linearGradient id="infinity-palm" x2="100%" y2="100%">
      <stop stop-color="#efd08a" />
      <stop offset=".46" stop-color="#84603d" />
      <stop offset="1" stop-color="#392f3d" />
    </linearGradient>
  </defs>
  <g class="hand">
    <path
      class="arm-shadow"
      d="M168 385 L378 382 L386 547 Q272 571 155 540 Z"
    />
    <path
      class="arm"
      d="M167 381 Q266 416 374 380 L390 540 Q270 557 151 535 Z"
    />
    <g class="snap-fingers">
      <path
        class="finger"
        d="M154 329 L147 139 Q149 107 176 100 Q208 96 214 130 L224 313 Z"
      />
      <path
        class="finger"
        d="M219 307 L219 90 Q219 50 252 47 Q286 47 288 86 L293 316 Z"
      />
      <path
        class="finger"
        d="M290 308 L296 126 Q296 89 328 89 Q359 90 360 126 L356 327 Z"
      />
      <path
        class="finger"
        d="M354 326 L368 198 Q374 165 402 168 Q429 170 428 204 L409 351 Z"
      />
    </g>
    <path
      class="thumb"
      d="M165 344 Q131 304 110 296 L69 283 Q43 280 38 306 Q32 333 58 345 L121 389 Z"
    />
    <path
      class="palm"
      d="M152 310 Q246 281 367 316 Q415 332 414 385 Q407 443 366 471 Q273 507 165 460 Q115 438 105 397 Q99 365 152 310 Z"
    />
    <path
      class="palm-detail"
      d="M151 369 Q251 333 368 368 M167 419 Q253 450 353 418 M228 332 L208 407 M300 330 L321 415"
    />
    <path
      class="cuff"
      d="M151 470 Q266 504 380 465 L390 506 Q266 542 149 506 Z"
    />
    <path
      class="cuff-detail"
      d="M165 489 Q265 516 371 486 M214 521 L208 535 M292 522 L296 535"
    />
  </g>
</svg>`;
