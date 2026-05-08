import { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useWalletStore } from '../../stores/wallet.store';
import { formatCurrency } from '../../utils/format';

// ─── Sub-states ───────────────────────────────────────────────────────────────
function ProcessingState() {
  return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%', marginBottom: 24,
        border: '2px solid var(--ink-primary)', borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite',
      }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
        Processando saque...
      </span>
    </div>
  );
}

function SuccessState({ amount, onClose }: { amount: number; onClose: () => void }) {
  return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(234,179,8,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Check size={28} style={{ color: '#eab308' }} strokeWidth={2.5} />
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 8 }}>
        Saque em processamento
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)', marginBottom: 10 }}>
        {formatCurrency(amount)}
      </span>
      <span style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 32 }}>Prazo: até 24h úteis via PIX</span>
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

export function WithdrawModal({ open, onClose }: Props) {
  const [step, setStep]     = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const { availableBalance, withdraw } = useWalletStore();

  const numeric  = parseFloat(amount.replace(',', '.').replace(/[^\d.]/g, '')) || 0;
  const overLimit = numeric > availableBalance;
  const valid    = numeric > 0 && !overLimit;

  const handleConfirm = async () => {
    if (!valid) return;
    setStep('processing');
    await new Promise(r => setTimeout(r, 1600));
    withdraw(numeric);
    setStep('success');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep('form'); setAmount(''); }, 300);
  };

  const setQuickPct = (pct: number) => {
    const val = (availableBalance * pct / 100);
    setAmount(val.toFixed(2));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {step === 'form' && (
        <div style={{ padding: 32 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
            Retirar saldo
          </span>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em', fontWeight: 600, color: 'var(--ink-primary)', marginBottom: 20 }}>
            Sacar
          </h2>

          {/* Available balance banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(20,20,20,0.04)', marginBottom: 20 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              Saldo disponível
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)' }}>
              {formatCurrency(availableBalance)}
            </span>
          </div>

          {/* Amount input */}
          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 8 }}>
            Valor em BRL
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${overLimit ? 'var(--red)' : 'var(--rule)'}`, background: 'rgba(255,255,255,0.50)', marginBottom: overLimit ? 6 : 10, transition: 'border-color 0.15s' }}>
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
          {overLimit && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--red)', marginBottom: 10 }}>
              Valor maior que o saldo disponível
            </p>
          )}

          {/* Quick percentages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
            {[25, 50, 75, 100].map(pct => (
              <button key={pct} onClick={() => setQuickPct(pct)}
                style={{
                  padding: '9px 0', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
                  border: '1.5px solid var(--rule)', background: 'transparent',
                  color: 'var(--ink-primary)', cursor: 'pointer', transition: 'border-color 0.15s',
                }}>
                {pct}%
              </button>
            ))}
          </div>

          {/* PIX info */}
          <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(229,37,26,0.04)', border: '1px solid rgba(229,37,26,0.12)', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Info size={15} style={{ color: 'var(--red-deep)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--red-deep)', display: 'block', marginBottom: 4 }}>
                  Saques via PIX
                </span>
                <span style={{ fontSize: 12, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                  Saques são processados em até 24 horas úteis para a chave PIX cadastrada na sua conta.
                </span>
              </div>
            </div>
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
