import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";
const root = process.cwd();
const artifacts = resolve(".artifacts");
mkdirSync(artifacts, { recursive: true });
const pnpm = process.env.npm_execpath;
assert(pnpm, "Run through pnpm test:pack");
function run(args, cwd) {
  execFileSync(process.execPath, [pnpm, ...args], { cwd, stdio: "inherit" });
}
const tarballs = [];
for (const folder of ["chaos-ui", "react", "angular"]) {
  run(
    ["pack", "--pack-destination", artifacts],
    join(root, "packages", folder),
  );
  const name = `sdcorejs-chaos-ui${folder === "chaos-ui" ? "" : "-" + folder}-0.0.0.tgz`;
  tarballs.push(join(artifacts, name));
}
const temp = mkdtempSync(join(tmpdir(), "chaos-ui-pack-"));
console.log(`Packed consumer fixture: ${temp}`);
const source = JSON.parse(readFileSync("package.json", "utf8"));
const dependencies = { ...source.devDependencies };
for (const folder of ["examples/react", "examples/angular"])
  Object.assign(
    dependencies,
    JSON.parse(readFileSync(`${folder}/package.json`, "utf8")).dependencies,
  );
Object.assign(
  dependencies,
  JSON.parse(readFileSync("examples/react/package.json", "utf8"))
    .devDependencies,
);
for (const [i, name] of [
  "@sdcorejs/chaos-ui",
  "@sdcorejs/chaos-ui-react",
  "@sdcorejs/chaos-ui-angular",
].entries())
  dependencies[name] = `file:${tarballs[i].replaceAll("\\", "/")}`;
writeFileSync(
  join(temp, "package.json"),
  JSON.stringify({
    name: "chaos-packed-consumer",
    private: true,
    type: "module",
    dependencies,
  }),
);
writeFileSync(
  join(temp, "pnpm-workspace.yaml"),
  `packages: []\nnodeLinker: hoisted\nverifyDepsBeforeRun: false\nstrictPeerDependencies: true\noverrides:\n  '@sdcorejs/chaos-ui': '${dependencies["@sdcorejs/chaos-ui"]}'\n`,
);
run(
  [
    "install",
    "--prefer-offline",
    "--ignore-scripts",
    "--fetch-timeout=600000",
    "--network-concurrency=4",
  ],
  temp,
);
for (const name of [
  "@sdcorejs/chaos-ui",
  "@sdcorejs/chaos-ui-react",
  "@sdcorejs/chaos-ui-angular",
]) {
  const dir = join(temp, "node_modules", name);
  const manifest = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  assert(
    !JSON.stringify(manifest).includes("workspace:"),
    `${name}: leaked workspace protocol`,
  );
  assert.equal(manifest.sideEffects, false);
  if (name === "@sdcorejs/chaos-ui") {
    assert(
      !readdirSync(join(dir, "dist", "infinity-otp")).some((file) =>
        String(file).startsWith("titan."),
      ),
      "Removed Infinity character art must not linger in the packed core package",
    );
    assert(
      readFileSync(join(dir, "assets", "loto-felt.png")).length > 0,
      "Loto artwork must ship with the packed core package",
    );
    for (const frame of ["open", "snap-contact", "snap-release"])
      assert(
        readFileSync(join(dir, "assets", `infinity-glove-${frame}.png`)).length > 0,
        `Infinity ${frame} artwork must ship with the packed core package`,
      );
  }
  assert(
    !readdirSync(dir, { recursive: true }).some((f) =>
      /testing|probe/.test(String(f)),
    ),
    `${name}: fixture leaked`,
  );
  for (const entry of [
    ".",
    "./loto-otp",
    "./infinity-otp",
    "./volume-gym",
    ...(name === "@sdcorejs/chaos-ui"
      ? [
          "./register",
          "./otp",
          "./loto-otp/register",
          "./infinity-otp/register",
          "./volume-gym/register",
        ]
      : []),
  ]) {
    const exp = manifest.exports[entry];
    assert(exp?.types, `${name}/${entry}: missing declarations`);
    readFileSync(join(dir, exp.types));
  }
}
writeFileSync(
  join(temp, "imports.mjs"),
  `import assert from 'node:assert/strict';
assert.equal(typeof document, 'undefined');
// APF partial declarations need the Angular linker or JIT compiler, even in Node.
await import('@angular/compiler');
for (const name of ['@sdcorejs/chaos-ui','@sdcorejs/chaos-ui-react','@sdcorejs/chaos-ui-angular']) {
  for (const sub of ['', '/loto-otp','/infinity-otp','/volume-gym']) await import(name + sub);
  await assert.rejects(import(name + '/testing/probe'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
}
const angularRoot = await import('@sdcorejs/chaos-ui-angular');
const angularVolume = await import('@sdcorejs/chaos-ui-angular/volume-gym');
assert.equal(angularRoot.ChaosVolumeGymComponent, angularVolume.ChaosVolumeGymComponent,
  'Angular root and per-component entrypoint must share one class');
const { registerLotoOtp } = await import('@sdcorejs/chaos-ui/loto-otp/register');
assert.equal(registerLotoOtp(), false);
assert.equal(globalThis.customElements?.get('chaos-loto-otp-element'), undefined);
const { registerInfinityOtp } = await import('@sdcorejs/chaos-ui/infinity-otp/register');
assert.equal(registerInfinityOtp(), false);
assert.equal(globalThis.customElements?.get('chaos-infinity-otp-element'), undefined);
const { registerVolumeGym } = await import('@sdcorejs/chaos-ui/volume-gym/register');
assert.equal(registerVolumeGym(), false);
assert.equal(globalThis.customElements?.get('chaos-volume-gym-element'), undefined);
assert.equal(typeof document, 'undefined');
console.log('Node imports and private export boundaries passed');`,
);
execFileSync(process.execPath, ["imports.mjs"], {
  cwd: temp,
  stdio: "inherit",
});
for (const folder of [
  "examples/react",
  "examples/angular",
  "apps/playground/src",
  "packages/chaos-ui/testing",
  "packages/react/testing",
  "packages/angular/testing",
])
  cpSync(join(root, folder), join(temp, folder), {
    recursive: true,
    filter: (p) =>
      !p
        .split(/[\\/]/)
        .some((s) => ["node_modules", "dist", ".angular"].includes(s)),
  });
cpSync("docs", join(temp, "docs"), { recursive: true });
cpSync("tsconfig.json", join(temp, "tsconfig.json"));
cpSync("tsconfig.base.json", join(temp, "tsconfig.base.json"));
cpSync("tsconfig.check.json", join(temp, "tsconfig.check.json"));
run(["exec", "tsc", "--noEmit", "-p", "tsconfig.check.json"], temp);
run(["exec", "vite", "build"], join(temp, "examples/react"));
run(["exec", "ng", "build"], join(temp, "examples/angular"));
console.log(
  "Packed manifests, Node imports, declarations and both consumer builds passed.",
);
