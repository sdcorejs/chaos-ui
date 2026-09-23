import { html } from "lit";

/** Faceted, articulated gauntlet artwork bundled with each component instance. */
export const gloveSvg = html`<svg
  part="gauntlet"
  class="gauntlet"
  viewBox="0 0 500 560"
  aria-hidden="true"
>
  <defs>
    <linearGradient id="infinity-brass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stop-color="#f8e4a8" />
      <stop offset=".23" stop-color="#bf925c" />
      <stop offset=".58" stop-color="#654c43" />
      <stop offset="1" stop-color="#d7ad6c" />
    </linearGradient>
    <linearGradient id="infinity-armor" x1="0%" y1="0%" x2="94%" y2="100%">
      <stop stop-color="#646178" />
      <stop offset=".27" stop-color="#34354f" />
      <stop offset=".7" stop-color="#171c34" />
      <stop offset="1" stop-color="#35354d" />
    </linearGradient>
    <linearGradient id="infinity-plate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stop-color="#8b8290" />
      <stop offset=".22" stop-color="#45445d" />
      <stop offset=".68" stop-color="#252b43" />
      <stop offset="1" stop-color="#131c35" />
    </linearGradient>
    <radialGradient id="infinity-glyph-gradient">
      <stop stop-color="#bd9d71" />
      <stop offset=".36" stop-color="#55506a" />
      <stop offset="1" stop-color="#20253d" />
    </radialGradient>
  </defs>
  <g class="orbit" fill="none">
    <ellipse cx="250" cy="285" rx="194" ry="245" />
    <path d="M75 233 Q250 28 428 232 M73 351 Q250 535 429 351" />
  </g>
  <g class="hand">
    <path class="arm-shadow" d="M162 425 L374 421 L397 538 Q275 574 137 538 Z" />
    <path class="arm" d="M174 421 L365 419 L386 537 L357 550 L158 546 L145 535 Z" />
    <path class="arm-panel" d="M182 433 L350 432 L369 525 Q265 548 167 526 Z" />
    <path class="arm-etch" d="M182 483 L359 483 M210 505 L327 505" />

    <g class="snap-fingers">
      <path class="finger" d="M151 316 L149 145 Q149 126 159 112 L176 96 L191 97 L207 114 Q215 127 215 146 L222 316 Z" />
      <path class="finger" d="M218 312 L218 96 Q218 76 230 62 L247 46 L266 47 L284 65 Q293 77 293 96 L293 318 Z" />
      <path class="finger" d="M287 312 L296 137 Q297 113 309 101 L328 88 L345 92 L361 111 Q367 124 364 145 L357 325 Z" />
      <path class="finger" d="M354 325 L368 207 Q371 185 383 174 L399 165 L414 171 L426 187 Q434 201 429 220 L411 355 Z" />
      <path class="finger-plate" d="M157 147 L166 120 L181 110 L197 125 L207 150 L206 226 L160 223 Z" />
      <path class="finger-plate" d="M226 98 L238 69 L256 57 L274 72 L285 101 L282 207 L226 207 Z" />
      <path class="finger-plate" d="M304 145 L315 113 L331 101 L350 119 L356 149 L350 224 L300 218 Z" />
      <path class="finger-plate" d="M376 215 L388 184 L405 179 L418 198 L416 224 L405 281 L368 276 Z" />
      <path class="finger-seam" d="M155 250 L215 256 M157 285 L218 290 M222 240 L289 240 M222 278 L290 277 M297 247 L359 251 M293 280 L357 284 M364 300 L417 310" />
      <path class="finger-glint" d="M165 137 L171 118 M234 87 L243 68 M312 134 L320 113 M385 205 L393 185" />
    </g>

    <path class="thumb" d="M157 352 L122 315 L89 291 L67 288 L47 302 L36 321 L47 340 L107 378 L139 402 Z" />
    <path class="thumb-plate" d="M122 325 L93 300 L69 297 L52 313 L53 329 L104 359 L139 382 Z" />
    <path class="thumb-seam" d="M104 356 L130 334 M74 337 L91 314" />

    <path class="palm" d="M144 305 L214 290 L291 289 L365 309 L402 337 L415 374 L403 422 L368 461 L310 485 L253 494 L183 478 L132 446 L106 404 L110 359 Z" />
    <path class="palm-rim" d="M151 319 L215 305 L291 304 L359 324 L390 346 L399 376 L388 414 L357 447 L306 468 L252 478 L187 463 L143 434 L122 399 L125 362 Z" />
    <path class="palm-panel" d="M168 340 L220 321 L291 319 L346 342 L369 368 L363 409 L330 441 L283 453 L222 450 L174 428 L146 394 L146 363 Z" />
    <path class="palm-etch" d="M168 350 L199 375 L194 411 M347 352 L321 376 L328 417 M212 329 L226 351 M290 325 L283 349 M178 433 L207 420 M338 435 L306 421" />
    <path class="palm-glyph" d="M250 337 L287 355 L304 394 L285 429 L249 446 L215 426 L197 390 L216 355 Z M250 350 L278 365 L290 392 L275 418 L250 432 L226 416 L212 390 L226 365 Z" />

    <path class="cuff" d="M151 465 Q251 504 377 463 L388 498 Q268 542 145 501 Z" />
    <path class="cuff-panel" d="M159 476 Q263 509 370 475 L374 492 Q269 525 157 493 Z" />
    <path class="cuff-detail" d="M167 489 Q265 516 363 488 M183 514 L207 540 M337 513 L320 540" />
    <circle class="rivet" cx="145" cy="374" r="4" />
    <circle class="rivet" cx="370" cy="375" r="4" />
    <circle class="rivet" cx="182" cy="449" r="4" />
    <circle class="rivet" cx="337" cy="448" r="4" />
  </g>
</svg>`;
