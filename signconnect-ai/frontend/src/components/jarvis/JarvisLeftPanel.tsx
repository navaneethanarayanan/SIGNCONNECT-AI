import {
  Activity,
  Cpu,
  Gauge,
  Radio,
  ScanEye,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import type { JarvisState } from "../JarvisAvatar";

type JarvisLeftPanelProps = {
  state: JarvisState;
  fps: number;
  confidence: number;
  isCameraActive: boolean;
  onToggleCamera: () => void;
};

type GaugeProps = {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  sub: string;
  active?: boolean;
  accent?: "cyan" | "purple" | "green" | "amber";
};

function StatusItem({
  icon,
  label,
  value,
  sub,
  active,
}: GaugeProps) {
  return (
    <div className={`jarvis-panel-item ${active ? "is-active" : ""}`}>
      <div className="jarvis-panel-item-icon">{icon}</div>
      <div className="jarvis-panel-item-body">
        <span className="jarvis-panel-item-label">{label}</span>
        <div className="jarvis-panel-item-row">
          <strong>{value ?? "—"}</strong>
          <span className="jarvis-panel-item-sub">{sub}</span>
        </div>
      </div>
    </div>
  );
}

function MiniBar({ value }: { value: number }) {
  const bars = 14;
  return (
    <div className="jarvis-minibar" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const height = Math.max(
          12,
          Math.sin((i / bars) * Math.PI) * 100 * Math.max(0.1, value / 100)
        );
        const lit = i / bars <= value / 100;
        return (
          <span
            key={i}
            className={lit ? "lit" : ""}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

function JarvisLeftPanel({
  state,
  fps,
  confidence,
  isCameraActive,
  onToggleCamera,
}: JarvisLeftPanelProps) {
  const active =
    state === "listening" || state === "thinking" || state === "speaking";

  return (
    <aside className="jarvis-left-panel jarvis-panel-glass">
      <div className="jarvis-panel-header">
        <span className="jarvis-panel-title">
          <Activity size={13} />
          SYSTEM STATUS
        </span>
        <span className="jarvis-live-dot" aria-hidden="true" />
      </div>

      <div className="jarvis-panel-body">
        <div className="jarvis-panel-section-label">CORE</div>

        <StatusItem
          icon={<Wifi size={15} />}
          label="Connection"
          value="Secure Link"
          sub={fps >= 30 ? "STABLE" : "FLUCTUATING"}
          active
          accent="cyan"
        />

        <StatusItem
          icon={<Cpu size={15} />}
          label="Neural Core"
          value={active ? "Processing" : "Standby"}
          sub={`${fps.toFixed(0)} FPS`}
          active={active}
          accent="purple"
        />

        <StatusItem
          icon={<Gauge size={15} />}
          label="AI Load"
          value="Low"
          sub={fps > 40 ? "OPTIMAL" : "HEAVY"}
          active
          accent="green"
        />

        <div className="jarvis-panel-section-label jarvis-mt">PIPELINE</div>

        <StatusItem
          icon={<ScanEye size={15} />}
          label="Sign Recognition"
          value={isCameraActive ? "Active" : "Standby"}
          sub={isCameraActive ? "CONTINUOUS" : "AWAITING INPUT"}
          active={isCameraActive}
          accent="cyan"
        />

        <StatusItem
          icon={<Radio size={15} />}
          label="Speech Input"
          value={state === "listening" ? "Listening" : "Ready"}
          sub={fps >= 24 ? "MIC ONLINE" : "MIC STANDBY"}
          active={state === "listening"}
          accent="purple"
        />

        <StatusItem
          icon={<ShieldCheck size={15} />}
          label="Privacy"
          value="Protected"
          sub="ON-DEVICE"
          active
          accent="green"
        />

        <div className="jarvis-panel-section-label jarvis-mt">
          CONFIDENCE
        </div>

        <MiniBar value={confidence} />

        <div className="jarvis-confidence-row">
          <span>Confidence</span>
          <strong>{confidence.toFixed(0)}%</strong>
        </div>

        <div className="jarvis-panel-hint">
          Camera is optional. Start it for sign language recognition,
          or use speech only.
        </div>

        <button
          className={`jarvis-toggle-btn ${isCameraActive ? "active" : ""}`}
          onClick={onToggleCamera}
        >
          <ScanEye size={15} />
          {isCameraActive ? "Camera Active" : "Enable Camera"}
        </button>
      </div>
    </aside>
  );
}

export default JarvisLeftPanel;