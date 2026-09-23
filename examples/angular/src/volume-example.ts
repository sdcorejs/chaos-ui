import { Component, DestroyRef, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  ChaosVolumeGymComponent,
  type VolumeChangeDetail,
} from "@sdcorejs/chaos-ui-angular/volume-gym";

@Component({
  selector: "volume-example",
  standalone: true,
  imports: [ReactiveFormsModule, ChaosVolumeGymComponent],
  template: `<section class="volume-example">
    <h2>Volume Gym · Angular Reactive Forms</h2>
    <p>FormControl nhận cả thao tác trực tiếp và giá trị thay đổi bởi gravity.</p>
    <chaos-volume-gym
      [formControl]="control"
      [gravity]="gravity()"
      [decayRate]="30"
      [readOnly]="readOnly()"
      (sdChange)="changed($event)"
      (sdCommit)="commits.update(increment)"
    />
    <p>
      Value: <b data-testid="volume-value">{{ value() }}</b> · Changes:
      <b data-testid="volume-changes">{{ changes() }}</b> · Commits:
      <b data-testid="volume-commits">{{ commits() }}</b> · Source:
      <b data-testid="volume-source">{{ source() }}</b>
    </p>
    <p data-testid="volume-form-state">
      Touched: {{ control.touched }} · Disabled: {{ control.disabled }}
    </p>
    <div class="demo-controls">
      <button (click)="control.setValue(73)">Set volume from app</button>
      <button (click)="gravity.set(!gravity())">Toggle volume gravity</button>
      <button (click)="control.disabled ? control.enable() : control.disable()">
        Toggle volume disabled
      </button>
      <button (click)="readOnly.set(!readOnly())">Toggle volume readonly</button>
    </div>
    <h3>Independent model binding (no Forms)</h3>
    <chaos-volume-gym [(model)]="other" [step]="5" />
    <p data-testid="volume-other-model">{{ other() }}</p>
  </section>`,
})
export class VolumeExample {
  readonly control = new FormControl(40, { nonNullable: true });
  readonly other = signal(25);
  readonly gravity = signal(false);
  readonly readOnly = signal(false);
  readonly value = signal(40);
  readonly changes = signal(0);
  readonly commits = signal(0);
  readonly source = signal("none");
  readonly increment = (n: number) => n + 1;
  constructor() {
    const subscription = this.control.valueChanges.subscribe((v) =>
      this.value.set(v),
    );
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }
  changed(detail: VolumeChangeDetail): void {
    this.changes.update(this.increment);
    this.source.set(detail.source);
  }
}
