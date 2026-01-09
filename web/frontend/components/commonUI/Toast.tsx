import React, { useEffect, useRef } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useUI } from "../../contexts/ui.context";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI();
  const app = useAppBridge();
  const processed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!app || toasts.length === 0) return;

    const newToasts = toasts.filter((t) => !processed.current.has(t.id));
    newToasts.forEach((t) => {
      processed.current.add(t.id);
      app.toast?.show(t.content, {
        duration: t.duration || 5000,
        isError: t.error,
      });
      // Remove asynchronously to avoid re-entrancy during the same effect
      setTimeout(() => removeToast(t.id), 0);
    });
  }, [toasts, app, removeToast]);

  return null;
};

export default ToastContainer;