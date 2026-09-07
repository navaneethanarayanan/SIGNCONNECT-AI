import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./App.css";

function Avatar({ speaking }) {
  return (
    <group position={[0, -1, 0]}>
      {/* Body */}
      <mesh position={[0, -1.4, 0]}>
        <capsuleGeometry args={[0.65, 1.5, 8, 16]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color="#f2c6a0" />
      </mesh>

      {/* Left Eye */}
      <mesh position={[-0.22, 0.2, 0.58]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Right Eye */}
      <mesh position={[0.22, 0.2, 0.58]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Mouth */}
      <mesh
        position={[0, -0.12, 0.59]}
        scale={speaking ? [1, 1.8, 1] : [1, 0.25, 1]}
      >
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.68, 32, 32]} />
        <meshStandardMaterial color="#171717" />
      </mesh>
    </group>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("sign");
  const [detectedText, setDetectedText] = useState("");
  const [speaking, setSpeaking] = useState(false);

  // Temporary sign detection simulation
  // Later this will be replaced with the actual ISL model.
  const simulateSign = () => {
    setDetectedText("Hello, how are you?");
  };

  const speakText = () => {
    if (!detectedText.trim()) {
      alert("No sign detected yet.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(detectedText);

    speech.lang = "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;

    speech.onstart = () => {
      setSpeaking(true);
    };

    speech.onend = () => {
      setSpeaking(false);
    };

    speech.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>🤟 SignConnect AI</h1>

        <p>
          Indian Sign Language Communication Assistant
        </p>
      </header>

      {/* Navigation */}
      <div className="tabs">

        <button
          className={activeTab === "conversation" ? "tab active" : "tab"}
          onClick={() => setActiveTab("conversation")}
        >
          🗣️ Simultaneous Conversation
        </button>

        <button
          className={activeTab === "sign" ? "tab active" : "tab"}
          onClick={() => setActiveTab("sign")}
        >
          🤟 Sign → Text
        </button>

        <button
          className={activeTab === "voice" ? "tab active" : "tab"}
          onClick={() => setActiveTab("voice")}
        >
          🔊 Sign → Voice
        </button>

      </div>

      {/* Sign To Voice */}
      {activeTab === "voice" && (
        <main className="main">

          <section className="card">

            <div className="section-title">
              <h2>🤟 Sign Language → Voice</h2>

              <span className="status">
                ● Ready
              </span>
            </div>

            <div className="communication-grid">

              {/* Camera */}
              <div className="camera-section">

                <h3>📷 Sign Language Input</h3>

                <div className="camera-box">

                  <div className="camera-icon">
                    📷
                  </div>

                  <p>Camera Preview</p>

                  <small>
                    Your ISL signs will be detected here
                  </small>

                </div>

                <button
                  className="detect-button"
                  onClick={simulateSign}
                >
                  🤟 Detect Sign
                </button>

              </div>

              {/* Text */}
              <div className="text-section">

                <h3>📝 Detected Text</h3>

                <div className="text-box">

                  {detectedText ? (
                    <p>{detectedText}</p>
                  ) : (
                    <span>
                      Waiting for sign language...
                    </span>
                  )}

                </div>

                <button
                  className="voice-button"
                  onClick={speakText}
                  disabled={!detectedText}
                >
                  🔊 Convert to Voice
                </button>

              </div>

            </div>

          </section>

          {/* Avatar */}
          <section className="avatar-card">

            <div className="avatar-header">

              <div>
                <h2>🧑 AI Speaking Avatar</h2>

                <p>
                  {speaking
                    ? "Avatar is speaking..."
                    : "Avatar is ready"}
                </p>
              </div>

              {speaking && (
                <span className="speaking">
                  🔊 Speaking
                </span>
              )}

            </div>

            <div className="avatar-container">

              <Canvas camera={{ position: [0, 0, 5] }}>

                <ambientLight intensity={2} />

                <directionalLight
                  position={[3, 3, 3]}
                  intensity={3}
                />

                <Avatar speaking={speaking} />

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                />

              </Canvas>

            </div>

            {detectedText && (
              <div className="avatar-message">
                <span>🔊</span>

                <p>{detectedText}</p>
              </div>
            )}

          </section>

        </main>
      )}

      {/* Existing Sign To Text */}
      {activeTab === "sign" && (
        <main className="main">

          <section className="card">

            <h2>🤟 Sign Language Input</h2>

            <div className="camera-box">
              📷
              <p>Sign → Text recognition</p>
            </div>

          </section>

        </main>
      )}

      {/* Conversation */}
      {activeTab === "conversation" && (
        <main className="main">

          <section className="card">

            <h2>🗣️ Simultaneous Conversation</h2>

            <p>
              SignConnect AI two-way communication mode.
            </p>

            <div className="flow">
              🤟 Sign
              <span>→</span>
              📝 Text
              <span>→</span>
              🔊 Voice
              <span>→</span>
              🧑 3D Avatar
            </div>

          </section>

        </main>
      )}

    </div>
  );
}

export default App;