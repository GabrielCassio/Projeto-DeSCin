import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import {
  AuthLayout, AuthInput, AuthCheckbox, AuthSubmitButton,
  AuthDivider, SocialButtons, AuthError, AuthLink,
} from '../../components/auth/AuthLayout';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const clearFieldError = (field: 'email' | 'password') =>
    setFieldErrors((e) => ({ ...e, [field]: undefined }));

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'E-mail inválido';
    if (!password || password.length < 6) errs.password = 'Mínimo 6 caracteres';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result) {
        login(result.user, result.token);
        navigate('/');
      } else {
        setError('E-mail ou senha incorretos');
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: 'google' | 'github') => {
    setError(null);
    setLoadingProvider(provider);
    try {
      const result = await authService.socialLogin(provider);
      login(result.user, result.token);
      navigate('/');
    } catch {
      setError('Erro ao conectar com ' + (provider === 'google' ? 'Google' : 'GitHub'));
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: 'block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--ink-muted)', marginBottom: 10,
        }}>
          Bem-vindo de volta
        </span>
        <h2 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 32, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '-0.02em',
          lineHeight: 1.1, color: 'var(--ink-primary)',
        }}>
          Entrar
        </h2>
      </div>

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <AuthInput
          label="E-mail"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); clearFieldError('email'); }}
          placeholder="seu@email.com"
          autoComplete="email"
          icon={<Mail size={16} />}
          error={fieldErrors.email}
        />

        <AuthInput
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(v) => { setPassword(v); clearFieldError('password'); }}
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<Lock size={16} />}
          error={fieldErrors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--ink-muted)', display: 'flex', alignItems: 'center',
                padding: 0, transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Remember me + Forgot password */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AuthCheckbox
            checked={rememberMe}
            onChange={() => setRememberMe((v) => !v)}
            label="Manter conectado"
          />
          <Link
            to="/recuperar-senha"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 500,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'var(--ink-muted)', textDecoration: 'none',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--red)';
              (e.currentTarget as HTMLElement).style.textDecoration = 'underline';
              (e.currentTarget as HTMLElement).style.textUnderlineOffset = '3px';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)';
              (e.currentTarget as HTMLElement).style.textDecoration = 'none';
            }}
          >
            Esqueceu a senha?
          </Link>
        </div>

        <AuthSubmitButton loading={loading}>Entrar</AuthSubmitButton>
      </form>

      <AuthDivider />

      <SocialButtons
        onGoogle={() => handleSocial('google')}
        onGitHub={() => handleSocial('github')}
        loadingProvider={loadingProvider}
      />

      <p style={{
        textAlign: 'center', marginTop: 28,
        fontSize: 14, color: 'var(--ink-secondary)',
        fontFamily: "'Geist', 'Inter', sans-serif",
      }}>
        Ainda não tem conta?{' '}
        <AuthLink to="/cadastrar">Criar conta</AuthLink>
      </p>
    </AuthLayout>
  );
}
