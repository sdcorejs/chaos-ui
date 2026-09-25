# Chaos UI by sdcorejs

**Simple tasks. Ridiculous interfaces.**

A reusable UI collection that turns familiar interactions into mini games. Loto OTP, Infinity OTP and Volume Gym are implemented with Web Components, React controlled/uncontrolled wrappers and Angular model/Reactive Forms integration. Nothing has been published to npm.

Try the [live playground](https://sdcorejs.github.io/chaos-ui/). GitHub Actions deploys it after a successful `main` CI run; npm packages are not published by this workflow.

## Run locally

Use **Node 24.19.0** and **pnpm 11.19.0** (see `.node-version` and `packageManager`).

```sh
pnpm install
pnpm build:packages
pnpm dev           # React playground: http://127.0.0.1:5173
pnpm dev:react     # React example: http://127.0.0.1:5174
pnpm dev:angular   # Angular standalone example: http://127.0.0.1:4200
```

The gallery includes working Loto OTP and Infinity OTP demos with host verification, plus a Volume Gym demo with opt-in Play/Stop/Mute audio owned only by the playground. Infinity OTP draws an articulated SVG gauntlet whose fingers perform a replayable snap with the stones still mounted (a still pose under reduced motion), a failure-only surprised emoji and SVG-cut stones; no external media is loaded. Read the [Loto OTP API](docs/loto-otp.md), [Infinity OTP API](docs/infinity-otp.md) and [Volume Gym API](docs/volume-gym.md). Both examples use public package imports; the original internal fixture remains isolated from npm exports.

## Structure

| Path                | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `packages/chaos-ui` | `@sdcorejs/chaos-ui`: Lit core, types and explicit registration |
| `packages/react`    | `@sdcorejs/chaos-ui-react`: React adapter package               |
| `packages/angular`  | `@sdcorejs/chaos-ui-angular`: Angular Package Format            |
| `apps/playground`   | React + Vite gallery, demo and docs shell                       |
| `examples/react`    | React controlled-binding example                                |
| `examples/angular`  | Angular standalone controlled-binding example                   |
| `docs`              | Architecture, authoring and release instructions                |

Only the three library packages are publishable. Core does not depend on either framework. MVP targets browser client interaction; Node import safety does not imply full SSR/hydration support.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:pack
pnpm exec playwright install chromium
pnpm test:e2e
# All gates in order:
pnpm check
```

Read [architecture and exact support matrix](docs/architecture.md), [component authoring](docs/component-authoring.md), [release process](docs/release.md), and [contributor instructions](AGENTS.md).

## Roadmap

- Implemented: Loto OTP and Infinity OTP with reusable digit supplies, and Volume Gym with precise drag/keyboard control and optional elapsed-time gravity.
- All three games have controlled bindings, framework examples, configurable styling and desktop/mobile browser coverage.
- For each game: public registration entrypoint, documented props/events/parts, thin adapters, both examples, teardown and packed-consumer tests, desktop/mobile review.
- Full SSR/hydration, additional framework versions and npm release automation require separate verification.
