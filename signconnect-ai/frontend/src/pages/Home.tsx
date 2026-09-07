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
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import AIStatus from "../components/AIStatus";
import CameraPreview from "../components/CameraPreview";

export default function Home() {
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

          <CameraPreview />


          {/* TRANSLATION */}

          <div className="conversation-card">

            <div className="conversation-header">

              <div>
                <span className="section-label">
                  LIVE TRANSLATION
                </span>

                <h3>Conversation</h3>
              </div>

              <div className="language-chip">
                <Languages size={15} />
                EN
              </div>

            </div>


            <div className="conversation-content">

              <div className="message message-sign">

                <div className="message-top">
                  <span>🤟 Sign</span>
                  <small>96%</small>
                </div>

                <p>
                  Hello, how are you?
                </p>

              </div>


              <div className="message message-voice">

                <div className="message-top">
                  <span>🔊 Voice</span>
                  <small>94%</small>
                </div>

                <p>
                  I am doing great!
                </p>

              </div>


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


            <div className="conversation-footer">

              <div className="context-status">
                <Brain size={16} />
                Context-aware AI
              </div>

              <button className="mini-action">
                <RefreshCw size={15} />
              </button>

            </div>

          </div>


          {/* AVATAR */}

          <div className="avatar-card">

            <div className="avatar-card-header">

              <div>
                <span className="section-label">
                  VOICE → SIGN
                </span>

                <h3>ISL Avatar</h3>
              </div>

              <span className="avatar-online">
                ● Ready
              </span>

            </div>


            <div className="avatar-stage">

              <div className="avatar-glow" />

              <div className="avatar-character">

                <div className="avatar-head">
                  <div className="avatar-eye left" />
                  <div className="avatar-eye right" />
                </div>

                <div className="avatar-neck" />

                <div className="avatar-body">

                  <div className="avatar-arm left-arm" />
                  <div className="avatar-arm right-arm" />

                </div>

              </div>

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
