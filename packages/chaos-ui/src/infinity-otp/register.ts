import { registerElement } from "../register.js";
import { ChaosInfinityOtpElement } from "./element.js";

/** Register only `<chaos-infinity-otp-element>`; safe to call repeatedly or in Node.
 * @example import { registerInfinityOtp } from '@sdcorejs/chaos-ui/infinity-otp/register';
 * registerInfinityOtp();
 */
export function registerInfinityOtp(): boolean {
  return typeof window === "undefined"
    ? false
    : registerElement("chaos-infinity-otp-element", ChaosInfinityOtpElement);
}
