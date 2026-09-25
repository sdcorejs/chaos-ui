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
    --socket-size: var(--infinity-socket-size, clamp(43px, 16.5cqw, 58px));
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
    /* Sockets size against the stage, so they never overlap in a narrow host. */
    container-type: inline-size;
  }
  .stage,
  .pool {
    user-select: none;
    -webkit-user-select: none;
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
  .rig {
    position: absolute;
    z-index: 2;
    inset: 0;
    transform-origin: 50% 72%;
  }
  .gauntlet {
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
    filter: drop-shadow(0 15px 13px #070916aa) drop-shadow(0 0 17px #efc26844);
  }
  .finger {
    transform-box: view-box;
    transform-origin: 0 0;
  }
  .joint { fill: #25162c; }
  .plate,
  .edge {
    stroke: #3a220b;
    stroke-width: 1.6;
    stroke-linejoin: round;
  }
  .rivet { fill: #fbe7ae; stroke: #6b4316; stroke-width: 1; }
  .prong { fill: #f0cf82; stroke: #5d3a12; stroke-width: 1.2; }
  .bezel-hole { fill: #1c1426; stroke: #120c1a; stroke-width: 2; }
  .shine,
  .engrave,
  .filigree {
    fill: none;
    stroke-linecap: round;
  }
  .shine { stroke: #fff6d4; stroke-width: 2.4; opacity: 0.55; }
  .engrave { stroke: #6f4518; stroke-width: 1.8; opacity: 0.75; }
  .filigree { stroke: #e7c47a; stroke-width: 2.4; opacity: 0.8; }
  .contact-glow,
  .snap-lines,
  .flick-streak {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: 50% 50%;
  }
  .snap-lines path {
    fill: none;
    stroke: #fff6d0;
    stroke-width: 5;
    stroke-linecap: round;
  }
  .flick-streak {
    fill: none;
    stroke-width: 12;
    stroke-linecap: round;
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
  }
  .snap-flash {
    position: absolute;
    z-index: 5;
    left: 41.6%;
    top: 23.57%;
    width: 22%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, #fffef0 0, #ffe49c 14%, #f4c87855 39%, transparent 70%);
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
  /* One 2.1 s choreography: wind-up, fingertip contact under tension, a fast
     release (the middle finger slams into the palm while the thumb flicks
     out), then recovery. Stones stay mounted on rigid armor throughout. */
  .snapping .rig {
    animation: rig-snap 2.1s ease-in-out 1 both;
  }
  .snapping .f-thumb {
    animation: thumb-snap 2.1s cubic-bezier(.45,0,.3,1) 1 both;
  }
  .snapping .f-middle {
    animation: middle-snap 2.1s cubic-bezier(.45,0,.3,1) 1 both;
  }
  .snapping .f-ring {
    animation: ring-curl 2.1s cubic-bezier(.45,0,.3,1) 1 both;
  }
  .snapping .f-pinky {
    animation: pinky-curl 2.1s cubic-bezier(.45,0,.3,1) 1 both;
  }
  .snapping .f-index {
    animation: index-brace 2.1s cubic-bezier(.45,0,.3,1) 1 both;
  }
  .snapping .contact-glow {
    animation: contact-glow 2.1s ease-in-out 1 both;
  }
  .snapping .snap-lines {
    animation: snap-lines 2.1s ease-out 1 both;
  }
  .snapping .flick-streak {
    animation: flick-streak 2.1s linear 1 both;
  }
  .snapping .snap-flash {
    animation: snap-flash 2.1s ease-out 1 both;
  }
  .snapping .socket:disabled {
    opacity: 1;
    cursor: progress;
  }
  .snapping .socket.filled {
    animation: gem-charge 2.1s ease-in-out 1 both;
  }
  .snap-impact {
    position: absolute;
    z-index: 5;
    left: 41.6%;
    top: 23.57%;
    width: 18%;
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
    right: 0;
    bottom: 3%;
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
  /* Success: the glove, its stones and the stone supply crumble to ash from
     left to right (the dust layer sheds flakes along the edge), then re-form. */
  .success .rig,
  .success .pool {
    -webkit-mask-image: linear-gradient(105deg, transparent 0 47%, #000 53% 100%);
    mask-image: linear-gradient(105deg, transparent 0 47%, #000 53% 100%);
    -webkit-mask-size: 300% 100%;
    mask-size: 300% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: 100% 0;
    mask-position: 100% 0;
  }
  .success .rig {
    animation: ash-sweep 3.2s linear 0.35s 1 both;
  }
  .success .pool {
    animation: ash-sweep 3.2s linear 0.6s 1 both;
  }
  .success .halo {
    animation: halo-ash 3.2s linear 0.35s 1 both;
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
    left: 32%;
    top: 47.86%;
    --gem: #70d8d4;
  }
  .pos-2 {
    left: 50%;
    top: 43.93%;
    --gem: #e3a6ff;
  }
  .pos-3 {
    left: 68%;
    top: 45.71%;
    --gem: #e89abb;
  }
  .pos-4 {
    left: 86%;
    top: 50.71%;
    --gem: #9ee4a4;
  }
  .pos-5 {
    left: 28%;
    top: 64.64%;
    --gem: #f3b37a;
  }
  .pos-6 {
    left: 59%;
    top: 63.93%;
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
  .socket .order {
    pointer-events: auto;
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
    user-select: text;
    -webkit-user-select: text;
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
    width: var(--s);
    height: calc(var(--s) * 1.3);
    background: var(--c);
    clip-path: polygon(0 8%, 76% 0, 100% 60%, 24% 100%);
    opacity: 0;
    animation: ash-fly var(--t) cubic-bezier(0.2, 0.55, 0.35, 1) var(--d) 1 both;
  }
  .dust i.k1 {
    clip-path: polygon(10% 0, 100% 25%, 70% 100%, 0 70%);
  }
  .dust i.k2 {
    clip-path: polygon(50% 0, 100% 100%, 0 80%);
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
  .no-motion.success .halo {
    opacity: 1;
  }
  /* Reduced motion: nothing travels. The glove fades into a still snap pose
     with glowing stones, then fades back once the result is shown. */
  .no-motion.snapping .rig {
    animation: pose-in 0.2s ease-out 1 both !important;
  }
  .no-motion.snap-done .rig {
    animation: pose-out 0.2s ease-out 1 both !important;
  }
  /* Reduced-motion success: nothing travels. The glove and supply fade to
     ashen gray while still flakes appear beside it, then everything returns. */
  .no-motion.success .rig,
  .no-motion.success .pool,
  .no-motion.success .halo {
    -webkit-mask-image: none;
    mask-image: none;
    animation: ash-still 2.6s ease-in-out 1 both !important;
  }
  .no-motion.success .dust i {
    transform: translate(calc(var(--dx) * 0.3), calc(var(--dy) * 0.3)) rotate(var(--r));
    animation: ash-still-flake 2.6s ease-in-out 1 both !important;
  }
  .no-motion.snapping .f-thumb { transform: rotate(56deg) scaleY(1.34); }
  .no-motion.snapping .f-middle { transform: rotate(-16deg) scaleY(0.62); }
  .no-motion.snapping .f-ring { transform: rotate(4deg) scaleY(0.3); }
  .no-motion.snapping .f-pinky { transform: rotate(8deg) scaleY(0.34); }
  .no-motion.snapping .f-index { transform: rotate(-12deg) scaleY(0.96); }
  .no-motion.snapping .contact-glow {
    opacity: 0.7;
  }
  .no-motion.snapping .snap-lines,
  .no-motion.snapping .snap-caption {
    opacity: 1;
  }
  .no-motion.snapping .socket.filled {
    box-shadow:
      0 5px 0 #17172b,
      0 0 0 4px #f4d58e,
      0 0 40px 8px var(--gem);
  }
  @keyframes pose-in {
    from { opacity: 0.2; }
    to { opacity: 1; }
  }
  @keyframes pose-out {
    from { opacity: 0.2; }
    to { opacity: 1; }
  }
  @keyframes rig-snap {
    0% { transform: translate(0, 0) rotate(0) scale(1); }
    8% { transform: translate(0, 1.4%) rotate(-1.6deg) scale(0.99); }
    24% { transform: translate(0, -0.6%) rotate(1deg) scale(1.03); }
    30% { transform: translate(0.3%, -0.6%) rotate(1.5deg) scale(1.03); }
    34% { transform: translate(-0.3%, -0.6%) rotate(0.6deg) scale(1.03); }
    38% { transform: translate(0.3%, -0.6%) rotate(1.5deg) scale(1.035); }
    42% { transform: translate(-0.3%, -0.6%) rotate(0.6deg) scale(1.035); }
    46% { transform: translate(0.3%, -0.7%) rotate(1.6deg) scale(1.04); }
    50% { transform: translate(0, -0.7%) rotate(1deg) scale(1.04); animation-timing-function: ease-out; }
    53% { transform: translate(0, -2.2%) rotate(-3deg) scale(1.07); }
    57% { transform: translate(0, 0.6%) rotate(1.6deg) scale(1.02); }
    62% { transform: translate(0, -0.3%) rotate(-0.6deg) scale(1.01); }
    70%, 100% { transform: translate(0, 0) rotate(0) scale(1); }
  }
  @keyframes thumb-snap {
    0% { transform: rotate(0) scaleY(1); }
    8% { transform: rotate(-8deg) scaleY(1); }
    24% { transform: rotate(56deg) scaleY(1.34); }
    50% { transform: rotate(54.5deg) scaleY(1.32); animation-timing-function: cubic-bezier(.1,.8,.3,1); }
    52.5% { transform: rotate(-12deg) scaleY(1.02); }
    58% { transform: rotate(-4deg) scaleY(1); }
    64% { transform: rotate(-7deg) scaleY(1); }
    80%, 100% { transform: rotate(0) scaleY(1); }
  }
  @keyframes middle-snap {
    0% { transform: rotate(0) scaleY(1); }
    8% { transform: rotate(2deg) scaleY(1.02); }
    24% { transform: rotate(-16deg) scaleY(0.62); }
    50% { transform: rotate(-17deg) scaleY(0.6); animation-timing-function: cubic-bezier(.1,.8,.3,1); }
    52.5% { transform: rotate(-4deg) scaleY(0.16); }
    62% { transform: rotate(-3deg) scaleY(0.2); }
    72% { transform: rotate(-6deg) scaleY(0.45); }
    86%, 100% { transform: rotate(0) scaleY(1); }
  }
  @keyframes ring-curl {
    0% { transform: rotate(0) scaleY(1); }
    8% { transform: rotate(2deg) scaleY(1); }
    24%, 50% { transform: rotate(4deg) scaleY(0.3); }
    55% { transform: rotate(5deg) scaleY(0.26); }
    72% { transform: rotate(3deg) scaleY(0.5); }
    88%, 100% { transform: rotate(0) scaleY(1); }
  }
  @keyframes pinky-curl {
    0% { transform: rotate(0) scaleY(1); }
    8% { transform: rotate(3deg) scaleY(1); }
    24%, 50% { transform: rotate(8deg) scaleY(0.34); }
    55% { transform: rotate(9deg) scaleY(0.3); }
    72% { transform: rotate(5deg) scaleY(0.55); }
    88%, 100% { transform: rotate(0) scaleY(1); }
  }
  @keyframes index-brace {
    0% { transform: rotate(0) scaleY(1); }
    8% { transform: rotate(-3deg) scaleY(1); }
    24%, 50% { transform: rotate(-12deg) scaleY(0.96); }
    53% { transform: rotate(2deg) scaleY(1); }
    60% { transform: rotate(-2deg) scaleY(1); }
    72%, 100% { transform: rotate(0) scaleY(1); }
  }
  @keyframes contact-glow {
    0%, 18% { opacity: 0; transform: scale(0.3); }
    24% { opacity: 0.7; transform: scale(1); }
    30% { opacity: 0.5; transform: scale(0.85); }
    36% { opacity: 0.8; transform: scale(1.1); }
    42% { opacity: 0.55; transform: scale(0.9); }
    50% { opacity: 0.9; transform: scale(1.3); }
    53% { opacity: 0; transform: scale(2.2); }
    100% { opacity: 0; transform: scale(0.3); }
  }
  @keyframes snap-lines {
    0%, 51% { opacity: 0; transform: scale(0.4); }
    53.5% { opacity: 1; transform: scale(1); }
    66%, 100% { opacity: 0; transform: scale(1.8); }
  }
  @keyframes flick-streak {
    0%, 50% { opacity: 0; stroke-dashoffset: 220; }
    51% { opacity: 1; stroke-dashoffset: 150; }
    54% { opacity: 0.85; stroke-dashoffset: 0; }
    61%, 100% { opacity: 0; stroke-dashoffset: -80; }
  }
  @keyframes snap-flash {
    0%, 50% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
    53% { opacity: 1; transform: translate(-50%, -50%) scale(1.4); }
    64%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(2.6); }
  }
  @keyframes gem-charge {
    0%, 16% {
      box-shadow: 0 5px 0 #17172b, 0 0 0 4px #8b6949, 0 0 24px 0 var(--gem);
    }
    46% {
      box-shadow: 0 5px 0 #17172b, 0 0 0 4px #d7aa62, 0 0 34px 5px var(--gem);
    }
    50% {
      box-shadow: 0 5px 0 #17172b, 0 0 0 4px #f4d58e, 0 0 40px 8px var(--gem);
    }
    53% {
      box-shadow: 0 5px 0 #17172b, 0 0 0 4px #fff4cf, 0 0 34px 6px #fff6d6;
    }
    72%, 100% {
      box-shadow: 0 5px 0 #17172b, 0 0 0 4px #8b6949, 0 0 24px 0 var(--gem);
    }
  }
  @keyframes contact-flash {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
    28% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(3); }
  }
  @keyframes snap-impact {
    0%, 51% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
    54% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    74%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(3.6); }
  }
  @keyframes snap-letter {
    0%, 52% { opacity: 0; transform: translateY(15px) scale(0.6) rotate(-8deg); }
    57%, 76% { opacity: 1; transform: translateY(0) scale(1.2) rotate(8deg); }
    100% { opacity: 0; transform: translateY(-18px) scale(1) rotate(14deg); }
  }
  @keyframes failure-pop {
    from { opacity: 0; transform: translateY(20px) scale(.5) rotate(-12deg); }
    to { opacity: 1; transform: translateY(0) scale(1) rotate(6deg); }
  }
  @keyframes ash-sweep {
    0% {
      -webkit-mask-position: 100% 0;
      mask-position: 100% 0;
      opacity: 1;
      filter: none;
    }
    40%, 70% {
      -webkit-mask-position: 0% 0;
      mask-position: 0% 0;
      opacity: 1;
      filter: none;
    }
    71% {
      -webkit-mask-position: 100% 0;
      mask-position: 100% 0;
      opacity: 0;
      filter: blur(6px) brightness(1.5);
    }
    100% {
      -webkit-mask-position: 100% 0;
      mask-position: 100% 0;
      opacity: 1;
      filter: blur(0) brightness(1);
    }
  }
  @keyframes halo-ash {
    0% { opacity: 1; }
    40%, 70% { opacity: 0.12; }
    100% { opacity: 1; }
  }
  @keyframes ash-fly {
    0% { opacity: 0; transform: translate(0, 0) rotate(0) scale(1); }
    6% { opacity: 1; }
    60% { opacity: 0.85; }
    100% {
      opacity: 0;
      transform: translate(var(--dx), var(--dy)) rotate(var(--r)) scale(0.35);
    }
  }
  @keyframes ash-still {
    0% { opacity: 0.2; filter: none; }
    8% { opacity: 1; filter: none; }
    22%, 70% { opacity: 0.3; filter: grayscale(1) sepia(0.35) brightness(0.7); }
    100% { opacity: 1; filter: none; }
  }
  @keyframes ash-still-flake {
    0%, 12% { opacity: 0; }
    24%, 66% { opacity: 0.9; }
    100% { opacity: 0; }
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
  @keyframes snap-wave {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(.15); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(4.5); }
  }
  @media (max-width: 700px) {
    .board {
      --stone-size: 44px;
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
      /* Borrow the board padding; stay centered once the stage width caps. */
      width: min(calc(100% + 20px), var(--infinity-stage-width, 460px));
      margin: 7px 0 0;
      margin-inline: max(-10px, calc((100% - var(--infinity-stage-width, 460px)) / 2));
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
`;
