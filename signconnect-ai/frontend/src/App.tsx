import {
  ArrowRight,
  Brain,
  Camera,
  Languages,
  MessageCircle,
  Mic,
  ShieldCheck,
  Users,
  WifiOff,
} from "lucide-react";

function App() {
  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">🤟</div>
          <div>
            <strong>SignConnect</strong>
            <span>AI</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#communication">Communication</a>
          <a href="#features">Features</a>
        </div>

        <button className="nav-button">
          Start Communication
          <ArrowRight size={16} />
        </button>
      </nav>

      {/* HERO */}
      <main>
        <section id="home" className="hero">
          <div className="hero-badge">
            <span className="pulse" />
            AI-POWERED INDIAN SIGN LANGUAGE
          </div>

          <h1>
            Communication
            <br />
            <span>without barriers.</span>
          </h1>

          <p>
            SignConnect AI connects Indian Sign Language,
            speech and text in real time — making
            communication easier for everyone.
          </p>

          <div className="hero-buttons">
            <button className="primary-button">
              <MessageCircle size={18} />
              Start Communication
              <ArrowRight size={17} />
            </button>

            <button className="secondary-button">
              <Camera size={18} />
              Try Sign Recognition
            </button>
          </div>

          <div className="hero-status">
            <span className="online-dot" />
            AI Online
            <span>•</span>
            Indian Sign Language
            <span>•</span>
            Real-time AI
            <span>•</span>
            Privacy First
          </div>
        </section>

        {/* COMMUNICATION */}
        <section id="communication" className="section">
          <div className="section-title">
            <span>LIVE COMMUNICATION</span>
            <h2>
              Sign, speak,
              <br />
              <em>connect naturally.</em>
            </h2>
            <p>
              Communicate naturally using sign language,
              speech and AI-powered translation.
            </p>
          </div>

          <div className="communication-grid">

            {/* CAMERA */}
            <div className="card camera-card">
              <div className="card-header">
                <div>
                  <small>SIGN LANGUAGE INPUT</small>
                  <h3>Person A</h3>
                </div>

                <div className="live">
                  <span />
                  READY
                </div>
              </div>

              <div className="camera-area">
                <div className="camera-icon">
                  <Camera size={42} />
                </div>

                <h3>Start your camera</h3>

                <p>
                  Position your hands and face inside
                  the camera view for sign recognition.
                </p>

                <button className="camera-button">
                  <Camera size={17} />
                  Enable Camera
                </button>
              </div>

              <div className="camera-footer">
                <div>
                  <small>Recognition</small>
                  <strong>Continuous</strong>
                </div>

                <div>
                  <small>People</small>
                  <strong>Auto Detect</strong>
                </div>

                <div>
                  <small>Privacy</small>
                  <strong>Protected</strong>
                </div>
              </div>
            </div>

            {/* CONVERSATION */}
            <div className="card conversation-card">
              <div className="card-header">
                <div>
                  <small>LIVE TRANSLATION</small>
                  <h3>Conversation</h3>
                </div>

                <div className="language">
                  <Languages size={15} />
                  EN
                </div>
              </div>

              <div className="messages">

                <div className="message sign-message">
                  <div className="message-top">
                    <span>🤟 Sign</span>
                    <b>96%</b>
                  </div>

                  <p>Hello, how are you?</p>
                </div>

                <div className="message voice-message">
                  <div className="message-top">
                    <span>🔊 Voice</span>
                    <b>94%</b>
                  </div>

                  <p>I am doing great!</p>
                </div>

                <div className="recognition">
                  <div className="waves">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  <div>
                    <strong>Continuous recognition</strong>
                    <small>
                      AI is listening for the next sign...
                    </small>
                  </div>
                </div>
              </div>

              <div className="context">
                <Brain size={16} />
                Context-aware AI
              </div>
            </div>

            {/* AVATAR */}
            <div className="card avatar-card">
              <div className="card-header">
                <div>
                  <small>VOICE → SIGN</small>
                  <h3>ISL Avatar</h3>
                </div>

                <div className="avatar-ready">
                  ● Ready
                </div>
              </div>

              <div className="avatar-area">
                <div className="avatar-glow" />

                <div className="avatar">
                  <div className="avatar-head">
                    <div className="eyes">
                      <span />
                      <span />
                    </div>
                  </div>

                  <div className="neck" />

                  <div className="body">
                    <div className="arm left" />
                    <div className="arm right" />
                  </div>
                </div>
              </div>

              <div className="avatar-info">
                <div>
                  <small>Language</small>
                  <strong>Indian Sign Language</strong>
                </div>

                <div>
                  <small>Mode</small>
                  <strong>Voice → Sign</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MODES */}
        <section className="section">
          <div className="section-title">
            <span>COMMUNICATION MODES</span>

            <h2>
              Choose how you
              <br />
              <em>want to communicate.</em>
            </h2>
          </div>

          <div className="mode-grid">

            <div className="mode-card">
              <div className="mode-icon">🤟</div>

              <small>CAMERA + AI</small>

              <h3>Sign → Voice</h3>

              <p>
                Use your camera and sign naturally.
                AI recognizes your signs, forms
                sentences and speaks them.
              </p>

              <button>
                Start recognition
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mode-card">
              <div className="mode-icon">🎙️</div>

              <small>SPEECH + AVATAR</small>

              <h3>Voice → Sign</h3>

              <p>
                Speak naturally. Speech is converted
                into sign language through the
                SignConnect avatar.
              </p>

              <button>
                Start voice mode
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="section">
          <div className="section-title center">
            <span>INTELLIGENT COMMUNICATION</span>

            <h2>
              Built for real
              <br />
              <em>conversations.</em>
            </h2>

            <p>
              SignConnect goes beyond recognizing
              individual gestures. It understands
              the conversation.
            </p>
          </div>

          <div className="feature-grid">

            <Feature
              icon={<MessageCircle />}
              title="Simultaneous Communication"
              text="Sign and speech can happen naturally during the same conversation."
              tag="CORE FEATURE"
            />

            <Feature
              icon={<Brain />}
              title="Context-Aware AI"
              text="Conversation context helps AI produce more meaningful translations."
            />

            <Feature
              icon={<Users />}
              title="Multi-Person Detection"
              text="Detect and track multiple people during a conversation."
            />

            <Feature
              icon={<Languages />}
              title="Multilingual Support"
              text="Translate ISL communication into English, Tamil and other languages."
            />

            <Feature
              icon={<WifiOff />}
              title="Offline Mode"
              text="Essential communication remains available with limited internet."
              tag="LOW INTERNET"
            />

            <Feature
              icon={<ShieldCheck />}
              title="Privacy First"
              text="Camera and conversation data should remain protected."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div>
            <span>SIGNCONNECT AI</span>

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

          <button className="primary-button">
            Start Communication
            <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer>
        <strong>SignConnect AI</strong>
        <span>AI-powered Indian Sign Language communication</span>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
  tag,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tag?: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      {tag && <span className="feature-tag">{tag}</span>}
    </div>
  );
}

export default App;
