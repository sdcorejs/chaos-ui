import { useEffect, useRef, useState } from "react";
import {
  InfinityOtp,
  type OtpSlots,
  type OtpStatus,
} from "@sdcorejs/chaos-ui-react/infinity-otp";

const codes = ["001122", "000000", "112233"];
/** The sample code and verification belong to the playground, never the component. */
export function InfinityDemo() {
  const [slots, setSlots] = useState<OtpSlots>([]);
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [message, setMessage] = useState("");
  const [sample, setSample] = useState(0);
  const [sound, setSound] = useState(false);
  const [motion, setMotion] = useState<"auto" | "always" | "never">("auto");
  const [systemReduced, setSystemReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const code = codes[sample]!;
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
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <div className="infinity-demo">
      <div className="infinity-message">
        <span aria-hidden="true">✦</span>
        <div>
          <small>TÍN HIỆU VỪA NHẬN</small>
          <p>
            Mã sáu chữ số: <strong data-testid="infinity-sample">{code}</strong>
          </p>
          <em>Mã mẫu chỉ có trong playground.</em>
        </div>
      </div>
      <InfinityOtp
        slots={slots}
        status={status}
        message={message}
        sound={sound}
        reducedMotion={motion}
        onChange={({ slots }) => {
          cancel();
          setSlots(slots);
          setStatus("idle");
          setMessage("");
        }}
        onSubmit={({ value }) => {
          cancel();
          setStatus("verifying");
          setMessage("Đang kiểm tra tín hiệu vũ trụ…");
          timer.current = setTimeout(() => {
            const success = value === code;
            setStatus(success ? "success" : "error");
            setMessage(
              success
                ? "Chuẩn rồi. Cú búng tay huyền thoại!"
                : "Chưa đúng mã. Hãy thay viên đá cần sửa.",
            );
            timer.current = null;
          }, 900);
        }}
      />
      <div className="demo-controls">
        <label>
          Chuyển động{" "}
          <select value={motion} onChange={(e) => {
            const value = e.target.value;
            if (value === "auto" || value === "always" || value === "never")
              setMotion(value);
          }}>
            <option value="auto">Theo thiết bị</option>
            <option value="never">Bật hoạt ảnh</option>
            <option value="always">Giảm chuyển động</option>
          </select>
        </label>
        <button onClick={reset}>Reset Infinity ↺</button>
        <button
          onClick={() => {
            reset();
            setSample((n) => (n + 1) % codes.length);
          }}
        >
          Đổi mã Infinity
        </button>
        <label>
          <input
            type="checkbox"
            checked={sound}
            onChange={(e) => setSound(e.target.checked)}
          />{" "}
          Âm thanh
        </label>
      </div>
      {motion === "auto" && systemReduced && <p className="loto-footnote" role="status">
        Thiết bị đang giảm chuyển động nên cú búng hiện dạng tư thế tĩnh. Chọn
        “Bật hoạt ảnh” rồi “Xem lại cú búng” để xem ngón tay chuyển động.
      </p>}
      <p className="loto-footnote">
        Sáu hốc có thứ tự rõ ràng; mỗi đá số có thể lấy lặp lại. Cú búng bắt đầu
        ngay khi xác nhận, có thể xem lại sau khi nhận kết quả. Sai mã mới hiện
        emoji ngạc nhiên; đúng mã thì găng phát sáng và tan thành bụi trong vùng trò chơi.
      </p>
    </div>
  );
}
