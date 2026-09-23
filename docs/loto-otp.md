# Loto OTP

Drag scattered loto balls into the code slots, or pick a digit and then a destination. The ten digits are reusable sources: `000000`, `112233`, and every other code of the configured length are possible. The component never receives a correct code or performs authentication.

## Component names

| Surface | Tag / export |
| --- | --- |
| Web Component | `<chaos-loto-otp-element>` / `ChaosLotoOtpElement` |
| React | `<ChaosLotoOtp>` / `ChaosLotoOtpProps` |
| Angular | `<chaos-loto-otp>` / `ChaosLotoOtpComponent` |

The `-element` suffix distinguishes the inner custom element from the Angular wrapper selector. This pre-release rename replaces `sd-loto-otp`, `LotoOtp` and `LotoOtpElement`; no legacy aliases are registered. Import paths and `registerLotoOtp()` remain unchanged.

## Shared contract (all OTP components)

Import `OtpDigit`, `OtpSlots`, `OtpStatus`, `OtpProps`, `OtpChangeDetail`, `OtpSubmitDetail`, `normalizeOtpSlots` and `normalizeOtpLength` from `@sdcorejs/chaos-ui/otp`. Framework Loto entrypoints re-export the payload and slot types.

| Property          | Default     | Behavior                                                                                                                 |
| ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `slots: OtpSlots` | six `null`s | Readonly array of decimal **strings** or `null`. Use a new array to update. No events for host updates.                  |
| `length: number`  | `6`         | Floor finite values, clamp 4–8; nonfinite uses 6. Keep the left prefix, truncate the rest, append `null` when expanding. |
| `disabled`        | `false`     | No editing/confirmation; controls leave the tab order.                                                                   |
| `readOnly`        | `false`     | Inspect/focus allowed, but no editing/reset/confirmation.                                                                |
| `status`          | `idle`      | `idle \| verifying \| success \| error`; `verifying` locks input.                                                        |
| `message`         | `''`        | Host feedback, rendered as plain text in a live status region.                                                           |
| `locale`          | `vi`        | Built-in interface strings: `vi` or `en`.                                                                                |
| `sound`           | `false`     | Small synthesized sound, only after opt-in plus trusted interaction. No audio asset downloads.                           |
| `reducedMotion`   | `auto`      | `auto` follows OS preference; `always` removes motion; `never` explicitly opts in.                                       |
| `mode`            | `game`      | `input` uses regular numeric text fields, preserving positions and leading zeroes. A built-in toggle is also available.  |

Normalization does not emit change/complete/submit. Invalid slot values become `null`, never shift later positions. Core and React uncontrolled state discard truncated positions; expanding later fills them with `null`. In controlled React or Angular Forms, the application remains authoritative: normalize the application array at the same time as changing length (`setSlots(normalizeOtpSlots(slots, nextLength))` or `control.setValue(...)`). Otherwise an explicit later write of the original full array can restore its digits. Do not mutate an existing array in place.

## Events

Core events are bubbling, composed `CustomEvent`s. All payload objects and slot arrays are detached, frozen snapshots:

- `change`: `{ slots, value: string | null, complete: boolean }`. Exactly once per effective user edit. A middle hole is retained and forces `value: null`.
- `complete`: `{ slots, value: string, complete: true }`. After `change`, if that edit changes an incomplete code to complete or changes the full value. Re-selecting the same digit in the same position does nothing. Re-filling after deletion can emit again. This event does **not** mean the code is correct.
- `submit`: `{ slots, value: string, complete: true }`. Explicit Confirm/Enter only. Never fires while incomplete, disabled, readonly or verifying. Repeated confirmations are possible while the host leaves the control idle; set verifying immediately to prevent duplicate requests.

Prop synchronization, `writeValue`, length normalization and silent `element.reset()` never emit business events. The visible Reset button is a user action and emits `change` when it actually clears something. `reset()` only resets input/transient interaction: the host must reset `status` and `message` too. Success glow and **KINH!** appear only when the host passes `status="success"`; no secret or sample code is included in a library package.

## Web Component

```ts
import { registerLotoOtp } from "@sdcorejs/chaos-ui/loto-otp/register";
import type { OtpSubmitDetail } from "@sdcorejs/chaos-ui/otp";
registerLotoOtp(); // only chaos-loto-otp-element; idempotent
const element = document.createElement("chaos-loto-otp-element");
element.length = 6;
element.addEventListener("submit", async (event) => {
  const { value } = (event as CustomEvent<OtpSubmitDetail>).detail;
  element.status = "verifying";
  try {
    element.status = (await verifyOnServer(value)) ? "success" : "error";
  } catch {
    element.status = "error";
    element.message = "Could not verify. Please try again.";
  }
});
document.body.append(element);
```

`ChaosLotoOtpElement` is exported from `/loto-otp`; importing its definition does not register it. Host cancellation/reset should invalidate outstanding requests so a stale response cannot mark a newer code successful (see the playground timer cleanup).

## React

