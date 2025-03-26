import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "antd-style";
import App from "./App.tsx";

// 获取主颜色
const mainColor = import.meta.env.VITE_MAIN_COLORS.split(",");
console.log(mainColor);
createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    theme={{
      token: {
        colorPrimary: mainColor[0],
      },
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
