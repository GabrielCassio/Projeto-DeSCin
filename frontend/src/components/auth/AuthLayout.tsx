import { type ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Shared types ──────────────────────────────────────────────────────────
export interface AuthInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  icon: ReactNode;
  rightElement?: ReactNode;
  error?: string;
  disabled?: boolean;
}

// ─── Brand wordmark ────────────────────────────────────────────────────────
export function WordMark({ size = 16 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: size,
        letterSpacing: '0.08em',
        color: 'var(--ink-primary)',
        textTransform: 'uppercase',
        userSelect: 'none',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      desc
      <span style={{ position: 'relative', display: 'inline-block' }}>
        i
        <svg
          width="7" height="7" viewBox="0 0 7 7"
          style={{
            position: 'absolute',
            top: -3,
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(0 0 3px var(--red-glow))',
          }}
        >
          <rect width="7" height="7" fill="var(--red)" />
        </svg>
      </span>
      n
    </span>
  );
}

// ─── SVG animated curves ───────────────────────────────────────────────────
const DASH = 2500;

function BrandCurves() {
  return (
    <>
      <style>{`
        @keyframes drawCurve {
          from { stroke-dashoffset: ${DASH}; opacity: 0; }
          to   { stroke-dashoffset: 0;       opacity: 1; }
        }
        .auth-curve { stroke-dasharray: ${DASH}; stroke-dashoffset: ${DASH}; animation: drawCurve 1800ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .auth-c0 { animation-delay: 200ms; }
        .auth-c1 { animation-delay: 350ms; }
        .auth-c2 { animation-delay: 500ms; }
        .auth-c3 { animation-delay: 650ms; }
        .auth-c4 { animation-delay: 800ms; }
      `}</style>
      <svg
        viewBox="0 0 800 1000"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <filter id="authBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <g filter="url(#authBlur)" fill="none" strokeLinecap="round">
          <path className="auth-curve auth-c0" d="M -50 850 Q 200 700, 400 500 T 850 100" stroke="#E5251A" strokeOpacity="0.85" strokeWidth="3" />
          <path className="auth-curve auth-c1" d="M -50 870 Q 220 720, 420 520 T 870 120" stroke="#E5251A" strokeOpacity="0.55" strokeWidth="2" />
          <path className="auth-curve auth-c2" d="M -50 830 Q 180 680, 380 480 T 830 80"  stroke="#FFFFFF"  strokeOpacity="0.70" strokeWidth="2" />
          <path className="auth-curve auth-c3" d="M -50 890 Q 240 740, 440 540 T 890 140" stroke="#E5251A" strokeOpacity="0.35" strokeWidth="1.5" />
          <path className="auth-curve auth-c4" d="M -50 810 Q 160 660, 360 460 T 810 60"  stroke="#FFFFFF"  strokeOpacity="0.40" strokeWidth="1.5" />
        </g>
      </svg>
    </>
  );
}

// ─── Google icon SVG ───────────────────────────────────────────────────────
export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

// ─── Custom input ──────────────────────────────────────────────────────────
export function AuthInput({ label, type, value, onChange, placeholder, autoComplete, icon, rightElement, error, disabled }: AuthInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: error ? 'var(--red)' : 'var(--ink-muted)',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: error ? 'var(--red)' : focused ? 'var(--ink-secondary)' : 'var(--ink-muted)',
          display: 'flex',
          pointerEvents: 'none',
          transition: 'color 200ms ease',
        }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: 52,
            paddingLeft: 44,
            paddingRight: rightElement ? 44 : 16,
            background: focused ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.40)',
            border: `1.5px solid ${error ? 'var(--red)' : focused ? 'var(--ink-primary)' : 'var(--rule)'}`,
            borderRadius: 12,
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--ink-primary)',
            outline: 'none',
            transition: 'border-color 200ms ease, background 200ms ease',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        {rightElement && (
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.08em',
          color: 'var(--red)',
          textTransform: 'uppercase',
        }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Custom checkbox ───────────────────────────────────────────────────────
export function AuthCheckbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string | ReactNode }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <span style={{
        width: 16,
        height: 16,
        border: `1.5px solid ${checked ? 'var(--ink-primary)' : 'var(--rule)'}`,
        borderRadius: 4,
        background: checked ? 'var(--ink-primary)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 150ms ease, border-color 150ms ease',
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)',
        textAlign: 'left',
      }}>
        {label}
      </span>
    </button>
  );
}

