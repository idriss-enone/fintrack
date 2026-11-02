import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{ style: { fontSize: "14px" } }}
          />
          <App />
        </AuthProvider>

    </BrowserRouter>
  </StrictMode>,
);
