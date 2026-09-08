import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";

import Home from "./pages/Home";
import Communicator from "./pages/Communicator";
import SignToVoice from "./pages/SignToVoice";
import VoiceToSign from "./pages/VoiceToSign";
import History from "./pages/History";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated =
    sessionStorage.getItem(
      "signconnect_authenticated"
    );

  if (authenticated !== "true") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/otp"
          element={<OTPVerification />}
        />

        {/* Protected Application */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/communicator"
          element={
            <ProtectedRoute>
              <Communicator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sign-to-voice"
          element={
            <ProtectedRoute>
              <SignToVoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voice-to-sign"
          element={
            <ProtectedRoute>
              <VoiceToSign />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <Emergency />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
