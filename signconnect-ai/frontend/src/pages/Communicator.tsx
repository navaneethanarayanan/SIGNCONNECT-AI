import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../jarvis.css";
import JarvisAvatar, { type JarvisState } from "../components/JarvisAvatar";
import JarvisBackground from "../components/jarvis/JarvisBackground";
import JarvisHUD from "../components/jarvis/JarvisHUD";
import JarvisLeftPanel from "../components/jarvis/JarvisLeftPanel";
import JarvisRightPanel, {
  type JarvisMessage,
} from "../components/jarvis/JarvisRightPanel";
import JarvisBottomBar from "../components/jarvis/JarvisBottomBar";

type CommsMode = "sign" | "speech" | "text";

function timestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Good to see you. I'm fully synced and ready to assist in any language.",
    "At your service. What shall we communicate today?",
  ],
  thanks: [
    "Happy to help — that's what I'm here for.",
    "Anytime. I'm always on standby.",
  ],
  help: [
    "I can translate sign language to text or voice, convert speech to sign, and handle real-time conversations. Enable the camera for sign recognition, or use the mic for speech.",
    "Here's what I can do: seamless sign-to-voice translation, speech-to-sign output, continuous sentence recognition, and context-aware correction.",
  ],
  weather: [
    "I don't have a live weather feed in this demo, but I can recommend a sign language translation approach for that question.",
  ],
  bye: [
    "Take care. I'll keep the systems warm and ready.",
  ],
};

function pickResponse(input: string): { text: string; correction?: string } {
  const lower = input.toLowerCase();

  if (/(hi|hello|hey|good (morning|afternoon|evening))/i.test(lower)) {
    const text = AI_RESPONSES.greeting[Math.floor(Math.random() * 2)];
    return { text };
  }

  if (/(thank|thanks)/i.test(lower)) {
    return {
      text: AI_RESPONSES.thanks[Math.floor(Math.random() * 2)],
    };
  }

  if (/(help|how do|what can|what are you)/i.test(lower)) {
    return {
      text: AI_RESPONSES.help[Math.floor(Math.random() * 2)],
    };
  }

  if (/(bye|goodbye|see you)/i.test(lower)) {
    return { text: AI_RESPONSES.bye[0] };
  }

  const confidence = Math.round(64 + Math.random() * 22);

  return {
    text:
      confidence > 72
        ? `I understood that transliteration from sign language to text. Interpreting: "${input}" — would you like me to refine the language or adjust the output voice?`
        : `I processed your input and interpreted it as "${input}". Confidence was moderate, so please confirm the intended message and I can correct the translation.`,
    correction:
      confidence <= 72
        ? input.includes(" ")
          ? input.split(" ").slice(0, -1).join(" ") + "?"
          : undefined
        : undefined,
  };
}

const SIGN_GLOSS = [
  "HELLO",
  "THANK YOU",
  "HOW ARE YOU",
  "GOOD MORNING",
  "I NEED HELP",
  "PLEASE",
  "SORRY",
  "WELCOME",
  "YES",
  "NO",
  "WATER",
  "EAT",
  "MOTHER",
  "FATHER",
  "FRIEND",
  "UNDERSTAND",
];