// ─── Submit button ─────────────────────────────────────────────────────────
export function AuthSubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        height: 52,
        marginTop: 8,
        background: loading ? '#3a3a3a' : 'var(--ink-primary)',
        color: 'var(--bg-form)',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        borderRadius: 12,
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        transition: 'background 200ms ease, transform 100ms ease',
      }}
      onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; }}
      onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--ink-primary)'; }}
      onMouseDown={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'scale(0.99)'; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
    >
      {loading ? (
        <>
          Aguarde...
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 1s linear infinite' }}>
            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
            <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </>
      ) : children}
    </button>
  );
}

// ─── OR divider ────────────────────────────────────────────────────────────
export function AuthDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)',
        whiteSpace: 'nowrap',
      }}>
        ou continue com
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
    </div>
  );
}

// ─── Social buttons ────────────────────────────────────────────────────────
interface SocialButtonsProps {
  onGoogle: () => void;
  onGitHub: () => void;
  loadingProvider: 'google' | 'github' | null;
}

export function SocialButtons({ onGoogle, onGitHub, loadingProvider }: SocialButtonsProps) {
  const btn = (label: string, icon: ReactNode, onClick: () => void, loading: boolean) => (
    <button
      type="button"
      onClick={onClick}
      disabled={loadingProvider !== null}
      style={{
        flex: 1,
        height: 48,
        background: loading ? 'rgba(10,10,10,0.04)' : 'transparent',
        border: `1.5px solid ${loading ? 'var(--ink-primary)' : 'var(--rule)'}`,
        borderRadius: 12,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--ink-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        cursor: loadingProvider !== null ? 'not-allowed' : 'pointer',
        transition: 'border-color 200ms ease, background 200ms ease',
        opacity: loadingProvider !== null && !loading ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!loadingProvider) {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--ink-primary)';
          el.style.background = 'rgba(10,10,10,0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!loadingProvider) {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--rule)';
          el.style.background = 'transparent';
        }
      }}
    >
      {loading ? (
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : icon}
      {loading ? 'Conectando...' : label}
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {btn('Google', <GoogleIcon />, onGoogle, loadingProvider === 'google')}
      {btn('GitHub', <GitHubIcon />, onGitHub, loadingProvider === 'github')}
    </div>
  );
}

// ─── Error banner ──────────────────────────────────────────────────────────
export function AuthError({ message }: { message: string }) {
  return (
    <div style={{
      marginBottom: 24,
      padding: '12px 16px',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(229, 37, 26, 0.08)',
      border: '1px solid rgba(229, 37, 26, 0.20)',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--red-deep)',
      }}>
        {message}
      </span>
    </div>
  );
}

