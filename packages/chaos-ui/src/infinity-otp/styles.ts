import { css } from "lit";

export const infinityStyles = css`
  :host {
    display: block;
    color: var(--infinity-ink, #f7f0da);
    font-family: system-ui, Arial, sans-serif;
  }
  * {
    box-sizing: border-box;
  }
  button,
  input {
    font: inherit;
  }
  button {
    cursor: pointer;
  }
  button:disabled,
  input:disabled {
    cursor: not-allowed;
    opacity: 0.58;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 3px solid var(--infinity-focus, #b9f4ff);
    outline-offset: 4px;
    z-index: 7;
  }
  .board {
    --stone-size: var(--infinity-stone-size, 58px);
    --socket-size: var(--infinity-socket-size, 64px);
    position: relative;
    overflow: hidden;
    isolation: isolate;
    padding: 22px clamp(14px, 3vw, 32px) 24px;
    border: 1px solid #746d8e;
    border-radius: 26px;
    background: radial-gradient(
      circle at 48% 39%,
      #40345f 0,
      #1b1932 49%,
      var(--infinity-surface, #111827) 100%
    );
    box-shadow:
      inset 0 1px #9a84b7aa,
      0 17px 32px #151a2955;
  }
  .board::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.32;
    background-image: radial-gradient(#b5a5d6 0.8px, transparent 1px);
    background-size: 22px 22px;
  }
  .header {
    display: flex;
    gap: 13px;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .mark {
    display: grid;
    place-items: center;
    color: #251d33;
    background: var(--infinity-gold, #e1bb6b);
    border-radius: 50%;
    width: 35px;
    height: 35px;
    box-shadow: 0 0 18px #e6c76c77;
  }
  .header strong {
    display: block;
    font: 800 14px/1.2 system-ui;
    letter-spacing: 2px;
  }
  .header small {
    display: block;
    color: #c2b8d6;
    font: 11px/1.8 system-ui;
  }
  .badge {
    margin-left: auto;
    color: #f2db9f;
    border: 1px solid #c8a96770;
    border-radius: 50px;
    padding: 5px 9px;
    white-space: nowrap;
    font: 10px monospace;
  }
  .stage {
    width: min(100%, var(--infinity-stage-width, 460px));
    aspect-ratio: 500/560;
    position: relative;
    margin: 5px auto -8px;
    isolation: isolate;
  }
  .stage::before {
    content: "";
    position: absolute;
    inset: 4% -6%;
    border-radius: 50%;
    background: radial-gradient(ellipse, #b885e03b, transparent 63%);
    pointer-events: none;
  }
  .halo {
    position: absolute;
    inset: 15% 12%;
    border-radius: 50%;
    background: radial-gradient(circle, #f1c96b52, transparent 64%);
    opacity: 0.25;
    transition:
      opacity 0.35s,
      filter 0.35s;
  }
  .complete .halo {
    opacity: 0.8;
    filter: drop-shadow(0 0 24px #d6ac60);
  }
  .success .halo {
    opacity: 1;
    background: radial-gradient(circle, #f5de8daa, transparent 65%);
  }
  .gauntlet {
    position: relative;
    z-index: 2;
    pointer-events: none;
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: drop-shadow(0 22px 16px #070916df) drop-shadow(0 0 18px #efc26844);
  }
  .titan {
    position: absolute;
    z-index: 1;
    left: -1%;
    top: 4%;
    width: 32%;
    overflow: visible;
    pointer-events: none;
    filter: drop-shadow(0 11px 14px #090a1caa);
  }
  .titan .surprised-mouth {
    opacity: 0;
  }
  .titan .eye,
  .titan .pupil,
  .titan .brow,
  .titan .smile,
  .titan .surprised-mouth {
    transition: transform 180ms ease, opacity 180ms ease;
    transform-box: fill-box;
    transform-origin: center;
  }
  .error .titan {
    animation: titan-recoil 820ms cubic-bezier(.18,.78,.3,1.3) 1 both;
  }
  .error .titan .brow-left {
    transform: translate(-2px, -12px) rotate(-8deg);
  }
  .error .titan .brow-right {
    transform: translate(2px, -12px) rotate(8deg);
  }
  .error .titan .eye {
    transform: scaleY(1.38);
  }
  .error .titan .pupil {
    transform: translateY(-3px) scale(.8);
  }
  .error .titan .smile {
    opacity: 0;
  }
  .error .titan .surprised-mouth {
    opacity: 1;
  }
  .failed-snap {
    position: absolute;
    z-index: 5;
    top: 13%;
    right: 0;
    padding: 8px 12px;
    border: 2px solid #ffbfcc;
    border-radius: 14px 14px 14px 3px;
    background: #35243fe8;
    color: #fff2ee;
    box-shadow: 0 8px 20px #09091799, 0 0 18px #ff8fa455;
    font: 900 clamp(13px, 3cqi, 21px)/1 system-ui;
    letter-spacing: .03em;
    transform: rotate(6deg);
    animation: failure-pop 650ms cubic-bezier(.18,1.3,.35,1) 1 both;
  }
  .orbit ellipse {
    stroke: #c4a77c;
    stroke-width: 1.4;
    stroke-dasharray: 3 12;
    opacity: 0.48;
  }
  .orbit path {
    stroke: #b487bc;
    stroke-width: 1.2;
    opacity: 0.21;
  }
  .arm-shadow {
    fill: #080d20;
    stroke: #070916;
    stroke-width: 11;
  }
  .arm {
    fill: url(#infinity-brass);
    stroke: #161629;
    stroke-width: 7;
  }
  .arm-panel {
    fill: url(#infinity-armor);
    stroke: #d4af74;
    stroke-width: 3;
  }
  .arm-etch {
    fill: none;
    stroke: #d5b878;
    stroke-width: 3;
    opacity: 0.65;
  }
  .finger,
  .thumb {
    fill: url(#infinity-brass);
    stroke: #171729;
    stroke-width: 6;
    stroke-linejoin: round;
  }
  .finger-plate,
  .thumb-plate {
    fill: url(#infinity-plate);
    stroke: #e0bd82;
    stroke-width: 2.5;
    stroke-linejoin: round;
  }
  .finger-seam,
  .thumb-seam {
    fill: none;
    stroke: #e3c688;
    stroke-width: 4;
    stroke-linecap: round;
    opacity: 0.82;
  }
  .finger-glint {
    fill: none;
    stroke: #fce6b4;
    stroke-width: 4;
    stroke-linecap: round;
    opacity: 0.82;
  }
  .palm {
    fill: url(#infinity-brass);
    stroke: #151626;
    stroke-width: 8;
    stroke-linejoin: round;
  }
  .palm-rim {
    fill: #11182e;
    stroke: #d0a463;
    stroke-width: 3;
    stroke-linejoin: round;
  }
  .palm-panel {
    fill: url(#infinity-armor);
    stroke: #8e765a;
    stroke-width: 2.5;
    stroke-linejoin: round;
  }
  .palm-etch {
    fill: none;
    stroke: #d1b789;
    stroke-width: 2.5;
    opacity: 0.66;
    stroke-linecap: round;
  }
  .palm-shine,
  .cuff-shine {
    fill: none;
    stroke: #fff1bf;
    stroke-width: 3;
    stroke-linecap: round;
    opacity: .85;
  }
  .palm-glyph {
    fill: url(#infinity-glyph-gradient);
    fill-rule: evenodd;
    stroke: #d1b179;
    stroke-width: 2;
    opacity: 0.92;
  }
  .cuff {
    fill: url(#infinity-brass);
    stroke: #141425;
    stroke-width: 6;
  }
  .cuff-panel {
    fill: url(#infinity-armor);
    stroke: #e0bd7e;
    stroke-width: 2.5;
  }
  .cuff-detail {
    fill: none;
    stroke: #e4c182;
    stroke-width: 3;
    stroke-linecap: round;
    opacity: 0.76;
  }
  .rivet {
    fill: #f5d598;
    stroke: #483d3d;
    stroke-width: 2;
  }
  .snap-fingers {
    transform-origin: 50% 60%;
  }
  .success .snap-fingers {
    animation: snap 0.68s cubic-bezier(0.15, 0.9, 0.3, 1) 1 both;
  }
  .error .snap-fingers {
    animation: snap-fail .72s cubic-bezier(.16,.9,.25,1) 1 both;
  }
  .success .gauntlet,
  .success .sockets {
    animation: ash-away 2.4s ease-out 1 both;
  }
  .success .pool {
    animation: ash-away 2.4s ease-out .14s 1 both;
  }
  .sockets {
    position: absolute;
    z-index: 4;
    inset: 0;
  }
  .socket-wrap {
    position: absolute;
    transform: translate(-50%, -50%);
    display: grid;
    place-items: center;
    width: var(--socket-size);
    height: var(--socket-size);
  }
  .pos-1 {
    left: 36%;
    top: 33%;
    --gem: #70d8d4;
  }
  .pos-2 {
    left: 51%;
    top: 22%;
    --gem: #e3a6ff;
  }
  .pos-3 {
    left: 66%;
    top: 32%;
    --gem: #e89abb;
  }
  .pos-4 {
    left: 80%;
    top: 46%;
    --gem: #9ee4a4;
  }
  .pos-5 {
    left: 17%;
    top: 59%;
    --gem: #f3b37a;
  }
  .pos-6 {
    left: 52%;
    top: 70%;
    --gem: #f1d680;
  }
  .order {
    position: absolute;
    z-index: 3;
    left: 50%;
    bottom: calc(100% - 5px);
    transform: translateX(-50%);
    color: #fff0c7;
    background: #1a1834;
    border: 1px solid #d2ae7c;
    border-radius: 12px;
    padding: 1px 5px;
    font: 800 10px monospace;
    letter-spacing: 1px;
    pointer-events: none;
  }
  .socket {
    width: 100%;
    height: 100%;
    position: relative;
    display: grid;
    place-items: center;
    padding: 0;
    border-radius: 14px;
    border: 2px solid #f2d9a2;
    background: radial-gradient(circle at 29% 20%, #5e536d, #151b32 68%);
    color: #fffbea;
    box-shadow:
      0 5px 0 #17172b,
      0 0 0 4px #85613e,
      inset 0 0 18px #030918;
    touch-action: none;
    user-select: none;
  }
  .socket::before {
    content: "";
    position: absolute;
    inset: 5px;
    border: 1px solid #ffffff80;
    border-radius: 9px;
    pointer-events: none;
  }
  .socket.filled {
    background: radial-gradient(
      circle at 27% 22%,
      #ffffff,
      var(--gem) 30%,
      color-mix(in srgb, var(--gem), #1c2445 46%) 80%
    );
    color: #111827;
    box-shadow:
      0 5px 0 #17172b,
      0 0 0 4px #8b6949,
      0 0 24px var(--gem);
  }
  .socket.selected,
  .source[aria-pressed="true"] {
    outline: 3px solid #fff0b1;
    outline-offset: 5px;
  }
  .socket-digit {
    position: relative;
    z-index: 2;
    font: 900 clamp(21px, 5vw, 30px)/1 system-ui;
    text-shadow: 0 1px #fff9;
  }
  .gem-shape {
    position: absolute;
    right: 5px;
    bottom: 4px;
    font: 15px/1 system-ui;
    opacity: 0.55;
    color: #fff;
  }
  .input {
    text-align: center;
    font: 900 27px system-ui;
    caret-color: #fff;
  }
  .error .socket.filled {
    animation: stone-error 0.55s ease 1;
  }
  .pool {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(10, minmax(0, 1fr));
    gap: var(--infinity-gap, 7px);
    padding: 13px;
    border: 1px solid #b3916688;
    border-radius: 19px;
    background: #080e20a0;
    max-width: 690px;
    margin: 0 auto;
  }
  .source {
    position: relative;
    display: grid;
    place-items: center;
    width: 100%;
    min-width: 0;
    aspect-ratio: 1;
    min-height: var(--stone-size);
    border: 2px solid #edcf9b;
    border-radius: 17px;
    color: #151825;
    background: linear-gradient(145deg, #fff9e7, #b8a5df 48%, #7688ae);
    box-shadow:
      inset 2px 2px #fff9,
      0 5px 0 #0b0d19,
      0 7px 9px #0007;
    touch-action: none;
    user-select: none;
  }
  .source:hover:not(:disabled) {
    transform: translateY(-3px);
  }
  .source strong {
    position: relative;
    z-index: 1;
    font: 900 23px/1 system-ui;
  }
  .source-shape {
    position: absolute;
    font-size: 35px;
    color: #ffffff75;
    transform: rotate(20deg);
  }
  .hint {
    min-height: 37px;
    max-width: 690px;
    margin: 15px auto;
    color: #d6cce3;
    font: 12px/1.5 system-ui;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    max-width: 690px;
    margin: auto;
  }
  .actions button {
    min-height: 40px;
    border: 1px solid #ad9cb5;
    border-radius: 24px;
    padding: 8px 14px;
    background: #2b2946;
    color: #fff2d7;
    font-weight: 700;
    font-size: 12px;
  }
  .actions .submit {
    margin-left: auto;
    border-color: #f6dea0;
    background: var(--infinity-accent, #edcf85);
    color: #222035;
    box-shadow: 0 4px 0 #69523b;
    font-size: 14px;
  }
  .actions .submit span {
    margin-left: 10px;
  }
  .complete .submit:not(:disabled) {
    box-shadow:
      0 4px 0 #69523b,
      0 0 20px #e8d47c88;
  }
  .message {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 34px;
    margin: 18px auto 0;
    max-width: 690px;
    color: #e6d8ee;
    font-size: 13px;
  }
  .message strong {
    margin-left: auto;
    white-space: nowrap;
    color: #f9eab0;
    font: 900 24px system-ui;
    text-shadow: 0 0 18px #fbe8a2;
  }
  .error .message {
    color: #ffd1dc;
  }
  .dust {
    position: absolute;
    z-index: 5;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .dust::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 52%;
    width: 24%;
    aspect-ratio: 1;
    border: 4px solid #ffeec5;
    border-radius: 50%;
    box-shadow: 0 0 26px #ffe8a8, inset 0 0 26px #ffe8a8;
    transform: translate(-50%, -50%) scale(.15);
    opacity: 0;
    animation: snap-wave .85s ease-out .36s 1 both;
  }
  .dust i {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: 10px;
    height: 14px;
    clip-path: polygon(0 8%, 76% 0, 100% 60%, 24% 100%);
    background: #ffe7ad;
    box-shadow: 0 0 12px #fff2bb;
    opacity: 0;
    animation: dust-out 1.9s cubic-bezier(.15,.6,.4,1) 1 both;
    animation-delay: calc(250ms + var(--i) * 18ms);
  }
  .dust i:nth-child(3n) {
    background: #d3b7ec;
  }
  .dust i:nth-child(4n) {
    background: #7f6c9d;
  }
  .drag-stone {
    position: fixed;
    z-index: 9999;
    width: 45px;
    height: 45px;
    transform: translate(-50%, -65%);
    display: grid;
    place-items: center;
    border: 2px solid #fff0ad;
    border-radius: 13px;
    color: #172035;
    background: #dfbcef;
    box-shadow: 0 8px 18px #1119;
    pointer-events: none;
    font: 900 23px system-ui;
  }
  .no-motion *,
  .no-motion *::before,
  .no-motion *::after {
    animation: none !important;
    transition: none !important;
  }
  .no-motion .dust {
    display: none;
  }
  .no-motion.success .halo {
    opacity: 1;
  }
  @keyframes snap {
    0%,
    100% {
      transform: rotate(0);
    }
    35% {
      transform: rotate(-11deg) translate(-6px, 7px);
    }
    58% {
      transform: rotate(5deg);
    }
  }
  @keyframes snap-fail {
    0%, 100% { transform: rotate(0); }
    35% { transform: rotate(-13deg) translate(-5px, 8px); }
    58% { transform: rotate(2deg) translate(2px, -1px); }
    72% { transform: rotate(-3deg); }
  }
  @keyframes titan-recoil {
    0%, 30% { transform: translate(0, 0) scale(1); }
    58% { transform: translate(-8px, -12px) scale(1.13) rotate(-7deg); }
    100% { transform: translate(-3px, -5px) scale(1.07) rotate(-3deg); }
  }
  @keyframes failure-pop {
    from { opacity: 0; transform: translateY(20px) scale(.5) rotate(-12deg); }
    to { opacity: 1; transform: translateY(0) scale(1) rotate(6deg); }
  }
  @keyframes ash-away {
    0%, 22% { opacity: 1; filter: blur(0) saturate(1); }
    62% { opacity: .08; filter: blur(6px) saturate(.4); }
    76% { opacity: 0; filter: blur(10px) saturate(.2); }
    100% { opacity: 1; filter: blur(0) saturate(1); }
  }
  @keyframes stone-error {
    0%,
    100% {
      filter: brightness(1);
    }
    45% {
      filter: brightness(1.7);
    }
  }
  @keyframes dust-out {
    0%, 10% {
      transform: translate(0, 0) rotate(0) scale(.4);
      opacity: 0;
    }
    30%, 70% {
      opacity: 1;
    }
    100% {
      transform: translate(var(--dx), var(--dy)) rotate(120deg) scale(.18);
      opacity: 0;
    }
  }
  @keyframes snap-wave {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(.15); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(4.5); }
  }
  @media (max-width: 700px) {
    .board {
      --stone-size: 44px;
      --socket-size: clamp(43px, 13vw, 58px);
      padding: 16px 10px 20px;
      border-radius: 19px;
    }
    .header {
      padding: 0 5px;
    }
    .header strong {
      font-size: 12px;
      letter-spacing: 1px;
    }
    .header small {
      font-size: 10px;
    }
    .stage {
      margin: 7px auto 0;
    }
    .pool {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      padding: 11px;
    }
    .source {
      min-height: 47px;
    }
    .hint,
    .actions,
    .message {
      margin-left: 7px;
      margin-right: 7px;
    }
    .actions .submit {
      width: 100%;
      margin: 4px 0 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
    .dust {
      display: none;
    }
  }
`;
