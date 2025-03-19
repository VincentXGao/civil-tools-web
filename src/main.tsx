import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "antd-style";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    theme={{
      token: {
        colorPrimary: "#5599ff",
      },
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
