import { LitElement, html, type PropertyValues } from "lit";
import { decayVolumePosition, normalizeVolume } from "./math.js";
import { volumeGymStyles } from "./styles.js";
import type {
  ChaosVolumeGymProps,
  VolumeChangeDetail,
  VolumeChangeSource,
  VolumeCommitDetail,
} from "./types.js";

type DirectSource = VolumeCommitDetail["source"];

/** A vertical volume slider drawn as a cable weight machine. It never plays audio.
 * `change` fires only for effective user/gravity updates; `commit` fires after an
 * effective pointer, keyboard or button action. Host writes are silent.
 * @fires change - CustomEvent<VolumeChangeDetail> with value and source.
 * @fires commit - CustomEvent<VolumeCommitDetail> after a direct gesture.
 * @example
 * registerVolumeGym();
 * const gym = document.querySelector('chaos-volume-gym-element');
 * gym.addEventListener('change', event => audio.volume = event.detail.value / 100);
 */
export class ChaosVolumeGymElement
  extends LitElement
  implements ChaosVolumeGymProps
{
  static override styles = volumeGymStyles;
  static override properties = {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    disabled: { type: Boolean },
    readOnly: { type: Boolean, attribute: "readonly" },
    gravity: { type: Boolean },
    decayRate: { type: Number, attribute: "decay-rate" },
    reducedMotion: { type: String, attribute: "reduced-motion" },
    systemReduced: { state: true },
  };
  static {
    this.finalize();
  }

  /** Current quantized volume; default 0. Programmatic writes emit no events.
   * @example gym.value = 35;
   */
  declare value: number;
  /** Lower bound, default 0; reversed min/max are sorted. @example gym.min = 10; */
  declare min: number;
  /** Upper bound, default 100 and always reachable. @example gym.max = 80; */
  declare max: number;
  /** Step size from min, default 1; invalid values use 1. @example gym.step = 0.5; */
  declare step: number;
  /** Default false; prevents focus and edits. @example gym.disabled = true; */
  declare disabled: boolean;
  /** Default false; allows focus but prevents edits. @example gym.readOnly = true; */
  declare readOnly: boolean;
  /** Default false; start descent after a direct gesture. @example gym.gravity = true; */
  declare gravity: boolean;
  /** Units of the value range per second, default 18. Zero stops descent.
   * @example gym.decayRate = 12; // 12 volume units / second
   */
  declare decayRate: number;
  /** auto follows prefers-reduced-motion, always reduces decoration, never opts in.
   * Default auto; gravity still changes the value in reduced-motion mode.
   * @example gym.reducedMotion = 'always';
   */
  declare reducedMotion: "auto" | "always" | "never";
  declare private systemReduced: boolean;

  private media: MediaQueryList | undefined;
  private pointerId: number | null = null;
  private pointerTarget: HTMLElement | null = null;
  private pointerChanged = false;
  private keyboardChanged = false;
  private gravityActive = false;
  private gravityFrame: number | null = null;
  private gravityPosition = 0;
  private lastFrameTime: number | null = null;
  private internalValue: number | null = null;

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.disabled = false;
    this.readOnly = false;
    this.gravity = false;
    this.decayRate = 18;
    this.reducedMotion = "auto";
    this.systemReduced = false;
  }

  private get range(): readonly [number, number] {
    const a = Number.isFinite(this.min) ? this.min : 0;
    const b = Number.isFinite(this.max) ? this.max : 100;
    return [Math.min(a, b), Math.max(a, b)];
  }
  private get quantum(): number {
    return Number.isFinite(this.step) && this.step > 0 ? this.step : 1;
  }
  private get speed(): number {
    return Number.isFinite(this.decayRate)
      ? Math.max(0, this.decayRate)
      : 18;
  }
  private get locked(): boolean {
    return this.disabled || this.readOnly;
  }
  private get motionOff(): boolean {
    return (
      this.reducedMotion === "always" ||
      (this.reducedMotion !== "never" && this.systemReduced)
    );
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.media = this.ownerDocument.defaultView?.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );
    this.systemReduced = this.media?.matches ?? false;
    this.media?.addEventListener("change", this.mediaChanged);
    this.ownerDocument.addEventListener("visibilitychange", this.visibilityChanged);
  }
  override disconnectedCallback(): void {
    this.cancelPointer();
    this.keyboardChanged = false;
    this.stopGravity();
    this.media?.removeEventListener("change", this.mediaChanged);
    this.media = undefined;
    this.ownerDocument.removeEventListener("visibilitychange", this.visibilityChanged);
    super.disconnectedCallback();
  }
  private mediaChanged = (event: MediaQueryListEvent): void => {
    this.systemReduced = event.matches;
  };
  private visibilityChanged = (): void => {
    if (this.ownerDocument.hidden) {
      this.pauseGravity();
    } else if (this.gravityActive) {
      this.scheduleGravity();
    }
  };

  protected override willUpdate(changed: PropertyValues<this>): void {
    const rangeChanged =
      changed.has("min") || changed.has("max") || changed.has("step");
    if (changed.has("value") || rangeChanged) {
      const external =
        rangeChanged ||
        (changed.has("value") && this.internalValue !== this.value);
      if (external) {
        this.stopGravity();
        this.cancelPointer();
        this.keyboardChanged = false;
      }
      const [low, high] = this.range;
      const normalized = normalizeVolume(this.value, low, high, this.quantum);
      if (normalized !== this.value) this.value = normalized;
      this.internalValue = null;
    }
    if (this.locked || !this.gravity || this.speed === 0) {
      this.stopGravity();
      if (this.locked) {
        this.cancelPointer();
        this.keyboardChanged = false;
      }
    }
  }

  private emitChange(value: number, source: VolumeChangeSource): void {
    const detail: VolumeChangeDetail = Object.freeze({ value, source });
    this.dispatchEvent(
      new CustomEvent("change", { detail, bubbles: true, composed: true }),
    );
  }
  private emitCommit(source: DirectSource): void {
    const detail: VolumeCommitDetail = Object.freeze({
      value: this.value,
      source,
    });
    this.dispatchEvent(
      new CustomEvent("commit", { detail, bubbles: true, composed: true }),
    );
  }
  private setFromInteraction(raw: number, source: VolumeChangeSource): boolean {
    if (this.locked) return false;
    const [low, high] = this.range;
    const next = normalizeVolume(raw, low, high, this.quantum);
    if (next === this.value) return false;
    this.internalValue = next;
    this.value = next;
    this.emitChange(next, source);
    return true;
  }

  private applyPointer(event: PointerEvent): void {
    const target = this.pointerTarget;
    if (!target) return;
    const box = target.getBoundingClientRect();
    const fraction = Math.max(
      0,
      Math.min(1, (box.bottom - event.clientY) / Math.max(box.height, 1)),
    );
    const [low, high] = this.range;
    if (this.setFromInteraction(low + fraction * (high - low), "pointer"))
      this.pointerChanged = true;
  }
  private pointerDown = (event: PointerEvent): void => {
    if (this.locked || !event.isPrimary || event.button !== 0) return;
    this.stopGravity();
    this.cancelPointer();
    this.pointerId = event.pointerId;
    this.pointerTarget = event.currentTarget as HTMLElement;
    this.pointerChanged = false;
    this.pointerTarget.setPointerCapture(event.pointerId);
    this.applyPointer(event);
    event.preventDefault();
    this.requestUpdate();
  };
  private pointerMove = (event: PointerEvent): void => {
    if (this.pointerId !== event.pointerId) return;
    this.applyPointer(event);
  };
  private pointerUp = (event: PointerEvent): void => {
    if (this.pointerId !== event.pointerId) return;
    this.applyPointer(event);
    const changed = this.pointerChanged;
    this.cancelPointer();
    if (changed) this.emitCommit("pointer");
    this.startGravity();
  };
  private pointerCancel = (event: PointerEvent): void => {
    if (this.pointerId === event.pointerId) this.cancelPointer();
  };
  private lostCapture = (event: PointerEvent): void => {
    if (this.pointerId === event.pointerId) this.cancelPointer();
  };
  private cancelPointer(): void {
    const id = this.pointerId;
    const target = this.pointerTarget;
    this.pointerId = null;
    this.pointerTarget = null;
    this.pointerChanged = false;
    if (id !== null && target?.hasPointerCapture(id))
      target.releasePointerCapture(id);
    if (id !== null) this.requestUpdate();
  }

  private keyTarget(key: string): number | null {
    const [low, high] = this.range;
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        return this.value + this.quantum;
      case "ArrowDown":
      case "ArrowLeft":
        return this.value - this.quantum;
      case "PageUp":
        return this.value + this.quantum * 10;
      case "PageDown":
        return this.value - this.quantum * 10;
      case "Home":
        return low;
      case "End":
        return high;
      default:
        return null;
    }
  }
  private keyDown = (event: KeyboardEvent): void => {
    const target = this.keyTarget(event.key);
    if (target === null) return;
    event.preventDefault();
    if (this.locked) return;
    this.stopGravity();
    if (this.setFromInteraction(target, "keyboard")) this.keyboardChanged = true;
  };
  private keyUp = (event: KeyboardEvent): void => {
    if (this.keyTarget(event.key) !== null) this.finishKeyboard();
  };
  private finishKeyboard(): void {
    if (!this.keyboardChanged) return;
    this.keyboardChanged = false;
    this.emitCommit("keyboard");
    this.startGravity();
  }
  private pressButton = (direction: -1 | 1): void => {
    if (this.locked) return;
    this.stopGravity();
    if (this.setFromInteraction(this.value + direction * this.quantum, "button"))
      this.emitCommit("button");
    this.startGravity();
  };

  private scheduleGravity(): void {
    if (!this.gravityActive || this.gravityFrame !== null || this.ownerDocument.hidden)
      return;
    const view = this.ownerDocument.defaultView;
    if (view) this.gravityFrame = view.requestAnimationFrame(this.gravityTick);
  }
  private gravityTick = (time: number): void => {
    this.gravityFrame = null;
    if (!this.gravityActive || !this.isConnected || this.ownerDocument.hidden)
      return;
    if (this.lastFrameTime !== null) {
      const [low] = this.range;
      this.gravityPosition = decayVolumePosition(
        this.gravityPosition,
        this.speed,
        time - this.lastFrameTime,
        low,
      );
      this.setFromInteraction(this.gravityPosition, "gravity");
      if (this.value <= low) {
        this.stopGravity();
        return;
      }
    }
    this.lastFrameTime = time;
    this.scheduleGravity();
  };
  private startGravity(): void {
    const [low] = this.range;
    if (!this.gravity || this.locked || this.speed <= 0 || this.value <= low)
      return;
    this.gravityActive = true;
    this.gravityPosition = this.value;
    this.lastFrameTime = null;
    this.scheduleGravity();
    this.requestUpdate();
  }
  private pauseGravity(): void {
    if (this.gravityFrame !== null)
      this.ownerDocument.defaultView?.cancelAnimationFrame(this.gravityFrame);
    this.gravityFrame = null;
    this.lastFrameTime = null;
  }
  private stopGravity(): void {
    if (!this.gravityActive && this.gravityFrame === null) return;
    this.gravityActive = false;
    this.pauseGravity();
    this.requestUpdate();
  }

  override render() {
    const [low, high] = this.range;
    const current = normalizeVolume(this.value, low, high, this.quantum);
    const percentage = high === low ? 0 : ((current - low) / (high - low)) * 100;
    const percentRange = low === 0 && high === 100;
    const state = this.disabled
      ? "TẠM KHÓA"
      : this.readOnly
        ? "CHỈ XEM"
        : this.gravity
          ? "TRỌNG LỰC BẬT"
          : "GIỮ NGUYÊN MỨC";
    return html`<section
      part="board"
      class="board ${this.disabled ? "disabled" : ""} ${this.readOnly
        ? "readonly"
        : ""} ${this.motionOff ? "no-motion" : ""} ${this.pointerId !== null
        ? "lifting"
        : ""} ${this.gravityActive ? "falling" : ""}"
      aria-label="Volume Gym"
    >
      <div class="heading">
        <span class="mark" aria-hidden="true">↟</span>
        <div><strong>VOLUME GYM</strong><small>KÉO LÊN. NGHE TO HƠN.</small></div>
        <span class="badge">${this.gravity ? "GRAVITY / ON" : "GRAVITY / OFF"}</span>
      </div>
      <div class="content">
        <div part="machine" class="machine" style=${`--lift:${percentage}%`}>
          <div class="beam" aria-hidden="true"></div>
          <div class="upright left" aria-hidden="true"></div>
          <div class="upright right" aria-hidden="true"></div>
          <div class="pulley" aria-hidden="true"></div>
          <div
            part="slider handle"
            class="lane slider"
            role="slider"
            aria-label="Âm lượng"
            aria-orientation="vertical"
            aria-valuemin=${low}
            aria-valuemax=${high}
            aria-valuenow=${current}
            aria-valuetext=${percentRange ? `${current} phần trăm` : `${current}`}
            aria-disabled=${this.disabled}
            aria-readonly=${this.readOnly}
            tabindex=${this.disabled ? -1 : 0}
            @pointerdown=${this.pointerDown}
            @pointermove=${this.pointerMove}
            @pointerup=${this.pointerUp}
            @pointercancel=${this.pointerCancel}
            @lostpointercapture=${this.lostCapture}
            @keydown=${this.keyDown}
            @keyup=${this.keyUp}
            @blur=${this.finishKeyboard}
          >
            <div class="cable" aria-hidden="true"></div>
            <div part="weight" class="weight" aria-hidden="true">
              <div class="bar"></div><div class="grip"></div>
              <div class="plate left outer"></div><div class="plate left inner"></div>
              <div class="plate right inner"></div><div class="plate right outer"></div>
            </div>
          </div>
          <div part="meter" class="scale" aria-hidden="true"><div class="fill"></div></div>
          <span class="scale-label top" aria-hidden="true">${high}</span>
          <span class="scale-label bottom" aria-hidden="true">${low}</span>
          <div class="floor" aria-hidden="true"></div>
        </div>
        <div class="panel">
          <small>MỨC ÂM LƯỢNG</small>
          <div part="display" class="number"><strong>${current}</strong>${percentRange ? html`<span>%</span>` : ""}</div>
          <div class="range">${low} — ${high}</div>
          <div part="status" class="reps">${state}</div>
          <div part="actions" class="actions">
            <button
              part="decrement"
              type="button"
              aria-label="Giảm âm lượng"
              ?disabled=${this.locked || current <= low}
              @click=${() => this.pressButton(-1)}
            >−</button>
            <button
              part="increment"
              type="button"
              aria-label="Tăng âm lượng"
              ?disabled=${this.locked || current >= high}
              @click=${() => this.pressButton(1)}
            >+</button>
          </div>
        </div>
      </div>
      <p class="footnote">Kéo tạ, dùng phím ↑ ↓ Home End, hoặc bấm + / −.</p>
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "chaos-volume-gym-element": ChaosVolumeGymElement;
  }
}
