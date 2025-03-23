import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global CSS variables for theme colors
const style = document.createElement('style');
style.textContent = `
  :root {
    --app-dark: #121212;
    --app-dark-lighter: #1E1E1E;
    --app-dark-card: #262626;
    --app-accent-red: #ff6b6b;
    --app-accent-orange: #ffb86c;
    --app-accent-green: #4cf977;
    --app-text: #E5E7EB;
    --app-text-dimmed: #9CA3AF;
  }

  @keyframes loaderWhite {
    100% {
      background-position: calc(100% / 3) 0;
    }
  }

  @keyframes loaderColor {
    100% {
      background-position: calc(100% / 3) 0;
    }
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--app-dark);
    color: var(--app-text);
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
