import { html } from "lit";

/** Original SVG warrior bust. Its raised arm disappears beneath the glove cuff. */
export const titanSvg = html`<svg
  part="titan"
  class="titan"
  viewBox="0 0 500 560"
  aria-hidden="true"
>
  <defs>
    <radialGradient id="titan-aura">
      <stop stop-color="#956ad1" stop-opacity=".47" />
      <stop offset="1" stop-color="#956ad1" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="titan-skin" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#9f7dba" />
      <stop offset=".27" stop-color="#73518c" />
      <stop offset=".65" stop-color="#513b65" />
      <stop offset="1" stop-color="#211b32" />
    </linearGradient>
    <linearGradient id="titan-armor" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#f1d294" />
      <stop offset=".3" stop-color="#947143" />
      <stop offset=".58" stop-color="#342b37" />
      <stop offset="1" stop-color="#d7ac68" />
    </linearGradient>
  </defs>
  <ellipse cx="116" cy="230" rx="153" ry="230" fill="url(#titan-aura)" />
  <g class="titan-body">
    <path d="M-58 566 Q-38 369 34 306 Q90 269 160 300 Q224 348 259 449 L293 560 Z" fill="#111321" stroke="#a17a4c" stroke-width="7" />
    <path d="M61 335 Q110 295 165 325 Q221 381 282 494 L353 563 L188 568 Q180 481 105 448 Z" fill="url(#titan-skin)" stroke="#302944" stroke-width="8" />
    <path d="M115 332 Q170 329 199 370 L232 422 Q192 449 166 484 Q139 438 85 404 Z" fill="url(#titan-armor)" stroke="#f0ca80" stroke-width="5" />
    <path d="M174 410 Q224 432 278 503" fill="none" stroke="#e9c074" stroke-width="12" opacity=".7" />
    <path d="M178 426 Q228 446 274 509" fill="none" stroke="#262236" stroke-width="7" />
    <path d="M5 363 Q58 335 112 369 L160 437 L135 560 L-46 560 Z" fill="url(#titan-armor)" stroke="#ddba72" stroke-width="6" />
    <path d="M-28 402 L57 391 L101 447 L75 551 M46 385 L90 454 L60 559 M116 445 L145 477" fill="none" stroke="#201d2c" stroke-width="14" />
    <path d="M-24 411 L56 407 L82 452 M7 490 L69 479 M90 531 L126 481" fill="none" stroke="#f7db98" stroke-width="3" opacity=".55" />
    <path d="M144 335 Q174 328 195 363 L216 397 L191 414 L163 377 Z" fill="#a17b55" stroke="#e4c47f" stroke-width="4" />
  </g>
  <g class="titan-face">
    <path d="M59 279 L151 282 L159 333 Q113 359 51 323 Z" fill="#554067" stroke="#251e36" stroke-width="5" />
    <ellipse cx="31" cy="191" rx="16" ry="29" fill="#694c7d" stroke="#30223d" stroke-width="4" />
    <ellipse cx="168" cy="191" rx="16" ry="29" fill="#684a7d" stroke="#30223d" stroke-width="4" />
    <path d="M39 113 Q49 42 105 39 Q162 41 177 113 L177 229 Q166 271 137 290 L102 311 L67 289 Q37 266 30 225 Z" fill="url(#titan-skin)" stroke="#251c36" stroke-width="7" />
    <path d="M113 73 Q171 88 174 170 L166 231 Q149 280 103 304 Q140 265 137 220 Q151 170 125 129 Z" fill="#251d38" opacity=".55" />
    <path d="M43 117 Q52 55 103 51 Q153 55 170 114 Q125 91 96 96 Q68 99 43 117 Z" fill="#b196d2" opacity=".22" />
    <path d="M45 123 Q80 98 112 104 M125 111 Q154 114 171 134 M35 199 Q50 226 71 233 M157 228 Q143 251 131 263" fill="none" stroke="#d6afe4" stroke-width="4" opacity=".2" />
    <path d="M44 207 Q50 240 71 248 L83 235 Q60 223 51 195 Z M154 209 Q149 244 129 251 L118 235 Q143 222 151 194 Z" fill="#291f3b" opacity=".35" />
    <path d="M41 139 Q99 108 168 141 M40 240 Q70 283 104 294 Q143 277 170 236" fill="none" stroke="#d7b5e7" stroke-width="3" opacity=".28" />
    <path d="M62 253 L73 285 M80 260 L88 297 M100 263 L103 302 M122 261 L118 298 M141 254 L133 286" stroke="#3c2b4c" stroke-width="3" stroke-linecap="round" />
    <path class="brow brow-left" d="M48 158 Q70 140 88 151" fill="none" stroke="#32233e" stroke-width="12" stroke-linecap="round" />
    <path class="brow brow-right" d="M119 151 Q140 140 161 158" fill="none" stroke="#32233e" stroke-width="12" stroke-linecap="round" />
    <path d="M49 180 Q68 166 87 177 M120 177 Q140 166 159 180" fill="none" stroke="#2c253e" stroke-width="5" />
    <ellipse class="eye" cx="69" cy="181" rx="11" ry="6" fill="#d5cbd1" />
    <ellipse class="eye" cx="139" cy="181" rx="11" ry="6" fill="#d5cbd1" />
    <circle class="pupil" cx="72" cy="181" r="4.4" fill="#171726" />
    <circle class="pupil" cx="136" cy="181" r="4.4" fill="#171726" />
    <path d="M101 177 L93 215 Q101 224 113 215" fill="none" stroke="#4b365c" stroke-width="5" stroke-linecap="round" />
    <path d="M56 226 Q104 246 153 226" fill="none" stroke="#493251" stroke-width="4" opacity=".8" />
    <path class="smile" d="M80 240 Q104 252 131 238" fill="none" stroke="#2e223b" stroke-width="6" stroke-linecap="round" />
    <ellipse class="surprised-mouth" cx="105" cy="244" rx="14" ry="19" fill="#2a1d34" stroke="#c7a0ca" stroke-width="3" />
    <path d="M51 213 L70 220 M138 219 L156 211" fill="none" stroke="#bd95ce" stroke-width="3" opacity=".5" />
  </g>
</svg>`;
