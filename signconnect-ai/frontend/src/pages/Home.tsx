import { lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  Languages,
  MessageCircle,
  Mic,
  ShieldCheck,
  Users,
  WifiOff,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  Volume2,
} from "lucide-react";

import { Link } from "react-router-dom";

import AIStatus from "../components/AIStatus";
import CameraPreview from "../components/CameraPreview";

const JarvisAvatar = lazy(() => import("../components/JarvisAvatar"));

const languageSettings = {
  English: { speechLanguage: "en-IN" },
  Tamil: { speechLanguage: "ta-IN" },
  Telugu: { speechLanguage: "te-IN" },
  Hindi: { speechLanguage: "hi-IN" },
} as const;

function createOfflineReply(message: string, language: keyof typeof languageSettings) {
  const normalizedMessage = message.toLowerCase();

  if (/\b(hi|hello|hey)\b/.test(normalizedMessage)) {
    return language === "Tamil"
      ? "வணக்கம்! நான் Jarvis. உங்களுக்கு எப்படி உதவலாம்?"
      : language === "Telugu"
        ? "నమస్కారం! నేను Jarvis. నేను మీకు ఎలా సహాయం చేయగలను?"
        : language === "Hindi"
          ? "नमस्ते! मैं Jarvis हूँ। मैं आपकी कैसे मदद कर सकता हूँ?"
          : "Hello! I am Jarvis. How can I help you communicate today?";
  }

  if (/\b(help|emergency|hospital)\b/.test(normalizedMessage)) {
    return language === "Tamil"
      ? "நான் உங்களுடன் இருக்கிறேன். அவசரநிலையில், உடனடியாக உள்ளூர் அவசர உதவியைத் தொடர்புகொள்ளுங்கள் அல்லது அருகில் இருப்பவரிடம் உதவி கேளுங்கள்."
      : language === "Telugu"
        ? "నేను మీతో ఉన్నాను. అత్యవసర పరిస్థితిలో స్థానిక అత్యవసర సేవలను సంప్రదించండి లేదా సమీపంలో ఉన్నవారిని వెంటనే సహాయం అడగండి."
        : language === "Hindi"
          ? "मैं आपके साथ हूँ। आपात स्थिति में स्थानीय आपातकालीन सेवा से संपर्क करें या पास के किसी व्यक्ति से तुरंत मदद मांगें।"
          : "I am here with you. For an emergency, contact your local emergency service or ask someone nearby for immediate help.";
  }

  return language === "Tamil"
    ? `நீங்கள் கூறியது: “${message}”. Jarvis தற்போது இணையமற்ற டெமோ முறையில் இயங்குகிறது. முழுமையான உரையாடலுக்கு பின்னர் AI பின்னணிச் சேவையைச் சேர்க்கலாம்.`
    : language === "Telugu"
      ? `మీరు చెప్పింది: “${message}”. Jarvis ప్రస్తుతం ఆఫ్‌లైన్ డెమో మోడ్‌లో నడుస్తోంది. పూర్తి సంభాషణ కోసం తర్వాత AI బ్యాకెండ్‌ను జోడించవచ్చు.`
      : language === "Hindi"
        ? `आपने कहा: “${message}”। Jarvis अभी ऑफ़लाइन डेमो मोड में चल रहा है। पूरी बातचीत के लिए बाद में AI बैकएंड जोड़ा जा सकता है।`
        : `I heard: “${message}”. Jarvis is running in offline demo mode, so add an AI backend later for a full conversation.`;
}

