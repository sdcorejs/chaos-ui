import lotoDocumentation from "../../../docs/loto-otp.md?raw";
import { LotoDemo } from "./LotoDemo";
import { InfinityDemo } from "./InfinityDemo";
import { VolumeDemo } from "./VolumeDemo";
import infinityDocumentation from "../../../docs/infinity-otp.md?raw";
import volumeDocumentation from "../../../docs/volume-gym.md?raw";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import architecture from "../../../docs/architecture.md?raw";
import authoring from "../../../docs/component-authoring.md?raw";
import release from "../../../docs/release.md?raw";

const games = [
  {
    name: "Loto OTP",
    category: "01 / CHANCE ENCOUNTER",
    description: "Your verification code. Now with bingo-night energy.",
    icon: "loto",
    color: "pink",
  },
  {
    name: "Infinity OTP",
    category: "02 / COSMIC CONFIRMATION",
    description: "Six digit stones. One extravagant snap.",
    icon: "infinity",
    color: "purple",
  },
  {
    name: "Volume Gym",
    category: "03 / SOUND WORKOUT",
    description: "Want it louder? You’ll have to work for it.",
    icon: "volume",
    color: "lime",
  },
] as const;
function Illustration({ kind }: { kind: string }) {
  if (kind === "loto")
    return (
      <div className="balls" aria-hidden="true">
        <span>0</span>
        <span>7</span>
        <span>0</span>
        <span>2</span>
      </div>
    );
  if (kind === "infinity")
    return (
      <div className="loop" aria-hidden="true">
        ∞<span>0 0 0 _ _ _</span>
      </div>
    );
  return (
    <div className="gym" aria-hidden="true">
      <i />
      <i />
      <b />
      <i />
      <i />
      <span>TURN REPS INTO DECIBELS</span>
    </div>
  );
}
function App() {
  const [selected, setSelected] = useState(0);
  const [framework, setFramework] = useState<"React" | "Angular">("React");
  const game = games[selected]!;
  const volumeCode =
    framework === "React"
      ? `import { VolumeGym } from "@sdcorejs/chaos-ui-react/volume-gym";\n\n<VolumeGym\n  value={volume}\n  gravity={gravity}\n  onChange={({ value }) => setVolume(value)}\n  onCommit={({ value }) => save(value)}\n/>`
      : `// imports: [ReactiveFormsModule, ChaosVolumeGymComponent]\ncontrol = new FormControl(35, { nonNullable: true });\n\n<chaos-volume-gym\n  [formControl]="control"\n  [gravity]="gravity()"\n  (sdCommit)="save($event.value)"\n/>`;
  return (
    <>
      <header>
        <a className="brand" href="#">
          <span className="brand-icon">✳</span> chaos ui{" "}
          <small>by sdcorejs</small>
        </a>
        <nav aria-label="Main">
          <a href="#collection">Components</a>
          <a href="#docs">Docs</a>
          <a href="https://github.com/sdcorejs/chaos-ui">GitHub ↗</a>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">
              <span className="dot" /> AN EXPERIMENT IN PLAYFUL INTERFACES
            </p>
            <h1>
              Simple tasks.
              <br />
              <em>Ridiculous</em> interfaces.
            </h1>
            <p className="intro">
              A perfectly unreasonable collection of UI mini games.
              <br className="desktop-break" /> Built to turn “just one click”
              into a small adventure.
            </p>
            <a className="cta" href="#collection">
              Explore the chaos <span>↘</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit" />
            <span className="spark">✳</span>
            <span className="sticker">
              100%
              <br />
              unnecessary*
            </span>
            <span className="tiny-note">* that's the point.</span>
          </div>
        </section>
        <section id="collection">
          <div className="section-title">
            <h2>
              The collection <span>03</span>
            </h2>
            <p>Serious components. Questionable methods.</p>
          </div>
          <div className="gallery">
            {games.map((item, index) => (
              <button
                key={item.name}
                className={`card ${item.color} ${selected === index ? "selected" : ""}`}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <div className="card-art">
                  <span className="status">
                    PLAY NOW
                  </span>
                  <Illustration kind={item.icon} />
                </div>
                <div className="card-body">
                  <p className="eyebrow">{item.category}</p>
                  <h3>
                    {item.name}
                    <span>↗</span>
                  </h3>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="lab" id="demo">
          <div className="section-title">
            <h2>
              The test bench <span>↴</span>
            </h2>
            <p>Selected: {game.name}</p>
          </div>
          <div className="bench loto-bench">
            {selected === 0 ? (
              <LotoDemo />
            ) : selected === 1 ? (
              <InfinityDemo />
            ) : (
              <VolumeDemo />
            )}
            <div className="code">
              <div
                className="code-tabs"
                role="group"
                aria-label="Code framework"
              >
                {(["React", "Angular"] as const).map((f) => (
                  <button
                    key={f}
                    aria-pressed={f === framework}
                    onClick={() => setFramework(f)}
                  >
                    {f}
                  </button>
                ))}
                <span>PUBLIC API</span>
              </div>
              <pre>
                <code>
                  {selected === 0
                    ? framework === "React"
                      ? `import { ChaosLotoOtp } from "@sdcorejs/chaos-ui-react/loto-otp";\n\n<ChaosLotoOtp\n  slots={slots}\n  onChange={({ slots }) => setSlots(slots)}\n  status={status}\n  onSubmit={({ value }) => verify(value)}\n/>`
                      : `// imports: [ReactiveFormsModule, ChaosLotoOtpComponent]\ncontrol = new FormControl<OtpSlots>([], { nonNullable: true });\n\n<chaos-loto-otp\n  [formControl]="control"\n  [status]="status()"\n  (sdSubmit)="verify($event.value)"\n/>`
                    : selected === 1
                      ? framework === "React"
                        ? `import { InfinityOtp } from "@sdcorejs/chaos-ui-react/infinity-otp";\n\n<InfinityOtp\n  slots={slots}\n  onChange={({ slots }) => setSlots(slots)}\n  status={status}\n  onSubmit={({ value }) => verify(value)}\n/>`
                        : `// imports: [ReactiveFormsModule, ChaosInfinityOtpComponent]\ncontrol = new FormControl<OtpSlots>([], { nonNullable: true });\n\n<chaos-infinity-otp\n  [formControl]="control"\n  [status]="status()"\n  (sdSubmit)="verify($event.value)"\n/>`
                      : volumeCode}
                </code>
              </pre>
              <p>Client-side interaction · Typed events · One shared core</p>
            </div>
          </div>
        </section>
        <section id="docs" className="docs">
          <div>
            <p className="eyebrow">MADE TO BE USED</p>
            <h2>
              Bring your own app.
              <br />
              We’ll bring the nonsense.
            </h2>
            <p>
              Lit Web Components at the center. Thin React and Angular adapters
              around them. No mandatory watermark, no heavyweight game engine.
            </p>
          </div>
          <div className="doc-links">
            {[
              ["Loto OTP · API & examples", lotoDocumentation],
              ["Infinity OTP · API & examples", infinityDocumentation],
              ["Volume Gym · API & examples", volumeDocumentation],
              ["Architecture & support", architecture],
              ["Author a component", authoring],
              ["Packaging & release", release],
            ].map(([title, body]) => (
              <details key={title}>
                <summary>{title}</summary>
                <pre>{body}</pre>
              </details>
            ))}
            <p>
              Loto OTP, Infinity OTP and Volume Gym are ready to try. npm packages have not
              been published.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <a className="brand" href="#">
          ✳ chaos ui
        </a>
        <p>A little friction. A lot of personality.</p>
        <span>BY SDCOREJS / 2026</span>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
