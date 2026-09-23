import { useEffect, useRef, useState } from "react";
import {
  ChaosLotoOtp,
  type OtpSlots,
  type OtpStatus,
} from "@sdcorejs/chaos-ui-react/loto-otp";
import { normalizeOtpSlots } from "@sdcorejs/chaos-ui/otp";

const samples = ["007204", "000000", "112233", "090909"];
export function LotoDemo() {
  const [slots, setSlots] = useState<OtpSlots>([]);
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [message, setMessage] = useState("");
  const [length, setLength] = useState(6);
  const [sample, setSample] = useState(0);
  const [sound, setSound] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const code = samples[sample]!.repeat(2).slice(0, length);
  const cancel = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const reset = () => {
    cancel();
    setSlots([]);
    setStatus("idle");
    setMessage("");
  };
  useEffect(() => () => cancel(), []);
  return (
    <div className="loto-demo">
      <div className="received-message">
        <span className="message-icon" aria-hidden="true">
          ✉
        </span>
        <div>
          <small>TIN NHẮN VỪA NHẬN</small>
          <p>
            Mã của bạn là <strong data-testid="sample-code">{code}</strong>
          </p>
          <span>Mã mẫu hiển thị chỉ dành cho playground.</span>
        </div>
        <span className="message-time">vừa xong</span>
      </div>
      <ChaosLotoOtp
        slots={slots}
        length={length}
        sound={sound}
        status={status}
        message={message}
        onChange={({ slots }) => {
          cancel();
          setSlots(slots);
          setStatus("idle");
          setMessage("");
        }}
        onSubmit={({ value }) => {
          cancel();
          setStatus("verifying");
          setMessage("Đợi chút, đang dò số…");
          timer.current = setTimeout(() => {
            const ok = value === code;
            setStatus(ok ? "success" : "error");
            setMessage(
              ok
                ? "Đúng mã rồi. Một tràng pháo tay!"
                : "Chưa trúng! Xem lại tin nhắn rồi thử lại nhé.",
            );
            timer.current = null;
          }, 900);
        }}
      />
      <div className="demo-controls">
        <button onClick={reset}>Reset demo ↺</button>
        <button
          onClick={() => {
            reset();
            setSample((n) => (n + 1) % samples.length);
          }}
        >
          Đổi mã mẫu
        </button>
        <label>
          Số ô{" "}
          <select
            aria-label="Số ô"
            value={length}
            onChange={(e) => {
              cancel();
              const n = Number(e.target.value);
              setLength(n);
              setSlots(normalizeOtpSlots(slots, n));
              setStatus("idle");
              setMessage("");
            }}
          >
            {[4, 5, 6, 7, 8].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={sound}
            onChange={(e) => setSound(e.target.checked)}
          />{" "}
          Âm thanh
        </label>
      </div>
      <p className="loto-footnote">
        Mười nguồn số, lấy bao nhiêu cũng được. Đủ số ≠ đúng mã.
      </p>
    </div>
  );
}
