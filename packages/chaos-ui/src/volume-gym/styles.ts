import { css } from "lit";

export const volumeGymStyles = css`
  :host {
    display: block;
    color: var(--volume-ink, #172c29);
    font-family: system-ui, Arial, sans-serif;
  }
  * { box-sizing: border-box; }
  button { font: inherit; cursor: pointer; }
  button:disabled { cursor: not-allowed; opacity: .45; }
  button:focus-visible, .slider:focus-visible {
    outline: 3px solid var(--volume-focus, #8454ca);
    outline-offset: 4px;
  }
  .board {
    --accent: var(--volume-accent, #d8ff66);
    position: relative;
    overflow: hidden;
    padding: 21px clamp(16px, 3vw, 29px) 24px;
    border: 1px solid #95a99e;
    border-radius: 26px;
    background: radial-gradient(circle at 21% 17%, #e6f9da, transparent 46%),
      var(--volume-surface, #f5f8eb);
    box-shadow: 0 17px 28px #29463a22, inset 0 1px #fff;
  }
  .board::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .18;
    background-image: radial-gradient(#416455 1px, transparent 1px);
    background-size: 18px 18px;
  }
  .heading, .content, .footnote { position: relative; z-index: 1; }
  .heading { display: flex; align-items: center; gap: 10px; }
  .heading .mark {
    display: grid; place-items: center;
    width: 34px; height: 34px;
    border: 2px solid #1d3730; border-radius: 10px;
    background: var(--accent); font-size: 20px; font-weight: 900;
    transform: rotate(-8deg);
  }
  .heading strong { font: 900 14px/1.2 system-ui; letter-spacing: 1.8px; }
  .heading small { display: block; margin-top: 3px; color: #557264; font: 10px monospace; }
  .badge {
    margin-left: auto; padding: 5px 8px;
    border: 1px solid #849c87; border-radius: 999px;
    color: #3d584d; background: #ffffff9c;
    white-space: nowrap; font: 700 10px monospace;
  }
  .content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 145px;
    gap: 18px;
    align-items: center;
    margin-top: 16px;
  }
  .machine {
    --machine-height: var(--volume-machine-height, 374px);
    position: relative;
    width: 100%; max-width: 420px;
    height: var(--machine-height);
    margin: auto;
    border: 3px solid #142b26;
    border-radius: 22px;
    overflow: hidden;
    background: linear-gradient(155deg, #406955, #203c35 53%, #122b2b);
    box-shadow: inset 0 0 0 5px #8fb89455, inset 0 22px 32px #b6e7ae18,
      0 9px 0 #18352c, 0 18px 22px #1d392a30;
  }
  .machine::before {
    content: ""; position: absolute; inset: 10px;
    border: 1px solid #c4e2b34d; border-radius: 14px;
    pointer-events: none;
  }
  .beam, .floor {
    position: absolute; left: 17px; right: 17px;
    height: 20px; border: 2px solid #0b2521;
    background: linear-gradient(#a9c5a1 0 21%, #3f6354 28%, #1e4039 78%, #0b2725);
    box-shadow: 0 4px 0 #0c2826;
  }
  .beam { top: 22px; border-radius: 8px 8px 3px 3px; }
  .floor { bottom: 20px; border-radius: 3px 3px 8px 8px; }
  .upright {
    position: absolute; top: 42px; bottom: 39px;
    width: 12px; border: 2px solid #0e2925;
    background: linear-gradient(90deg, #719c7c, #304f46 55%, #132e2c);
  }
  .upright.left { left: 28px; }
  .upright.right { right: 28px; }
  .pulley {
    position: absolute; z-index: 2; top: 24px; left: 50%;
    width: 43px; height: 43px; transform: translateX(-50%);
    border: 6px solid #d7e3c4; border-radius: 50%;
    background: radial-gradient(circle, #172e2c 0 27%, #84ae84 29% 48%, #243f37 52%);
    box-shadow: 0 0 0 3px #132e2b, 0 5px 8px #0d271f96;
  }
  .lane {
    position: absolute; z-index: 3;
    top: 81px; bottom: 75px; left: 41px; right: 60px;
    touch-action: none; user-select: none; cursor: ns-resize;
  }
  .lane::before {
    content: ""; position: absolute;
    top: 0; bottom: 0; left: 50%;
    border-left: 2px dashed #e5efce55; pointer-events: none;
  }
  .cable {
    position: absolute; left: 50%; top: -20px;
    height: calc(100% - var(--lift) + 20px);
    width: 3px; transform: translateX(-50%);
    background: linear-gradient(90deg, #0c2020, #d7d1a1 50%, #25453a);
    box-shadow: 1px 0 3px #0009;
    pointer-events: none;
  }
  .weight {
    position: absolute; left: 50%; bottom: var(--lift);
    width: min(225px, 100%); height: 92px;
    transform: translate(-50%, 50%);
    transition: bottom .11s cubic-bezier(.22, .8, .2, 1);
    pointer-events: none;
    filter: drop-shadow(0 9px 6px #061d1e88);
  }
  .bar {
    position: absolute; left: 1%; right: 1%; top: 44px; height: 12px;
    border: 2px solid #142e2d; border-radius: 8px;
    background: linear-gradient(#fff7c7, #8c9880 48%, #334c46 65%, #dce1b9);
  }
  .grip {
    position: absolute; z-index: 2; left: 34%; right: 34%; top: 35px;
    height: 30px; border: 3px solid #122b2b; border-radius: 9px;
    background: repeating-linear-gradient(100deg, #182c2c 0 5px, #637b65 5px 7px);
    box-shadow: inset 0 2px #cce4b156, 0 3px #071d1e;
  }
  .plate {
    position: absolute; z-index: 1; top: 13px;
    height: 75px; border: 4px solid #142c2b; border-radius: 11px;
    background: linear-gradient(125deg, #acc89d 0 11%, var(--volume-plate, #789969) 20%, #375b4b 66%, #193c38);
    box-shadow: inset 5px 0 #d4e7aa66, inset -5px 0 #071e2280, 0 3px #091e21;
  }
  .plate.outer { width: 26px; }
  .plate.inner { width: 33px; top: 7px; height: 87px; }
  .plate.left.outer { left: 3%; }
  .plate.left.inner { left: 16%; }
  .plate.right.inner { right: 16%; }
  .plate.right.outer { right: 3%; }
  .plate::after {
    content: ""; position: absolute; top: 13px; bottom: 13px; left: 5px;
    width: 2px; background: #d5ebb481;
  }
  .lifting .weight { transition: none; }
  .falling .weight { transition: bottom .075s linear; }
  .scale {
    position: absolute; top: 81px; bottom: 75px; right: 26px;
    width: 17px; border: 2px solid #b5d2a9; border-radius: 12px;
    background: var(--volume-track, #102e2c);
    box-shadow: inset 0 2px 5px #000a;
  }
  .fill {
    position: absolute; left: 2px; right: 2px; bottom: 2px;
    height: calc(var(--lift) - 4px);
    max-height: calc(100% - 4px);
    border-radius: 9px;
    background: linear-gradient(#eafea6, var(--accent) 65%, #8ab73a);
    box-shadow: 0 0 13px #dbff7999;
    transition: height .11s linear;
  }
  .scale-label {
    position: absolute; right: 9px; color: #eaf2d9;
    font: 700 9px monospace; pointer-events: none;
  }
  .scale-label.top { top: 64px; }
  .scale-label.bottom { bottom: 57px; }
  .panel { align-self: stretch; display: flex; flex-direction: column; justify-content: center; }
  .panel small { font: 800 10px monospace; letter-spacing: 1px; color: #597568; }
  .number { display: flex; align-items: baseline; gap: 2px; white-space: nowrap; }
  .number strong { font: 950 clamp(46px, 5vw, 68px)/1 system-ui; letter-spacing: -5px; }
  .number span { font: 800 17px system-ui; }
  .range { margin-top: 4px; color: #5b7565; font: 11px monospace; }
  .panel .reps {
    margin: 18px 0 13px; padding: 9px 7px;
    border: 1px solid #91a88d; border-radius: 9px;
    background: #ecf5dc; text-align: center;
    font: 800 10px monospace; letter-spacing: .5px;
  }
  .actions { display: flex; gap: 9px; }
  .actions button {
    min-width: 47px; min-height: 47px; flex: 1;
    border: 2px solid #19352e; border-radius: 13px;
    background: #fffdf1; color: #19352e;
    box-shadow: 0 4px 0 #1b3f36;
    font: 900 25px/1 system-ui;
  }
  .actions button:last-child { background: var(--accent); }
  .actions button:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 #1b3f36; }
  .footnote { margin: 19px 0 0; color: #4d6758; font: 12px/1.5 system-ui; }
  .disabled { opacity: .62; filter: grayscale(.45); }
  .readonly .machine { border-color: #617a6e; }
  .disabled .lane, .readonly .lane { cursor: default; }
  .no-motion *, .no-motion *::before, .no-motion *::after {
    animation: none !important; transition: none !important;
  }
  @container (max-width: 440px) {
    .content { grid-template-columns: 1fr; gap: 19px; }
    .panel { align-items: center; }
    .panel .reps { margin: 10px 0; min-width: 180px; }
    .actions { width: min(100%, 250px); }
    .number strong { font-size: 56px; }
  }
  :host { container-type: inline-size; }
`;
