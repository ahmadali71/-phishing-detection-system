import React, { useId } from 'react';

/**
 * APDS — Automated Phishing Detection System
 * Unified High-Tech Cybersecurity Brand Logo
 * 
 * Features:
 * - Military-grade faceted cyber shield geometry with specular armor bevels
 * - Multi-vector neural defense circuit traces (URL, Email, Image, SMS vectors)
 * - Encrypted quantum lock core with glowing cyber-cyan energy pulse
 * - Fully responsive SVG scaling from 18px (favicon/header) to 64px (hero/auth)
 * - Unique SVG gradient/filter IDs to prevent collisions across multiple instances
 */
export default function Logo({
  size = 'md',
  showText = true,
  showSubtitle = false,
  showBadge = false,
  lightText = false,
  className = ''
}) {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, '');

  const sizeMap = {
    xs: { icon: 22, titleSize: '0.94rem', subSize: '0.48rem', badgeSize: '0.52rem', gap: 7 },
    sm: { icon: 28, titleSize: '1.08rem', subSize: '0.54rem', badgeSize: '0.58rem', gap: 9 },
    md: { icon: 38, titleSize: '1.32rem', subSize: '0.62rem', badgeSize: '0.66rem', gap: 11 },
    lg: { icon: 48, titleSize: '1.62rem', subSize: '0.70rem', badgeSize: '0.72rem', gap: 13 },
    xl: { icon: 60, titleSize: '2.05rem', subSize: '0.80rem', badgeSize: '0.78rem', gap: 16 },
  };

  const current = sizeMap[size] || sizeMap.md;

  const gradOuter = `apds-outer-${id}`;
  const gradFacet = `apds-facet-${id}`;
  const gradInner = `apds-inner-${id}`;
  const gradCyan = `apds-cyan-${id}`;
  const gradNeon = `apds-neon-${id}`;
  const filterGlow = `apds-glow-${id}`;

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
      {/* ── High-Tech Cybersecurity Shield Emblem ── */}
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          filter: `drop-shadow(0 4px 14px rgba(0, 229, 255, 0.4))`,
          transition: 'transform 0.25s ease',
        }}
      >
        <defs>
          {/* Outer Cyber Armor Gradient: Neon Cyan to Deep Electric Blue */}
          <linearGradient id={gradOuter} x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Left Facet Shading for 3D Angular Bevel */}
          <linearGradient id={gradFacet} x1="6" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>

          {/* Deep Obsidian Core Plate */}
          <linearGradient id={gradInner} x1="10" y1="8" x2="38" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a192f" />
            <stop offset="50%" stopColor="#030b17" />
            <stop offset="100%" stopColor="#02060f" />
          </linearGradient>

          {/* Glowing Cyber Cyan Neon */}
          <linearGradient id={gradCyan} x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>

          {/* Core Energy Line */}
          <linearGradient id={gradNeon} x1="24" y1="14" x2="24" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Cyber Glow Filter */}
          <filter id={filterGlow} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── 1. Outer Perimeter Shield (Faceted Armor) ── */}
        <path
          d="M24 2.5L42.5 8.5C42.5 21.5 36.5 35.5 24 45.5C11.5 35.5 5.5 21.5 5.5 8.5L24 2.5Z"
          fill={`url(#${gradOuter})`}
          stroke="rgba(0, 242, 254, 0.6)"
          strokeWidth="1.2"
        />

        {/* ── 2. Left 3D Angular Bevel Specular Highlight ── */}
        <path
          d="M24 2.5L5.5 8.5C5.5 21.5 11.5 35.5 24 45.5L24 2.5Z"
          fill={`url(#${gradFacet})`}
        />

        {/* ── 3. Inner Cyber Armor Plate (Dark Obsidian Shield) ── */}
        <path
          d="M24 6.8L38 11.5C38 21.5 33.2 32.5 24 40.5C14.8 32.5 10 21.5 10 11.5L24 6.8Z"
          fill={`url(#${gradInner})`}
          stroke="rgba(56, 189, 248, 0.5)"
          strokeWidth="1.2"
        />

        {/* ── 4. Neural Threat Vector Circuit Lines ── */}
        {/* URL vector circuit */}
        <path
          d="M15 15L20 20"
          stroke="rgba(56, 189, 248, 0.65)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Email vector circuit */}
        <path
          d="M33 15L28 20"
          stroke="rgba(56, 189, 248, 0.65)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Terminal nodes */}
        <circle cx="15" cy="15" r="1.6" fill="#38bdf8" />
        <circle cx="33" cy="15" r="1.6" fill="#38bdf8" />

        {/* ── 5. Cyber Security Padlock / Threat Intercept Core ── */}
        {/* High-Tech Shackle */}
        <path
          d="M19.5 21.5V17C19.5 14.5 21.5 12.5 24 12.5C26.5 12.5 28.5 14.5 28.5 17V21.5"
          stroke={`url(#${gradCyan})`}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Armored Lock Body with Cyber Chamfers */}
        <path
          d="M16.5 21.5H31.5C32.6 21.5 33.5 22.4 33.5 23.5V30.5C33.5 31.6 32.6 32.5 31.5 32.5H16.5C15.4 32.5 14.5 31.6 14.5 30.5V23.5C14.5 22.4 15.4 21.5 16.5 21.5Z"
          fill="#0c213d"
          stroke={`url(#${gradCyan})`}
          strokeWidth="1.8"
          filter={`url(#${filterGlow})`}
        />

        {/* Center Keyway / Threat Scanning Pulse */}
        <circle cx="24" cy="25.5" r="2.2" fill="#ffffff" />
        <path
          d="M24 27V30"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* ── 6. Bottom Apex Radar Ping ── */}
        <circle cx="24" cy="37" r="1.8" fill="#00f2fe" filter={`url(#${filterGlow})`} />
      </svg>

      {/* ── Unified Brand Typography Lockup ── */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: current.titleSize,
                fontWeight: 900,
                fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                letterSpacing: '-0.03em',
                color: lightText ? '#ffffff' : 'var(--text-primary, #0f172a)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              APDS
            </span>

            {showBadge && (
              <span
                style={{
                  fontSize: current.badgeSize,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.18), rgba(2, 132, 199, 0.18))',
                  border: '1px solid rgba(0, 242, 254, 0.4)',
                  color: '#38bdf8',
                  boxShadow: '0 0 10px rgba(0, 242, 254, 0.15)',
                }}
              >
                CYBER DEFENSE
              </span>
            )}
          </div>

          {showSubtitle && (
            <span
              className="apds-brand-subtitle"
              style={{
                fontSize: current.subSize,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: lightText ? 'rgba(255, 255, 255, 0.75)' : 'var(--text-muted, #64748b)',
                marginTop: '3px',
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
