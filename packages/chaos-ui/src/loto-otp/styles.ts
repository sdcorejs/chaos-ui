import { css } from "lit";
export const lotoStyles = css`
  :host {
    display: block;
    color: var(--loto-ink, #272b25);
    font:
      500 15px/1.5 system-ui,
      sans-serif;
    container-type: inline-size;
  }
  * {
    box-sizing: border-box;
  }
  button,
  input {
    font: inherit;
    color: inherit;
  }
  button {
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 3px solid var(--loto-focus, #7553b5);
    outline-offset: 3px;
  }
  .board {
    padding: clamp(14px, 4cqi, 32px);
    border: 1px solid #d9d8c7;
    border-radius: 24px;
    background: var(--loto-surface, #fffdf5);
    overflow: hidden;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 22px;
  }
  .top strong {
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .ticket {
    border: 1px dashed #b7b4a1;
    background: #f3f0e4;
    border-radius: 20px;
    padding: 5px 10px;
    font: 10px monospace;
    white-space: nowrap;
  }
  .slots {
    display: grid;
    grid-template-columns: repeat(var(--count), minmax(0, 1fr));
    gap: var(--loto-gap, 8px);
    max-width: calc(
      var(--count) * var(--loto-ball-size, 68px) + (var(--count) - 1) *
        var(--loto-gap, 8px)
    );
    margin: auto;
  }
  .slot {
    position: relative;
    border: 2px dashed #c9c7b6;
    padding: 3px;
    border-radius: 50%;
    aspect-ratio: 1;
    min-width: 0;
    max-height: var(--loto-ball-size, 68px);
    background: #eceadd;
    box-shadow: inset 0 3px 6px #20231f12;
    display: grid;
    place-items: center;
    touch-action: none;
  }
  .slot:empty::after {
    content: "·";
    opacity: 0.3;
  }
  .slot.selected {
    border-color: var(--loto-focus, #7553b5);
    background: #e4dbf8;
  }
  .slot.filled {
    border-style: solid;
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }
  .slot .ball {
    width: 100%;
    height: 100%;
    animation: snap 0.28s ease-out;
  }
  .ball {
    position: relative;
    display: grid;
    place-items: center;
    border: 1.5px solid #5b533a;
    border-radius: 50%;
    overflow: hidden;
    background: radial-gradient(
      circle at 28% 18%,
      #fff 0%,
      #fff9e8 11%,
      var(--loto-ball, var(--ball-tint, #f8d976)) 48%,
      #8e6948 100%
    );
    box-shadow:
      inset -5px -8px 10px #54381977,
      inset 3px 4px 6px #ffffffdd,
      2px 5px 0 #241e1a66,
      0 11px 16px #0d251e88;
    font-size: clamp(17px, 5cqi, 29px);
    font-weight: 800;
    user-select: none;
  }
  .ball span {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 58%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle at 36% 22%, #fff, #fff9e8 72%, #e8dcc6);
    border: 1px solid #6f5a2444;
    box-shadow: 0 2px 5px #301d1655, inset 0 1px #fff;
  }
  .ball::after {
    content: "";
    position: absolute;
    inset: 6% 14% 58% 12%;
    border-radius: 50%;
    background: linear-gradient(#fff9, #fff0);
    transform: rotate(-18deg);
    pointer-events: none;
  }
  .pool {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 18px 13px;
    padding: 30px 12px 26px;
    margin-top: 22px;
    border-radius: 22px;
    border: 5px solid #b87d55;
    background: var(--loto-pool, #064333);
    background-image:
      linear-gradient(145deg, #063b2c55, #062f2499),
      var(--loto-pool-art, var(--loto-art-url));
    background-size: cover;
    background-position: center;
    box-shadow: inset 0 0 0 2px #f5ca83, inset 0 12px 26px #001a1699, 0 12px 20px #273a2b26;
  }
  .pool .ball {
    justify-self: center;
    width: min(100%, var(--loto-ball-size, 68px));
    aspect-ratio: 1;
    touch-action: none;
    animation: float 5s ease-in-out infinite alternate;
    transform: rotate(var(--tilt));
    translate: var(--scatter-x) var(--scatter-y);
    animation-delay: var(--delay);
  }
  .pool .ball:nth-child(3n) {
    --ball-tint: #c8b3e9;
  }
  .pool .ball:nth-child(3n + 2) {
    --ball-tint: #d5ea8d;
  }
  .pool .ball[aria-pressed="true"] {
    outline: 3px solid var(--loto-focus, #7553b5);
    outline-offset: 4px;
  }
  .engaged .pool .ball,
  :host(:focus-within) .pool .ball,
  .pool:hover .ball {
    animation-play-state: paused;
  }
  .hint {
    font-size: 12px;
    color: #656457;
    margin: 17px 0 0;
    min-height: 36px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-top: 18px;
  }
  .actions button {
    padding: 11px 17px;
    border-radius: 30px;
    border: 1px solid #bbb8a5;
    background: transparent;
    font-size: 13px;
    min-height: 44px;
  }
  .actions .submit {
    background: var(--loto-accent, #d9f56e);
    border: 2px solid var(--loto-ink, #272b25);
    font-weight: 750;
    margin-left: auto;
    box-shadow: 0 3px 0 #272b25;
  }
  .result {
    margin-top: 16px;
    min-height: 24px;
    font-size: 13px;
  }
  .error .result {
    color: var(--loto-error, #a6303a);
  }
  .success .slot {
    box-shadow:
      0 0 0 3px var(--loto-success, #98be39),
      0 0 20px #c3e96699;
  }
  .celebration {
    display: block;
    text-align: center;
    color: #385710;
    font-size: 48px;
    font-weight: 950;
    letter-spacing: -3px;
    transform: rotate(-6deg);
    animation: celebrate 0.45s cubic-bezier(0.2, 1.4, 0.5, 1);
  }
  .plain {
    margin-top: 12px;
  }
  input.slot {
    width: 100%;
    border-radius: 12px;
    border: 2px solid #c9c7b6;
    text-align: center;
    font-size: clamp(18px, 5cqi, 30px);
    background: #fff;
    appearance: textfield;
  }
  .ghost {
    position: fixed;
    width: 58px;
    height: 58px;
    z-index: 10000;
    pointer-events: none;
    opacity: 0.95;
    transform: translate(-50%, -65%) rotate(-10deg) scale(1.08);
  }
  .no-motion *,
  .no-motion *::before {
    animation: none !important;
    transition: none !important;
  }
  @keyframes float {
    from {
      transform: translateY(-3px) rotate(var(--tilt));
    }
    to {
      transform: translateY(3px) rotate(calc(var(--tilt) + 5deg));
    }
  }
  @keyframes snap {
    from {
      transform: scale(1.22) translateY(-8px);
    }
    to {
      transform: scale(1) translateY(0);
    }
  }
  @keyframes celebrate {
    from {
      opacity: 0;
      transform: scale(0.5) rotate(-15deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(-6deg);
    }
  }
  @container (max-width:380px) {
    .slots {
      gap: var(--loto-gap, 4px);
    }
    .pool {
      gap: 18px 9px;
      padding: 26px 9px;
    }
    .top {
      margin-bottom: 18px;
    }
    .ticket {
      font-size: 9px;
    }
    .actions button {
      padding: 10px 13px;
    }
  }
`;
