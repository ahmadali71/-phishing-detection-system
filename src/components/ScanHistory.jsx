import React, { useState } from 'react';
import { Download, Search, Filter, Trash2, ExternalLink } from 'lucide-react';

export default function ScanHistory({ scanHistory, onViewDetail, onDeleteScan, onExportPdf, t }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const defaultRecords = [
    { id: 1, type: 'URL', input: 'paypal-secure-login.com', result: 'Phishing', riskScore: '90/100', date: '2024-05-15 10:30 AM', category: 'Phishing' },
    { id: 2, type: 'Email', input: 'Verify your account.eml', result: 'Suspicious', riskScore: '65/100', date: '2024-05-15 10:15 AM', category: 'Suspicious' },
    { id: 3, type: 'URL', input: 'microsoft.com', result: 'Safe', riskScore: '10/100', date: '2024-05-15 09:45 AM', category: 'Safe' },
    { id: 4, type: 'Email', input: 'Meeting schedule.eml', result: 'Safe', riskScore: '15/100', date: '2024-05-14 04:20 PM', category: 'Safe' },
    { id: 5, type: 'URL', input: 'secure-login.bank.com', result: 'Phishing', riskScore: '95/100', date: '2024-05-14 03:10 PM', category: 'Phishing' }
  ];

  const recordsToDisplay = scanHistory && scanHistory.length > 0 ? scanHistory : defaultRecords;

  const filtered = recordsToDisplay.filter(item => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory || item.result === filterCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>SCAN HISTORY & REPORTS</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          View and manage your scan history
        </p>
      </div>

      {/* Filter Bar with Date Selectors & Export PDF (Exact Match to PDF Page 63 Screen 8) */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Phishing', 'Suspicious', 'Safe'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '7px 18px',
                borderRadius: '20px',
                border: 'none',
                background: filterCategory === cat ? '#3b82f6' : 'var(--bg-input)',
                color: filterCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date Pickers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '0.8rem', width: '130px' }}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '0.8rem', width: '130px' }}
          />
          <button
            onClick={onExportPdf}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* History Table (Exact Match to PDF Page 63 Screen 8) */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Type</th>
                <th>Input</th>
                <th>Result</th>
                <th>Risk Score</th>
                <th>Date & Time</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ fontWeight: '700', color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td><span className="badge badge-blue">{item.type}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{item.input}</td>
                  <td>
                    <span className={`badge badge-${item.result === 'Phishing' ? 'danger' : (item.result === 'Suspicious' ? 'warning' : 'emerald')}`}>
                      {item.result}
                    </span>
                  </td>
                  <td style={{ fontWeight: '800' }}>{item.riskScore}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.date}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onViewDetail(item)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (Exact Match to PDF Page 63 Screen 8) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
          <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>&lt;</button>
          <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>1</button>
          <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>2</button>
          <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>3</button>
          <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>Next &gt;</button>
        </div>
      </div>
    </div>
  );
}