// ─── Page footer ───────────────────────────────────────────────────────────
export function AuthFooter() {
  return (
    <div style={{ padding: '0 48px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        DeSCin © 2026
      </span>
      <div style={{ display: 'flex', gap: 24 }}>
        {['Termos', 'Privacidade'].map((t) => (
          <a
            key={t}
            href="#"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
          >
            {t}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Main layout ───────────────────────────────────────────────────────────
interface AuthLayoutProps {
  children: ReactNode;
  /** Kicker label shown above the headline, e.g. "Capital descentralizado" */
  kicker?: string;
}

export function AuthLayout({ children, kicker = 'Capital descentralizado' }: AuthLayoutProps) {
  return (
    <>
      <style>{`
        @keyframes authPanelIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes authSlideIn  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes authCardIn   { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 880px) {
          .auth-left  { display: none !important; }
          .auth-logo-mobile { display: block !important; }
        }
      `}</style>

      {/* Escapes App.tsx <main paddingTop:96> */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        background: 'var(--bg-form)',
        overflow: 'hidden',
      }}>
        {/* ── Left brand panel (60%) ── */}
        <div
          className="auth-left"
          style={{
            position: 'relative',
            flex: '0 0 60%',
            overflow: 'hidden',
            background: 'var(--bg-base)',
            animation: 'authPanelIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          {/* Gradient depth */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(229, 37, 26, 0.18), transparent 60%),
              radial-gradient(ellipse 60% 50% at 90% 80%, rgba(10, 10, 10, 0.15), transparent 65%),
              radial-gradient(ellipse 50% 40% at 60% 10%, rgba(255, 255, 255, 0.5), transparent 60%)
            `,
          }} />

          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(20, 20, 20, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20, 20, 20, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 100% 80% at 50% 40%, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 40%, black, transparent 80%)',
          }} />

          {/* Animated SVG curves */}
          <BrandCurves />

          {/* Content */}
          <div style={{
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 56px',
            gap: 48,
          }}>
            {/* Logo */}
            <div style={{ position: 'absolute', top: 48, left: 56 }}>
              <WordMark size={18} />
            </div>

            {/* Headline */}
            <div style={{ animation: 'authSlideIn 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both' }}>
              <span style={{
                display: 'block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--ink-secondary)',
                marginBottom: 24,
              }}>
                {kicker}
              </span>
              <h1 style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600, textTransform: 'uppercase',
                lineHeight: 0.95, letterSpacing: '-0.02em',
                marginBottom: 28,
              }}>
                <span style={{ display: 'block', fontSize: 'clamp(52px, 6.5vw, 106px)', color: 'var(--ink-primary)' }}>
                  Ideias
                </span>
                <span style={{ display: 'block', fontSize: 'clamp(52px, 6.5vw, 106px)', color: 'var(--red)' }}>
                  viram ativos.
                </span>
              </h1>
              <p style={{
                maxWidth: 420, fontSize: 16, lineHeight: 1.65,
                color: 'var(--ink-secondary)',
                fontFamily: "'Geist', 'Inter', sans-serif",
              }}>
                DeSCin é o primeiro mercado descentralizado para financiar projetos universitários.
                Compre frações de ideias antes que o mundo descubra que elas existiam.
              </p>
            </div>
          </div>

          {/* Floating glass card */}
          <div style={{
            position: 'absolute', bottom: 48, right: 48,
            maxWidth: 240,
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid var(--glass-border)',
            borderRadius: 16,
            boxShadow: 'inset 0 1px 0 var(--glass-highlight), 0 12px 32px rgba(20, 20, 20, 0.08)',
            padding: '20px 22px',
            animation: 'authCardIn 700ms cubic-bezier(0.16, 1, 0.3, 1) 600ms both',
            zIndex: 3,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span className="live-dot" style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--red)', flexShrink: 0,
                boxShadow: '0 0 6px var(--red-glow)',
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--ink-secondary)',
              }}>
                Mercado ao vivo
              </span>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, color: 'var(--ink-primary)',
              lineHeight: 1.9, fontVariantNumeric: 'tabular-nums',
            }}>
              <div>PROJ:HIDRO24{' '}<span style={{ color: '#22c55e', fontWeight: 600 }}>+18.2%</span></div>
              <div>PROJ:NEURO25{' '}<span style={{ color: '#22c55e', fontWeight: 600 }}>+6.4%</span></div>
              <div>PROJ:SOLAR24{' '}<span style={{ color: 'var(--red)', fontWeight: 600 }}>−2.1%</span></div>
            </div>
          </div>
        </div>

        {/* ── Right form panel (40%) ── */}
        <div style={{
          flex: 1,
          background: 'var(--bg-form)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Mobile logo */}
          <div className="auth-logo-mobile" style={{ display: 'none', padding: '32px 32px 0' }}>
            <WordMark size={16} />
          </div>

          {/* Form area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 48px',
            overflow: 'hidden',
          }}>
            <div style={{ width: '100%', maxWidth: 400, overflowY: 'auto', maxHeight: '100%' }}>
              {children}
            </div>
          </div>

          <AuthFooter />
        </div>
      </div>
    </>
  );
}

// ─── Hover link helper ─────────────────────────────────────────────────────
export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12, fontWeight: 500,
        letterSpacing: '0.10em', textTransform: 'uppercase',
        color: 'var(--ink-primary)', textDecoration: 'none',
        transition: 'color 150ms ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'var(--red)';
        (e.currentTarget as HTMLElement).style.textDecoration = 'underline';
        (e.currentTarget as HTMLElement).style.textUnderlineOffset = '3px';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)';
        (e.currentTarget as HTMLElement).style.textDecoration = 'none';
      }}
    >
      {children}
    </Link>
  );
}
