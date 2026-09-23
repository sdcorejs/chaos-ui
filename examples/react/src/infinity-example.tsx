import { useEffect, useRef, useState } from "react";
import {
  InfinityOtp,
  type OtpSlots,
  type OtpStatus,
} from "@sdcorejs/chaos-ui-react/infinity-otp";

export function InfinityExample() {
  const [slots, setSlots] = useState<OtpSlots>([]);
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [changes, setChanges] = useState(0);
  const [completes, setCompletes] = useState(0);
  const [submits, setSubmits] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => () => cancel(), []);
  return (
    <section className="loto-example">
      <h2>Infinity OTP · React controlled</h2>
      <p>
        Tín hiệu vừa nhận: <strong>001122</strong>. Ứng dụng mẫu kiểm tra mã sau
        khi búng tay.
      </p>
      <InfinityOtp
        slots={slots}
        status={status}
        onChange={({ slots }) => {
          cancel();
          setSlots(slots);
          setChanges((n) => n + 1);
          setStatus("idle");
        }}
        onComplete={() => setCompletes((n) => n + 1)}
        onSubmit={({ value }) => {
          cancel();
          setSubmits((n) => n + 1);
          setStatus("verifying");
          timer.current = setTimeout(() => {
            setStatus(value === "001122" ? "success" : "error");
            timer.current = null;
          }, 350);
        }}
      />
      <p>
        Slots: <code data-testid="infinity-value">{JSON.stringify(slots)}</code>
      </p>
      <p>
        Changes: <b data-testid="infinity-changes">{changes}</b> · Completes:{" "}
        <b data-testid="infinity-completes">{completes}</b> · Submits:{" "}
        <b data-testid="infinity-submits">{submits}</b>
      </p>
      <div className="demo-controls">
        <button
          onClick={() => {
            cancel();
            setSlots(["1", "1", "2", "2", "3", "3"]);
            setStatus("idle");
          }}
        >
          Load Infinity 112233
        </button>
        <button
          onClick={() => {
            cancel();
            setSlots([]);
            setStatus("idle");
          }}
        >
          Reset Infinity from app
        </button>
      </div>
      <h3>Independent uncontrolled glove</h3>
      <InfinityOtp
        defaultSlots={["0", null, null, null, null, null]}
        locale="en"
      />
    </section>
  );
}
