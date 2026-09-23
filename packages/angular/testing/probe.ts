import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from "@angular/core";
import { registerProbe } from "../../chaos-ui/testing/register.js";
@Component({
  selector: "chaos-probe-adapter",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template:
    '<chaos-internal-probe [value]="value()" (chaos-change)="forward($event)" />',
})
export class ChaosProbeAdapter {
  readonly value = input(0);
  readonly valueChange = output<number>();
  constructor() {
    registerProbe();
  }
  forward(event: Event) {
    this.valueChange.emit(
      (event as CustomEvent<{ value: number }>).detail.value,
    );
  }
}
