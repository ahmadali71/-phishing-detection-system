import React from 'react';
import {
  Search,
  ExternalLink,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function Dashboard({ stats, recentActivity, onNavigateScan, onViewDetail, t }) {
  const weeklyData = [
    { day: 'Mon', count: 50, height: 25 },
    { day: 'Tue', count: 100, height: 50 },
    { day: 'Wed', count: 80, height: 40 },
    { day: 'Thu', count: 120, height: 60 },
    { day: 'Fri', count: 110, height: 55 },
    { day: 'Sat', count: 150, height: 75 },
    { day: 'Sun', count: 200, height: 100 }
  ];

  const threatCategories = [
    { label: 'Phishing', pct: 45, color: '#ef4444' },
    { label: 'Malware', pct: 25, color: '#f59e0b' },
    { label: 'Suspicious', pct: 18, color: '#3b82f6' },
    { label: 'Other', pct: 12, color: '#10b981' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: '800' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Overview of your security activity
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onNavigateScan('url-detection')} className="btn-primary" style={{ padding: '9px 18px' }}>
            <Search size={16} /> Scan URL
          </button>
          <button onClick={() => onNavigateScan('email-detection')} className="btn-secondary" style={{ padding: '9px 18px' }}>
            <Zap size={16} /> Scan Email
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards (Responsive Grid) */}
      <div className="responsive-grid-4">
        {/* Total Scans */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Scans</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '800', margin: '6px 0', color: 'var(--text-primary)' }}>
            {stats.totalScans ? stats.totalScans.toLocaleString() : '2,568'}
          </div>
        </div>

        {/* Phishing Detected */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Phishing Detected</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '800', margin: '6px 0', color: '#ef4444' }}>
            {stats.phishingDetected ? stats.phishingDetected.toLocaleString() : '642'}
          </div>
        </div>

        {/* Safe Items */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Safe Items</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '800', margin: '6px 0', color: '#10b981' }}>
            {stats.safeItems ? stats.safeItems.toLocaleString() : '1,926'}
          </div>
        </div>

        {/* Accuracy */}
        <div className="glass-panel" style={{ padding: '22px 24px', background: 'var(--bg-card)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Accuracy</div>
          <div style={{ fontSize: '2.4rem', fontWeight: '800', margin: '6px 0', color: '#3b82f6' }}>
            {stats.accuracyRate ? `${stats.accuracyRate}%` : '94.6%'}
          </div>
        </div>
      </div>

      {/* Middle Row: Threats Detected Line Chart & Threat Categories Donut (Responsive Grid) */}
      <div className="responsive-grid-2-1">
        {/* Left Card: Threats Detected (This Week) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '18px' }}>Threats Detected (This Week)</h3>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', height: '180px', padding: '10px 10px 0 10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '12px' }}>
              {weeklyData.map((d, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    maxWidth: '32px',
                    height: `${d.height}%`,
                    background: 'linear-gradient(180deg, #3b82f6 0%, rgba(59, 130, 246, 0.25) 100%)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.4s ease'
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700' }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Threat Categories Donut Chart */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>Threat Categories</h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'conic-gradient(#ef4444 0% 45%, #f59e0b 45% 70%, #3b82f6 70% 88%, #10b981 88% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0,0,0,0.2)'
            }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-card)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
            {threatCategories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                <span>{cat.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Recent Activity</h3>
          <button
            onClick={() => onNavigateScan('scan-history')}
            style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            View All
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Input</th>
                <th>Result</th>
                <th>Risk Score</th>
                <th>Time</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700' }}>{item.type}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{item.input}</td>
                    <td>
                      <span className={`badge badge-${item.badgeColor || (item.result === 'Phishing' ? 'danger' : (item.result === 'Suspicious' ? 'warning' : 'emerald'))}`}>
                        {item.result}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700' }}>{item.riskScore}/100</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.time || '2 min ago'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onViewDetail(item)}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td style={{ fontWeight: '700' }}>URL</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>paypal-secure-login.com</td>
                    <td><span className="badge badge-danger">Phishing</span></td>
                    <td style={{ fontWeight: '700' }}>90/100</td>
                    <td style={{ color: 'var(--text-muted)' }}>2 min ago</td>
                    <td style={{ textAlign: 'right' }}><button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Inspect</button></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '700' }}>Email</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>Verify your account.eml</td>
                    <td><span className="badge badge-warning">Suspicious</span></td>
                    <td style={{ fontWeight: '700' }}>65/100</td>
                    <td style={{ color: 'var(--text-muted)' }}>15 min ago</td>
                    <td style={{ textAlign: 'right' }}><button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Inspect</button></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: '700' }}>URL</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>microsoft.com</td>
                    <td><span className="badge badge-emerald">Safe</span></td>
                    <td style={{ fontWeight: '700' }}>10/100</td>
                    <td style={{ color: 'var(--text-muted)' }}>1 hour ago</td>
                    <td style={{ textAlign: 'right' }}><button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Inspect</button></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
