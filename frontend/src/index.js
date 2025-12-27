import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UploadsContextProvider } from "./context/ContactContext";
import "./index.css";

// Set page background using public/ path to avoid webpack resolving the image at build time.
try {
  const bgUrl = '/backgrounds/uploading.jpg';

  const applyBackground = (mode = 'light') => {
    const overlay = mode === 'dark' ? 'linear-gradient(rgba(10,12,20,0.6), rgba(10,12,20,0.45))' : 'linear-gradient(rgba(255,255,255,0.6), rgba(247,248,252,0.35))';
    document.body.style.backgroundImage = `${overlay}, url("${bgUrl}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    if (mode === 'dark') {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
    } else {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
    }
  };

  // expose theme controls for components to call
  window.setTheme = (mode) => {
    try {
      localStorage.setItem('site-theme', mode);
    } catch (e) {}
    applyBackground(mode);
  };
  window.toggleTheme = () => {
    const current = localStorage.getItem('site-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    window.setTheme(next);
    const ev = new Event('site-theme-changed');
    window.dispatchEvent(ev);
  };

  // initialize
  const initial = (localStorage.getItem('site-theme') || 'light');
  applyBackground(initial);
} catch (e) {
  // ignore in non-browser environments
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UploadsContextProvider>
      <App />
    </UploadsContextProvider>
  </React.StrictMode>
);
