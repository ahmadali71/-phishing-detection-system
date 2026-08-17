import React, { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';

export default function ScanHistory({ scanHistory, onViewDetail, onExportPdf, t, searchQuery }) {
  const [filter, setFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const defaultRecords = [
    { id: 1, type: 'URL', input: 'paypal-secure-login.com', result: 'Phishing', riskScore: '90/100', date: '2024-05-15 10:30 AM', category: 'Phishing' },
    { id: 2, type: 'Email', input: 'Verify your account.eml', result: 'Suspicious', riskScore: '65/100', date: '2024-05-15 10:15 AM', category: 'Suspicious' },
    { id: 3, type: 'URL', input: 'microsoft.com', result: 'Safe', riskScore: '10/100', date: '2024-05-15 09:45 AM', category: 'Safe' },
    { id: 4, type: 'Email', input: 'Meeting schedule.eml', result: 'Safe', riskScore: '15/100', date: '2024-05-14 04:20 PM', category: 'Safe' },
    { id: 5, type: 'URL', input: 'secure-login.bank.com', result: 'Phishing', riskScore: '95/100', date: '2024-05-14 03:10 PM', category: 'Phishing' },
  ];

  const records = (scanHistory?.length > 0 ? scanHistory : defaultRecords).filter(r => {
    const matchesCategory = filter === 'All' || r.result === filter || r.category === filter;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = !q ||
      r.input?.toLowerCase().includes(q) ||
      r.type?.toLowerCase().includes(q) ||
      r.result?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* ── Badge & Title with Capability Blocks ── */}
      <div className="feature-hero-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div className="badge-screen-num">8</div>
            <span className="badge-screen-title">SCAN HISTORY &amp; REPORTS</span>
            <span className="badge-live-ai">● AUDIT TRAIL</span>
          </div>
          <h2 className="feature-hero-title">Inspection Log &amp; Security Reports</h2>
          <p className="feature-hero-desc">
            Review detailed analytical records of all past URL and Email scans, filter by classification category, and export formal PDF audit dossiers.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="feature-blocks-grid">
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>📋</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Audit Trail</span>
              <span className="feature-block-sub">Historical forensic log</span>
            </div>
          </div>
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>🔍</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Category Filters</span>
              <span className="feature-block-sub">Phishing, safe, suspicious</span>
            </div>
          </div>
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>📄</div>
            <div className="feature-block-content">
              <span className="feature-block-title">PDF Export</span>
              <span className="feature-block-sub">Printable security report</span>
            </div>
          </div>
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(168, 85, 247, 0.12)' }}>⏱️</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Time Stamps</span>
              <span className="feature-block-sub">Precise scan timeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar with Date Selectors & Export PDF (Exact Match to PDF Page 63 Screen 8) ── */}
      <div className="glass-panel scan-history-filter-bar"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: 'All', activeBg: '#2563eb', activeColor: '#ffffff', inactiveBg: 'var(--bg-input)' },
            { id: 'Phishing', label: 'Phishing', activeBg: '#ef4444', activeColor: '#ffffff', inactiveBg: 'rgba(239, 68, 68, 0.12)' },
            { id: 'Suspicious', label: 'Suspicious', activeBg: '#f59e0b', activeColor: '#ffffff', inactiveBg: 'rgba(245, 158, 11, 0.12)' },
            { id: 'Safe', label: 'Safe', activeBg: '#10b981', activeColor: '#ffffff', inactiveBg: 'rgba(16, 185, 129, 0.12)' },
          ].map(cat => {
            const isSelected = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isSelected ? cat.activeBg : cat.inactiveBg,
                  color: isSelected ? cat.activeColor : (cat.id === 'All' ? 'var(--text-secondary)' : cat.activeBg),
                  fontWeight: '700',
                  fontSize: '0.84rem',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-display)'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Date Pickers + Export Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>From</span>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            style={{ width: '135px', padding: '7px 10px', fontSize: '0.82rem' }}
          />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>To</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            style={{ width: '135px', padding: '7px 10px', fontSize: '0.82rem' }}
          />
          <button onClick={onExportPdf} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.86rem' }}>
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── Mobile Card View (hidden on desktop) ── */}
      <div className="scan-history-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '10px' }}>
        {records.map((item, idx) => {
          const isPhish = item.result === 'Phishing';
          const isSusp = item.result === 'Suspicious';
          const color = isPhish ? '#ef4444' : (isSusp ? '#f59e0b' : '#10b981');
          return (
            <div key={item.id ?? idx} style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{item.type}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.date}</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '0.86rem', color }}>{item.result}</span>
                <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Risk: {item.riskScore}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => onViewDetail?.(item)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  <ExternalLink size={13} /> View
                </button>
              </div>
            </div>
          );
        })}
        {records.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '36px' }}>No records found.</div>
        )}
      </div>

      {/* ── Table (Exact Match to PDF Page 63 Screen 8) ── */}
      <div className="glass-panel scan-history-desktop-table" style={{ padding: '20px' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Type</th>
                <th>Input</th>
                <th>Result</th>
                <th>Risk Score</th>
                <th>Date &amp; Time</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, idx) => (
                <tr key={item.id ?? idx}>
                  <td style={{ fontWeight: '700', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td><span className="badge badge-blue">{item.type}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.date}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onViewDetail?.(item)}
                      className="btn-secondary"
                      style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                    >
                      <ExternalLink size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '36px' }}>No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination: < 1 2 3 Next > (Exact Match to PDF Page 63 Screen 8) ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>&lt;</button>
          <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.82rem', minWidth: '36px' }}>1</button>
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem', minWidth: '36px' }}>2</button>
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem', minWidth: '36px' }}>3</button>
          <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>Next</button>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
