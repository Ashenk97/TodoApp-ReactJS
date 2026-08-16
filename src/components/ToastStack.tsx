import { Check } from 'lucide-react';
import type { Toast } from '../types';

type ToastStackProps = {
  toasts: Toast[];
  onDismiss: (id: string) => void;
};

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 grid gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/12 bg-[#171b33]/95 px-4 py-3 shadow-xl shadow-black/30 animate-[rise_0.25s_ease]"
        >
          <span className="grid size-8 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
            <Check className="size-4" />
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="sr-only"
          >
            Dismiss notification
          </button>
        </div>
      ))}
    </div>
  );
}
