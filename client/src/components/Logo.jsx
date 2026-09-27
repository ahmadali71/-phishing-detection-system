import React, { useId } from 'react';

/**
 * APDS — Automated Phishing Detection System Unified Brand Logo
 * Features:
 * - Dynamic SVG shield with AI defense nexus & cryptographic pulse
 * - Unique SVG gradient IDs to eliminate duplicate DOM ID collisions
 * - Clean, modern cybersecurity aesthetic matching the official system title
 */
export default function Logo({
  size = 'md',
  showText = true,
  showSubtitle = false,
  showBadge = false,
  lightText = false,
  useShort = false,
  className = ''
}) {
  const uniqueId = useId().replace(/[:]/g, '');

  const sizeMap = {
    xs: { icon: 22, titleSize: '0.92rem', badgeSize: '0.55rem', subSize: '0.48rem', gap: 6 },
    sm: { icon: 30, titleSize: '1.08rem', badgeSize: '0.62rem', subSize: '0.54rem', gap: 8 },
    md: { icon: 38, titleSize: '1.28rem', badgeSize: '0.68rem', subSize: '0.60rem', gap: 10 },
    lg: { icon: 48, titleSize: '1.55rem', badgeSize: '0.74rem', subSize: '0.68rem', gap: 12 },
    xl: { icon: 58, titleSize: '1.95rem', badgeSize: '0.82rem', subSize: '0.76rem', gap: 14 },
  };

  const current = sizeMap[size] || sizeMap.md;

  const gradShield = `apds-shield-grad-${uniqueId}`;
  const gradCore = `apds-core-grad-${uniqueId}`;
  const gradGlow = `apds-glow-grad-${uniqueId}`;
  const filterGlow = `apds-filter-glow-${uniqueId}`;

  return (
    <div
      className={`apds-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${current.gap}px`,
        textDecoration: 'none',
        userSelect: 'none',
        verticalAlign: 'middle',
      }}
    >
      {/* ── Modern Cyber Shield Emblem ── */}
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          filter: `drop-shadow(0 4px 12px rgba(14, 165, 233, 0.45))`,
          transition: 'transform 0.25s ease',
        }}
      >
        <defs>
          {/* Main Shield Gradient: Electric Cyan -> Cobalt Blue -> Deep Navy */}
          <linearGradient id={gradShield} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* AI Core Accent Gradient: White-Hot Cyan to Emerald Glow */}
          <linearGradient id={gradCore} x1="16" y1="14" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Bevel Highlight */}
          <linearGradient id={gradGlow} x1="24" y1="4" x2="24" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          {/* Ambient Glow Filter */}
          <filter id={filterGlow} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield Backplate */}
        <path
          d="M24 3.5L41 9.8C41 21.5 35.8 34.2 24 44.5C12.2 34.2 7 21.5 7 9.8L24 3.5Z"
          fill={current ? `url(#${gradShield})` : '#2563eb'}
        />

        {/* Shield Facet Overlay / Glass Highlight */}
        <path
          d="M24 3.5L41 9.8C41 21.5 35.8 34.2 24 44.5C12.2 34.2 7 21.5 7 9.8L24 3.5Z"
          fill={`url(#${gradGlow})`}
        />

        {/* Inner Cyber Armor Plate */}
        <path
          d="M24 7.2L37 12.2C37 21 32.8 31 24 39.5C15.2 31 11 21 11 12.2L24 7.2Z"
          fill="#07152b"
          fillOpacity="0.75"
          stroke="rgba(56, 189, 248, 0.45)"
          strokeWidth="1.2"
        />

        {/* High-Tech Radar Ring Crosshair */}
        <circle
          cx="24"
          cy="22"
          r="9"
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />

        {/* Cyber Threat Defense Nexus (Center Glyph: Interlocking Chevron + Shield Pulse) */}
        <path
          d="M17.5 21.5L22 26L31 16.5"
          stroke={`url(#${gradCore})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${filterGlow})`}
        />

        {/* Energy Pulse Center Dot */}
        <circle cx="24" cy="31" r="2" fill="#38bdf8" />
      </svg>

      {/* ── Brand Typography Lockup ── */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: current.titleSize,
                fontWeight: 900,
                fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                letterSpacing: '-0.025em',
                color: lightText ? '#ffffff' : 'var(--text-primary, #0f172a)',
                display: 'inline-flex',
                alignItems: 'baseline',
              }}
            >
              APDS
            </span>
          </div>

          {showSubtitle && (
            <span
              className="apds-brand-subtitle"
              style={{
                fontSize: current.subSize,
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: lightText ? 'rgba(255, 255, 255, 0.72)' : 'var(--text-muted, #64748b)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
              }}
            >
              Automated Phishing Detection System
            </span>
          )}
        </div>
      )}
    </div>
  );
}
