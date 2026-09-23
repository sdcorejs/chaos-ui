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

The glove uses three original, image-generated artwork frames: a front-facing idle hand, a side view where the armored thumb and middle fingertips meet, and a release pose where they separate. The ordinary stage shows only the glove. A small original SVG surprised purple-villain emoji appears **only** after an unsuccessful snap. The assets ship with the core npm package; no film still, remote URL, GIF host or playground asset path is required. Gem cuts are SVG paths with distinct silhouettes at the six sockets. The reusable source has varied cuts and colors chosen independently per instance; neither a digit nor its source color determines the mounted gem shape. The six drop targets remain at least 43 CSS pixels wide in narrow layouts, with distinct printed digits before and after placement. Shadow DOM isolates styling; supported parts are `board`, `header`, `stage`, `gauntlet`, `sockets`, `socket`, `input`, `pool`, `stone`, `source`, `hint`, `actions`, `reset`, `remove`, `mode-toggle`, `submit`, `replay`, `message`, `celebration`, `failed-emoji`, `failed-snap`, `snap-impact`, `snap-caption`, `dust`, `drag-stone`.

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

The 2.1-second snap starts immediately on explicit submit, while the host independently verifies the OTP. The numbered stones briefly clear the hand so the side-view finger contact and release remain visible. The result waits until the movement ends, even if the host responds sooner. A failed result leaves all six digits in place for correction and reveals only the small surprised emoji and "Ơ KÌA?!"; it has no success flash. A successful result produces a fingertip flash, particles and a temporary ash-like fade of the glove, sockets and stone supply. These visuals return so the UI remains usable. The **Xem lại cú búng / Replay snap** button repeats only the visual effect; it never emits `submit`, `change` or `complete`. All effects stay inside the component's shadow DOM. Re-rendering does not restart them; an edit, reset, mode change or unmount cancels the pending animation timer. With `prefers-reduced-motion` or `reducedMotion="always"`, the motion is replaced by static color/text feedback. Audio is off by default, begins only after opt-in and a trusted user interaction, and closes on unmount. No RAF, external DOM changes, 3D engine or remote assets are used. This MVP supports client interaction; SSR rendering/hydration are unverified.
