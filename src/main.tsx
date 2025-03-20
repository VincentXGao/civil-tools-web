import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "antd-style";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    theme={{
      token: {
        colorPrimary: "#886441",
      },
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
