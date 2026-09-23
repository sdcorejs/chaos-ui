import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  forwardRef,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from "@angular/forms";
import { registerInfinityOtp } from "@sdcorejs/chaos-ui/infinity-otp/register";
import {
  normalizeOtpSlots,
  type OtpSlots,
  type OtpStatus,
  type OtpChangeDetail,
  type OtpSubmitDetail,
} from "@sdcorejs/chaos-ui/otp";
export type {
  InfinityOtpProps,
  OtpSlots,
  OtpDigit,
  OtpStatus,
  OtpChangeDetail,
  OtpSubmitDetail,
} from "@sdcorejs/chaos-ui/infinity-otp";

/** Standalone Infinity OTP adapter. Choose [(model)] OR Reactive Forms, never both.
 * @example
 * // imports: [ReactiveFormsModule, ChaosInfinityOtpComponent]
 * control = new FormControl<OtpSlots>([], {nonNullable:true});
 * // <chaos-infinity-otp [formControl]="control" (sdSubmit)="verify($event.value)" />
 */
@Component({
  selector: "chaos-infinity-otp",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChaosInfinityOtpComponent),
      multi: true,
    },
  ],
  template: `<chaos-infinity-otp-element
    [slots]="formMode() ? formValue() : model()"
    [disabled]="disabled() || formDisabled()"
    [readOnly]="readOnly()"
    [status]="status()"
    [message]="message()"
    [locale]="locale()"
    [sound]="sound()"
    [reducedMotion]="reducedMotion()"
    [mode]="mode()"
    (change)="changed($event)"
    (complete)="completed($event)"
    (submit)="submitted($event)"
    (focusout)="blurred($event)"
  />`,
})
export class ChaosInfinityOtpComponent implements ControlValueAccessor {
  /** Positional slots for two-way binding, default []. Do not combine with Forms. @example <chaos-infinity-otp [(model)]="slots" /> */
  readonly model = model<OtpSlots>([]);
  /** Default false; combined with the Forms disabled state. @example <chaos-infinity-otp [disabled]="busy" /> */
  readonly disabled = input(false);
  /** Default false; blocks edits and confirmation but permits focus. @example <chaos-infinity-otp [readOnly]="true" /> */
  readonly readOnly = input(false);
  /** Host verification result, default idle. @example <chaos-infinity-otp [status]="status()" /> */
  readonly status = input<OtpStatus>("idle");
  /** Plain-text feedback, default ''. @example <chaos-infinity-otp message="Try again" /> */
  readonly message = input("");
  /** vi by default; en supported. @example <chaos-infinity-otp locale="en" /> */
  readonly locale = input<"vi" | "en">("vi");
  /** Default false; audio also requires user interaction. @example <chaos-infinity-otp [sound]="true" /> */
  readonly sound = input(false);
  /** auto by default follows OS preferences. @example <chaos-infinity-otp reducedMotion="always" /> */
  readonly reducedMotion = input<"auto" | "always" | "never">("auto");
  /** game by default; input provides conventional entry. @example <chaos-infinity-otp mode="input" /> */
  readonly mode = input<"game" | "input">("game");
  /** Immutable snapshot for user changes only. @example <chaos-infinity-otp (sdChange)="save($event.slots)" /> */
  readonly sdChange = output<OtpChangeDetail>();
  /** A new complete value, not a verification result. @example <chaos-infinity-otp (sdComplete)="ready($event.value)" /> */
  readonly sdComplete = output<OtpSubmitDetail>();
  /** Explicit user confirmation of a complete code. @example <chaos-infinity-otp (sdSubmit)="verify($event.value)" /> */
  readonly sdSubmit = output<OtpSubmitDetail>();
  protected readonly formValue = signal<OtpSlots>([]);
  protected readonly formDisabled = signal(false);
  protected readonly formMode = signal(false);
  private onFormChange: (value: OtpSlots) => void = () => {};
  private onTouched: () => void = () => {};
  constructor() {
    registerInfinityOtp();
  }
  /** Forms view synchronization; never emits modelChange/sdChange or invokes registered change callbacks.
   * @example control.setValue(['0','0','0','0','0','0']); // calls writeValue internally
   */
  writeValue(value: OtpSlots | null): void {
    this.formMode.set(true);
    this.formValue.set(normalizeOtpSlots(value, 6));
  }
  /** Register Forms user-change callback. @example accessor.registerOnChange(slots => save(slots)); */
  registerOnChange(fn: (value: OtpSlots) => void): void {
    this.onFormChange = fn;
  }
  /** Register callback for focus leaving the entire control. @example accessor.registerOnTouched(() => markTouched()); */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  /** Synchronize disabled state without events. @example control.disable(); */
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
  protected changed(event: Event) {
    event.stopPropagation();
    const detail = (event as CustomEvent<OtpChangeDetail>).detail;
    if (this.formMode()) {
      this.formValue.set(detail.slots);
      this.onFormChange(detail.slots);
    } else this.model.set(detail.slots);
    this.sdChange.emit(detail);
  }
  protected completed(event: Event) {
    event.stopPropagation();
    this.sdComplete.emit((event as CustomEvent<OtpSubmitDetail>).detail);
  }
  protected submitted(event: Event) {
    event.stopPropagation();
    this.sdSubmit.emit((event as CustomEvent<OtpSubmitDetail>).detail);
  }
  protected blurred(event: Event) {
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
