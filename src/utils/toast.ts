/**
 * Lightweight, elegant toast helper that dispatches custom events to a global toast listener.
 * This decouples components from App.tsx while allowing simple triggers anywhere.
 */

export interface ToastConfig {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export function showToast(message: string, type: "success" | "error" | "info" = "success", duration = 4000) {
  const toastEvent = new CustomEvent("raceboy-toast", {
    detail: {
      message,
      type,
      duration,
    },
  });
  window.dispatchEvent(toastEvent);
}