export default function Home() {
  const [language, setLanguage] = useState("English");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "sign",
      label: "🤟 Sign input",
      text: "Waiting for a recognized sign...",
      detail: "Camera",
    },
  ]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = (message: string) => {
    if (!("speechSynthesis" in window)) return;

    const speech = new SpeechSynthesisUtterance(message);
    const speechLanguage = languageSettings[language as keyof typeof languageSettings].speechLanguage;
    const matchingLanguageVoices = voices.filter((voice) =>
      voice.lang.toLowerCase().startsWith(speechLanguage.slice(0, 2).toLowerCase())
    );
    const preferredVoice =
      matchingLanguageVoices[0] ??
      voices.find((voice) => voice.default);

    speech.lang = speechLanguage;
    if (preferredVoice) speech.voice = preferredVoice;
    // A slower, lower-pitched system voice gives Jarvis a futuristic AI tone.
    speech.rate = 0.88;
    speech.pitch = 0.55;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const sendText = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = textInput.trim();
    if (!message) return;

    const userMessage = { id: Date.now(), type: "text", label: "⌨️ You", text: message, detail: "Text" };
    const chatHistory = [...messages, userMessage]
      .filter((item) => item.type !== "sign" || item.detail === "Recognized")
      .map((item) => ({
        role: item.type === "jarvis" ? "assistant" : "user",
        content: item.text,
      }));

    setMessages((current) => [...current, userMessage]);
    setTextInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, messages: chatHistory }),
      });
      const result = await response.json() as { reply?: string; error?: string };
      const reply = result.reply;
      if (!response.ok || !reply) {
        throw new Error(
          result.error ||
          "Jarvis could not reply. Add OPENAI_API_KEY to frontend/.env and restart the development server."
        );
      }

      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, type: "jarvis", label: "🔊 Jarvis", text: reply, detail: "AI reply" },
      ]);
      speak(reply);
    } catch (error) {
      const offlineReply = createOfflineReply(message, language as keyof typeof languageSettings);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: "jarvis",
          label: "🔊 Jarvis",
          text: offlineReply,
          detail: "Offline demo",
        },
      ]);
      speak(offlineReply);
    } finally {
      setIsSending(false);
    }
  };

  // Camera sign-recognition model will call this once it is connected.
  const handleSignRecognized = (sign: string) => {
    setMessages((current) => [
      ...current,
      { id: Date.now(), type: "sign", label: "🤟 Sign input", text: sign, detail: "Recognized" },
    ]);
  };

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-badge">
          <span className="pulse-dot" />
          AI-POWERED INDIAN SIGN LANGUAGE
        </div>

        <h1>
          Communication
          <br />
          <span>without barriers.</span>
        </h1>

        <p className="hero-text">
          SignConnect AI connects Indian Sign Language,
          speech and text in real time — making
          communication easier for everyone.
        </p>

        <div className="hero-actions">

          <Link
            to="/communicator"
            className="primary-btn"
          >
            <MessageCircle size={18} />
            Start Communication
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/sign-to-voice"
            className="secondary-btn"
          >
            Try Sign Recognition
          </Link>

        </div>

        <div className="hero-info">

          <AIStatus />

          <span>Indian Sign Language</span>

          <span className="info-dot">•</span>

          <span>Real-time AI</span>

          <span className="info-dot">•</span>

          <span>Privacy First</span>

        </div>

      </section>


      {/* ================= LIVE COMMUNICATION ================= */}

      <section className="home-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              LIVE COMMUNICATION
            </span>

            <h2>
              Sign, speak,
              <br />
              <span>connect naturally.</span>
            </h2>

            <p>
              SignConnect translates communication
              between sign language and speech in real time.
            </p>
          </div>

          <div className="live-ai-status">
            <AIStatus />
            <span>AI engine ready</span>
          </div>

        </div>


        <div className="communication-grid">

          {/* CAMERA */}

          <CameraPreview onSignRecognized={handleSignRecognized} />


          {/* TRANSLATION */}

          <div className="conversation-card">

            <div className="conversation-header">

              <div>
                <span className="section-label">
                  LIVE TRANSLATION
                </span>

                <h3>Conversation</h3>
              </div>

              <label className="language-chip">
                <Languages size={15} />
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  aria-label="Translation language"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </label>

            </div>


            <div className="conversation-content">

              {messages.map((message) => (
                <div key={message.id} className={`message message-${message.type}`}>
                  <div className="message-top">
                    <span>{message.label}</span>
                    <small>{message.detail}</small>
                  </div>
                  <p>{message.text}</p>
                </div>
              ))}


              <div className="recognition-status">

                <div className="recognition-animation">
                  <span />
                  <span />
                  <span />
                </div>

                <div>
                  <strong>Continuous recognition</strong>
                  <small>
                    AI is listening for the next sign...
                  </small>
                </div>

              </div>

            </div>

            <form className="text-composer" onSubmit={sendText}>
              <input
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Type a message for Jarvis..."
                aria-label="Message for Jarvis"
              />
              <button type="submit" aria-label="Send message" disabled={isSending}>
                <Send size={16} />
              </button>
            </form>


            <div className="conversation-footer">

              <div className="context-status">
                <Brain size={16} />
                Context-aware AI
              </div>

              <div className="conversation-actions">
                <button
                  className="mini-action"
                  onClick={() => {
                    const lastReply = [...messages].reverse().find((message) => message.type === "jarvis");
                    if (lastReply) speak(lastReply.text);
                  }}
                  title="Repeat Jarvis reply"
                  aria-label="Repeat Jarvis reply"
                >
                  <Volume2 size={15} />
                </button>
                <button
                  className="mini-action clear-chat-button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setMessages([]);
                  }}
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
              </div>

            </div>

          </div>


          {/* AVATAR */}

          <div className="avatar-card">

            <div className="avatar-card-header">

              <div>
                <span className="section-label">
                  VOICE → SIGN
                </span>

                <h3>Jarvis</h3>
              </div>

              <span className="avatar-online">
                ● Ready
              </span>

            </div>


            <div className="avatar-stage">
              <Suspense fallback={<div className="avatar-loading">Loading Jarvis…</div>}>
                <JarvisAvatar active={isSending} />
              </Suspense>
              <span className="avatar-3d-hint">Drag to explore Jarvis</span>

            </div>


            <div className="avatar-caption">

              <div>
                <span>Language</span>
                <strong>Indian Sign Language</strong>
              </div>

              <div>
                <span>Mode</span>
                <strong>Voice → Sign</strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= QUICK MODES ================= */}

      <section className="home-section">

        <div className="section-heading-simple">

          <div>
            <span className="section-label">
              COMMUNICATION MODES
            </span>

            <h2>
              Choose how you
              <br />
              <span>want to communicate.</span>
            </h2>
          </div>

        </div>


        <div className="mode-grid">

          <Link
            to="/sign-to-voice"
            className="mode-card sign-mode"
          >

            <div className="mode-icon">
              🤟
            </div>

            <div className="mode-content">

              <span className="mode-label">
                CAMERA + AI
              </span>

              <h3>Sign → Voice</h3>

              <p>
                Use your camera. Sign naturally.
                SignConnect recognizes your signs,
                forms sentences and speaks them.
              </p>

              <span className="mode-link">
                Start recognition
                <ArrowRight size={16} />
              </span>

            </div>

          </Link>


          <Link
            to="/voice-to-sign"
            className="mode-card voice-mode"
          >

            <div className="mode-icon">
              🎙️
            </div>

            <div className="mode-content">

              <span className="mode-label">
                SPEECH + AVATAR
              </span>

              <h3>Voice → Sign</h3>

              <p>
                Speak naturally. Speech is converted
                into sign language through the
                SignConnect 3D avatar.
              </p>

              <span className="mode-link">
                Start voice mode
                <ArrowRight size={16} />
              </span>

            </div>

          </Link>

        </div>

      </section>


      {/* ================= AI FEATURES ================= */}

      <section className="home-section">

        <div className="section-heading-simple centered-heading">

          <span className="section-label">
            INTELLIGENT COMMUNICATION
          </span>

          <h2>
            Built for real
            <br />
            <span>conversations.</span>
          </h2>

          <p>
            SignConnect goes beyond recognizing individual
            gestures. It understands the conversation.
          </p>

        </div>


        <div className="feature-grid">

          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <MessageCircle />
            </div>

            <h3>Simultaneous Communication</h3>

            <p>
              Sign and speech can happen naturally
              during the same conversation.
            </p>

            <span className="feature-tag">
              CORE FEATURE
            </span>

          </div>


          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <RefreshCw />
            </div>

            <h3>Continuous Recognition</h3>

            <p>
              Recognize sign sequences continuously
              instead of stopping after every gesture.
            </p>

          </div>


          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <Users />
            </div>

            <h3>Multi-Person Detection</h3>

            <p>
              Detect and track multiple people
              during a conversation.
            </p>

          </div>


          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <Brain />
            </div>

            <h3>Context-Aware AI</h3>

            <p>
              Conversation context helps AI produce
              more meaningful translations.
            </p>

          </div>


          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <Languages />
            </div>

            <h3>Multilingual Support</h3>

            <p>
              Translate ISL communication into
              English, Tamil and other languages.
            </p>

          </div>


          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <WifiOff />
            </div>

            <h3>Offline Mode</h3>

            <p>
              Essential communication remains
              available even with limited internet.
            </p>

            <span className="feature-tag">
              LOW INTERNET
            </span>

          </div>


          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <ShieldCheck />
            </div>

            <h3>Privacy First</h3>

            <p>
              Your camera and conversation data
              should remain protected.
            </p>

          </div>


          <div className="ai-feature-card">

            <div className="ai-feature-icon">
              <Sparkles />
            </div>

            <h3>Smart AI Assistance</h3>

            <p>
              AI continuously improves the conversation
              experience with confidence-aware results.
            </p>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="home-cta">

        <div className="cta-content">

          <span className="section-label">
            SIGNCONNECT AI
          </span>

          <h2>
            Everyone deserves
            <br />
            to be understood.
          </h2>

          <p>
            Start a real-time communication session
            and experience barrier-free communication.
          </p>

        </div>

        <Link
          to="/communicator"
          className="primary-btn"
        >
          Start Communication
          <ArrowRight size={18} />
        </Link>

      </section>

    </div>
  );
}
