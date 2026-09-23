import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  ElementRef,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from "@angular/forms";
import { normalizeVolume } from "@sdcorejs/chaos-ui/volume-gym";
import { registerVolumeGym } from "@sdcorejs/chaos-ui/volume-gym/register";
import type {
  ChaosVolumeGymElement,
  VolumeChangeDetail,
  VolumeCommitDetail,
} from "@sdcorejs/chaos-ui/volume-gym";
export type {
  ChaosVolumeGymProps,
  VolumeGymProps,
  VolumeChangeSource,
  VolumeChangeDetail,
  VolumeCommitDetail,
} from "@sdcorejs/chaos-ui/volume-gym";

/** Standalone Angular Volume Gym. Choose `[(model)]` OR Forms per instance.
 * Gravity changes update the same number state and Forms callback as direct edits.
 * @example
 * // imports: [ReactiveFormsModule, ChaosVolumeGymComponent]
 * control = new FormControl(40, {nonNullable:true});
 * // <chaos-volume-gym [formControl]="control" (sdCommit)="save($event.value)" />
 */
@Component({
  selector: "chaos-volume-gym",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChaosVolumeGymComponent),
      multi: true,
    },
  ],
  template: `<chaos-volume-gym-element #inner
    [value]="effectiveValue()"
    [min]="min()"
    [max]="max()"
    [step]="step()"
    [disabled]="disabled() || formDisabled()"
    [readOnly]="readOnly()"
    [gravity]="gravity()"
    [decayRate]="decayRate()"
    [reducedMotion]="reducedMotion()"
    (change)="changed($event)"
    (commit)="committed($event)"
    (focusout)="blurred($event)"
  />`,
})
export class ChaosVolumeGymComponent implements ControlValueAccessor {
  /** Numeric two-way value, default 0. Use this OR Forms on an instance.
   * @example <chaos-volume-gym [(model)]="volume" />
   */
  readonly model = model(0);
  /** Lower endpoint, default 0. @example <chaos-volume-gym [min]="10" /> */
  readonly min = input(0);
  /** Upper endpoint, default 100. @example <chaos-volume-gym [max]="80" /> */
  readonly max = input(100);
  /** Decimal step anchored at min, default 1. @example <chaos-volume-gym [step]="0.5" /> */
  readonly step = input(1);
  /** Block editing/focus, default false; combined with Forms disabled state.
   * @example <chaos-volume-gym [disabled]="busy" />
   */
  readonly disabled = input(false);
  /** Keep focus but block edits, default false. @example <chaos-volume-gym [readOnly]="true" /> */
  readonly readOnly = input(false);
  /** Let the weight fall after direct gestures, default false. @example <chaos-volume-gym [gravity]="true" /> */
  readonly gravity = input(false);
  /** Descent speed in volume units per second, default 18. @example <chaos-volume-gym [decayRate]="12" /> */
  readonly decayRate = input(18);
  /** auto (default), always or never; decorative motion only.
   * @example <chaos-volume-gym reducedMotion="always" />
   */
  readonly reducedMotion = input<"auto" | "always" | "never">("auto");
  /** Effective direct/gravity update with value and source, never from writeValue.
   * @example <chaos-volume-gym (sdChange)="log($event.source)" />
   */
  readonly sdChange = output<VolumeChangeDetail>();
  /** Final value after a direct gesture; gravity emits no commit.
   * @example <chaos-volume-gym (sdCommit)="save($event.value)" />
   */
  readonly sdCommit = output<VolumeCommitDetail>();

  protected readonly formValue = signal(0);
  protected readonly formDisabled = signal(false);
  protected readonly formMode = signal(false);
  protected readonly effectiveValue = computed(() =>
    normalizeVolume(
      this.formMode() ? this.formValue() : this.model(),
      this.min(),
      this.max(),
      this.step(),
    ),
  );
  private onFormChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly inner = viewChild<ElementRef<ChaosVolumeGymElement>>("inner");

  constructor() {
    registerVolumeGym();
  }
  /** Programmatic Forms write; normalizes silently without sdChange/modelChange.
   * @example control.setValue(73); // calls writeValue internally
   */
  writeValue(value: number | null): void {
    this.formMode.set(true);
    const next = normalizeVolume(
      value ?? this.min(), this.min(), this.max(), this.step(),
    );
    this.formValue.set(next);
    // Forms writes can arrive between gravity frames. Stop descent immediately,
    // before the next Angular template refresh can be overtaken by another tick.
    const element = this.inner()?.nativeElement;
    if (element) element.value = next;
  }
  /** Register one callback for effective direct/gravity updates.
   * @example accessor.registerOnChange(value => save(value));
   */
  registerOnChange(fn: (value: number) => void): void {
    this.onFormChange = fn;
  }
  /** Register touched callback for focus leaving the composite control.
   * @example accessor.registerOnTouched(() => markTouched());
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  /** Sync Forms disabled state without change/commit events.
   * @example control.disable();
   */
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    const element = this.inner()?.nativeElement;
    if (element) element.disabled = disabled || this.disabled();
  }
  protected changed(event: Event): void {
    event.stopPropagation();
    const detail = (event as CustomEvent<VolumeChangeDetail>).detail;
    if (this.formMode()) {
      this.formValue.set(detail.value);
      this.onFormChange(detail.value);
    } else this.model.set(detail.value);
    this.sdChange.emit(detail);
  }
  protected committed(event: Event): void {
    event.stopPropagation();
    this.sdCommit.emit((event as CustomEvent<VolumeCommitDetail>).detail);
  }
  protected blurred(event: Event): void {
    const focus = event as FocusEvent;
    const element = event.target as HTMLElement;
    if (
      focus.relatedTarget &&
      (element.contains(focus.relatedTarget as Node) ||
        element.shadowRoot?.contains(focus.relatedTarget as Node))
    )
      return;
    this.onTouched();
  }
}
