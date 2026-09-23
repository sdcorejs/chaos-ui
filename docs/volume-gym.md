# Volume Gym

Volume Gym is a numeric volume control dressed as a cable weight machine. Pull the bar upward to increase the level and downward to decrease it. The printed number, bar position and side meter all derive from the same normalized value. The library component **never plays sound or changes page audio**; the playground alone has an opt-in Play/Stop/Mute preview.

| Surface | Tag / export |
| --- | --- |
| Web Component | `<chaos-volume-gym-element>` / `ChaosVolumeGymElement` |
| React | `<ChaosVolumeGym>` or `<VolumeGym>` |
| Angular | `<chaos-volume-gym>` / `ChaosVolumeGymComponent` |

Importing the definition does not register it. Call `registerVolumeGym()` from `@sdcorejs/chaos-ui/volume-gym/register` for the Web Component; registration is idempotent and imports are Node-safe. This MVP supports client interaction, with no verified SSR rendering/hydration claim.

## Values and gravity

| Property | Default | Behavior |
| --- | --- | --- |
| `value` | `0` | Numeric volume level; host writes are silent. |
| `min` / `max` | `0` / `100` | Finite endpoints. Invalid values use the defaults; reversed endpoints are sorted. |
| `step` | `1` | Positive step anchored at min. Nonpositive/nonfinite uses 1. The exact max endpoint is reachable even when not on the step grid. |
| `disabled` | `false` | Excludes slider from tab order and blocks edits. |
| `readOnly` | `false` | Keeps focus and value inspection, blocks edits. |
| `gravity` | `false` | When false, release preserves value. When true, descent starts after a direct gesture ends. It does not start merely from a host write. |
| `decayRate` | `18` | **Volume units per second**, not units per frame. `0` stops descent; nonfinite uses 18. |
| `reducedMotion` | `auto` | `auto` follows `prefers-reduced-motion`; `always` removes decorative transitions, `never` opts in. Gravity still changes the value. |

Values clamp to the interval, then quantize to the nearest `min + n × step` or the exact max endpoint. Decimal results round to eight places to avoid floating point artifacts such as `0.30000000000000004`. If min equals max, the control remains at that single value. Host changes to value or bounds cancel active gravity and normalize without emitting events.
The display and accessible value use a percent suffix for the default 0–100 range; custom ranges show the numeric value without assuming it is a percentage.

Gravity integrates elapsed time between animation frames. It emits only when the quantized value actually changes, and stops at min. The loop runs only during descent; it stops when disabled, readOnly, gravity is off, or the element disconnects. Hiding the document pauses it; becoming visible resumes from a fresh time baseline, so the level does not jump by the time spent hidden. Changing `decayRate` while falling changes the subsequent speed. Multiple instances keep their own state and animation frame.

## Events and input

`change` and `commit` are bubbling, composed `CustomEvent`s with frozen payloads. `change` detail is `{ value: number, source: 'pointer' | 'keyboard' | 'button' | 'gravity' }`. It fires once for each effective value change caused by a gesture or gravity. `commit` detail is `{ value: number, source: 'pointer' | 'keyboard' | 'button' }`; it fires once after an effective direct gesture ends, never for gravity or host updates. A cancelled pointer gesture keeps the last value but emits no commit. A button click changes and commits immediately. Holding an arrow key may change repeatedly but commits once on key release or blur.

The cable lane has vertical slider semantics (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`) and accessible name “Âm lượng”. Drag/click works with mouse and touch. Arrow Up/Right increase, Arrow Down/Left decrease, Page Up/Down move ten steps, Home/End choose endpoints. Large `+`/`−` buttons provide a non-drag alternative. Pointer capture is released on finish/cancel/unmount. Disabled and readOnly states are visually indicated.

## Integration

```ts
import { registerVolumeGym } from '@sdcorejs/chaos-ui/volume-gym/register';
registerVolumeGym();
const gym = document.createElement('chaos-volume-gym-element');
gym.value = 40;
gym.addEventListener('change', event => {
  audio.volume = event.detail.value / 100; // the host owns audio
});
```

```tsx
import { VolumeGym } from '@sdcorejs/chaos-ui-react/volume-gym';
<VolumeGym value={volume} gravity onChange={({value}) => setVolume(value)}
  onCommit={({value}) => save(value)} />
// Or omit value and use defaultValue for an independent uncontrolled instance.
```

React callbacks receive typed payloads directly. Controlled consumers should update their value synchronously from `onChange`, including gravity changes; rejected values are restored. The forwarded ref exposes the Web Component.

```ts
// Angular standalone imports: ReactiveFormsModule, ChaosVolumeGymComponent
control = new FormControl(40, { nonNullable: true });
// <chaos-volume-gym [formControl]="control" [gravity]="true"
//   (sdChange)="observe($event)" (sdCommit)="save($event.value)" />
// Alternatively: <chaos-volume-gym [(model)]="volume" />
```

Use Angular `[(model)]` **or** Forms on one instance, not both. CVA carries a number; `writeValue` and `control.setValue` do not feed back as `sdChange` or `modelChange`. Gravity updates the same model/FormControl path as direct edits. Focus leaving the composite control marks Forms touched, and `control.disable()` blocks interaction. Runnable examples live in `examples/react/src/volume-example.tsx` and `examples/angular/src/volume-example.ts`.

## Styling and assets

The machine uses bundled CSS artwork. Shadow DOM contains the illustration; no global stylesheet, remote asset, animation library or audio file is required. CSS variables: `--volume-ink` (`#172c29`), `--volume-surface` (`#f5f8eb`), `--volume-accent` (`#d8ff66`), `--volume-plate` (`#789969`), `--volume-track` (`#102e2c`), `--volume-focus` (`#8454ca`), and `--volume-machine-height` (`374px`). Supported parts: `board`, `machine`, `slider`, `handle`, `weight`, `meter`, `display`, `status`, `actions`, `decrement`, `increment`.

```css
chaos-volume-gym-element { --volume-accent: #f9d66b; }
chaos-volume-gym-element::part(weight) { filter: drop-shadow(0 12px 8px #17352a88); }
```
