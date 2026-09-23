/** One decimal digit, always a string (leading zeroes are meaningful).
 * @example const digit: OtpDigit = '0';
 */
export type OtpDigit =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
/** Positional input. null means empty; never compact holes.
 * @example const slots: OtpSlots = ['0', null, '0', '7'];
 */
export type OtpSlots = readonly (OtpDigit | null)[];
/** Host-owned verification; complete input is not proof of correctness.
 * @example const status: OtpStatus = 'verifying';
 */
export type OtpStatus = "idle" | "verifying" | "success" | "error";
/** Immutable snapshot of a user edit.
 * @example function changed(detail: OtpChangeDetail) { save(detail.slots); }
 */
export interface OtpChangeDetail {
  /** Frozen positional copy, detached from component state. */
  readonly slots: OtpSlots;
  /** Complete string preserving zeroes, or null if any position is empty. */
  readonly value: string | null;
  /** True only when every position holds a decimal digit. */
  readonly complete: boolean;
}
/** Payload for complete/submit; completeness does not authenticate a code.
 * @example function submit(detail: OtpSubmitDetail) { verifyOnServer(detail.value); }
 */
export interface OtpSubmitDetail extends OtpChangeDetail {
  readonly value: string;
  readonly complete: true;
}
/** Shared OTP options. Programmatic changes never emit business events.
 * @example const props: OtpProps = { length: 6, slots: ['0',null,null,null,null,null], locale: 'vi' };
 */
export interface OtpProps {
  /** Default six empty positions. Arrays are padded/truncated; invalid entries become null. */
  slots?: OtpSlots;
  /** Default 6. Floored and clamped to 4–8; nonfinite values use 6. */
  length?: number;
  /** Default false. Blocks edits/submit and removes controls from tab order. */
  disabled?: boolean;
  /** Default false. Allows focus/inspection, but blocks edits, reset and submit. */
  readOnly?: boolean;
  /** Default idle. verifying locks input; only success activates celebration. */
  status?: OtpStatus;
  /** Host text, default ''. Rendered as text, never HTML. */
  message?: string;
  /** Default vi. Built-in interface strings support vi and en. */
  locale?: "vi" | "en";
  /** Default false. Opt-in synthesized audio only after trusted user interaction. */
  sound?: boolean;
  /** Default auto follows prefers-reduced-motion; always disables motion, never opts in. */
  reducedMotion?: "auto" | "always" | "never";
  /** Default game. input provides conventional numeric inputs with paste/autofill. */
  mode?: "game" | "input";
}
/** Normalize length without mutating host data.
 * @example normalizeOtpLength(12); // 8
 */
export function normalizeOtpLength(length = 6): number {
  return Number.isFinite(length)
    ? Math.max(4, Math.min(8, Math.floor(length)))
    : 6;
}
/** Copy positional slots. Invalid entries become null; preserve zeroes and duplicates.
 * @example normalizeOtpSlots(['0', null, '7'], 4); // ['0', null, '7', null]
 */
export function normalizeOtpSlots(
  slots: readonly unknown[] | null | undefined,
  length = 6,
): OtpSlots {
  return Array.from({ length: normalizeOtpLength(length) }, (_, index) => {
    const digit = slots?.[index];
    return typeof digit === "string" && /^[0-9]$/.test(digit)
      ? (digit as OtpDigit)
      : null;
  });
}
/** Create a frozen event snapshot; empty or invalid input is incomplete.
 * @example otpSnapshot(['0', null, '0', '7']).value; // null
 */
export function otpSnapshot(slots: OtpSlots): OtpChangeDetail {
  const copy = Object.freeze([...slots]);
  const complete =
    copy.length >= 4 &&
    copy.length <= 8 &&
    copy.every((d) => typeof d === "string" && /^[0-9]$/.test(d));
  return Object.freeze({
    slots: copy,
    value: complete ? copy.join("") : null,
    complete,
  });
}
