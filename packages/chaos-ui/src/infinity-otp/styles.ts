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
    position: absolute;
    z-index: 2;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    filter: drop-shadow(0 15px 13px #070916aa) drop-shadow(0 0 17px #efc26844);
  }
  .glove-frame {
    position: absolute;
    inset: 0 auto auto 0;
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
  }
  .glove-contact,
  .glove-release {
    opacity: 0;
  }
  .snap-flash {
    position: absolute;
    left: 72%;
    top: 19%;
    width: 20%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, #fffef0 0, #ffe49c 14%, #f4c87855 39%, transparent 70%);
    opacity: 0;
    pointer-events: none;
  }
  .snapping .gauntlet {
    transform-origin: 58% 75%;
    animation: snap-camera 2.1s cubic-bezier(.32,.02,.25,1) 1 both;
  }
  .snapping .glove-open {
    animation: open-frame 2.1s steps(1, end) 1 both;
  }
  .snapping .glove-contact {
    animation: contact-frame 2.1s steps(1, end) 1 both;
  }
  .snapping .glove-release {
    animation: release-frame 2.1s steps(1, end) 1 both;
  }
  .snapping .socket-wrap {
    animation: reveal-hand 2.1s ease-in-out 1 both;
  }
  .snap-impact {
    position: absolute;
    z-index: 5;
    left: 76%;
    top: 21%;
    width: 16%;
    aspect-ratio: 1;
    border: 3px solid #fff3c9;
    border-radius: 50%;
    box-shadow: 0 0 18px #f5cb8b, inset 0 0 22px #f5cb8b;
    pointer-events: none;
    opacity: 0;
    animation: snap-impact 2.1s ease-out 1 both;
  }
  .snap-caption {
    position: absolute;
    z-index: 6;
    right: 12%;
    top: 7%;
    color: #fff8dd;
    font: 1000 clamp(20px, 5vw, 34px)/1 system-ui;
    letter-spacing: .08em;
    text-shadow: 0 3px 0 #452d59, 0 0 20px #ffde93;
    transform: rotate(8deg);
    pointer-events: none;
    opacity: 0;
    animation: snap-letter 2.1s ease-out 1 both;
  }
  .failed-reaction {
    position: absolute;
    z-index: 6;
    right: 1%;
    bottom: 14%;
    width: min(27%, 122px);
    display: grid;
    justify-items: center;
    gap: 2px;
    pointer-events: none;
    animation: failure-pop 550ms cubic-bezier(.18,1.3,.35,1) 1 both;
  }
  .failed-emoji {
    width: min(100%, 98px);
    height: auto;
    filter: drop-shadow(0 8px 10px #080916bb);
  }
  .failed-snap {
    padding: 8px 12px;
    border: 2px solid #ffbfcc;
    border-radius: 13px;
    background: #35243fe8;
    color: #fff2ee;
    box-shadow: 0 8px 20px #09091799, 0 0 18px #ff8fa455;
    font: 900 clamp(11px, 2.8vw, 15px)/1 system-ui;
    letter-spacing: .03em;
    white-space: nowrap;
    transform: rotate(5deg);
  }
  .success .snap-flash {
    animation: contact-flash .9s ease-out 1 both;
  }
  .success .gauntlet,
  .success .sockets {
    animation: ash-away 2.4s ease-out .4s 1 both;
  }
  .success .pool {
    animation: ash-away 2.4s ease-out .54s 1 both;
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
    left: 41%;
    top: 31%;
    --gem: #70d8d4;
  }
  .pos-2 {
    left: 55%;
    top: 28%;
    --gem: #e3a6ff;
  }
  .pos-3 {
    left: 69%;
    top: 31%;
    --gem: #e89abb;
  }
  .pos-4 {
    left: 79%;
    top: 39%;
    --gem: #9ee4a4;
  }
  .pos-5 {
    left: 21%;
    top: 52%;
    --gem: #f3b37a;
  }
  .pos-6 {
    left: 56%;
    top: 55%;
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
    border-radius: 50%;
    border: 2px solid #f2d9a2;
    background: radial-gradient(circle at 32% 27%, #5e536d, #151b32 68%);
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
    border-radius: 50%;
    pointer-events: none;
  }
  .socket.filled {
    background: radial-gradient(circle at 25% 19%, #eed5aa, #40334c 69%);
    color: #fffef0;
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
    text-shadow: 0 2px 3px #151022, 0 0 8px #171329;
  }
  .gem-art {
    position: absolute;
    inset: 5%;
    width: 90%;
    height: 90%;
    overflow: visible;
    filter: drop-shadow(0 4px 3px #080b19a8);
  }
  .gem-shadow { fill: #121528; opacity: .8; }
  .gem-core { fill: var(--gem, #cbb4e7); stroke: #fff3da; stroke-width: 1.3; }
  .gem-light { fill: #fff; opacity: .5; }
  .gem-facet { fill: #17182e; opacity: .27; }
  .gem-line { fill: none; stroke: #fff; stroke-width: 1.4; opacity: .58; }
  .gem-glint { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; opacity: .82; }
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
    border: 0;
    border-radius: 50%;
    color: #fffef0;
    background: transparent;
    --gem: #baa6e4;
    filter: drop-shadow(0 6px 5px #030512b8);
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
    text-shadow: 0 2px 3px #16102b, 0 0 7px #16102b;
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
  .actions [part="replay"] {
    border-color: #e5c381;
    color: #ffe9b0;
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
  @keyframes contact-frame {
    0%, 17% { opacity: 0; }
    18%, 57% { opacity: 1; }
    58%, 100% { opacity: 0; }
  }
  @keyframes open-frame {
    0%, 17% { opacity: 1; }
    18%, 90% { opacity: 0; }
    91%, 100% { opacity: 1; }
  }
  @keyframes release-frame {
    0%, 57% { opacity: 0; }
    58%, 90% { opacity: 1; }
    91%, 100% { opacity: 0; }
  }
  @keyframes contact-flash {
    0% { opacity: 0; transform: scale(.1); }
    28% { opacity: 1; transform: scale(1.5); }
    100% { opacity: 0; transform: scale(3); }
  }
  @keyframes reveal-hand {
    0%, 15% { opacity: 1; }
    22%, 86% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes snap-camera {
    0%, 15% { transform: scale(1) rotate(0); }
    35%, 56% { transform: scale(1.06) rotate(-5deg); }
    62% { transform: scale(1.11) rotate(5deg); }
    82% { transform: scale(1.04) rotate(2deg); }
    100% { transform: scale(1) rotate(0); }
  }
  @keyframes snap-impact {
    0%, 57% { opacity: 0; transform: translate(-50%, -50%) scale(.2); }
    62% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
    84%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(3.6); }
  }
  @keyframes snap-letter {
    0%, 56% { opacity: 0; transform: translateY(15px) scale(.6) rotate(-8deg); }
    63%, 76% { opacity: 1; transform: translateY(0) scale(1.2) rotate(8deg); }
    100% { opacity: 0; transform: translateY(-18px) scale(1) rotate(14deg); }
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
      filter: brightness(1.2);
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
