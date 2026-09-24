import React from 'react';

export default function Logo({ size = 'md', showText = true, showSubtitle = false, lightText = false, useShort = false, className = '' }) {
  const sizeMap = {
    xs: { icon: 22, fontSize: '0.95rem', subSize: '0.5rem' },
    sm: { icon: 28, fontSize: '1.1rem', subSize: '0.58rem' },
    md: { icon: 36, fontSize: '1.35rem', subSize: '0.64rem' },
    lg: { icon: 48, fontSize: '1.65rem', subSize: '0.75rem' },
    xl: { icon: 60, fontSize: '2rem', subSize: '0.85rem' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`phishguard-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', userSelect: 'none' }}>
      {/* SVG Shield with Envelope */}
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 4px 10px rgba(37, 99, 235, 0.35))' }}
      >
        <defs>
          <linearGradient id="pgShieldGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="pgInnerGlow" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Shield Outer Path */}
        <path
          d="M24 4L40 9.8V23.4C40 33.2 33.2 41.8 24 44C14.8 41.8 8 33.2 8 23.4V9.8L24 4Z"
          fill="url(#pgShieldGrad)"
        />
        {/* Shield Highlight Overlay */}
        <path
          d="M24 4L40 9.8V23.4C40 33.2 33.2 41.8 24 44C14.8 41.8 8 33.2 8 23.4V9.8L24 4Z"
          fill="url(#pgInnerGlow)"
        />

        {/* Inner White Envelope Badge */}
        <rect x="15" y="18" width="18" height="13" rx="2.5" fill="#ffffff" />
        {/* Envelope Flap Lines */}
        <path
          d="M16 19.5L24 25.5L32 19.5"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Envelope Bottom Corners Detail */}
        <path
          d="M16 29.5L20.5 25"
          stroke="#2563eb"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        <path
          d="M32 29.5L27.5 25"
          stroke="#2563eb"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            style={{
              fontSize: current.fontSize,
              fontWeight: 900,
              fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: '-0.02em',
              color: lightText ? '#ffffff' : 'var(--text-primary, #0f172a)',
            }}
          >
            {useShort ? (
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ color: lightText ? '#ffffff' : 'var(--text-primary, #0f172a)' }}>APDS</span>
              </span>
            ) : (
              <span className="logo-brand-text">
                <span className="logo-brand-desktop" style={{ alignItems: 'baseline', gap: '5px' }}>
                  <span style={{ color: lightText ? '#ffffff' : 'var(--text-primary, #0f172a)' }}>Automated</span>
                  <span style={{ color: '#38bdf8' }}>Phishing Detection System</span>
                </span>
                <span className="logo-brand-mobile" style={{ alignItems: 'center' }}>
                  <span style={{ color: lightText ? '#ffffff' : 'var(--text-primary, #0f172a)' }}>APDS</span>
                </span>
              </span>
            )}
          </span>
          {showSubtitle && (
            <span
              style={{
                fontSize: current.subSize,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: lightText ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary, #64748b)',
                marginTop: '2px',
              }}
            >
              REAL-TIME AI DEFENSE &amp; THREAT INTELLIGENCE
            </span>
          )}
        </div>
      )}
    </div>
  );
}
