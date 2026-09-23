import { html } from "lit";

/** Original SVG reaction portrait. Both expressions share one stable DOM tree. */
export const titanSvg = html`<svg
  part="titan"
  class="titan"
  viewBox="0 0 240 260"
  aria-hidden="true"
>
  <defs>
    <radialGradient id="titan-aura">
      <stop stop-color="#9772d6" stop-opacity=".65" />
      <stop offset="1" stop-color="#9772d6" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="titan-skin" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#c0a2ec" />
      <stop offset=".43" stop-color="#875eaf" />
      <stop offset="1" stop-color="#493464" />
    </linearGradient>
    <linearGradient id="titan-armor" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#f5d897" />
      <stop offset=".48" stop-color="#8e673f" />
      <stop offset="1" stop-color="#f1c37b" />
    </linearGradient>
  </defs>
  <circle cx="120" cy="122" r="119" fill="url(#titan-aura)" />
  <path d="M18 250 Q28 193 82 190 L154 190 Q208 191 223 250 Z" fill="#17182b" stroke="#e5b76e" stroke-width="6" />
  <path d="M34 250 Q52 206 83 204 L109 223 L131 223 L157 204 Q188 208 208 250 Z" fill="url(#titan-armor)" />
  <path d="M70 209 L107 229 L121 249 L133 229 L169 208" fill="none" stroke="#292441" stroke-width="11" stroke-linejoin="round" />
  <path d="M91 176 Q120 190 150 175 L153 210 Q120 230 87 209 Z" fill="#665080" />
  <ellipse cx="48" cy="123" rx="16" ry="27" fill="#735394" stroke="#342744" stroke-width="4" />
  <ellipse cx="190" cy="123" rx="16" ry="27" fill="#735394" stroke="#342744" stroke-width="4" />
  <path d="M61 76 Q68 24 120 20 Q174 22 180 77 L182 134 Q177 178 149 197 L120 215 L91 197 Q64 180 57 136 Z" fill="url(#titan-skin)" stroke="#322344" stroke-width="5" />
  <path d="M64 84 Q70 29 119 26 Q158 27 177 81 Q145 68 120 64 Q92 68 64 84 Z" fill="#a687d1" opacity=".7" />
  <path d="M68 149 Q89 185 120 201 Q154 187 174 150" fill="none" stroke="#d2b1f1" stroke-width="4" opacity=".43" />
  <path d="M94 175 L104 198 M108 180 L113 204 M126 181 L126 205 M140 178 L135 200 M151 174 L144 195" stroke="#4a315f" stroke-width="3" stroke-linecap="round" />
  <path class="brow brow-left" d="M72 98 Q90 85 108 93" fill="none" stroke="#342542" stroke-width="10" stroke-linecap="round" />
  <path class="brow brow-right" d="M132 93 Q150 85 168 98" fill="none" stroke="#342542" stroke-width="10" stroke-linecap="round" />
  <ellipse class="eye" cx="91" cy="116" rx="15" ry="12" fill="#efe6ea" />
  <ellipse class="eye" cx="149" cy="116" rx="15" ry="12" fill="#efe6ea" />
  <circle class="pupil" cx="93" cy="117" r="6" fill="#27243d" />
  <circle class="pupil" cx="147" cy="117" r="6" fill="#27243d" />
  <circle cx="95" cy="114" r="2" fill="#fff" />
  <circle cx="149" cy="114" r="2" fill="#fff" />
  <path d="M117 115 L109 145 Q120 152 132 145" fill="none" stroke="#593e75" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  <path class="smile" d="M98 160 Q120 172 143 158" fill="none" stroke="#392642" stroke-width="6" stroke-linecap="round" />
  <ellipse class="surprised-mouth" cx="120" cy="168" rx="14" ry="18" fill="#301d3a" stroke="#d5a9cb" stroke-width="3" />
  <path class="cheek" d="M75 143 Q84 150 95 147 M146 147 Q157 150 166 143" fill="none" stroke="#dda5d4" stroke-width="3" opacity=".5" />
</svg>`;
