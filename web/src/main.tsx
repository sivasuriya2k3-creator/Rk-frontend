import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Verify React DOM is available
if (!document) {
  console.error("DOM not available");
  throw new Error("DOM is required");
}

const root = document.getElementById("root");
if (!root) {
  console.error("Root element not found in HTML");
  throw new Error("Root element (#root) not found in HTML");
}

try {
  createRoot(root).render(<App />);
} catch (error) {
  console.error("Failed to render React app:", error);
  root.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h1>Application Error</h1>
        <p>Failed to initialize the application.</p>
        <p style="font-size: 12px; color: #999; margin-top: 20px;">
          ${error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    </div>
  `;
  throw error;
}
