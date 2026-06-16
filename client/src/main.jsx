import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EstimationProvider } from "./context/EstimationContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <EstimationProvider>
        <App />
      </EstimationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
