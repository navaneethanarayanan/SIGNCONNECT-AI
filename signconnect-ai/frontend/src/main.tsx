import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Both App.jsx and App.tsx exist in this project. Import the routed TypeScript
// app explicitly so Vite does not select the legacy App.jsx dashboard.
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
