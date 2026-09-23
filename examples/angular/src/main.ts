import { LotoExample } from "./loto-example";
import { InfinityExample } from "./infinity-example";
import { VolumeExample } from "./volume-example";
import { Component, signal } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import type { ChaosLotoOtpProps } from "@sdcorejs/chaos-ui-angular/loto-otp";
import { ChaosProbeAdapter } from "../../../packages/angular/testing/probe";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [ChaosProbeAdapter, LotoExample, InfinityExample, VolumeExample],
  template: `<main class="example">
    <loto-example />
    <infinity-example />
    <volume-example />
    <p class="eyebrow">CHAOS UI / ANGULAR</p>
    <h1>One core.<br />A little chaos.</h1>
    <p>Internal build-pipeline fixture (not public API).</p>
    <p>
      Positional OTP contract: <code>{{ slots }}</code>
    </p>
    @if (visible()) {
      <chaos-probe-adapter [value]="value()" (valueChange)="change($event)" />
    }
    <p data-testid="value">Value: {{ value() }}</p>
    <p data-testid="events">Events: {{ events() }}</p>
    <button (click)="value.set(10)">Set from app</button>
    <button (click)="visible.set(!visible())">Toggle fixture</button>
    <h2>Independent instance</h2>
    <chaos-probe-adapter [(value)]="second" />
  </main>`,
})
class App {
  readonly contract: ChaosLotoOtpProps = { slots: ["0", null, "0"], status: "idle" };
  readonly slots = JSON.stringify(this.contract.slots);
  readonly value = signal(0);
  readonly second = signal(0);
  readonly events = signal(0);
  readonly visible = signal(true);
  change(value: number) {
    this.value.set(value);
    this.events.update((n) => n + 1);
  }
}
bootstrapApplication(App).catch(console.error);
