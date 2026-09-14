import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  AudioLines,
  BrainCircuit,
  CheckCheck,
  Hand,
  Languages,
  MessageSquareText,
  Mic,
  Sparkles,
  Volume2,
} from "lucide-react";
import type { JarvisState } from "../JarvisAvatar";

export type JarvisMessage = {
  id: number;
  type: "sign" | "voice" | "ai" | "system";
  text: string;
  confidence?: number;
  correction?: string;
  time: string;
};

type JarvisRightPanelProps = {
  state: JarvisState;
  messages: JarvisMessage[];
  interimText: string;
  isListening: boolean;
  onSendText: (text: string) => void;
  onSpeak: (text: string) => void;
  onToggleListening: () => void;
  detectedSign: string;
  signConfidence: number;
};

const stateHints: Record<JarvisState, string> = {
  idle: "Awaiting input — use the microphone, camera, or type a message.",
  listening: "Listening… speak clearly, or sign when the camera is active.",
  thinking: "Processing context and preparing the most accurate response…",
  speaking: "Speaking the response aloud with natural voice output.",
  error: "Attention needed — review the message below.",
};

function typeIcon(type: JarvisMessage["type"]) {
  switch (type) {
    case "sign":
      return <Hand size={13} />;
    case "voice":
      return <Mic size={13} />;
    case "ai":
      return <BrainCircuit size={13} />;
    default:
      return <Sparkles size={13} />;
  }
}

function typeLabel(type: JarvisMessage["type"]) {
  switch (type) {
    case "sign":
      return "SIGN";
    case "voice":
      return "VOICE";
    case "ai":
      return "JARVIS";
    default:
      return "SYSTEM";
  }
}

function JarvisRightPanel({
  state,
  messages,
  interimText,
  isListening,
  onSendText,
  onSpeak,
  onToggleListening,
  detectedSign,
  signConfidence,
}: JarvisRightPanelProps) {
  const [textDraft, setTextDraft] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, interimText]);

  const submit = () => {
    const value = textDraft.trim();
    if (!value) return;
    onSendText(value);
    setTextDraft("");
  };

  return (
    <aside className="jarvis-right-panel jarvis-panel-glass">
      <div className="jarvis-panel-header">
        <span className="jarvis-panel-title">
          <MessageSquareText size={13} />
          AI CONVERSATION
        </span>
        {isListening && (
          <span className="jarvis-listen-badge">
            <AudioLines size={11} />
            LIVE
          </span>
        )}
      </div>

      {/* Detected info strip */}
      <div className="jarvis-detected-strip">
        <div className="jarvis-detected-label">
          <Languages size={12} />
          DETECTED
        </div>
        <div className="jarvis-detected-value">
          {detectedSign ? (
            <>
              <span>{detectedSign}</span>
              <small>{signConfidence.toFixed(0)}% conf</small>
            </>
          ) : (
            <>
              <span>Awaiting sign / speech</span>
              <small>camera or mic</small>
            </>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className="jarvis-chat-list" ref={chatScrollRef}>
        {messages.length === 0 && (
          <div className="jarvis-chat-empty">
            <div className="jarvis-chat-empty-icon">
              <Sparkles size={18} />
            </div>
            <p>Start a conversation with your hands or your voice.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`jarvis-msg jarvis-msg-${message.type}`}>
            <div className="jarvis-msg-top">
              <span className="jarvis-msg-type">{typeIcon(message.type)} {typeLabel(message.type)}</span>
              <span className="jarvis-msg-time">{message.time}</span>
            </div>

            <p className="jarvis-msg-text">{message.text}</p>

            {message.confidence !== undefined && (
              <div className="jarvis-msg-meta">
                <span className="jarvis-msg-confidence">
                  {message.confidence >= 85 ? (
                    <CheckCheck size={12} />
                  ) : (
                    <AlertTriangle size={12} />
                  )}
                  {message.confidence >= 85 ? "High" : "Medium"} confidence ·{" "}
                  {message.confidence.toFixed(0)}%
                </span>
              </div>
            )}

            {message.correction && (
              <div className="jarvis-msg-correction">
                <AlertTriangle size={12} />
                <span>
                  Did you mean: <strong>{message.correction}</strong>?
                </span>
                <button onClick={() => onSendText(message.correction!)}>
                  Use
                </button>
              </div>
            )}
          </div>
        ))}

        {interimText && isListening && (
          <div className="jarvis-msg jarvis-msg-interim">
            <div className="jarvis-msg-top">
              <span className="jarvis-msg-type">
                <Mic size={13} /> LISTENING
              </span>
              <span className="jarvis-msg-time">now</span>
            </div>
            <p className="jarvis-msg-text">
              {interimText}
              <span className="jarvis-cursor" aria-hidden="true" />
            </p>
          </div>
        )}
      </div>

      {/* State hint */}
      <div className={`jarvis-state-hint jarvis-hint-${state}`}>
        <span className="jarvis-state-hint-dot" aria-hidden="true" />
        {stateHints[state]}
      </div>

      {/* Composer */}
      <div className="jarvis-composer">
        <input
          value={textDraft}
          onChange={(event) => setTextDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder="Type a message to Jarvis…"
          aria-label="Type a message"
        />

        <button
          className="jarvis-composer-send"
          onClick={submit}
          title="Send text"
          disabled={!textDraft.trim()}
        >
          Send
        </button>

        <button
          className={`jarvis-composer-mic ${isListening ? "active" : ""}`}
          onClick={onToggleListening}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          <Mic size={16} />
        </button>

        <button
          className="jarvis-composer-speak"
          onClick={() =>
            onSpeak(
              messages
                .filter((m) => m.type === "ai")
                .slice(-1)[0]?.text ?? ""
            )
          }
          title="Speak last AI response"
          disabled={
            !messages.some((m) => m.type === "ai") ||
            state !== "idle"
          }
        >
          <Volume2 size={16} />
        </button>
      </div>
    </aside>
  );
}

export default JarvisRightPanel;