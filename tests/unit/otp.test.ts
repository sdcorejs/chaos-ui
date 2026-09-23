import { describe, expect, it } from "vitest";
import * as otp from "../../packages/chaos-ui/src/otp.js";

describe("OTP positional contract", () => {
  it("exports normalization before any game implementation", () => {
    expect(otp).toHaveProperty("normalizeOtpSlots");
  });
  it("preserves leading zeroes, repeated digits and middle holes", () => {
    expect(otp.otpSnapshot(["0", "0", "0", "0", "0", "0"]).value).toBe(
      "000000",
    );
    expect(otp.otpSnapshot(["1", "1", "2", "2", "3", "3"]).value).toBe(
      "112233",
    );
    const snapshot = otp.otpSnapshot(["0", null, "1", "2", "3", "4"]);
    expect(snapshot).toEqual({
      slots: ["0", null, "1", "2", "3", "4"],
      value: null,
      complete: false,
    });
    expect(Object.isFrozen(snapshot.slots)).toBe(true);
  });
  it("clamps length and preserves positions while discarding invalid digits", () => {
    expect(otp.normalizeOtpLength(3)).toBe(4);
    expect(otp.normalizeOtpLength(20)).toBe(8);
    expect(otp.normalizeOtpLength(NaN)).toBe(6);
    expect(otp.normalizeOtpSlots(["0", "x", null, "7", "2"], 4)).toEqual([
      "0",
      null,
      null,
      "7",
    ]);
    expect(otp.normalizeOtpSlots(["0"], 6)).toEqual([
      "0",
      null,
      null,
      null,
      null,
      null,
    ]);
  });
});
