import React from "react";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import { configure } from "mobx";

const container = document.getElementById("root");
const root = createRoot(container!);

configure({
  computedRequiresReaction: true,
  observableRequiresReaction: true,
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