```tsx
import {
  ChaosLotoOtp,
  type OtpSlots,
  type OtpStatus,
} from "@sdcorejs/chaos-ui-react/loto-otp";
const [slots, setSlots] = useState<OtpSlots>([]);
const [status, setStatus] = useState<OtpStatus>("idle");
<ChaosLotoOtp
  slots={slots}
  status={status}
  onChange={({ slots }) => {
    setSlots(slots);
    setStatus("idle");
  }}
  onComplete={({ value }) => console.log("Ready, not verified:", value)}
  onSubmit={({ value }) => verify(value)}
/>;
```

Callbacks receive typed payloads directly, not `CustomEvent`. Supplying `slots` makes the control controlled: rejected edits are restored even if the parent does not render again. For uncontrolled input omit `slots` and use `defaultSlots` (read only at mount). Do not switch ownership mode mid-lifecycle. A forwarded ref exposes the element; use application state to reset a controlled input. See `examples/react/src/loto-example.tsx` for working controlled and uncontrolled instances.

## Angular

```ts
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import {
  ChaosLotoOtpComponent,
  type OtpSlots,
} from "@sdcorejs/chaos-ui-angular/loto-otp";
// @Component imports: [ReactiveFormsModule, ChaosLotoOtpComponent]
control = new FormControl<OtpSlots>([], { nonNullable: true });
// template:
// <chaos-loto-otp [formControl]="control" [status]="status()"
//   (sdChange)="edited($event)" (sdSubmit)="verify($event.value)" />
```

Alternatively: `<chaos-loto-otp [(model)]="slots" (sdSubmit)="verify($event.value)" />`. Use **model binding OR Forms** on an instance, not both; once Forms attaches, its CVA state takes precedence. Outputs `sdChange`, `sdComplete`, `sdSubmit` carry the same typed payloads as React. `writeValue` and programmatic `control.setValue/reset` update the view without triggering user callbacks or modelChange. User edits call the Forms change callback once; focus leaving the composite control marks it touched, moving between inner buttons/inputs does not. `control.disable()` blocks all edits and submits. See `examples/angular/src/loto-example.ts` for a runnable Forms example plus a separate model-bound instance.

Angular wrapper peers are exactly `@angular/core`, `@angular/common`, `@angular/forms` 22.1.7 and RxJS 7.8.2. The package is APF/partial compiled. Like Angular's own partial libraries, raw Node evaluation needs Angular's linker or preloaded `@angular/compiler`; the packed smoke test preloads the compiler and verifies there is no DOM access. This is not a claim of interactive SSR/hydration support.

## Interaction and lifecycle

- Mouse/touch: drag from the infinite supply to any slot. Drag between slots to move, swapping occupied targets. Drag an occupied slot anywhere outside a slot to remove it.
- Alternative: pick a pool digit then tap/click a slot. Click a filled slot then another to move/swap; the Remove ball button clears a selected occupied slot. Escape cancels selection.
- Keyboard: Tab through semantic controls; digits fill a focused slot and advance. Left/Right/Home/End move focus. Delete clears the current slot; Backspace on an empty slot clears the previous one. Enter on a slot confirms. Enter/Space on a pool button selects it; Space on a slot places the selected ball. Paste/autofill can fill multiple positions.
- Pool movement pauses during selection, pointer gestures and focus within the component. Reduced motion removes float, snap and celebration animations while keeping the success text/glow.
- Pointer cancel, resize, host state/length/mode changes and disconnect cancel transient drag without applying a drop. Pointer capture and resize listeners are released; media-query listeners and audio contexts are cleaned up on disconnect. Reconnection and multiple instances are independent. CSS-only animations require no timers/RAF loops.

## Styling

Host CSS variables inherit through both wrappers. No watermark is required.

| Variable           | Default                                  |
| ------------------ | ---------------------------------------- |
| `--loto-ink`       | `#272b25`                                |
| `--loto-surface`   | `#fffdf5`                                |
| `--loto-pool`      | `#f0deda`                                |
| `--loto-ball`      | `#f8d976`                                |
| `--loto-accent`    | `#d9f56e`                                |
| `--loto-focus`     | `#7553b5`                                |
| `--loto-success`   | `#98be39`                                |
| `--loto-error`     | `#a6303a`                                |
| `--loto-ball-size` | `68px`                                   |
| `--loto-gap`       | `8px` (4px default in narrow containers) |

Public parts: `board`, `slots`, `slot`, `input`, `ball`, `source`, `pool`, `hint`, `actions`, `reset`, `mode-toggle`, `submit`, `message`, `celebration`, `drag-ball`.

```css
chaos-loto-otp-element {
  --loto-accent: #cfc1ff;
  --loto-gap: 6px;
}
chaos-loto-otp-element::part(submit) {
  border-radius: 12px;
}
/* Angular's inner custom element lives in light DOM: */
chaos-loto-otp chaos-loto-otp-element::part(board) {
  border-color: rebeccapurple;
}
```

Package imports have no registration/global stylesheet side effects, so `sideEffects: false` remains accurate. CSS and synthesized audio are bundled; no playground asset paths or new animation libraries are used.
