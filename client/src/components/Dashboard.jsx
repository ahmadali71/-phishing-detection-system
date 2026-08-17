import React from 'react';
import {
  Search,
  Zap,
  ExternalLink
} from 'lucide-react';

export default function Dashboard({ stats, recentActivity, onNavigateScan, onViewDetail, t }) {
  // Weekly points matching Page 61 line chart:
  // Mon: 50, Tue: 100, Wed: 75, Thu: 125, Fri: 110, Sat: 140, Sun: 190
  const points = [
    { day: 'Mon', val: 50, x: 40, y: 150 },
    { day: 'Tue', val: 100, x: 90, y: 110 },
    { day: 'Wed', val: 75, x: 140, y: 130 },
    { day: 'Thu', val: 125, x: 190, y: 90 },
    { day: 'Fri', val: 110, x: 240, y: 100 },
    { day: 'Sat', val: 140, x: 290, y: 75 },
    { day: 'Sun', val: 190, x: 340, y: 35 }
  ];

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

  const defaultActivity = [
    { type: 'URL', input: 'paypal-secure-login.com', result: 'Phishing', riskScore: '90/100', time: '2 min ago' },
    { type: 'Email', input: 'Verify your account.eml', result: 'Suspicious', riskScore: '65/100', time: '15 min ago' },
    { type: 'URL', input: 'microsoft.com', result: 'Safe', riskScore: '10/100', time: '1 hour ago' }
  ];

  const activityList = recentActivity && recentActivity.length > 0 ? recentActivity : defaultActivity;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header with Title & Feature Blocks */}
      <div className="feature-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div className="badge-screen-num">4</div>
              <span className="badge-screen-title">DASHBOARD</span>
              <span className="badge-live-ai">● THREAT MONITOR</span>
            </div>
            <h2 className="feature-hero-title">Automated Phishing Threat Monitoring</h2>
            <p className="feature-hero-desc">
              Multi-layered ML & NLP analysis pipeline protecting web users against domain typosquatting, email social engineering, and fraudulent links.
            </p>
          </div>
          <div className="dashboard-actions" style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onNavigateScan('url-detection')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              <Search size={16} /> Scan URL Now
            </button>
            <button onClick={() => onNavigateScan('email-detection')} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              <Zap size={16} /> Analyze Email
            </button>
          </div>
        </div>

        {/* Feature Capability Blocks */}
        <div className="feature-blocks-grid">
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>🛡️</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Dual Scanners</span>
              <span className="feature-block-sub">URL + Email ML engines</span>
            </div>
          </div>
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>⚡</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Instant Analysis</span>
              <span className="feature-block-sub">Sub-second ML classification</span>
            </div>
          </div>
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>🎯</div>
            <div className="feature-block-content">
              <span className="feature-block-title">94.6% Accuracy</span>
              <span className="feature-block-sub">Supervised Random Forest</span>
            </div>
          </div>
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(168, 85, 247, 0.12)' }}>🔒</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Risk Scoring</span>
              <span className="feature-block-sub">Semicircle radial gauge</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Stat Metric Cards (Exact Match to PDF Page 61 Screen 4) ── */}
      <div className="responsive-grid-4">
        {/* Total Scans */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Total Scans</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', margin: '4px 0', color: '#2563eb' }}>
             {stats.totalScans ? stats.totalScans.toLocaleString() : '2,568'}
           </div>
        </div>

        {/* Phishing Detected */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Phishing Detected</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', margin: '4px 0', color: '#ef4444' }}>
             {stats.phishingDetected ? stats.phishingDetected.toLocaleString() : '642'}
           </div>
        </div>

        {/* Safe Items */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Safe Items</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', margin: '4px 0', color: '#10b981' }}>
             {stats.safeItems ? stats.safeItems.toLocaleString() : '1,926'}
           </div>
        </div>

        {/* Accuracy */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: '700' }}>Accuracy</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', margin: '4px 0', color: '#3b82f6' }}>
             {stats.accuracyRate ? `${stats.accuracyRate}%` : '94.6%'}
           </div>
        </div>
      </div>

      {/* ── Middle Row: Line Chart & Donut Chart (Exact Match to PDF Page 61 Screen 4) ── */}
      <div className="responsive-grid-2-1">
        {/* Left Card: Threats Detected (This Week) with Connected Line Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px' }}>Threats Detected (This Week)</h3>

          <div style={{ width: '100%', height: '200px', position: 'relative' }}>
            <svg viewBox="0 0 380 200" style={{ width: '100%', height: '100%' }}>
              {/* Y-axis grid labels */}
              <text x="10" y="38" fill="var(--text-muted)" fontSize="11" fontWeight="600">200</text>
              <text x="10" y="78" fill="var(--text-muted)" fontSize="11" fontWeight="600">150</text>
              <text x="10" y="118" fill="var(--text-muted)" fontSize="11" fontWeight="600">100</text>
              <text x="10" y="158" fill="var(--text-muted)" fontSize="11" fontWeight="600">50</text>
              <text x="10" y="195" fill="var(--text-muted)" fontSize="11" fontWeight="600">0</text>

              {/* Horizontal grid lines */}
              <line x1="35" y1="35" x2="370" y2="35" stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1="35" y1="75" x2="370" y2="75" stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1="35" y1="115" x2="370" y2="115" stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1="35" y1="155" x2="370" y2="155" stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1="35" y1="190" x2="370" y2="190" stroke="var(--border-color)" />

              {/* Connecting Blue Line matching Page 61 */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Circular Dots & Day Labels on X-axis */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={p.x}
                    y="198"
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Card: Threat Categories Donut Chart matching Page 61 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Threat Categories</h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '16px', flexWrap: 'wrap' }}>
            {/* SVG Donut Chart */}
            <div style={{ width: '130px', height: '130px', position: 'relative' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Phishing (45%) -> Red */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="16" strokeDasharray="107.44 238.76" strokeDashoffset="0" />
                {/* Malware (25%) -> Orange */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f97316" strokeWidth="16" strokeDasharray="59.69 238.76" strokeDashoffset="-107.44" />
                {/* Suspicious (18%) -> Yellow */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#eab308" strokeWidth="16" strokeDasharray="42.98 238.76" strokeDashoffset="-167.13" />
                {/* Other (12%) -> Green/Blue */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="16" strokeDasharray="28.65 238.76" strokeDashoffset="-210.11" />
              </svg>
            </div>

            {/* Legend (Exact percentages from PDF Page 61) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                 <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Phishing</span>
                 <span style={{ fontWeight: '800', marginInlineStart: 'auto', color: 'var(--text-primary)' }}>45%</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                 <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Malware</span>
                 <span style={{ fontWeight: '800', marginInlineStart: 'auto', color: 'var(--text-primary)' }}>25%</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
                 <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Suspicious</span>
                 <span style={{ fontWeight: '800', marginInlineStart: 'auto', color: 'var(--text-primary)' }}>18%</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }} />
                 <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Other</span>
                 <span style={{ fontWeight: '800', marginInlineStart: 'auto', color: 'var(--text-primary)' }}>12%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Card: Recent Activity (Responsive Table + Mobile Cards) ── */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Recent Activity</h3>
          <button
            onClick={() => onNavigateScan('scan-history')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2563eb',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            View All →
          </button>
        </div>

        {/* Desktop / Tablet Table View */}
        <div className="table-wrapper dashboard-desktop-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Input</th>
                <th>Result</th>
                <th>Risk Score</th>
                <th style={{ textAlign: 'right' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {activityList.slice(0, 5).map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => onViewDetail && onViewDetail(item)}
                  style={{ cursor: onViewDetail ? 'pointer' : 'default' }}
                >
                  <td style={{ fontWeight: '700' }}>{item.type}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.input}
                  </td>
                  <td>
                    <span style={{
                      fontWeight: '800',
                      color: item.result === 'Phishing' ? '#ef4444' : (item.result === 'Suspicious' ? '#f59e0b' : '#10b981')
                    }}>
                      {item.result}
                    </span>
                  </td>
                  <td style={{ fontWeight: '800' }}>{item.riskScore}</td>
                  <td style={{ textAlign: 'end', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {item.time || item.date || 'Just now'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile-Only Touch Cards List */}
        <div className="dashboard-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '10px' }}>
          {activityList.slice(0, 5).map((item, idx) => {
            const isPhish = item.result === 'Phishing';
            const isSusp = item.result === 'Suspicious';
            const color = isPhish ? '#ef4444' : (isSusp ? '#f59e0b' : '#10b981');
            return (
              <div
                key={idx}
                onClick={() => onViewDetail && onViewDetail(item)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {item.time || item.date || 'Just now'}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.input}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.86rem', color }}>
                    {item.result}
                  </span>
                  <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Risk: {item.riskScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
