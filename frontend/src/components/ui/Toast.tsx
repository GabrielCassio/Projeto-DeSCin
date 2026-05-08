import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message, title) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, title }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export function toast(type: ToastType, message: string, title?: string) {
  useToastStore.getState().addToast(type, message, title);
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles: Record<ToastType, { icon: string; bg: string }> = {
  success: { icon: 'text-success', bg: 'bg-success/15' },
  error: { icon: 'text-danger', bg: 'bg-danger/15' },
  warning: { icon: 'text-warning', bg: 'bg-warning/15' },
  info: { icon: 'text-info', bg: 'bg-info/15' },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const Icon = icons[toast.type];
  const style = styles[toast.type];

  useEffect(() => {
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div
      className={cn(
        'glass rounded-xl',
        'flex items-start gap-3 p-4',
        'min-w-[320px] max-w-[400px]',
        'shadow-lg border border-border',
        'animate-slide-up'
      )}
    >
      <div className={cn('p-1.5 rounded-lg flex-shrink-0', style.bg)}>
        <Icon size={16} className={style.icon} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className="text-sm font-medium text-text-primary mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-text-secondary">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className={cn(
          'p-1.5 rounded-lg flex-shrink-0',
          'text-text-muted hover:text-text-primary',
          'hover:bg-bg-surface',
          'transition-colors duration-150'
        )}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-toast flex flex-col gap-3 safe-bottom">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          onRemove={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}
