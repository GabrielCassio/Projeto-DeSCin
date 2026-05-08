import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import {
  AuthLayout, AuthInput, AuthSubmitButton, AuthError,
} from '../../components/auth/AuthLayout';
import { authService } from '../../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();

  const validate = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setFieldError('E-mail inválido');
      return false;
    }
    setFieldError(undefined);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout kicker="Recuperação de acesso">
        {/* Success state */}
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          {/* Check icon */}
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.10)',
            border: '1.5px solid rgba(34, 197, 94, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span style={{
            display: 'block',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 500,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--ink-muted)', marginBottom: 10,
          }}>
            E-mail enviado
          </span>

          <h2 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 28, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '-0.02em',
            lineHeight: 1.15, color: 'var(--ink-primary)',
            marginBottom: 20,
          }}>
            Verifique sua<br />caixa de entrada
          </h2>

          <p style={{
            fontSize: 15, lineHeight: 1.65,
            color: 'var(--ink-secondary)',
            fontFamily: "'Geist', 'Inter', sans-serif",
            marginBottom: 40,
            maxWidth: 320, margin: '0 auto 40px',
          }}>
            Enviamos um link de recuperação para{' '}
            <strong style={{ color: 'var(--ink-primary)', fontWeight: 600 }}>{email}</strong>.
            Verifique também a pasta de spam.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              style={{
                width: '100%', height: 52,
                background: 'var(--ink-primary)',
                color: 'var(--bg-form)',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                borderRadius: 12, border: 'none', cursor: 'pointer',
                transition: 'background 200ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ink-primary)'; }}
            >
              Reenviar e-mail
            </button>

            <Link
              to="/login"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, height: 48,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'var(--ink-muted)', textDecoration: 'none',
                transition: 'color 150ms ease',
                border: '1.5px solid var(--rule)', borderRadius: 12,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)';
              }}
            >
              <ArrowLeft size={14} />
              Voltar para login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout kicker="Recuperação de acesso">
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: 'block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--ink-muted)', marginBottom: 10,
        }}>
          Esqueceu a senha?
        </span>
        <h2 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 30, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '-0.02em',
          lineHeight: 1.1, color: 'var(--ink-primary)',
          marginBottom: 14,
        }}>
          Recuperar acesso
        </h2>
        <p style={{
          fontSize: 14, lineHeight: 1.6,
          color: 'var(--ink-secondary)',
          fontFamily: "'Geist', 'Inter', sans-serif",
        }}>
          Insira seu e-mail para receber um link de redefinição de senha.
        </p>
      </div>

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AuthInput
          label="E-mail"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); setFieldError(undefined); }}
          placeholder="seu@email.com"
          autoComplete="email"
          icon={<Mail size={16} />}
          error={fieldError}
        />

        <AuthSubmitButton loading={loading}>Enviar link de recuperação</AuthSubmitButton>
      </form>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
        <Link
          to="/login"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 500,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--ink-muted)', textDecoration: 'none',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
        >
          <ArrowLeft size={14} />
          Voltar para login
        </Link>
      </div>
    </AuthLayout>
  );
}
