import { Link } from "react-router-dom";
import {
  Bell,
  CircleUserRound,
  MessageCircleMore,
  Settings,
} from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <div className="brand-logo">S</div>
        <div>
          <div className="brand-name">SignConnect</div>
          <div className="brand-ai">AI COMMUNICATION</div>
        </div>
      </Link>

      <nav className="desktop-nav">
        <Link to="/">Home</Link>
        <Link to="/communicator">Communicate</Link>
        <Link to="/history">History</Link>
        <Link to="/statistics">AI Stats</Link>
      </nav>

      <div className="nav-actions">
        <button className="icon-button">
          <Bell size={19} />
        </button>

        <Link to="/communicator" className="message-button">
          <MessageCircleMore size={19} />
          <span>Live Talk</span>
        </Link>

        <Link to="/profile" className="profile-button">
          <CircleUserRound size={21} />
        </Link>

        <Link to="/settings" className="icon-button settings-icon">
          <Settings size={19} />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
