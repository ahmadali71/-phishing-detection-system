import React from 'react';

export default function RadialGauge({ score = 85, label, maxScore = 100, size = 200 }) {
  const numericScore = Math.min(100, Math.max(0, Number(score) || 0));
  
  // Semicircle arc calculation
  // Radius = 75, Center at (100, 88), Stroke = 14
  // Arc length = PI * 75 = 235.619
  const radius = 75;
  const strokeWidth = 14;
  const arcLength = Math.PI * radius; // ~235.62
  const strokeDashoffset = arcLength * (1 - numericScore / 100);

  // Status & color definition matching PDF Page 62 & 63
  let riskLevel = label;
  let gradientId = 'gauge-danger';
  let statusColor = '#ef4444';

  if (!riskLevel) {
    if (numericScore >= 65) {
      riskLevel = 'High Risk';
      statusColor = '#ef4444';
      gradientId = 'gauge-danger';
    } else if (numericScore >= 35) {
      riskLevel = 'Medium Risk';
      statusColor = '#f59e0b';
      gradientId = 'gauge-warning';
    } else {
      riskLevel = 'Low Risk';
      statusColor = '#10b981';
      gradientId = 'gauge-safe';
    }
  } else {
    if (riskLevel.toLowerCase().includes('high')) {
      statusColor = '#ef4444';
      gradientId = 'gauge-danger';
    } else if (riskLevel.toLowerCase().includes('med')) {
      statusColor = '#f59e0b';
      gradientId = 'gauge-warning';
    } else {
      statusColor = '#10b981';
      gradientId = 'gauge-safe';
    }
  }

  return (
    <div style={{
      background: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '20px 18px 16px 18px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      position: 'relative'
    }}>
      {/* Top Title: "Risk Score" matching PDF */}
      <div style={{
        fontSize: '0.92rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
        alignSelf: 'flex-start',
        marginBottom: '6px',
        fontFamily: 'var(--font-display)'
      }}>
        Risk Score
      </div>

      {/* SVG Semicircle Arc Gauge */}
      <div style={{ position: 'relative', width: `${size}px`, height: `${size * 0.58}px`, overflow: 'hidden' }}>
        <svg
          viewBox="0 0 200 115"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {/* Danger Gradient: Red to Orange matching user image */}
            <linearGradient id="gauge-danger" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>

            {/* Warning Gradient */}
            <linearGradient id="gauge-warning" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            {/* Safe Gradient */}
            <linearGradient id="gauge-safe" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background Track (Grey Semicircle) */}
          <path
            d="M 25,92 A 75,75 0 0,1 175,92"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ opacity: 0.7 }}
          />

          {/* Active Filled Arc */}
          <path
            d="M 25,92 A 75,75 0 0,1 175,92"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center Numbers: "85 /100" & "High Risk" matching user image */}
        <div style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{
            fontSize: '1.85rem',
            fontWeight: '900',
            lineHeight: '1',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '3px'
          }}>
            <span>{numericScore}</span>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: '700' }}>/{maxScore}</span>
          </div>

          <div style={{
            fontSize: '0.86rem',
            fontWeight: '800',
            marginTop: '4px',
            color: statusColor,
            fontFamily: 'var(--font-display)'
          }}>
            {riskLevel}
          </div>
        </div>
      </div>
    </div>
  );
}
