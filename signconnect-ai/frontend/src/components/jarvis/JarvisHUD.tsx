import { AudioLines, Cpu, ScanEye, Signal, Wifi } from "lucide-react";
import type { JarvisState } from "../JarvisAvatar";

type JarvisHUDProps = {
  state: JarvisState;
  confidence: number;
  fps: number;
  isListening: boolean;
  isCameraActive: boolean;
};

type HudBadgeProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "cyan" | "purple" | "green" | "amber";
};

function HudBadge({ icon, label, value, tone }: HudBadgeProps) {
  return (
    <div className={`jarvis-hud-badge hud-tone-${tone}`}>
      <span className="jarvis-hud-badge-icon">{icon}</span>
      <div className="jarvis-hud-badge-text">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function JarvisHUD({
  state,
  confidence,
  fps,
  isListening,
  isCameraActive,
}: JarvisHUDProps) {
  const processing = state === "thinking";

  return (
    <div className="jarvis-hud" aria-hidden="true">
      {/* Digital rings */}
      <div className={`jarvis-ring jarvis-ring-outer ring-${state}`} />
      <div className="jarvis-ring jarvis-ring-mid" />
      <div className={`jarvis-ring jarvis-ring-inner ${processing ? "processing" : ""}`} />

      {/* Orbit sweeps */}
      <div className={`jarvis-orbit jarvis-orbit-a ${processing ? "active" : ""}`}>
        <span />
      </div>
      <div className={`jarvis-orbit jarvis-orbit-b ${processing ? "active" : ""}`}>
        <span />
      </div>

      {/* Floating indicator badges */}
      <div className="jarvis-hud-badge-tl">
        <HudBadge
          icon={<Cpu size={13} />}
          label="AI Processing"
          value={processing ? "ACTIVE" : "IDLE"}
          tone={processing ? "purple" : "cyan"}
        />
      </div>

      <div className="jarvis-hud-badge-tr">
        <HudBadge
          icon={<Signal size={13} />}
          label="Confidence"
          value={`${confidence.toFixed(0)}%`}
          tone="green"
        />
      </div>

      <div className="jarvis-hud-badge-bl">
        <HudBadge
          icon={<Wifi size={13} />}
          label="Link"
          value={fps >= 24 ? "STABLE" : "WEAK"}
          tone="cyan"
        />
      </div>

      <div className="jarvis-hud-badge-br">
        <HudBadge
          icon={isListening ? <AudioLines size={13} /> : <ScanEye size={13} />}
          label={isListening ? "Listening" : "Recognition"}
          value={
            isListening
              ? "ON AIR"
              : isCameraActive
                ? "SCANNING"
                : "STANDBY"
          }
          tone={isListening ? "amber" : "cyan"}
        />
      </div>

      {/* Corner brackets around avatar */}
      <div className="jarvis-bracket jarvis-bracket-tl" />
      <div className="jarvis-bracket jarvis-bracket-tr" />
      <div className="jarvis-bracket jarvis-bracket-bl" />
      <div className="jarvis-bracket jarvis-bracket-br" />
    </div>
  );
}

export default JarvisHUD;