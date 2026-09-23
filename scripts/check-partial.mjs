import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const output = readFileSync(
  ".artifacts/angular-partial/packages/angular/testing/probe.js",
  "utf8",
);
assert(
  output.includes("ɵɵngDeclareComponent"),
  "Angular fixture must retain partial declarations for consumer linking",
);
assert(
  !output.includes("ɵɵdefineComponent"),
  "Do not publish fully compiled Angular components",
);
console.log("Angular fixture partial compilation verified");
const publicOutput = readFileSync(
  "packages/angular/dist/fesm2022/sdcorejs-chaos-ui-angular-loto-otp.mjs",
  "utf8",
);
assert(
  publicOutput.includes("ɵɵngDeclareComponent"),
  "Public Loto wrapper must be partially compiled",
);
assert(
  !publicOutput.includes("ɵɵdefineComponent("),
  "Public Loto wrapper must not be fully compiled",
);
console.log("Public Angular Loto partial compilation verified");
const infinityOutput = readFileSync(
  "packages/angular/dist/fesm2022/sdcorejs-chaos-ui-angular-infinity-otp.mjs",
  "utf8",
);
assert(
  infinityOutput.includes("ɵɵngDeclareComponent"),
  "Public Infinity wrapper must be partially compiled",
);
assert(
  !infinityOutput.includes("ɵɵdefineComponent("),
  "Public Infinity wrapper must not be fully compiled",
);
console.log("Public Angular Infinity partial compilation verified");
