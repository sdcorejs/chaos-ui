import { registerElement } from "../register.js";
import { ChaosVolumeGymElement } from "./element.js";

/** Register only `<chaos-volume-gym-element>`; idempotent and Node-safe.
 * @example import { registerVolumeGym } from '@sdcorejs/chaos-ui/volume-gym/register';
 * registerVolumeGym();
 */
export function registerVolumeGym(): boolean {
  return typeof window === "undefined"
    ? false
    : registerElement("chaos-volume-gym-element", ChaosVolumeGymElement);
}
