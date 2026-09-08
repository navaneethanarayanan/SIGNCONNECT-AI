import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Temporary local-development OTP flow.
    // Real email OTP will be connected through the backend later.
    sessionStorage.setItem("signconnect_email", email);
    sessionStorage.setItem("signconnect_demo_otp", "123456");

    navigate("/otp");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT PANEL */}
        <div className="login-welcome">
          <div className="welcome-decoration decoration-one" />
          <div className="welcome-decoration decoration-two" />
          <div className="welcome-decoration decoration-three" />

          <div className="jarvis-content">
            <div className="jarvis-icon">🤖</div>

            <p className="jarvis-small">SIGNCONNECT AI</p>

            <h1>
              Hi, I'm
              <br />
              <span>Jarvis</span>
            </h1>

            <p className="jarvis-description">
              Your AI assistant for accessible
              communication.
            </p>

            <div className="jarvis-status">
              <span />
              AI Assistant Ready
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-form-panel">
          <div className="login-logo">
            <div className="login-logo-icon">🤟</div>

            <h2>SignConnect AI</h2>

            <p>Accessible Communication</p>
          </div>

          <div className="login-heading">
            <h3>LOGIN</h3>
            <p>Welcome back! Let's communicate.</p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="login-input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-options">
              <button
                type="button"
                className="forgot-password"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
            >
              LOGIN
            </button>
          </form>

          <div className="login-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button type="button">
              <span>G</span>
              Google
            </button>

            <button type="button">
              <span>✉</span>
              Email
            </button>
          </div>

          <div className="login-security">
            🔐 Your communication is protected
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
