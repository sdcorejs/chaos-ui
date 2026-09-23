import { Component, DestroyRef, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  ChaosInfinityOtpComponent,
  type OtpSlots,
  type OtpStatus,
  type OtpSubmitDetail,
} from "@sdcorejs/chaos-ui-angular/infinity-otp";

@Component({
  selector: "infinity-example",
  standalone: true,
  imports: [ReactiveFormsModule, ChaosInfinityOtpComponent],
  template: `<section class="loto-example">
    <h2>Infinity OTP · Angular Reactive Forms</h2>
    <p>
      Tín hiệu vừa nhận: <strong>001122</strong>. Ứng dụng mẫu kiểm tra mã sau
      khi búng tay. Sáu hốc trên giáp tay giữ thứ tự 01–06.
    </p>
    <chaos-infinity-otp
      [formControl]="control"
      [status]="status()"
      (sdChange)="changed()"
      (sdComplete)="completes.update(increment)"
      (sdSubmit)="submit($event)"
    />
    <p>
      Slots: <code data-testid="infinity-value">{{ serialized() }}</code>
    </p>
    <p>
      Changes: <b data-testid="infinity-changes">{{ changes() }}</b> ·
      Completes: <b data-testid="infinity-completes">{{ completes() }}</b> ·
      Submits: <b data-testid="infinity-submits">{{ submits() }}</b>
    </p>
    <p data-testid="infinity-form-state">
      Touched: {{ control.touched }} · Dirty: {{ control.dirty }} · Disabled:
      {{ control.disabled }}
    </p>
    <div class="demo-controls">
      <button (click)="load()">Load Infinity 112233</button>
      <button (click)="reset()">Reset Infinity from app</button>
      <button (click)="control.disabled ? control.enable() : control.disable()">
        Toggle Infinity disabled
      </button>
    </div>
    <h3>Independent model binding</h3>
    <chaos-infinity-otp [(model)]="other" locale="en" />
    <p data-testid="infinity-other-model">{{ other().join("") }}</p>
  </section>`,
})
export class InfinityExample {
  readonly control = new FormControl<OtpSlots>([], { nonNullable: true });
  readonly other = signal<OtpSlots>(["0", null, null, null, null, null]);
  readonly status = signal<OtpStatus>("idle");
  readonly changes = signal(0);
  readonly completes = signal(0);
  readonly submits = signal(0);
  readonly serialized = signal("[]");
  readonly increment = (n: number) => n + 1;
  private timer: ReturnType<typeof setTimeout> | null = null;
  constructor() {
    const subscription = this.control.valueChanges.subscribe((v) =>
      this.serialized.set(JSON.stringify(v)),
    );
    inject(DestroyRef).onDestroy(() => {
      this.cancel();
      subscription.unsubscribe();
    });
  }
  private cancel() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }
  changed() {
    this.cancel();
    this.changes.update(this.increment);
    this.status.set("idle");
  }
  load() {
    this.cancel();
    this.control.setValue(["1", "1", "2", "2", "3", "3"]);
    this.status.set("idle");
  }
  reset() {
    this.cancel();
    this.control.reset([]);
    this.status.set("idle");
  }
  submit({ value }: OtpSubmitDetail) {
    this.cancel();
    this.submits.update(this.increment);
    this.status.set("verifying");
    this.timer = setTimeout(() => {
      this.status.set(value === "001122" ? "success" : "error");
      this.timer = null;
    }, 350);
  }
}
