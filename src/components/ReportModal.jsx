import React from 'react';
import { X, ShieldAlert, Download, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ReportModal({ record, onClose, onExportPdf }) {
  if (!record) return null;

  const isPhishing = record.result === 'Phishing' || (typeof record.result === 'string' && record.result.includes('Phishing'));
  const isSuspicious = record.result === 'Suspicious' || (typeof record.result === 'string' && record.result.includes('Suspicious'));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-panel report-modal-inner" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: isPhishing ? 'rgba(239, 68, 68, 0.2)' : (isSuspicious ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPhishing ? '#ef4444' : (isSuspicious ? '#f59e0b' : '#10b981')
            }}>
              {isPhishing ? <ShieldAlert size={22} /> : (isSuspicious ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>APDS Security Threat Audit Report</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scan ID #{record.id || 'SCAN-9021'}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ANALYSIS TARGET</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', fontFamily: 'var(--font-mono)', marginTop: '4px', wordBreak: 'break-all' }}>
              {record.input || record.fullUrl || record.fileName || 'Email Content Scan'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>VERDICT</div>
              <div style={{ fontWeight: '800', marginTop: '2px', color: isPhishing ? '#ef4444' : (isSuspicious ? '#f59e0b' : '#10b981') }}>
                {record.result || record.verdict}
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>RISK SCORE</div>
              <div style={{ fontWeight: '800', marginTop: '2px' }}>
                {record.riskScore || '85/100'}
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>TIMESTAMP</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', marginTop: '2px' }}>
                {record.date || record.time || 'Just now'}
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px' }}>ANALYTICAL EXPLANATION</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {isPhishing
                ? 'High-confidence phishing indicators identified. Lexical entropy and pattern analysis confirm domain spoofing or deceptive call-to-action prompts.'
                : 'Scanned item cleared security checks. No threat indicators or malicious characteristics detected.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button onClick={onExportPdf} className="btn-primary">
            <Download size={16} /> Export PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
