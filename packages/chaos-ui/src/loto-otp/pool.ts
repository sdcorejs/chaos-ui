import type { OtpDigit } from "../otp.js";

interface LotoPoolBall {
  readonly digit: OtpDigit;
  readonly x: number;
  readonly y: number;
  readonly tilt: number;
  readonly delay: number;
}

const digits: readonly OtpDigit[] = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

/** One reusable source of every digit, scattered independently of the OTP. */
export function createLotoPool(
  previous: readonly LotoPoolBall[] = [],
  random: () => number = Math.random,
): readonly LotoPoolBall[] {
  const order = [...digits];
  for (let index = order.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [order[index], order[swap]] = [order[swap]!, order[index]!];
  }
  // A reroll should visibly change the order even if the shuffle repeats it.
  if (
    previous.length === order.length &&
    order.every((digit, index) => digit === previous[index]?.digit)
  ) {
    [order[0], order[1]] = [order[1]!, order[0]!];
  }
  return order.map((digit) => ({
    digit,
    x: Math.round((random() - 0.5) * 14),
    y: Math.round((random() - 0.5) * 12),
    tilt: Math.round((random() - 0.5) * 28),
    delay: -Math.round(random() * 3500) / 1000,
  }));
}
