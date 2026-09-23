# Chaos UI by sdcorejs

**Simple tasks. Ridiculous interfaces.**

A reusable UI collection that turns familiar interactions into mini games. Loto OTP and Infinity OTP are implemented with drag/drop, tap and keyboard entry, React controlled/uncontrolled wrappers and Angular model/Reactive Forms integration. Volume Gym remains on the roadmap. Nothing has been published to npm.

## Run locally

Use **Node 24.19.0** and **pnpm 11.19.0** (see `.node-version` and `packageManager`).

```sh
pnpm install
pnpm build:packages
pnpm dev           # React playground: http://127.0.0.1:5173
pnpm dev:react     # React example: http://127.0.0.1:5174
pnpm dev:angular   # Angular standalone example: http://127.0.0.1:4200
```

The gallery includes working Loto OTP and Infinity OTP demos with visible sample messages, delayed host verification, sound toggle and reset. Read the [Loto OTP API](docs/loto-otp.md) and [Infinity OTP API](docs/infinity-otp.md). Both examples use public package imports; the original internal fixture remains isolated from npm exports.

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

- Implemented: Loto OTP and Infinity OTP, reusable digit supply, move/swap/remove, conventional input, controlled bindings, host verification and configurable styling.
- Volume Gym: controlled volume interaction with click/tap alternatives and reduced motion.
- For each game: public registration entrypoint, documented props/events/parts, thin adapters, both examples, teardown and packed-consumer tests, desktop/mobile review.
- Full SSR/hydration, additional framework versions and npm release automation require separate verification.
