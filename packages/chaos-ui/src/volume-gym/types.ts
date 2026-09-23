/** Origin of a Volume Gym value change. Programmatic writes never emit one.
 * @example if (detail.source === 'gravity') showFallingIndicator();
 */
export type VolumeChangeSource = "pointer" | "keyboard" | "button" | "gravity";

/** Immutable payload emitted when a user gesture or gravity changes the value.
 * @example gym.addEventListener('change', event => console.log(event.detail.value));
 */
export interface VolumeChangeDetail {
  /** Quantized value within min/max. @example 42 */
  readonly value: number;
  /** What caused this effective change. @example 'gravity' */
  readonly source: VolumeChangeSource;
}

/** Immutable payload emitted once after an effective direct gesture ends.
 * Gravity changes never emit commit.
 * @example gym.addEventListener('commit', event => save(event.detail.value));
 */
export interface VolumeCommitDetail {
  /** Final quantized value. @example 42 */
  readonly value: number;
  /** Direct interaction method. @example 'pointer' */
  readonly source: Exclude<VolumeChangeSource, "gravity">;
}

/** Volume Gym options. The component controls a number only; it never plays audio.
 * @example const options: ChaosVolumeGymProps = { value: 40, gravity: true, decayRate: 18 };
 */
export interface ChaosVolumeGymProps {
  /** Volume level; default 0. Host writes normalize silently. @example gym.value = 40; */
  value?: number;
  /** Lower endpoint; default 0. Reversed bounds are sorted. @example gym.min = 10; */
  min?: number;
  /** Upper endpoint; default 100 and always reachable. @example gym.max = 80; */
  max?: number;
  /** Quantization increment anchored at min; default 1. Nonpositive values use 1. @example gym.step = 0.5; */
  step?: number;
  /** Block focus and editing; default false. @example gym.disabled = true; */
  disabled?: boolean;
  /** Keep the slider focusable but block editing; default false. @example gym.readOnly = true; */
  readOnly?: boolean;
  /** Lower the weight after a direct gesture ends; default false. @example gym.gravity = true; */
  gravity?: boolean;
  /** Gravity speed in **volume units per second**; default 18. Used only with gravity. @example gym.decayRate = 12; */
  decayRate?: number;
  /** `auto` follows the OS setting, `always` reduces decorative motion, `never` opts in; default `auto`. @example gym.reducedMotion = 'always'; */
  reducedMotion?: "auto" | "always" | "never";
}

/** Short compatibility name for Volume Gym options.
 * @example const props: VolumeGymProps = { value: 25 };
 */
export type VolumeGymProps = ChaosVolumeGymProps;
