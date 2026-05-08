import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'md',
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          'absolute inset-0',
          'bg-black/70 backdrop-blur-sm',
          'animate-fade-in'
        )}
      />

      <div
        className={cn(
          'relative w-full',
          'bg-bg-elevated',
          'rounded-2xl border border-border',
          'shadow-xl',
          'animate-scale-in',
          sizeClasses[size]
        )}
        onClick={e => e.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between px-6 py-5 border-b border-border-subtle">
            <div className="flex-1 min-w-0 pr-4">
              {title && (
                <h2 className="font-semibold text-lg text-text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-text-tertiary">{description}</p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className={cn(
                  'p-2 -mr-2 -mt-1 rounded-lg flex-shrink-0',
                  'text-text-muted hover:text-text-primary',
                  'hover:bg-bg-surface',
                  'transition-all duration-150'
                )}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="px-6 pb-6 pt-2 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
  children: ReactNode;
}

export function ConfirmModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  loading = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  children,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
