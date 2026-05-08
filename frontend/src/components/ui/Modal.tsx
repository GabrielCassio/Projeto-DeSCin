import { useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './Button';

// ─── Base Modal ───────────────────────────────────────────────────────────────
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

const MAX_WIDTHS: Record<string, number> = {
  sm: 440, md: 520, lg: 720, xl: 960,
};

export function Modal({
  open, title, description, onClose, children,
  footer, size = 'md', showClose = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', h);
    };
  }, [open, onClose]);

  const hasHeader = !!title || showClose;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10, 10, 10, 0.52)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          }} />

          {/* Card */}
          <motion.div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: MAX_WIDTHS[size] ?? 520,
              background: 'rgba(248, 248, 245, 0.88)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.55)',
              boxShadow: [
                'inset 0 1.5px 0 rgba(255,255,255,0.90)',
                '0 2px 0 rgba(20,20,20,0.04)',
                '0 24px 80px rgba(10,10,10,0.22)',
                '0 8px 24px rgba(10,10,10,0.12)',
              ].join(', '),
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.93, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button — always floats top-right */}
            {showClose && (
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: 16, right: 16, zIndex: 10,
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(20,20,20,0.07)',
                  border: '1px solid rgba(20,20,20,0.07)',
                  cursor: 'pointer', color: 'var(--ink-muted)',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(20,20,20,0.14)';
                  e.currentTarget.style.color = 'var(--ink-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(20,20,20,0.07)';
                  e.currentTarget.style.color = 'var(--ink-muted)';
                }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}

            {/* Optional header with title */}
            {title && (
              <div style={{
                padding: '22px 52px 18px 24px',
                borderBottom: '1px solid rgba(20,20,20,0.07)',
              }}>
                <h2 style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--ink-primary)',
                  marginBottom: description ? 4 : 0,
                }}>
                  {title}
                </h2>
                {description && (
                  <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Body — padding only when we have a title header, else zero */}
            <div style={{ padding: hasHeader && title ? '20px 24px' : 0 }}>
              {children}
            </div>

            {/* Optional footer */}
            {footer && (
              <div style={{
                padding: '0 24px 22px',
                display: 'flex', gap: 10, justifyContent: 'flex-end',
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
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
  open, title, description, onClose, onConfirm,
  loading = false, confirmText = 'Confirmar', cancelText = 'Cancelar',
  variant = 'primary', children,
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
