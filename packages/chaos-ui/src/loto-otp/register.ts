import { registerElement } from "../register.js";
import { ChaosLotoOtpElement } from "./element.js";
/** Register only chaos-loto-otp-element; idempotent and a no-op without a browser.
 * @example import { registerLotoOtp } from '@sdcorejs/chaos-ui/loto-otp/register';
 * registerLotoOtp();
 */
export function registerLotoOtp(): boolean {
  return typeof window === "undefined"
    ? false
    : registerElement("chaos-loto-otp-element", ChaosLotoOtpElement);
}
