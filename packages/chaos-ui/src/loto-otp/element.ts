import { LitElement, html, nothing, type PropertyValues } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { live } from "lit/directives/live.js";
import {
  normalizeOtpLength,
  normalizeOtpSlots,
  otpSnapshot,
  type OtpDigit,
  type OtpSlots,
  type OtpStatus,
  type OtpProps,
} from "../otp.js";
import { lotoStyles } from "./styles.js";
import { OtpAudio } from "../otp-audio.js";
import {
  placeOtpDigit,
  clearOtpDigit,
  fillOtpDigits,
  type OtpSelection,
} from "../otp-interaction.js";

type Selection = OtpSelection;
type Drag = Selection & {
  id: number;
  element: HTMLElement;
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
};
const digits: OtpDigit[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const words = {
  vi: {
    title: "LÔ TÔ • MÃ XÁC NHẬN",
    supply: "10 SỐ · VÔ HẠN BÓNG",
    slot: "Ô",
    empty: "trống",
    digit: "Lấy số",
    hint: "Kéo bóng vào ô, hoặc chọn số rồi bấm ô. Có thể nhập số bằng bàn phím.",
    selected: "Đã chọn số",
    place: "Bấm ô đích để đặt bóng.",
    reset: "Làm lại",
    remove: "Bỏ bóng",
    submit: "Xác nhận",
    verifying: "Đang xác thực…",
    ready: "Đủ số rồi. Bấm xác nhận khi sẵn sàng.",
    idle: "Mã xác nhận vẫn đang chờ bạn.",
    error: "Chưa đúng. Thử lại nhé!",
    success: "Xác thực thành công!",
    input: "Nhập thông thường",
    game: "Chơi lô tô",
    pool: "Nguồn chữ số, lấy lặp lại",
    code: "Mã xác nhận",
  },
  en: {
    title: "LOTO • VERIFICATION CODE",
    supply: "10 DIGITS · ENDLESS BALLS",
    slot: "Slot",
    empty: "empty",
    digit: "Pick digit",
    hint: "Drag a ball to a slot, or pick a digit then tap a slot. You can also type digits.",
    selected: "Selected digit",
    place: "Choose a destination slot.",
    reset: "Reset",
    remove: "Remove ball",
    submit: "Confirm",
    verifying: "Verifying…",
    ready: "All digits ready. Confirm when you are ready.",
    idle: "Your verification code goes here.",
    error: "Not quite. Try again!",
    success: "Verified successfully!",
    input: "Standard input",
    game: "Play loto",
    pool: "Reusable digit supply",
    code: "Verification code",
  },
};

/** Reusable loto OTP input. Registration is separate; the host verifies submitted codes.
 * @fires change - CustomEvent<OtpChangeDetail>, once per effective user edit.
 * @fires complete - CustomEvent<OtpSubmitDetail>, when an edit creates a new complete value.
 * @fires submit - CustomEvent<OtpSubmitDetail>, only on explicit confirmation.
 * @example
 * registerLotoOtp();
 * const input = document.querySelector('chaos-loto-otp-element');
 * input.addEventListener('submit', event => verify(event.detail.value));
 * // Later: input.status = 'success';
 */
export class ChaosLotoOtpElement extends LitElement implements OtpProps {
  static override styles = lotoStyles;
  static override properties = {
    slots: { attribute: false },
    length: { type: Number },
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
  };
  static {
    // Make accessors available to framework adapters before registration, without DOM access.
    this.finalize();
  }
  /** Positional digits; default six nulls. Assign a new array to update without events. @example element.slots = ['0','0','0','0','0','0']; */
  declare slots: OtpSlots;
  /** Default 6; floored/clamped 4–8. Keeps prefix and pads nulls without events. @example element.length = 4; */
  declare length: number;
  /** Default false; blocks edits and submit. @example element.disabled = true; */
  declare disabled: boolean;
  /** Default false; focusable, but cannot edit or submit. @example element.readOnly = true; */
  declare readOnly: boolean;
  /** Host-owned result; default idle. verifying locks input. @example element.status = 'success'; */
  declare status: OtpStatus;
  /** Host feedback as plain text, default ''. @example element.message = 'Try the new code'; */
  declare message: string;
  /** vi (default) or en for built-in labels. @example element.locale = 'en'; */
  declare locale: "vi" | "en";
  /** Default false. Sound requires opt-in and trusted user interaction. @example element.sound = true; */
  declare sound: boolean;
  /** auto (default), always or never. auto follows the OS preference. @example element.reducedMotion = 'always'; */
  declare reducedMotion: "auto" | "always" | "never";
  /** game (default) or conventional input; preserves slots when changed. @example element.mode = 'input'; */
  declare mode: "game" | "input";
  declare private selection: Selection | null;
  declare private drag: Drag | null;
  declare private systemReduced: boolean;
  private media: MediaQueryList | undefined;
  private resizeWindow: Window | null = null;
  private ignoreClickUntil = 0;
  private readonly audio = new OtpAudio();
  private pendingFocus = 0;

  constructor() {
    super();
    this.slots = normalizeOtpSlots([], 6);
    this.length = 6;
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
  }
  private get text() {
    return words[this.locale === "en" ? "en" : "vi"];
  }
  private get values() {
    return normalizeOtpSlots(this.slots, this.length);
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
    this.pendingFocus++;
    this.media?.removeEventListener("change", this.mediaChanged);
    this.media = undefined;
    this.audio.close();
    super.disconnectedCallback();
  }
  private mediaChanged = (event: MediaQueryListEvent) => {
    this.systemReduced = event.matches;
  };
  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("length") || changed.has("slots")) {
      this.length = normalizeOtpLength(this.length);
      const values = this.values;
      if (
        !Array.isArray(this.slots) ||
        this.slots.length !== values.length ||
        this.slots.some((d, i) => d !== values[i])
      )
        this.slots = values;
      this.cancelInteraction();
    }
    if (changed.has("mode") || this.locked) this.cancelInteraction();
    if (!this.sound) this.audio.close();
    if (
      changed.has("status") &&
      this.status === "success" &&
      changed.get("status") !== "success"
    )
      this.audio.tone(this.sound, true);
  }
  /** Clear all slots silently and cancel transient interaction. Host owns verification status.
   * @example element.reset(); // no change/complete/submit event
   */
  reset(): void {
    this.cancelInteraction();
    this.pendingFocus++;
    this.slots = normalizeOtpSlots([], this.length);
  }

  private commit(next: OtpSlots, event: Event) {
    if (this.locked) return;
    const before = otpSnapshot(this.values);
    const after = otpSnapshot(normalizeOtpSlots(next, this.length));
    if (before.slots.every((d, i) => d === after.slots[i])) return;
    this.cancelInteraction();
    this.slots = [...after.slots];
    this.audio.activate(event, this.sound);
    this.audio.tone(this.sound, false);
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
    if (this.locked) return;
    const detail = otpSnapshot(this.values);
    if (!detail.complete) return;
    this.audio.activate(event, this.sound);
    this.dispatchEvent(
      new CustomEvent("submit", { detail, bubbles: true, composed: true }),
    );
  };
  private place(selection: Selection, target: number, event: Event) {
    this.commit(placeOtpDigit(this.values, selection, target), event);
    this.selection = null;
  }
  private clickDigit(digit: OtpDigit, event: MouseEvent) {
    if (
      this.locked ||
      (event.detail > 0 && performance.now() < this.ignoreClickUntil)
    )
      return;
    this.audio.activate(event, this.sound);
    this.selection = { digit, source: null };
  }
  private clickSlot(index: number, event: MouseEvent) {
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
      if (digit) this.selection = { digit, source: index };
    }
  }
  private removeSelection = (event: Event) => {
    if (this.selection?.source === null || this.selection === null) return;
    this.commit(clearOtpDigit(this.values, this.selection.source), event);
    this.selection = null;
  };
  private focusSlot(index: number) {
    const token = ++this.pendingFocus;
    void this.updateComplete.then(() => {
      if (token === this.pendingFocus && this.isConnected)
        this.renderRoot
          .querySelector<HTMLElement>(`[data-slot="${index}"]`)
          ?.focus();
    });
  }
  private keySlot(index: number, event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.cancelInteraction();
      return;
    }
    const count = normalizeOtpLength(this.length);
    const move =
      event.key === "ArrowLeft"
        ? index - 1
        : event.key === "ArrowRight"
          ? index + 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : null;
    if (move !== null) {
      event.preventDefault();
      this.focusSlot(Math.max(0, Math.min(count - 1, move)));
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
      this.focusSlot(Math.min(index + 1, count - 1));
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      const next = [...this.values];
      const target =
        event.key === "Backspace" && next[index] === null
          ? Math.max(0, index - 1)
          : index;
      next[target] = null;
      this.commit(next, event);
      this.focusSlot(target);
    }
  }
  private fill(index: number, raw: string, event: Event) {
    const filled = fillOtpDigits(this.values, index, raw);
    this.commit(filled.slots, event);
    this.focusSlot(Math.min(filled.slots.length - 1, index + filled.count));
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
  private pointerDown(selection: Selection, event: PointerEvent) {
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
      const slot = Array.from(
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
      if (slot) this.place(drag, Number(slot.dataset["slot"]), event);
      else if (drag.source !== null) {
        const next = [...this.values];
        next[drag.source] = null;
        this.commit(next, event);
      }
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
    const t = this.text;
    const values = this.values;
    const complete = otpSnapshot(values).complete;
    const label = (index: number) =>
      `${t.slot} ${index + 1}: ${values[index] ?? t.empty}`;
    return html`<section
      part="board"
      class="board ${this.status} ${this.motionOff ? "no-motion" : ""} ${this
        .selection || this.drag
        ? "engaged"
        : ""}"
      aria-label=${t.code}
      aria-busy=${this.status === "verifying"}
      @pointermove=${this.pointerMove}
      @pointerup=${this.pointerUp}
      @pointercancel=${this.cancelInteraction}
      @lostpointercapture=${this.cancelDrag}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape") this.cancelInteraction();
      }}
    >
      <div class="top">
        <strong>${t.title}</strong><span class="ticket">${t.supply}</span>
      </div>
      <div
        part="slots"
        class="slots ${this.mode === "input" ? "plain" : ""}"
        style=${`--count:${values.length}`}
        role="group"
        aria-label=${t.code}
      >
        ${values.map((digit, index) =>
          this.mode === "input"
            ? html`<input
                part="slot input"
                class="slot"
                data-slot=${index}
                aria-label=${label(index)}
                aria-describedby="hint result"
                type="text"
                inputmode="numeric"
                autocomplete=${index === 0 ? "one-time-code" : "off"}
                maxlength=${values.length}
                .value=${live(digit ?? "")}
                ?disabled=${this.disabled || this.status === "verifying"}
                ?readonly=${this.readOnly}
                @input=${(e: Event) => this.input(index, e)}
                @change=${(e: Event) => e.stopPropagation()}
                @paste=${(e: ClipboardEvent) => this.paste(index, e)}
                @keydown=${(e: KeyboardEvent) => this.keySlot(index, e)}
              />`
            : html`<button
                type="button"
                part="slot"
                class="slot ${digit !== null ? "filled" : ""} ${this.selection
                  ?.source === index
                  ? "selected"
                  : ""}"
                data-slot=${index}
                aria-label=${label(index)}
                aria-describedby="hint result"
                aria-pressed=${this.selection?.source === index}
                ?disabled=${this.disabled || this.status === "verifying"}
                aria-disabled=${this.readOnly}
                @click=${(e: MouseEvent) => this.clickSlot(index, e)}
                @keydown=${(e: KeyboardEvent) => this.keySlot(index, e)}
                @paste=${(e: ClipboardEvent) => this.paste(index, e)}
                @pointerdown=${(e: PointerEvent) => {
                  if (digit !== null)
                    this.pointerDown({ digit, source: index }, e);
                }}
              >
                ${digit === null
                  ? html`<span aria-hidden="true">·</span>`
                  : keyed(
                      digit,
                      html`<span part="ball" class="ball"
                        ><span>${digit}</span></span
                      >`,
                    )}
              </button>`,
        )}
      </div>
      ${this.mode === "game"
        ? html`<div part="pool" class="pool" role="group" aria-label=${t.pool}>
            ${digits.map(
              (digit, index) =>
                html`<button
                  type="button"
                  part="ball source"
                  class="ball"
                  aria-label=${`${t.digit} ${digit}`}
                  aria-pressed=${this.selection?.digit === digit &&
                  this.selection.source === null}
                  ?disabled=${this.locked}
                  style=${`--tilt:${[-12, 8, -5, 14, -9][index % 5]}deg;--delay:${-index * 0.37}s`}
                  @click=${(e: MouseEvent) => this.clickDigit(digit, e)}
                  @pointerdown=${(e: PointerEvent) =>
                    this.pointerDown({ digit, source: null }, e)}
                >
                  <span>${digit}</span>
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
          type="button"
          part="reset"
          ?disabled=${this.locked || values.every((d) => d === null)}
          @click=${(e: Event) =>
            this.commit(normalizeOtpSlots([], this.length), e)}
        >
          ${t.reset}
        </button>
        ${this.selection?.source != null
          ? html`<button
              type="button"
              ?disabled=${this.locked}
              @click=${this.removeSelection}
            >
              ${t.remove}
            </button>`
          : nothing}
        <button
          type="button"
          part="mode-toggle"
          ?disabled=${this.disabled || this.status === "verifying"}
          @click=${() => {
            this.mode = this.mode === "game" ? "input" : "game";
          }}
        >
          ${this.mode === "game" ? t.input : t.game}
        </button>
        <button
          type="button"
          part="submit"
          class="submit"
          ?disabled=${this.locked || !complete}
          @click=${this.submit}
        >
          ${this.status === "verifying" ? t.verifying : t.submit}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div
        part="message"
        class="result"
        id="result"
        role="status"
        aria-live="polite"
      >
        ${this.message ||
        (this.status === "verifying"
          ? t.verifying
          : this.status === "error"
            ? t.error
            : this.status === "success"
              ? t.success
              : complete
                ? t.ready
                : t.idle)}
        ${this.status === "success"
          ? html`<strong part="celebration" class="celebration">KINH!</strong>`
          : nothing}
      </div>
      ${this.drag?.moved
        ? html`<span
            part="drag-ball"
            class="ball ghost"
            aria-hidden="true"
            style=${`left:${this.drag.x}px;top:${this.drag.y}px`}
            ><span>${this.drag.digit}</span></span
          >`
        : nothing}
    </section>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "chaos-loto-otp-element": ChaosLotoOtpElement;
  }
}
