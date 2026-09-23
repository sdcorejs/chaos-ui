import { useEffect, useRef, useState } from "react";
import {
  ChaosLotoOtp,
  type OtpSlots,
  type OtpStatus,
} from "@sdcorejs/chaos-ui-react/loto-otp";

export function LotoExample() {
  const [slots, setSlots] = useState<OtpSlots>([]);
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [changes, setChanges] = useState(0);
  const [completes, setCompletes] = useState(0);
  const [submits, setSubmits] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function cancel() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }
  useEffect(() => () => cancel(), []);
  return (
    <section className="loto-example">
      <h2>Loto OTP · React controlled</h2>
      <p>
        Tin nhắn vừa nhận: <strong>000000</strong>. The host checks this demo
        code. Nguồn bóng được xáo độc lập với mã và có thể lấy lặp lại.
        Bàn nhung và bóng nổi đều nằm trong package core.
      </p>
      <ChaosLotoOtp
        slots={slots}
        status={status}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(detail) => {
          cancel();
          setSlots(detail.slots);
          setChanges((n) => n + 1);
          setStatus("idle");
        }}
        onComplete={() => setCompletes((n) => n + 1)}
        onSubmit={({ value }) => {
          setSubmits((n) => n + 1);
          setStatus("verifying");
          cancel();
          timer.current = setTimeout(() => {
            setStatus(value === "000000" ? "success" : "error");
            timer.current = null;
          }, 350);
        }}
      />
      <p>
        Slots: <code data-testid="loto-value">{JSON.stringify(slots)}</code>
      </p>
      <p>
        Changes: <b data-testid="loto-changes">{changes}</b> · Completes:{" "}
        <b data-testid="loto-completes">{completes}</b> · Submits:{" "}
        <b data-testid="loto-submits">{submits}</b>
      </p>
      <div className="demo-controls">
        <button
          onClick={() => {
            cancel();
            setSlots(["1", "1", "2", "2", "3", "3"]);
            setStatus("idle");
          }}
        >
          Load 112233
        </button>
        <button
          onClick={() => {
            cancel();
            setSlots([]);
            setStatus("idle");
          }}
        >
          Reset from app
        </button>
        <button onClick={() => setDisabled((v) => !v)}>Toggle disabled</button>
        <button onClick={() => setReadOnly((v) => !v)}>Toggle readonly</button>
      </div>
      <h3>Uncontrolled, independent instance</h3>
      <ChaosLotoOtp defaultSlots={["0", null, null, null]} length={4} locale="en" />
    </section>
  );
}
