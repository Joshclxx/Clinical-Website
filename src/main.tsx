import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/dm-sans";
import { MotionConfig } from "motion/react";
import App from "./App";
import "./styles.css";
import "./reference-home.css";
import "./one-page.css";

const root = document.getElementById("root");
if (!root) throw new Error("Application root is missing.");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
