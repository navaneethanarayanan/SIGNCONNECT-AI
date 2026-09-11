import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OTPVerification() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("signconnect_email");

    if (!savedEmail) {
      navigate("/login");
      return;
    }

    setEmail(savedEmail);
  }, [navigate]);

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const correctOtp =
      sessionStorage.getItem("signconnect_demo_otp");

    if (otp === correctOtp) {
      setVerified(true);

      sessionStorage.setItem(
        "signconnect_authenticated",
        "true"
      );

      setTimeout(() => {
        navigate("/home");
      }, 1200);

      return;
    }

    setError("Invalid OTP. Please try again.");
  };

  if (verified) {
    return (
      <div className="otp-page">
        <div className="otp-card success-card">
          <div className="success-icon">✓</div>

          <h1>Verification Successful</h1>

          <p>
            Welcome back! Let's communicate.
          </p>

          <strong>— Jarvis</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-page">
      <div className="otp-card">

        <div className="otp-jarvis">
          🤖
        </div>

        <h1>Verify your OTP</h1>

        <p>
          Hi, I'm Jarvis 👋
        </p>

        <span className="otp-description">
          Enter the verification code sent to
        </span>

        <strong className="otp-email">
          {email}
        </strong>

        <form onSubmit={handleVerify}>

          <input
            className="otp-input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
          />

          {error && (
            <div className="otp-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="otp-button"
          >
            VERIFY OTP
          </button>
        </form>

        <p className="demo-otp">
          Development OTP: <strong>123456</strong>
        </p>

        <button
          className="back-login"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>

      </div>
    </div>
  );
}

export default OTPVerification;
