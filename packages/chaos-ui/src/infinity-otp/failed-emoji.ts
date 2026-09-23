import { html } from "lit";

/** A small, decorative, startled purple villain face shown only after a failed snap. */
export const failedEmoji = html`<svg
  part="failed-emoji"
  class="failed-emoji"
  viewBox="0 0 120 120"
  aria-hidden="true"
>
  <defs>
    <linearGradient id="emoji-face" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#c8a0d5" />
      <stop offset=".55" stop-color="#9167ad" />
      <stop offset="1" stop-color="#4c396b" />
    </linearGradient>
    <linearGradient id="emoji-helmet" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#f9df99" />
      <stop offset=".5" stop-color="#ac783f" />
      <stop offset="1" stop-color="#6c4e43" />
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="#241c39" stroke="#ebc684" stroke-width="3" />
  <path d="M26 36 Q60 4 94 36 L101 70 Q96 99 60 109 Q24 99 19 70 Z"
    fill="url(#emoji-face)" stroke="#342341" stroke-width="4" />
  <path d="M22 51 Q19 20 53 14 L60 25 L67 14 Q101 20 98 51 L85 39 L77 26 L60 37 L43 26 L35 39 Z"
    fill="url(#emoji-helmet)" stroke="#604432" stroke-width="3" />
  <path d="M52 16 L60 6 L68 16 L66 34 L60 41 L54 34 Z"
    fill="#f5d58b" stroke="#715136" stroke-width="2" />
  <path d="M33 52 Q41 43 53 51 M67 51 Q79 43 87 52"
    fill="none" stroke="#35233d" stroke-width="6" stroke-linecap="round" />
  <ellipse cx="44" cy="62" rx="11" ry="10" fill="#fff7e7" />
  <ellipse cx="76" cy="62" rx="11" ry="10" fill="#fff7e7" />
  <circle cx="46" cy="63" r="4" fill="#272134" />
  <circle cx="74" cy="63" r="4" fill="#272134" />
  <path d="M60 61 L55 75 Q60 79 65 75" fill="none" stroke="#584164"
    stroke-width="3" stroke-linecap="round" />
  <ellipse cx="60" cy="88" rx="9" ry="12" fill="#2f203c" stroke="#d3a9c8" stroke-width="2" />
  <path d="M35 82 L39 98 M46 86 L48 103 M72 103 L74 86 M81 98 L85 82"
    stroke="#61466e" stroke-width="3" stroke-linecap="round" />
  <path d="M30 71 L34 82 M90 71 L86 82" stroke="#d0a4d5" stroke-width="3"
    opacity=".65" />
</svg>`;
