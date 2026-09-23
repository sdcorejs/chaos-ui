import { useState } from "react";
import {
  ChaosVolumeGym,
  VolumeGym,
  type VolumeChangeSource,
} from "@sdcorejs/chaos-ui-react/volume-gym";

export function VolumeExample() {
  const [value, setValue] = useState(40);
  const [changes, setChanges] = useState(0);
  const [commits, setCommits] = useState(0);
  const [source, setSource] = useState<VolumeChangeSource | "none">("none");
  const [gravity, setGravity] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  return (
    <section className="volume-example">
      <h2>Volume Gym · React controlled</h2>
      <p>Giá trị thuộc ứng dụng; tạ chỉ gửi yêu cầu đổi mức âm lượng.</p>
      <ChaosVolumeGym
        value={value}
        gravity={gravity}
        decayRate={30}
        disabled={disabled}
        readOnly={readOnly}
        onChange={({ value, source }) => {
          setValue(value);
          setSource(source);
          setChanges((n) => n + 1);
        }}
        onCommit={() => setCommits((n) => n + 1)}
      />
      <p>
        Value: <b data-testid="volume-value">{value}</b> · Changes: {" "}
        <b data-testid="volume-changes">{changes}</b> · Commits: {" "}
        <b data-testid="volume-commits">{commits}</b> · Source: {" "}
        <b data-testid="volume-source">{source}</b>
      </p>
      <div className="demo-controls">
        <button onClick={() => setValue(73)}>Set volume from app</button>
        <button onClick={() => setGravity((v) => !v)}>Toggle volume gravity</button>
        <button onClick={() => setDisabled((v) => !v)}>Toggle volume disabled</button>
        <button onClick={() => setReadOnly((v) => !v)}>Toggle volume readonly</button>
      </div>
      <h3>Independent uncontrolled machine</h3>
      <VolumeGym defaultValue={25} step={5} />
    </section>
  );
}
