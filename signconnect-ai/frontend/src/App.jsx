import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [activeMode, setActiveMode] = useState("conversation");

  const [language, setLanguage] = useState("English");
  const [confidence, setConfidence] = useState(94);
  const [detectedSign, setDetectedSign] = useState("HELLO");

  const [messages, setMessages] = useState([
    {
      type: "sign",
      text: "Hello, how are you?",
      time: "11:08 AM",
    },
    {
      type: "speech",
      text: "I'm doing great!",
      time: "11:08 AM",
    },
  ]);

  const [quickPhrases] = useState([
    "Hello",
    "Thank you",
    "Please wait",
    "I need help",
    "Yes",
    "No",
    "Where is the hospital?",
  ]);

  // Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
    } catch (error) {
      alert("Camera permission is required.");
      console.error(error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  // Demo AI recognition
  const detectSign = () => {
    const signs = [
      "HELLO",
      "THANK YOU",
      "HOW ARE YOU",
      "YES",
      "NO",
      "HELP",
    ];

    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const randomConfidence = Math.floor(Math.random() * 20) + 80;

    setDetectedSign(randomSign);
    setConfidence(randomConfidence);

    const newMessage = {
      type: "sign",
      text: randomSign,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Speech recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language === "Tamil" ? "ta-IN" : "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setMessages((prev) => [
        ...prev,
        {
          type: "speech",
          text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  // Text to speech
  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported.");
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = language === "Tamil" ? "ta-IN" : "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // Quick phrase
  const sendQuickPhrase = (phrase) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "speech",
        text: phrase,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    speakText(phrase);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">🤟</div>

          <div>
            <h2>SignConnect AI</h2>
            <span>Accessible Communication</span>
          </div>
        </div>

        <div className="nav-right">
          <div className="system-status">
            <span className="status-dot"></span>
            System Ready
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Tamil</option>
          </select>

          <button className="icon-button">⚙️</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="badge">
            ✨ AI POWERED COMMUNICATION
          </div>

          <h1>
            Breaking
            <span> Communication </span>
            Barriers
          </h1>

          <p>
            Real-time sign language and speech translation
            designed for seamless communication.
          </p>
        </div>
      </section>

      {/* MODE SWITCHER */}
      <section className="mode-container">
        <button
          className={activeMode === "conversation" ? "mode active" : "mode"}
          onClick={() => setActiveMode("conversation")}
        >
          🗣️ Simultaneous Conversation
        </button>

        <button
          className={activeMode === "sign" ? "mode active" : "mode"}
          onClick={() => setActiveMode("sign")}
        >
          🤟 Sign → Text
        </button>

        <button
          className={activeMode === "speech" ? "mode active" : "mode"}
          onClick={() => setActiveMode("speech")}
        >
          🎙️ Speech → Text
        </button>
      </section>

      {/* MAIN */}
      <main className="dashboard">

        {/* LEFT */}
        <section className="left-column">

          {/* CAMERA */}
          <div className="card camera-card">

            <div className="card-header">
              <div>
                <h3>🤟 Sign Language Input</h3>
                <p>Live gesture recognition</p>
              </div>

              <div className={cameraOn ? "live active-live" : "live"}>
                <span></span>
                {cameraOn ? "LIVE" : "OFF"}
              </div>
            </div>

            <div className="camera-container">

              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="camera-placeholder">
                  <div className="camera-icon">📷</div>
                  <h3>Camera is Off</h3>
                  <p>
                    Enable your camera to start recognizing
                    sign language.
                  </p>
                </div>
              )}

              {cameraOn && (
                <div className="camera-overlay">

                  <div className="tracking-box"></div>

                  <div className="person-badge">
                    👤 Person 1
                  </div>

                </div>
              )}

            </div>

            <div className="camera-controls">

              {!cameraOn ? (
                <button
                  className="primary-button"
                  onClick={startCamera}
                >
                  📷 Start Camera
                </button>
              ) : (
                <button
                  className="danger-button"
                  onClick={stopCamera}
                >
                  ⏹ Stop Camera
                </button>
              )}

              <button
                className="secondary-button"
                onClick={detectSign}
                disabled={!cameraOn}
              >
                🤖 Detect Sign
              </button>

            </div>
          </div>

          {/* AI DETECTION */}
          <div className="card detection-card">

            <div className="card-header">
              <div>
                <h3>🧠 AI Detection</h3>
                <p>Real-time recognition result</p>
              </div>

              <span className="ai-badge">
                AI ACTIVE
              </span>
            </div>

            <div className="detected-word">
              <span>Detected Sign</span>
              <strong>{detectedSign}</strong>
            </div>

            <div className="confidence">

              <div className="confidence-top">
                <span>Confidence</span>
                <strong>{confidence}%</strong>
              </div>

              <div className="progress">
                <div
                  style={{
                    width: `${confidence}%`,
                  }}
                ></div>
              </div>

              {confidence >= 80 ? (
                <p className="success">
                  ✓ High confidence recognition
                </p>
              ) : (
                <p className="warning">
                  ⚠️ Unclear sign. Please repeat.
                </p>
              )}

            </div>
          </div>

        </section>

        {/* RIGHT */}
        <section className="right-column">

          {/* SPEECH */}
          <div className="card speech-card">

            <div className="card-header">
              <div>
                <h3>🎙️ Speech Input</h3>
                <p>Speak naturally</p>
              </div>

              <div className={listening ? "listening" : "mic-status"}>
                {listening ? "Listening..." : "Ready"}
              </div>
            </div>

            <button
              className={listening ? "mic-button listening-button" : "mic-button"}
              onClick={startListening}
            >
              🎙️
            </button>

            <p className="mic-text">
              {listening
                ? "Listening to your voice..."
                : "Tap to speak"}
            </p>

          </div>

          {/* CONVERSATION */}
          <div className="card conversation-card">

            <div className="card-header">

              <div>
                <h3>🗣️ Live Conversation</h3>
                <p>Bidirectional communication</p>
              </div>

              <button
                className="clear-button"
                onClick={clearConversation}
              >
                Clear
              </button>

            </div>

            <div className="messages">

              {messages.length === 0 && (
                <div className="empty">
                  Conversation is empty
                </div>
              )}

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={
                    message.type === "sign"
                      ? "message sign-message"
                      : "message speech-message"
                  }
                >

                  <div className="message-top">

                    <span>
                      {message.type === "sign"
                        ? "🤟 Signer"
                        : "🎙️ Speaker"}
                    </span>

                    <small>{message.time}</small>

                  </div>

                  <p>{message.text}</p>

                  <button
                    className="speak-button"
                    onClick={() => speakText(message.text)}
                  >
                    🔊 Speak
                  </button>

                </div>

              ))}

            </div>

          </div>

        </section>
      </main>

      {/* QUICK PHRASES */}
      <section className="quick-section">

        <div className="section-title">
          <div>
            <h2>⚡ Quick Communication</h2>
            <p>Frequently used phrases</p>
          </div>
        </div>

        <div className="phrases">

          {quickPhrases.map((phrase) => (

            <button
              key={phrase}
              onClick={() => sendQuickPhrase(phrase)}
              className="phrase"
            >
              {phrase}
            </button>

          ))}

        </div>

      </section>

      {/* FEATURES */}
      <section className="features">

        <div className="feature">
          <span>👥</span>
          <div>
            <strong>Multi-Person Detection</strong>
            <p>Track active signer</p>
          </div>
        </div>

        <div className="feature">
          <span>🧠</span>
          <div>
            <strong>Context Aware</strong>
            <p>Understands conversation flow</p>
          </div>
        </div>

        <div className="feature">
          <span>🔐</span>
          <div>
            <strong>Privacy Mode</strong>
            <p>Local processing ready</p>
          </div>
        </div>

        <div className="feature">
          <span>📶</span>
          <div>
            <strong>AI Status</strong>
            <p>Online and operational</p>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer>
        <div>
          🤟 <strong>SignConnect AI</strong>
          <span> — Communication without barriers.</span>
        </div>

        <div>
          ♿ Accessible &nbsp; • &nbsp; 🔐 Privacy Focused
        </div>
      </footer>

    </div>
  );
}

export default App;