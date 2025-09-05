"use client";

import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useToast } from "./useToast";

export default function NotifyToast() {
  const { toasts, removeToast } = useToast();

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return {
          wrap: "bg-emerald-50 border-emerald-300",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
          text: "text-emerald-800",
        };
      case "error":
        return {
          wrap: "bg-rose-50 border-rose-300",
          icon: <XCircle className="h-5 w-5 text-rose-600" />,
          text: "text-rose-800",
        };
      default:
        return {
          wrap: "bg-indigo-50 border-indigo-300",
          icon: <Info className="h-5 w-5 text-indigo-600" />,
          text: "text-indigo-800",
        };
    }
  };

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[92vw] max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
      {toasts.map((t) => {
        const s = getStyles(t.type);
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg ${s.wrap}`}
          >
            <div className="mt-0.5">{s.icon}</div>
            <div className={`flex-1 text-sm ${s.text}`}>{t.message}</div>
            <button
              aria-label="Close"
              className="rounded-md p-1 text-gray-500 hover:bg-white/60"
              onClick={() => removeToast(t.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
