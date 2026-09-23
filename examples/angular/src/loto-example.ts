import { Component, DestroyRef, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  ChaosLotoOtpComponent,
  type OtpSlots,
  type OtpStatus,
  type OtpSubmitDetail,
} from "@sdcorejs/chaos-ui-angular/loto-otp";

@Component({
  selector: "loto-example",
  standalone: true,
  imports: [ReactiveFormsModule, ChaosLotoOtpComponent],
  template: `
    <section class="loto-example">
      <h2>Loto OTP · Angular Reactive Forms</h2>
      <p>
        Tin nhắn vừa nhận: <strong>000000</strong>. The host checks this demo
        code. Nguồn bóng được xáo độc lập với mã và có thể lấy lặp lại.
        Bàn nhung và bóng nổi đều nằm trong package core.
      </p>
      <chaos-loto-otp
        [formControl]="control"
        [status]="status()"
        [readOnly]="readOnly()"
        (sdChange)="changed()"
        (sdComplete)="completes.set(completes() + 1)"
        (sdSubmit)="submit($event)"
      />
      <p>
        Slots: <code data-testid="loto-value">{{ serialized() }}</code>
      </p>
      <p>
        Changes: <b data-testid="loto-changes">{{ changes() }}</b> · Completes:
        <b data-testid="loto-completes">{{ completes() }}</b> · Submits:
        <b data-testid="loto-submits">{{ submits() }}</b>
      </p>
      <p data-testid="form-state">
        Touched: {{ control.touched }} · Dirty: {{ control.dirty }} · Disabled:
        {{ control.disabled }}
      </p>
      <div class="demo-controls">
        <button (click)="load()">Load 112233</button
        ><button (click)="reset()">Reset from app</button>
        <button
          (click)="control.disabled ? control.enable() : control.disable()"
        >
          Toggle disabled</button
        ><button (click)="readOnly.set(!readOnly())">Toggle readonly</button>
      </div>
      <h3>Independent model binding (no Forms)</h3>
      <chaos-loto-otp [(model)]="other" [length]="4" locale="en" />
      <p data-testid="other-model">{{ other().join("") }}</p>
    </section>
  `,
})
export class LotoExample {
  readonly control = new FormControl<OtpSlots>([], { nonNullable: true });
  readonly other = signal<OtpSlots>([]);
  readonly status = signal<OtpStatus>("idle");
  readonly readOnly = signal(false);
  readonly changes = signal(0);
  readonly completes = signal(0);
  readonly submits = signal(0);
  readonly serialized = signal("[]");
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
    this.changes.update((n) => n + 1);
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
    this.submits.update((n) => n + 1);
    this.status.set("verifying");
    this.timer = setTimeout(() => {
      this.status.set(value === "000000" ? "success" : "error");
      this.timer = null;
    }, 350);
  }
}
