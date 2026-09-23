# Infinity OTP

Infinity OTP is a six-digit input game. Its glove has **exactly six sockets**: top-left index finger is **1**, top middle finger **2**, upper-right ring finger **3**, right little finger **4**, left thumb **5**, and center palm **6**. The visible `01`–`06` labels and accessible names are the OTP order. Gem color and symbol belong to the socket; neither encodes a digit. The stones in the reusable source are decimal digits 0–9, so `000000` and `112233` work.

The core element is `<chaos-infinity-otp-element>` (`ChaosInfinityOtpElement`). React exports both `<ChaosInfinityOtp>` and `<InfinityOtp>` from `@sdcorejs/chaos-ui-react/infinity-otp`; Angular exports standalone `ChaosInfinityOtpComponent` with selector `<chaos-infinity-otp>`. The `-element` suffix prevents selector collision with Angular's wrapper. Only core defines the game UI. Package import does not register an element; call `registerInfinityOtp()` from `@sdcorejs/chaos-ui/infinity-otp/register` when using it directly.

## Contract

`InfinityOtpProps` is the shared `OtpProps` **without `length`**. Slots normalize to exactly six `(OtpDigit | null)` entries: invalid entries become `null`, surplus entries are dropped, missing entries are padded on the right. Leading zeroes, repeated digits and holes retain their positions. `slots`, `disabled`, `readOnly`, `status`, `message`, `locale`, `sound`, `reducedMotion`, and `mode` have the same meaning and defaults as [Loto OTP](loto-otp.md). `mode="input"` shows ordinary numeric text fields with paste/autofill. No correct code lives in the component.

User edits emit `change` with an immutable `{slots,value,complete}` snapshot. `value` is a six-character string only when full, otherwise `null`. A user edit that creates a new complete code emits `complete`; explicit “Búng tay” or Enter emits `submit` with a complete string. Programmatic `slots` changes, rendering and Forms `writeValue` emit no business events. Disabled, readOnly and verifying block edits and submit. The host verifies and supplies `status`: idle/verifying/success/error, plus optional `message`.

Select a digit source then a numbered socket, or drag and drop. Selecting an occupied socket then another swaps them; selecting a socket and “Lấy đá ra”, dragging outside the sockets, Delete or Backspace removes it. Arrow keys/Home/End move focus among sockets; typing 0–9 fills and advances; Enter submits when complete; Escape cancels selection. Touch uses the select/tap path. The reset button clears through a user `change` event; the element's `reset()` method silently clears and cancels transient effects. The host must also set status to idle and invalidate any pending verification response.

## Integration

```ts
import { registerInfinityOtp } from '@sdcorejs/chaos-ui/infinity-otp/register';
registerInfinityOtp();
const glove = document.createElement('chaos-infinity-otp-element');
glove.addEventListener('submit', event => verify(event.detail.value));
```

```tsx
import { InfinityOtp } from '@sdcorejs/chaos-ui-react/infinity-otp';
<InfinityOtp slots={slots} onChange={({slots}) => setSlots(slots)}
  onSubmit={({value}) => verify(value)} status={status} />
// For an independent uncontrolled instance, use defaultSlots instead of slots.
```

```ts
// Angular standalone imports: ReactiveFormsModule, ChaosInfinityOtpComponent
control = new FormControl<OtpSlots>([], { nonNullable: true });
// <chaos-infinity-otp [formControl]="control" [status]="status()"
//   (sdSubmit)="verify($event.value)" />
// Alternatively, use [(model)] for slots. Do not combine model binding and Forms on one instance.
```

Angular `sdChange`, `sdComplete` and `sdSubmit` carry typed payloads. Its CVA passes `OtpSlots`, marks touched when focus exits the whole control, and honors Forms disabled state. App writes and `writeValue` do not feed back as user-change events. The examples under `examples/react` and `examples/angular` run these patterns.

## Visual customization and effects

The SVG glove and CSS gems are bundled inside the core package. The six drop targets are at least 43 CSS pixels wide in narrow layouts, with distinct printed digits before and after placement. The source stones stay independent of socket color/symbol. Shadow DOM isolates styling; supported parts are `board`, `header`, `stage`, `gauntlet`, `sockets`, `socket`, `input`, `pool`, `stone`, `source`, `hint`, `actions`, `reset`, `remove`, `mode-toggle`, `submit`, `message`, `celebration`, `dust`, `drag-stone`.

| CSS variable | Default | Use |
| --- | --- | --- |
| `--infinity-ink` | `#f7f0da` | Text |
| `--infinity-surface` | `#111827` | Board base |
| `--infinity-gold` | `#e1bb6b` | Header mark |
| `--infinity-accent` | `#edcf85` | Submit |
| `--infinity-focus` | `#b9f4ff` | Keyboard focus |
| `--infinity-stage-width` | `460px` | Maximum glove stage width |
| `--infinity-socket-size` | `64px` | Drop target diameter, responsive override in narrow layouts |
| `--infinity-stone-size` | `58px` | Source stone size, responsive override in narrow layouts |
| `--infinity-gap` | `7px` | Source spacing |

On a transition to success, the hand performs one CSS snap and localized dust appears within the component. Error causes one brief stone pulse while preserving slots. Re-rendering does not restart the effect; reset/unmount cancels it. With `prefers-reduced-motion` or `reducedMotion="always"`, state is conveyed by color/text with no movement. Audio is off by default, begins only after opt-in and a trusted user interaction, and closes on unmount. No timers, RAF, external DOM changes, 3D engine or remote assets are used. This MVP supports client interaction; SSR rendering/hydration are unverified.
