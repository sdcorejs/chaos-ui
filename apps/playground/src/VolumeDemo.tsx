import { useEffect, useRef, useState } from "react";
import {
  ChaosVolumeGym,
  type VolumeChangeSource,
} from "@sdcorejs/chaos-ui-react/volume-gym";

interface PreviewAudio {
  context: AudioContext;
  oscillator: OscillatorNode;
  gain: GainNode;
}

/** Audio belongs only to the playground and begins after an explicit Play click. */
export function VolumeDemo() {
  const [value, setValue] = useState(35);
  const [gravity, setGravity] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<VolumeChangeSource | "app">("app");
  const [audioMessage, setAudioMessage] = useState("");
  const audio = useRef<PreviewAudio | null>(null);

  const stop = () => {
    const current = audio.current;
    audio.current = null;
    if (current) {
      current.oscillator.stop();
      current.oscillator.disconnect();
      current.gain.disconnect();
      void current.context.close();
    }
    setPlaying(false);
    setAudioMessage("Âm thử đã dừng.");
  };
  useEffect(
    () => () => {
      const current = audio.current;
      audio.current = null;
      if (current) {
        current.oscillator.stop();
        current.oscillator.disconnect();
        current.gain.disconnect();
        void current.context.close();
      }
    },
    [],
  );
  useEffect(() => {
    const current = audio.current;
    if (current)
      current.gain.gain.setTargetAtTime(
        muted ? 0 : (value / 100) * 0.09,
        current.context.currentTime,
        0.025,
      );
  }, [value, muted]);

  const play = () => {
    if (audio.current) return;
    if (typeof AudioContext === "undefined") {
      setAudioMessage("Trình duyệt này không hỗ trợ âm thử.");
      return;
    }
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 220;
    gain.gain.value = muted ? 0 : (value / 100) * 0.09;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    void context.resume();
    audio.current = { context, oscillator, gain };
    setPlaying(true);
    setAudioMessage("Âm thử đang phát. Tạ điều khiển mức nghe.");
  };

  return (
    <div className="volume-demo">
      <div className="volume-intro">
        <span className="volume-intro-icon" aria-hidden="true">↟</span>
        <div>
          <small>CA TẬP HÔM NAY</small>
          <p>Kéo tạ lên, đẩy âm lượng lên.</p>
          <span>Gravity tắt thì mức âm sẽ đứng yên khi thả.</span>
        </div>
      </div>
      <ChaosVolumeGym
        value={value}
        gravity={gravity}
        decayRate={18}
        disabled={disabled}
        readOnly={readOnly}
        onChange={({ value, source }) => {
          setValue(value);
          setSource(source);
        }}
      />
      <div className="volume-demo-controls">
        <label>
          <input
            type="checkbox"
            checked={gravity}
            onChange={(event) => setGravity(event.target.checked)}
          />{" "}Trọng lực
        </label>
        <button onClick={() => { setValue(35); setSource("app"); }}>Về mức 35 ↺</button>
        <button onClick={() => setDisabled((value) => !value)}>
          {disabled ? "Bật điều khiển" : "Khóa điều khiển"}
        </button>
        <button onClick={() => setReadOnly((value) => !value)}>
          {readOnly ? "Cho phép chỉnh" : "Chỉ xem"}
        </button>
      </div>
      <div className="audio-preview">
        <div>
          <strong>NGHE THỬ TẠI PLAYGROUND</strong>
          <span>Âm thanh chỉ bắt đầu khi bạn bấm Play.</span>
        </div>
        <div className="audio-actions">
          <button onClick={play} disabled={playing}>Play ▶</button>
          <button onClick={stop} disabled={!playing}>Stop ■</button>
          <button onClick={() => setMuted((value) => !value)} aria-pressed={muted}>
            {muted ? "Unmute ◖))" : "Mute ×"}
          </button>
        </div>
        <p role="status">{audioMessage || "Sẵn sàng. Chưa phát âm thanh."}</p>
      </div>
      <p className="loto-footnote">
        Mức: <b data-testid="volume-demo-value">{value}</b> · Nguồn: {source}.
        Component npm chỉ trả giá trị, không phát âm thanh.
      </p>
    </div>
  );
}
