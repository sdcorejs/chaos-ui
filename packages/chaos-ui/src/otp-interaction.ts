import type { OtpDigit, OtpSlots } from "./otp.js";

/** A digit chosen from a reusable source or an occupied OTP position. */
export type OtpSelection = { digit: OtpDigit; source: number | null };

/** Put a selected digit in a position; moving between occupied positions swaps them. */
export function placeOtpDigit(
  slots: OtpSlots,
  selection: OtpSelection,
  target: number,
): OtpSlots {
  const next = [...slots];
  if (selection.source !== null) next[selection.source] = next[target] ?? null;
  next[target] = selection.digit;
  return next;
}

/** Clear one position without shifting any later digit. */
export function clearOtpDigit(slots: OtpSlots, index: number): OtpSlots {
  const next = [...slots];
  next[index] = null;
  return next;
}

/** Paste/autofill decimal digits into consecutive positions without compacting holes. */
export function fillOtpDigits(
  slots: OtpSlots,
  index: number,
  raw: string,
): { slots: OtpSlots; count: number } {
  const incoming = raw.replace(/[^0-9]/g, "").split("") as OtpDigit[];
  const next = [...slots];
  if (!incoming.length) next[index] = null;
  else
    incoming.slice(0, next.length - index).forEach((digit, offset) => {
      next[index + offset] = digit;
    });
  return { slots: next, count: incoming.length };
}
