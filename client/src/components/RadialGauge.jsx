import React from 'react';

export default function RadialGauge({ score = 85, label, maxScore = 100, size = 160 }) {
  const numericScore = Math.min(100, Math.max(0, Number(score) || 0));

  // Gauge calculations
  // Radius = 54, Center = (80, 68), ViewBox = (0, 0, 160, 95)
  // Semicircle arc length = PI * radius = ~169.65
  const radius = 54;
  const strokeWidth = 10;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength * (1 - numericScore / 100);

  // Status & color scheme
  let riskLevel = label;
  let statusColor = '#ef4444';
  let badgeBg = 'rgba(239, 68, 68, 0.12)';
  let gradientId = 'gauge-danger';

  if (!riskLevel) {
    if (numericScore >= 70) {
      riskLevel = 'High Risk';
      statusColor = '#ef4444';
      badgeBg = 'rgba(239, 68, 68, 0.12)';
      gradientId = 'gauge-danger';
    } else if (numericScore >= 35) {
      riskLevel = 'Medium Risk';
      statusColor = '#f59e0b';
      badgeBg = 'rgba(245, 158, 11, 0.12)';
      gradientId = 'gauge-warning';
    } else {
      riskLevel = 'Low Risk';
      statusColor = '#10b981';
      badgeBg = 'rgba(16, 185, 129, 0.12)';
      gradientId = 'gauge-safe';
    }
  } else {
    const l = riskLevel.toLowerCase();
    if (l.includes('high') || l.includes('crit') || l.includes('danger')) {
      statusColor = '#ef4444';
      badgeBg = 'rgba(239, 68, 68, 0.12)';
      gradientId = 'gauge-danger';
    } else if (l.includes('med') || l.includes('warn') || l.includes('susp')) {
      statusColor = '#f59e0b';
      badgeBg = 'rgba(245, 158, 11, 0.12)';
      gradientId = 'gauge-warning';
    } else {
      statusColor = '#10b981';
      badgeBg = 'rgba(16, 185, 129, 0.12)';
      gradientId = 'gauge-safe';
    }
  }

  return (
    <div style={{
      background: 'var(--bg-card, rgba(255, 255, 255, 0.85))',
      border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
      borderRadius: '16px',
      padding: '14px 16px 12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '130px',
      maxWidth: '180px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      backdropFilter: 'blur(12px)',
      userSelect: 'none'
    }}>
      {/* Title */}
      <span style={{
        fontSize: '0.74rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-muted, #64748b)',
        marginBottom: '6px'
      }}>
        Risk Score
      </span>

      {/* SVG Semicircle Meter */}
      <div style={{ position: 'relative', width: '130px', height: '68px', display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 160 88"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="gauge-danger" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>

            <linearGradient id="gauge-warning" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            <linearGradient id="gauge-safe" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path
            d="M 26,76 A 54,54 0 0,1 134,76"
            fill="none"
            stroke="var(--border-color, #e2e8f0)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ opacity: 0.55 }}
          />

          {/* Active Gradient Arc */}
          <path
            d="M 26,76 A 54,54 0 0,1 134,76"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 2px 6px ${statusColor}40)`
            }}
          />
        </svg>

        {/* Score Number in center (plenty of room, no overlap) */}
        <div style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '2px',
          lineHeight: 1
        }}>
          <span style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            color: 'var(--text-primary, #0f172a)',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            {numericScore}
          </span>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: 'var(--text-muted, #94a3b8)'
          }}>
            /{maxScore}
          </span>
        </div>
      </div>

      {/* Risk Level Badge below arc (never collides) */}
      <div style={{
        marginTop: '8px',
        padding: '3px 10px',
        borderRadius: '999px',
        background: badgeBg,
        border: `1px solid ${statusColor}35`,
        color: statusColor,
        fontSize: '0.72rem',
        fontWeight: '800',
        letterSpacing: '0.03em',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        {riskLevel}
      </div>
    </div>
  );
}

