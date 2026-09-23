import { registerElement } from "@sdcorejs/chaos-ui/register";
import { ChaosProbe } from "./probe.js";
export function registerProbe(): boolean {
  return registerElement("chaos-internal-probe", ChaosProbe);
}
