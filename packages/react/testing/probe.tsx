import * as React from "react";
import { createComponent, type EventName } from "@lit/react";
import { ChaosProbe } from "../../chaos-ui/testing/probe.js";
import { registerProbe } from "../../chaos-ui/testing/register.js";
const Element = createComponent({
  react: React,
  tagName: "chaos-internal-probe",
  elementClass: ChaosProbe,
  events: {
    onChaosChange: "chaos-change" as EventName<CustomEvent<{ value: number }>>,
  },
});
/** Internal adapter: registration is explicit and lazy, props/events stay in Lit. */
export function ChaosProbeAdapter(props: React.ComponentProps<typeof Element>) {
  React.useEffect(() => {
    registerProbe();
  }, []);
  return <Element {...props} />;
}
