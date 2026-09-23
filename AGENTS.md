# Chaos UI contributor instructions

Brand: **Chaos UI by sdcorejs**. Tagline: **Simple tasks. Ridiculous interfaces.**
This repository builds reusable client-side UI mini games; the playground demonstrates them.

1. Share state logic and rendering in Lit Web Components. React/Angular wrappers only translate props/events and integrate their framework.
2. Do not build a generic framework or plugin engine. Extract an abstraction only for demonstrated repetition and an actual consumer.
3. Every public API needs JSDoc/TSDoc explaining purpose, types, defaults, behavior, event detail and an `@example` visible in IDE hover. Update declarations and per-component exports together.
4. Application property updates must never re-emit user-change events. Distinguish user input from controlled updates to avoid binding loops.
5. OTP is an input UI, not an authenticator. Never embed the correct OTP. Emit a submit request; let the host verify it and pass the result down.
6. OTP codes are strings and preserve leading zeroes and repeated digits. Use explicit empty slots (`null`) and retain positions when serializing. Never compact/join incomplete slots into an apparently valid code.
7. Support mouse, touch and keyboard, including a select/click alternative to dragging. Use semantic buttons, accessible names, visible focus and announcements.
8. Respect `prefers-reduced-motion`. Audio is off by default and can only start after user interaction and opt-in.
9. Clean up listeners, timers, animation frames, audio and pointer capture on teardown/cancellation as needed. Multiple instances must be independent.
10. Isolate styles in shadow DOM; publish supported CSS variables and parts. Branding belongs in playground/docs; components require no watermark.
11. Prefer SVG/CSS artwork. Do not add a physics engine or large animation dependency without demonstrated need. Ship assets inside the package or bundle them.
12. Test actual risks: transitions, duplicate digits, controlled binding, teardown, interactions and installation of packed packages. Use real browser tests for behavior involving DOM/framework integration.
13. After every feature update docs and both React/Angular examples, verify desktop/mobile UI and report actual results and remaining limitations.

## Workspace and delivery

- Only `packages/chaos-ui`, `packages/react`, `packages/angular` can publish. Root, apps and examples stay private. Do not publish without an explicit release request.
- Core never depends on React/Angular. Framework runtime dependencies belong in wrapper peers; never widen beyond the verified version matrix.
- ESM and declarations are required. Keep per-component entrypoints independent. Angular uses ng-packagr/APF and partial compilation.
- Keep element definition separate from registration. Registration is explicit, idempotent and local to one element. Package import must be safe without browser globals.
- MVP supports client interaction only. Node import safety does not establish SSR rendering or hydration support.
- `sideEffects: false` is correct while imports do not register elements or inject global CSS. Explicit registration functions are effects only when called. Revisit the manifest if adding auto-registration or global stylesheet entries.
- `packages/*/testing` contains repository-only fixtures. Never export or include these in an npm tarball. Do not promote the probe into a product component.
- Use Node and pnpm versions recorded in `.node-version` and `packageManager`. Run `pnpm check` before completion. See [architecture](docs/architecture.md), [authoring](docs/component-authoring.md), [release](docs/release.md).

## OTP contract

Use [the shared OTP and Loto contract](docs/loto-otp.md): positional digit strings/null, length 4–8, status idle/verifying/success/error and immutable user-only change/complete/submit payloads. Normalize host state when changing length. For Angular, choose model binding or Forms per instance, never both.

## Component naming

Use the chaos- prefix for all library HTML tags/selectors and Chaos for framework component identifiers. Web Components use chaos-<name>-element (class Chaos<Name>Element); React uses Chaos<Name>; Angular uses chaos-<name> (class Chaos<Name>Component). The element suffix prevents the inner custom element from matching its Angular wrapper selector. Component prop types use Chaos<Name>Props. Registration functions remain register<Name>(); npm scopes and entrypoint paths stay unchanged.