export default function Communicator() {
  const navigate = useNavigate();
  const [state, setState] = useState<JarvisState>("idle");
  const [mode, setMode] = useState<CommsMode>("speech");
  const [isListening, setIsListening] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [confidence, setConfidence] = useState(98);
  const [detectedSign, setDetectedSign] = useState("");
  const [signConfidence, setSignConfidence] = useState(0);
  const [aiResponse, setAiResponse] = useState("");
  const [interimText, setInterimText] = useState("");
  const [messages, setMessages] = useState<JarvisMessage[]>([]);
  const [fps, setFps] = useState(60);

  const messageId = useRef(0);
  const nextId = () => ++messageId.current;

  // Synthetic FPS meter
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.round(48 + Math.random() * 12));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Speech recognition
  const recognitionRef = useRef<{
    start: () => void;
    stop: () => void;
  } | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let finalText = "";
      let temp = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalText += text + " ";
        else temp += text;
      }
      if (finalText) {
        setInterimText("");
        pushUserMessage(finalText.trim(), "voice");
      } else {
        setInterimText(temp);
      }
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushUserMessage = useCallback(
    (text: string, type: "sign" | "voice") => {
      if (!text) return;
      const msgConfidence = Math.round(78 + Math.random() * 21);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          type,
          text,
          confidence: msgConfidence,
          time: timestamp(),
        },
      ]);
      runAI(text);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const runAI = (input: string) => {
    setState("thinking");
    setConfidence(Math.round(72 + Math.random() * 26));

    window.setTimeout(() => {
      const { text, correction } = pickResponse(input);
      setAiResponse(text);
      setState("speaking");
      setConfidence(Math.round(88 + Math.random() * 11));

      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            type: "ai",
            text,
            confidence: Math.round(88 + Math.random() * 11),
            correction,
            time: timestamp(),
          },
        ]);
        setState("idle");
      }, 700);
    }, 1400);
  };

  const handleSendText = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        type: "voice",
        text: clean,
        confidence: 100,
        time: timestamp(),
      },
    ]);
    runAI(clean);
  };

  const handleSpeak = (text: string) => {
    if (!text) return;
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    setState("speaking");
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
      setInterimText("");
      return;
    }
    if (!recognition) {
      pushSystemMessage("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    try {
      recognition.start();
    } catch {
      // Already started — ignore.
    }
  };

  const pushSystemMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), type: "system", text, time: timestamp() },
    ]);
  };

  const handleToggleCamera = () => {
    if (isCameraActive) {
      setIsCameraActive(false);
      setDetectedSign("");
      setSignConfidence(0);
      return;
    }
    setIsCameraActive(true);
    setConfidence(100);
    pushSystemMessage(
      "Camera enabled — sign language recognition is now active."
    );
    startSignSimulation();
  };

  // Simulated sign recognition feed (replace with real MediaPipe pipeline later)
  const signTimer = useRef<number | null>(null);
  const startSignSimulation = () => {
    if (signTimer.current) window.clearInterval(signTimer.current);
    signTimer.current = window.setInterval(() => {
      const mini = Math.random();
      if (mini > 0.55) {
        const sign = SIGN_GLOSS[Math.floor(Math.random() * SIGN_GLOSS.length)];
        const conf = Math.round(80 + Math.random() * 19);
        setDetectedSign(sign);
        setSignConfidence(conf);
        setConfidence(conf);
        pushUserMessage(sign, "sign");
      } else {
        setDetectedSign("");
        setSignConfidence(0);
      }
    }, 7000);
  };

  useEffect(() => {
    return () => {
      if (signTimer.current) window.clearInterval(signTimer.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleModeChange = (next: CommsMode) => {
    setMode(next);
    pushSystemMessage(
      `Mode switched to ${next === "sign" ? "Sign Language" : next === "speech" ? "Speech / Voice" : "Text"}.`
    );
  };

  const avatarState: JarvisState =
    state === "thinking"
      ? "thinking"
      : state === "speaking"
        ? "speaking"
        : isListening
          ? "listening"
          : state;

  return (
    <div className={`jarvis-stage jarvis-state-${avatarState}`}>
      <JarvisBackground state={avatarState} />

      {/* Top HUD header */}
      <header className="jarvis-top-bar">
        <div className="jarvis-top-brand">
          <span className="jarvis-top-logo">S</span>
          <div>
            <strong>SIGNCONNECT</strong>
            <small>AI COMMUNICATION INTERFACE</small>
          </div>
        </div>

        <div className="jarvis-top-center">
          <span className="jarvis-top-pulse" aria-hidden="true" />
          NEURAL LINK ACTIVE
        </div>

        <div className="jarvis-top-meta">
          <span>v3.4.7</span>
          <span>{fps.toFixed(0)} FPS</span>
          <span className="jarvis-top-secure">SECURE</span>
          <button
            className="jarvis-exit-btn"
            onClick={() => navigate("/home")}
            title="Return to home"
          >
            <ArrowLeft size={13} />
            Exit
          </button>
        </div>
      </header>

      {/* Main three-column layout */}
      <main className="jarvis-main">
        <JarvisLeftPanel
          state={avatarState}
          fps={fps}
          confidence={confidence}
          isCameraActive={isCameraActive}
          onToggleCamera={handleToggleCamera}
        />

        {/* Center avatar */}
        <section className="jarvis-center">
          <JarvisHUD
            state={avatarState}
            confidence={confidence}
            fps={fps}
            isListening={isListening}
            isCameraActive={isCameraActive}
          />

          <div className="jarvis-center-frame">
            <JarvisAvatar active={isListening || state !== "idle"} state={avatarState} />
          </div>

          <div className="jarvis-center-caption">
            <span className="jarvis-caption-name">JARVIS</span>
            <span className="jarvis-caption-sub">SENTIENT AI ASSISTANT</span>
          </div>
        </section>

        <JarvisRightPanel
          state={avatarState}
          messages={messages}
          interimText={interimText}
          isListening={isListening}
          onSendText={handleSendText}
          onSpeak={handleSpeak}
          onToggleListening={toggleListening}
          detectedSign={detectedSign}
          signConfidence={signConfidence}
        />
      </main>

      <JarvisBottomBar
        state={avatarState}
        mode={mode}
        isListening={isListening}
        isCameraActive={isCameraActive}
        aiResponse={aiResponse}
        onModeChange={handleModeChange}
        onToggleListening={toggleListening}
        onToggleCamera={handleToggleCamera}
        onSpeak={handleSpeak}
      />
    </div>
  );
}