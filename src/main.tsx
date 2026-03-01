import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import posthog from "posthog-js";

// ── Analytics: PostHog ─────────────────────────────────────────────────────
// SUPUESTO: la key está disponible en el env. Si no, PostHog no inicializa
// y el producto sigue funcionando (fail silencioso, no bloquea el flujo).
// HACK: usamos capture_pageview automático para no perder sesiones que
// nunca llegan al wizard — así detectamos drop-off desde la landing.
if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
  });
}

createRoot(document.getElementById("root")!).render(<App />);