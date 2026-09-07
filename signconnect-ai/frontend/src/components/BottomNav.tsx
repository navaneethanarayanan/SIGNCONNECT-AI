import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageCircle,
  History,
  UserRound,
} from "lucide-react";

function BottomNav() {
  const location = useLocation();

  const items = [
    { path: "/", label: "Home", icon: Home },
    { path: "/communicator", label: "Talk", icon: MessageCircle },
    { path: "/history", label: "History", icon: History },
    { path: "/profile", label: "Profile", icon: UserRound },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={active ? "bottom-item active" : "bottom-item"}
          >
            <Icon size={21} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
