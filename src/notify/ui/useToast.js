"use client";

import { useEffect, useRef, useState } from "react";

// Mặc định nghe event "app:notify" từ utils/notify.js
const EVENT_NAME = "app:notify";
const DEFAULT_DURATION = 2600;

export function useToast() {
  const [toasts, setToasts] = useState([]); // {id,type,message}
  const timersRef = useRef(new Map());

  useEffect(() => {
    const handler = (e) => {
      const {
        type = "info",
        message = "",
        duration = DEFAULT_DURATION,
      } = e.detail || {};
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message }]);

      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      timersRef.current.set(id, timer);
    };

    window.addEventListener(EVENT_NAME, handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      // clear all timers
      timersRef.current.forEach((t) => clearTimeout(t));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timersRef.current.clear();
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
  };

  const clearAll = () => {
    setToasts([]);
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
  };

  return { toasts, removeToast, clearAll };
}
