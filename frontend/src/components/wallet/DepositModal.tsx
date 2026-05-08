import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useWalletStore } from '../../stores/wallet.store';
import { formatCurrency } from '../../utils/format';

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

// ─── Sub-states ───────────────────────────────────────────────────────────────
function PaymentMethodOption({
  selected, onClick, label, sublabel, badge,
}: {
  selected: boolean; onClick: () => void;
  label: string; sublabel: string; badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderRadius: 12,
        border: `1.5px solid ${selected ? 'var(--ink-primary)' : 'var(--rule)'}`,
        background: selected ? 'rgba(255,255,255,0.70)' : 'transparent',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-primary)' }}>
            {label}
          </span>
          {badge && (
            <span style={{ padding: '2px 6px', borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(229,37,26,0.10)', color: 'var(--red-deep)' }}>
              {badge}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: 'var(--ink-secondary)', display: 'block', marginTop: 2 }}>
          {sublabel}
        </span>
      </div>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${selected ? 'var(--ink-primary)' : 'var(--rule)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ink-primary)' }} />}
      </div>
    </button>
  );
}

function ProcessingState() {
  return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%', marginBottom: 24,
        border: '2px solid var(--ink-primary)', borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite',
      }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
        Processando depósito...
      </span>
    </div>
  );
}

function SuccessState({ amount, onClose }: { amount: number; onClose: () => void }) {
  return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Check size={28} style={{ color: '#22c55e' }} strokeWidth={2.5} />
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 8 }}>
        Depósito confirmado
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)', marginBottom: 32 }}>
        {formatCurrency(amount)}
      </span>
      <button onClick={onClose}
        style={{
          padding: '12px 32px', borderRadius: 12, fontSize: 13, fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em',
          background: 'var(--ink-primary)', color: 'var(--bg-form)', border: 'none', cursor: 'pointer',
        }}>
        Concluir
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void; }
type Step = 'form' | 'processing' | 'success';

export function DepositModal({ open, onClose }: Props) {
  const [step, setStep]     = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'pix' | 'bank'>('pix');
  const { deposit } = useWalletStore();

  const numeric = parseFloat(amount.replace(',', '.').replace(/[^\d.]/g, '')) || 0;
  const valid   = numeric > 0;

  const handleConfirm = async () => {
    if (!valid) return;
    setStep('processing');
    await new Promise(r => setTimeout(r, 1600));
    deposit(numeric, method);
    setStep('success');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep('form'); setAmount(''); setMethod('pix'); }, 300);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {step === 'form' && (
        <div style={{ padding: 32 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
            Adicionar saldo
          </span>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em', fontWeight: 600, color: 'var(--ink-primary)', marginBottom: 28 }}>
            Depositar
          </h2>

          {/* Amount input */}
          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 8 }}>
            Valor em BRL
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.50)', marginBottom: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, color: 'var(--ink-muted)' }}>R$</span>
            <input
              type="text" inputMode="decimal" value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^0-9,.]/g, ''))}
              placeholder="0,00" autoFocus
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600,
                fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)',
              }}
            />
          </div>

          {/* Quick amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
            {QUICK_AMOUNTS.map(v => (
              <button key={v} onClick={() => setAmount(String(v))}
                style={{
                  padding: '9px 0', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
                  border: `1.5px solid ${numeric === v ? 'var(--ink-primary)' : 'var(--rule)'}`,
                  background: numeric === v ? 'rgba(255,255,255,0.70)' : 'transparent',
                  color: 'var(--ink-primary)', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                R$ {v}
              </button>
            ))}
          </div>

          {/* Payment method */}
          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 10 }}>
            Forma de pagamento
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            <PaymentMethodOption selected={method === 'pix'} onClick={() => setMethod('pix')} label="PIX" sublabel="Confirmação imediata" badge="Recomendado" />
            <PaymentMethodOption selected={method === 'bank'} onClick={() => setMethod('bank')} label="Transferência bancária" sublabel="1 a 2 dias úteis" />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleClose}
              style={{ flex: 1, padding: '12px 0', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'transparent', border: '1.5px solid var(--rule)', color: 'var(--ink-secondary)', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={handleConfirm} disabled={!valid}
              style={{
                flex: 2, padding: '12px 0', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                background: valid ? 'var(--ink-primary)' : 'rgba(10,10,10,0.20)',
                color: 'var(--bg-form)', border: 'none',
                cursor: valid ? 'pointer' : 'not-allowed', transition: 'background 0.15s',
              }}>
              Confirmar
            </button>
          </div>
        </div>
      )}
      {step === 'processing' && <ProcessingState />}
      {step === 'success'    && <SuccessState amount={numeric} onClose={handleClose} />}
    </Modal>
  );
}
