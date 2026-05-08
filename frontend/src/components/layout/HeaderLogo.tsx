import { Link } from 'react-router-dom';

export function HeaderLogo() {
  return (
    <Link
      to="/"
      className="flex items-center flex-shrink-0"
      style={{ transition: 'opacity 200ms ease, transform 100ms ease' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.75'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: '0.06em',
          color: 'var(--ink-primary)',
          textTransform: 'uppercase',
          userSelect: 'none',
          position: 'relative',
        }}
      >
        desc
        <span style={{ position: 'relative', display: 'inline-block' }}>
          i
          <svg
            width="6"
            height="6"
            viewBox="0 0 6 6"
            style={{
              position: 'absolute',
              top: -2,
              left: '50%',
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 0 3px var(--red-glow))',
            }}
          >
            <rect width="6" height="6" fill="var(--red)" />
          </svg>
        </span>
        n
      </span>
    </Link>
  );
}
