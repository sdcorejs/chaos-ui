import { LitElement, html, nothing, type PropertyValues } from "lit";
import { live } from "lit/directives/live.js";
import {
  normalizeOtpSlots,
  otpSnapshot,
  type OtpDigit,
  type OtpProps,
  type OtpSlots,
  type OtpStatus,
} from "../otp.js";
import {
  clearOtpDigit,
  fillOtpDigits,
  placeOtpDigit,
  type OtpSelection,
} from "../otp-interaction.js";
import { OtpAudio } from "../otp-audio.js";
import { gloveArtwork } from "./glove.js";
import { gemSvg } from "./gem.js";
import { failedEmoji } from "./failed-emoji.js";
import { infinityStyles } from "./styles.js";

/** Shared OTP options with six fixed sockets; `length` is intentionally unavailable.
 * @example const options: InfinityOtpProps = { slots: ['0',null,null,null,null,null], status: 'idle' };
 */
export type InfinityOtpProps = Omit<OtpProps, "length">;
type Drag = OtpSelection & {
  id: number;
  element: HTMLElement;
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
};
const digits: OtpDigit[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const sourceColors = ["#baa6e4", "#93c9e6", "#e1afd2", "#d4bf8a", "#8ad8c3"] as const;
const SNAP_DURATION_MS = 2100;
type SnapPhase = "idle" | "playing" | "finished";
const words = {
  vi: {
    title: "GĂNG TAY VÔ CỰC",
    sub: "Sáu hốc. Một mã. Một cú búng tay.",
    slot: "Hốc",
    empty: "trống",
    pick: "Lấy đá số",
    pool: "Nguồn đá chữ số, lấy lặp lại",
    hint: "Chọn đá rồi chọn hốc 1–6, hoặc kéo thả. Có thể nhập bằng bàn phím.",
    selected: "Đã chọn đá số",
    place: "Chọn hốc đích.",
    reset: "Làm lại",
    remove: "Lấy đá ra",
    submit: "Búng tay",
    snapping: "Đang búng tay…",
    verifying: "Vũ trụ đang kiểm tra…",
    success: "Hoàn tất! Vũ trụ đã nghe thấy.",
    error: "Chưa đúng. Đổi đá rồi thử lại.",
    ready: "Đủ sáu viên. Sẵn sàng búng tay.",
    idle: "Đặt sáu viên đá theo thứ tự mã OTP.",
    input: "Nhập thông thường",
    game: "Chơi xếp đá",
    badge: "BÚNG!",
    failedSnap: "Ơ KÌA?!",
    replay: "Xem lại cú búng",
  },
  en: {
    title: "INFINITY GAUNTLET",
    sub: "Six sockets. One code. One snap.",
    slot: "Socket",
    empty: "empty",
    pick: "Pick stone",
    pool: "Reusable digit stones",
    hint: "Pick a stone then socket 1–6, or drag it. You can also type digits.",
    selected: "Selected stone",
    place: "Choose a destination socket.",
    reset: "Reset",
    remove: "Remove stone",
    submit: "Snap fingers",
    snapping: "Snapping fingers…",
    verifying: "The universe is checking…",
    success: "Done! The universe heard you.",
    error: "Not quite. Replace a stone and try again.",
    ready: "All six stones set. Ready to snap.",
    idle: "Place six stones in OTP order.",
    input: "Standard input",
    game: "Arrange stones",
    badge: "SNAP!",
    failedSnap: "WAIT... WHAT?!",
    replay: "Replay snap",
  },
};

/** A six-position OTP game. The host verifies `submit` and owns `status`/`message`.
 * @fires change - CustomEvent<OtpChangeDetail> for effective user edits.
 * @fires complete - CustomEvent<OtpSubmitDetail> for a newly complete value.
 * @fires submit - CustomEvent<OtpSubmitDetail> only after confirmation.
 * @example
 * registerInfinityOtp();
 * const glove = document.querySelector('chaos-infinity-otp-element');
 * glove.addEventListener('submit', event => verify(event.detail.value));
 */
export class ChaosInfinityOtpElement
  extends LitElement
  implements InfinityOtpProps
{
  static override styles = infinityStyles;
  static override properties = {
    slots: { attribute: false },
    disabled: { type: Boolean },
    readOnly: { type: Boolean, attribute: "readonly" },
    status: { type: String },
    message: { type: String },
    locale: { type: String },
    sound: { type: Boolean },
    reducedMotion: { type: String, attribute: "reduced-motion" },
    mode: { type: String },
    selection: { state: true },
    drag: { state: true },
    systemReduced: { state: true },
    visualState: { state: true },
    snapPhase: { state: true },
  };
  static {
    this.finalize();
  }
  /** Six positional digit strings/nulls, padded/truncated silently. @example glove.slots = ['0','0','1','1','2','2']; */
  declare slots: OtpSlots;
  /** Default false; blocks interactions. @example glove.disabled = true; */
  declare disabled: boolean;
  /** Default false; allows focus but blocks edits/submit. @example glove.readOnly = true; */
  declare readOnly: boolean;
  /** Host verification state; default idle. Submit starts the snap; success/error appears after it finishes. @example glove.status = 'success'; */
  declare status: OtpStatus;
  /** Host feedback as plain text; default ''. @example glove.message = 'Try again'; */
  declare message: string;
  /** vi by default; en supported. @example glove.locale = 'en'; */
  declare locale: "vi" | "en";
  /** Default false; also requires a trusted user gesture. @example glove.sound = true; */
  declare sound: boolean;
  /** auto (default), always or never. @example glove.reducedMotion = 'always'; */
  declare reducedMotion: "auto" | "always" | "never";
  /** game (default) or conventional six-field input. @example glove.mode = 'input'; */
  declare mode: "game" | "input";
  declare private selection: OtpSelection | null;
  declare private drag: Drag | null;
  declare private systemReduced: boolean;
  declare private visualState: OtpStatus | null;
  declare private snapPhase: SnapPhase;
  private snapTimer: ReturnType<typeof setTimeout> | null = null;
  private media: MediaQueryList | undefined;
  private resizeWindow: Window | null = null;
  private ignoreClickUntil = 0;
  private pendingFocus = 0;
  private readonly audio = new OtpAudio();
  private readonly poolCuts = digits.map(() => Math.floor(Math.random() * 6));
  private readonly poolColors = digits.map(() =>
    sourceColors[Math.floor(Math.random() * sourceColors.length)],
  );

  constructor() {
    super();
    this.slots = normalizeOtpSlots([], 6);
    this.disabled = false;
    this.readOnly = false;
    this.status = "idle";
    this.message = "";
    this.locale = "vi";
    this.sound = false;
    this.reducedMotion = "auto";
    this.mode = "game";
    this.selection = null;
    this.drag = null;
    this.systemReduced = false;
    this.visualState = null;
    this.snapPhase = "idle";
  }
  private get t() {
    return words[this.locale === "en" ? "en" : "vi"];
  }
  private get values() {
    return normalizeOtpSlots(this.slots, 6);
  }
  private get locked() {
    return this.disabled || this.readOnly || this.status === "verifying";
  }
  private get motionOff() {
    return (
      this.reducedMotion === "always" ||
      (this.reducedMotion !== "never" && this.systemReduced)
    );
  }
  override connectedCallback() {
    super.connectedCallback();
    this.media = this.ownerDocument.defaultView?.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );
    this.systemReduced = this.media?.matches ?? false;
    this.media?.addEventListener("change", this.mediaChanged);
  }
  override disconnectedCallback() {
    this.cancelInteraction();
    this.cancelSnap();
    this.pendingFocus++;
    this.media?.removeEventListener("change", this.mediaChanged);
    this.media = undefined;
    this.audio.close();
    this.visualState = null;
    super.disconnectedCallback();
  }
  private mediaChanged = (event: MediaQueryListEvent) => {
    this.systemReduced = event.matches;
    if (this.motionOff) this.finishSnap();
  };
  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("slots")) {
      const values = this.values;
      const previous = changed.get("slots");
      const contentsChanged =
        !Array.isArray(previous) ||
        normalizeOtpSlots(previous, 6).some((digit, index) => digit !== values[index]);
      if (
        !Array.isArray(this.slots) ||
        this.slots.length !== 6 ||
        this.slots.some((d, i) => d !== values[i])
      )
        this.slots = values;
      if (contentsChanged) {
        this.cancelInteraction();
        this.cancelSnap();
        this.visualState = null;
      }
    }
    if (changed.has("mode")) this.cancelSnap();
    if (changed.has("mode") || this.locked) this.cancelInteraction();
    if (changed.has("reducedMotion") && this.motionOff)
      this.finishSnap();
    if (!this.sound) this.audio.close();
    if (changed.has("status") && changed.get("status") !== this.status) {
      this.visualState = this.status;
      if (this.status === "idle") this.cancelSnap();
      else if (
        (this.status === "success" || this.status === "error") &&
        this.snapPhase === "idle"
      )
        this.startSnap();
      if (this.status === "success") this.audio.tone(this.sound, true);
    }
  }
  private cancelSnap() {
    if (this.snapTimer !== null) clearTimeout(this.snapTimer);
    this.snapTimer = null;
    this.snapPhase = "idle";
  }
  private finishSnap() {
    if (this.snapPhase !== "playing") return;
    if (this.snapTimer !== null) clearTimeout(this.snapTimer);
    this.snapTimer = null;
    this.snapPhase = "finished";
  }
  private startSnap() {
    this.cancelSnap();
    if (this.motionOff) {
      this.snapPhase = "finished";
      return;
    }
    this.snapPhase = "playing";
    this.snapTimer = setTimeout(() => this.finishSnap(), SNAP_DURATION_MS);
  }
  /** Silently clear slots and cancel effects/drag; host also sets status to idle.
   * @example glove.reset(); glove.status = 'idle';
   */
  reset(): void {
    this.cancelInteraction();
    this.cancelSnap();
    this.pendingFocus++;
    this.slots = normalizeOtpSlots([], 6);
    this.visualState = null;
    this.audio.close();
  }
  private commit(next: OtpSlots, event: Event) {
    if (this.locked) return;
    const before = otpSnapshot(this.values),
      after = otpSnapshot(normalizeOtpSlots(next, 6));
    if (before.slots.every((d, i) => d === after.slots[i])) return;
    this.cancelInteraction();
    this.cancelSnap();
    this.slots = [...after.slots];
    this.visualState = null;
    this.audio.activate(event, this.sound);
    this.audio.tone(this.sound, false);
    if (after.slots.every((d) => d === null)) this.audio.close();
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: after,
        bubbles: true,
        composed: true,
      }),
    );
    if (after.complete && after.value !== before.value)
      this.dispatchEvent(
        new CustomEvent("complete", {
          detail: after,
          bubbles: true,
          composed: true,
        }),
      );
  }
  private submit = (event: Event) => {
    if (this.locked || this.snapPhase === "playing") return;
    const detail = otpSnapshot(this.values);
    if (!detail.complete) return;
    this.audio.activate(event, this.sound);
    this.startSnap();
    this.dispatchEvent(
      new CustomEvent("submit", { detail, bubbles: true, composed: true }),
    );
  };
  private replaySnap = (event: Event) => {
    if (
      this.disabled ||
      this.status === "verifying" ||
      (this.status !== "success" && this.status !== "error")
    ) return;
    this.audio.activate(event, this.sound);
    this.startSnap();
  };
  private place(selection: OtpSelection, target: number, event: Event) {
    this.commit(placeOtpDigit(this.values, selection, target), event);
    this.selection = null;
  }
  private clickSource(digit: OtpDigit, event: MouseEvent) {
    if (
      this.locked ||
      (event.detail > 0 && performance.now() < this.ignoreClickUntil)
    )
      return;
    this.audio.activate(event, this.sound);
    this.selection = { digit, source: null };
  }
  private clickSocket(index: number, event: MouseEvent) {
    if (
      this.locked ||
      (event.detail > 0 && performance.now() < this.ignoreClickUntil)
    )
      return;
    if (this.selection) {
      if (this.selection.source !== index)
        this.place(this.selection, index, event);
      this.selection = null;
    } else {
      const digit = this.values[index];
      if (digit != null) this.selection = { digit, source: index };
    }
  }
  private removeSelection = (event: Event) => {
    if (this.selection?.source == null) return;
    this.commit(clearOtpDigit(this.values, this.selection.source), event);
    this.selection = null;
  };
  private focusSocket(index: number) {
    const token = ++this.pendingFocus;
    void this.updateComplete.then(() => {
      if (token === this.pendingFocus && this.isConnected)
        this.renderRoot
          .querySelector<HTMLElement>(`[data-slot="${index}"]`)
          ?.focus();
    });
  }
  private keySocket(index: number, event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.cancelInteraction();
      return;
    }
    const move =
      event.key === "ArrowLeft"
        ? index - 1
        : event.key === "ArrowRight"
          ? index + 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? 5
              : null;
    if (move !== null) {
      event.preventDefault();
      this.focusSocket(Math.max(0, Math.min(5, move)));
      return;
    }
    if (this.locked) return;
    if (event.key === "Enter") {
      event.preventDefault();
      this.submit(event);
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      const next = [...this.values];
      next[index] = event.key as OtpDigit;
      this.commit(next, event);
      this.focusSocket(Math.min(5, index + 1));
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      const target =
        event.key === "Backspace" && this.values[index] === null
          ? Math.max(0, index - 1)
          : index;
      this.commit(clearOtpDigit(this.values, target), event);
      this.focusSocket(target);
    }
  }
  private fill(index: number, raw: string, event: Event) {
    const filled = fillOtpDigits(this.values, index, raw);
    this.commit(filled.slots, event);
    this.focusSocket(Math.min(5, index + filled.count));
  }
  private paste(index: number, event: ClipboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.locked)
      this.fill(index, event.clipboardData?.getData("text") ?? "", event);
  }
  private input(index: number, event: Event) {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    if (!this.locked) this.fill(index, input.value, event);
    input.value = this.values[index] ?? "";
  }
  private pointerDown(selection: OtpSelection, event: PointerEvent) {
    if (this.locked || !event.isPrimary || event.button !== 0) return;
    this.cancelDrag();
    const element = event.currentTarget as HTMLElement;
    this.drag = {
      ...selection,
      id: event.pointerId,
      element,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
    element.setPointerCapture(event.pointerId);
    this.resizeWindow = this.ownerDocument.defaultView;
    this.resizeWindow?.addEventListener("resize", this.cancelInteraction);
    this.audio.activate(event, this.sound);
  }
  private pointerMove = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    const moved =
      drag.moved ||
      Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6;
    if (moved) {
      event.preventDefault();
      this.selection = { digit: drag.digit, source: drag.source };
    }
    this.drag = { ...drag, x: event.clientX, y: event.clientY, moved };
  };
  private pointerUp = (event: PointerEvent) => {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.moved) {
      event.preventDefault();
      this.ignoreClickUntil = performance.now() + 400;
      const socket = Array.from(
        this.renderRoot.querySelectorAll<HTMLElement>("[data-slot]"),
      ).find((el) => {
        const r = el.getBoundingClientRect();
        return (
          event.clientX >= r.left &&
          event.clientX <= r.right &&
          event.clientY >= r.top &&
          event.clientY <= r.bottom
        );
      });
      this.cancelDrag();
      if (socket) this.place(drag, Number(socket.dataset["slot"]), event);
      else if (drag.source !== null)
        this.commit(clearOtpDigit(this.values, drag.source), event);
      this.selection = null;
    } else this.cancelDrag();
  };
  private cancelDrag() {
    const drag = this.drag;
    this.drag = null;
    this.resizeWindow?.removeEventListener("resize", this.cancelInteraction);
    this.resizeWindow = null;
    if (drag?.element.hasPointerCapture(drag.id))
      drag.element.releasePointerCapture(drag.id);
  }
  private cancelInteraction = () => {
    this.cancelDrag();
    this.selection = null;
  };

  override render() {
    const t = this.t,
      values = this.values,
      complete = otpSnapshot(values).complete,
      state = this.snapPhase === "playing" ? "snapping" : this.visualState;
    const label = (index: number) =>
      `${t.slot} ${index + 1}: ${values[index] ?? t.empty}`;
    return html`<section
      part="board"
      class="board ${state ?? "idle"} ${complete ? "complete" : ""} ${this
        .motionOff
        ? "no-motion"
        : ""}"
      aria-label=${t.title}
      aria-busy=${this.status === "verifying" || this.snapPhase === "playing"}
      @pointermove=${this.pointerMove}
      @pointerup=${this.pointerUp}
      @pointercancel=${this.cancelInteraction}
      @lostpointercapture=${this.cancelDrag}
    >
      <header part="header" class="header">
        <span class="mark" aria-hidden="true">✦</span>
        <div><strong>${t.title}</strong><small>${t.sub}</small></div>
        <span class="badge">06 / 06</span>
      </header>
      <div part="stage" class="stage">
        <div class="halo" aria-hidden="true"></div>
        ${gloveArtwork}
        ${state === "snapping"
          ? html`<span part="snap-impact" class="snap-impact" aria-hidden="true"></span>
              <span part="snap-caption" class="snap-caption" aria-hidden="true">${t.badge}</span>`
          : nothing}
        ${state === "error"
          ? html`<div class="failed-reaction" aria-hidden="true">
              ${failedEmoji}
              <span part="failed-snap" class="failed-snap">${t.failedSnap}</span>
            </div>`
          : nothing}
        <div part="sockets" class="sockets" role="group" aria-label=${t.title}>
          ${values.map(
            (digit, index) =>
              html`<div class="socket-wrap pos-${index + 1}">
                <span class="order" aria-hidden="true"
                  >${String(index + 1).padStart(2, "0")}</span
                >
                ${this.mode === "input"
                  ? html`<input
                      part="socket input"
                      class="socket input"
                      data-slot=${index}
                      aria-label=${label(index)}
                      aria-describedby="hint result"
                      type="text"
                      inputmode="numeric"
                      autocomplete=${index === 0 ? "one-time-code" : "off"}
                      maxlength="6"
                      .value=${live(digit ?? "")}
                      ?disabled=${this.disabled || this.status === "verifying"}
                      ?readonly=${this.readOnly}
                      @input=${(e: Event) => this.input(index, e)}
                      @change=${(e: Event) => e.stopPropagation()}
                      @paste=${(e: ClipboardEvent) => this.paste(index, e)}
                      @keydown=${(e: KeyboardEvent) => this.keySocket(index, e)}
                    />`
                  : html`<button
                      type="button"
                      part="socket"
                      class="socket ${digit !== null ? "filled" : ""} ${this
                        .selection?.source === index
                        ? "selected"
                        : ""}"
                      data-slot=${index}
                      aria-label=${label(index)}
                      aria-describedby="hint result"
                      aria-pressed=${this.selection?.source === index}
                      ?disabled=${this.disabled || this.status === "verifying"}
                      aria-disabled=${this.readOnly}
                      @click=${(e: MouseEvent) => this.clickSocket(index, e)}
                      @keydown=${(e: KeyboardEvent) => this.keySocket(index, e)}
                      @paste=${(e: ClipboardEvent) => this.paste(index, e)}
                      @pointerdown=${(e: PointerEvent) => {
                        if (digit !== null)
                          this.pointerDown({ digit, source: index }, e);
                      }}
                    >
                      ${digit === null ? nothing : gemSvg(index)}
                      <span class="gem-shape" aria-hidden="true"
                        >${["✦", "✧", "✳", "◇", "✶", "✴"][index]}</span
                      >
                      <span class="socket-digit">${digit ?? "·"}</span>
                    </button>`}
              </div>`,
          )}
        </div>
        ${state === "success"
          ? html`<div part="dust" class="dust" aria-hidden="true">
              ${Array.from(
                { length: 24 },
                (_, i) => html`<i
                  style=${`--i:${i};--x:${16 + ((i * 37) % 69)}%;--y:${19 + ((i * 47) % 62)}%;--dx:${((i * 31) % 161) - 80}px;--dy:${-90 - ((i * 17) % 90)}px`}
                ></i>`,
              )}
            </div>`
          : nothing}
      </div>
      ${this.mode === "game"
        ? html`<div part="pool" class="pool" role="group" aria-label=${t.pool}>
            ${digits.map(
              (digit) =>
                html`<button
                  type="button"
                  part="stone source"
                  class="source"
                  style=${`--gem:${this.poolColors[Number(digit)]}`}
                  aria-label=${`${t.pick} ${digit}`}
                  aria-pressed=${this.selection?.source === null &&
                  this.selection.digit === digit}
                  ?disabled=${this.locked}
                  @click=${(e: MouseEvent) => this.clickSource(digit, e)}
                  @pointerdown=${(e: PointerEvent) =>
                    this.pointerDown({ digit, source: null }, e)}
                >
                  ${gemSvg(this.poolCuts[Number(digit)])}<strong>${digit}</strong>
                </button>`,
            )}
          </div>`
        : nothing}
      <p part="hint" class="hint" id="hint" aria-live="polite">
        ${this.selection
          ? `${t.selected} ${this.selection.digit}. ${t.place}`
          : t.hint}
      </p>
      <div part="actions" class="actions">
        <button
          part="reset"
          type="button"
          ?disabled=${this.locked || values.every((d) => d === null)}
          @click=${(e: Event) => this.commit(normalizeOtpSlots([], 6), e)}
        >
          ${t.reset}
        </button>
        ${this.selection?.source != null
          ? html`<button
              part="remove"
              type="button"
              ?disabled=${this.locked}
              @click=${this.removeSelection}
            >
              ${t.remove}
            </button>`
          : nothing}
        <button
          part="mode-toggle"
          type="button"
          ?disabled=${this.disabled || this.status === "verifying"}
          @click=${() => {
            this.mode = this.mode === "game" ? "input" : "game";
          }}
        >
          ${this.mode === "game" ? t.input : t.game}
        </button>
        <button
          part="submit"
          class="submit"
          type="button"
          ?disabled=${this.locked || !complete || this.snapPhase === "playing"}
          @click=${this.submit}
        >
          ${this.snapPhase === "playing"
            ? t.snapping
            : this.status === "verifying"
              ? t.verifying
              : t.submit}<span
            aria-hidden="true"
            >✦</span
          >
        </button>
        ${(this.status === "success" || this.status === "error") &&
        this.snapPhase === "finished"
          ? html`<button
              part="replay"
              type="button"
              ?disabled=${this.disabled}
              @click=${this.replaySnap}
            >${t.replay}</button>`
          : nothing}
      </div>
      <div
        part="message"
        class="message"
        id="result"
        role="status"
        aria-live="polite"
      >
        ${state === "snapping" ? t.snapping : this.message ||
        (this.status === "verifying"
          ? t.verifying
          : this.status === "success"
            ? t.success
            : this.status === "error"
              ? t.error
              : complete
                ? t.ready
                : t.idle)}
        ${state === "success"
          ? html`<strong part="celebration">${t.badge}</strong>`
          : nothing}
      </div>
      ${this.drag?.moved
        ? html`<span
            part="drag-stone"
            class="drag-stone"
            aria-hidden="true"
            style=${`left:${this.drag.x}px;top:${this.drag.y}px`}
            >${this.drag.digit}</span
          >`
        : nothing}
    </section>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "chaos-infinity-otp-element": ChaosInfinityOtpElement;
  }
}
