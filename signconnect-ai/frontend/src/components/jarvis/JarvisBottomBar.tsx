import { AudioLines, Hand, Mic, MicOff, Radio, Type, Volume2 } from "lucide-react";
import type { JarvisState } from "../JarvisAvatar";

type Mode = "sign" | "speech" | "text";

type JarvisBottomBarProps = {
  state: JarvisState;
  mode: Mode;
  isListening: boolean;
  isCameraActive: boolean;
  aiResponse: string;
  onModeChange: (mode: Mode) => void;
  onToggleListening: () => void;
  onToggleCamera: () => void;
  onSpeak: (text: string) => void;
};

const stateLabel: Record<JarvisState, string> = {
  idle: "STANDBY",
  listening: "LISTENING",
  thinking: "PROCESSING",
  speaking: "SPEAKING",
  error: "ATTENTION",
};

function JarvisBottomBar({
  state,
  mode,
  isListening,
  isCameraActive,
  aiResponse,
  onModeChange,
  onToggleListening,
  onToggleCamera,
  onSpeak,
}: JarvisBottomBarProps) {
  return (
    <footer className="jarvis-bottom-bar">
      <div className="jarvis-bottom-left">
        <div className="jarvis-mode-tabs">
          <button
            className={mode === "sign" ? "active" : ""}
            onClick={() => onModeChange("sign")}
            title="Sign language mode"
          >
            <Hand size={15} />
            Sign
          </button>
          <button
            className={mode === "speech" ? "active" : ""}
            onClick={() => onModeChange("speech")}
            title="Speech mode"
          >
            <AudioLines size={15} />
            Voice
          </button>
          <button
            className={mode === "text" ? "active" : ""}
            onClick={() => onModeChange("text")}
            title="Text mode"
          >
            <Type size={15} />
            Text
          </button>
        </div>

        <button
          className={`jarvis-cam-toggle ${isCameraActive ? "active" : ""}`}
          onClick={onToggleCamera}
          title="Toggle camera"
        >
          <Radio size={15} />
          <span>{isCameraActive ? "Camera On" : "Camera Off"}</span>
        </button>
      </div>

      {/* Center mic + status */}
      <div className="jarvis-bottom-center">
        <div className={`jarvis-state-label jarvis-state-${state}`}>
          <span className="jarvis-state-dot" aria-hidden="true" />
          {stateLabel[state]}
        </div>

        <button
          className={`jarvis-mic-btn ${isListening ? "active" : ""}`}
          onClick={onToggleListening}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        <button
          className="jarvis-speak-btn"
          onClick={() => onSpeak(aiResponse)}
          disabled={!aiResponse}
          title="Speak the AI response"
        >
          <Volume2 size={17} />
        </button>
      </div>

      <div className="jarvis-bottom-right">
        <span className="jarvis-bottom-meta">ENG</span>
        <span className="jarvis-bottom-meta">REAL-TIME</span>
        {aiResponse ? (
          <div className="jarvis-response">
            <span className="jarvis-response-label">JARVIS:</span>
            <p className="jarvis-response-text">{aiResponse}</p>
          </div>
        ) : (
          <div className="jarvis-response jarvis-response-empty">
            <p>Awaiting your message…</p>
          </div>
        )}
      </div>
    </footer>
  );
}

export default JarvisBottomBar;