import { LotoExample } from "./loto-example";
import { InfinityExample } from "./infinity-example";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import type { ChaosLotoOtpProps } from "@sdcorejs/chaos-ui-react/loto-otp";
import { ChaosProbeAdapter } from "../../../packages/react/testing/probe";
import "../../../apps/playground/src/style.css";
const contract: ChaosLotoOtpProps = { slots: ["0", null, "0"], status: "idle" };
function App() {
  const [value, setValue] = useState(0);
  const [events, setEvents] = useState(0);
  const [visible, setVisible] = useState(true);
  return (
    <main className="example">
      <LotoExample />
      <InfinityExample />
      <p className="eyebrow">CHAOS UI / REACT</p>
      <h1>
        One core.
        <br />A little chaos.
      </h1>
      <p>Internal build-pipeline fixture (not public API).</p>
      <p>
        Positional OTP contract: <code>{JSON.stringify(contract.slots)}</code>
      </p>
      {visible && (
        <ChaosProbeAdapter
          value={value}
          onChaosChange={(e) => {
            setValue(e.detail.value);
            setEvents((n) => n + 1);
          }}
        />
      )}
      <p data-testid="value">Value: {value}</p>
      <p data-testid="events">Events: {events}</p>
      <button onClick={() => setValue(10)}>Set from app</button>{" "}
      <button onClick={() => setVisible((v) => !v)}>Toggle fixture</button>
      <h2>Independent instance</h2>
      <Independent />
    </main>
  );
}
function Independent() {
  const [value, setValue] = useState(0);
  return (
    <ChaosProbeAdapter value={value} onChaosChange={(e) => setValue(e.detail.value)} />
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
