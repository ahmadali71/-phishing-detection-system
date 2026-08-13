import React, { useState } from 'react';
import {
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Download,
  Info,
  X,
  Check
} from 'lucide-react';
import { analyzeUrl } from '../utils/urlAnalyzer';

export default function UrlScanner({ onScanComplete, onViewDetail, t }) {
  const [inputUrl, setInputUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({
    verdict: 'Phishing Detected',
    badgeColor: 'danger',
    riskScore: 85,
    fullUrl: 'http://165.199.108.153/verify-account',
    details: {
      domainAge: '2 months',
      ipAddress: '165.199.108.153',
      sslCertificate: 'Invalid',
      redirectCount: '3',
      blacklistStatus: 'Blacklisted',
      hostingCountry: 'High Risk'
    },
    recommendation: 'Do not visit this URL. Report to your administrator.'
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleScan = (urlToScan = inputUrl) => {
    setErrorMessage(null);
    const target = typeof urlToScan === 'string' ? urlToScan.trim() : '';
    if (!target) {
      setErrorMessage('Please enter or paste a valid URL to analyze.');
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      const result = analyzeUrl(target);
      if (result.error) {
        setErrorMessage(result.message);
        setIsScanning(false);
      } else {
        setScanResult(result);
        setIsScanning(false);
        if (onScanComplete) onScanComplete(result);
      }
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '950px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: '800' }}>URL Detection</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Analyze any URL for potential threats
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
          <button className="btn-icon" title="Scan History"><Clock size={16} /></button>
          <button className="btn-icon" title="Export Results"><Download size={16} /></button>
          <button className="btn-icon" title="Documentation"><Info size={16} /></button>
        </div>
      </div>

      {/* Input Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder="Enter or Paste URL here..."
            style={{ flex: 1, minWidth: '220px', padding: '12px 18px', fontSize: '0.95rem' }}
          />
          <button
            onClick={() => handleScan()}
            disabled={isScanning}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            {isScanning ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {errorMessage && (
          <div style={{ marginTop: '10px', color: '#f43f5e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={15} /> {errorMessage}
          </div>
        )}

        {/* Preset sample links */}
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Test Presets:</span>
          <button onClick={() => { setInputUrl('https://paypal-secure-login.com'); handleScan('https://paypal-secure-login.com'); }} className="btn-secondary" style={{ fontSize: '0.73rem', padding: '4px 10px' }}>
            paypal-secure-login.com
          </button>
          <button onClick={() => { setInputUrl('https://google.com'); handleScan('https://google.com'); }} className="btn-secondary" style={{ fontSize: '0.73rem', padding: '4px 10px' }}>
            google.com
          </button>
          <button onClick={() => { setInputUrl('http://165.199.108.153/verify-account'); handleScan('http://165.199.108.153/verify-account'); }} className="btn-secondary" style={{ fontSize: '0.73rem', padding: '4px 10px' }}>
            165.199.108.153 (IP Host)
          </button>
        </div>
      </div>

      {/* Result Section */}
      {scanResult && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Row: Result Banner & Risk Score Radial Gauge */}
          <div className="responsive-grid-2-1" style={{ alignItems: 'stretch' }}>
            {/* Result Box */}
            <div style={{
              padding: '20px',
              borderRadius: '14px',
              background: scanResult.verdict.includes('Phishing') ? 'rgba(239, 68, 68, 0.12)' : (scanResult.verdict.includes('Suspicious') ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'),
              border: `1px solid ${scanResult.verdict.includes('Phishing') ? 'rgba(239, 68, 68, 0.4)' : (scanResult.verdict.includes('Suspicious') ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)')}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Result</div>
              <div style={{
                fontSize: '1.4rem',
                fontWeight: '900',
                color: scanResult.verdict.includes('Phishing') ? '#ef4444' : (scanResult.verdict.includes('Suspicious') ? '#f59e0b' : '#10b981'),
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {scanResult.verdict.includes('Phishing') ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                {scanResult.verdict}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {scanResult.verdict.includes('Phishing')
                  ? 'This URL is malicious and may harm your device or steal your information.'
                  : 'This URL passed security validation checks and appears clean.'}
              </p>
            </div>

            {/* Risk Score Half-Circle Gauge */}
            <div style={{
              padding: '20px',
              borderRadius: '14px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Risk Score</div>
              <div style={{ fontSize: '2.6rem', fontWeight: '900', lineHeight: '1', color: scanResult.riskScore >= 65 ? '#ef4444' : (scanResult.riskScore >= 35 ? '#f59e0b' : '#10b981') }}>
                {scanResult.riskScore}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', marginTop: '4px', color: scanResult.riskScore >= 65 ? '#ef4444' : (scanResult.riskScore >= 35 ? '#f59e0b' : '#10b981') }}>
                {scanResult.riskScore >= 65 ? 'High Risk' : (scanResult.riskScore >= 35 ? 'Medium Risk' : 'Low Risk')}
              </div>
            </div>
          </div>

          {/* Middle Section: URL Analysis Details Grid */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '14px' }}>URL Analysis Details</h3>
            <div className="responsive-grid-3">
              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Domain Age</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', marginTop: '3px' }}>{scanResult.details?.domainAge || '2 months'}</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>IP Address</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>{scanResult.details?.ipAddress || '165.199.108.153'}</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>SSL Certificate</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', marginTop: '3px', color: scanResult.details?.sslCertificate === 'Invalid' ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {scanResult.details?.sslCertificate === 'Invalid' ? <X size={15} color="#ef4444" /> : <Check size={15} color="#10b981" />}
                  {scanResult.details?.sslCertificate || 'Invalid'}
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Redirect Count</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', marginTop: '3px' }}>{scanResult.details?.redirectCount || '3'}</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Blacklist Status</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', marginTop: '3px', color: '#ef4444' }}>{scanResult.details?.blacklistStatus || 'Blacklisted'}</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Hosting</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', marginTop: '3px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <X size={15} color="#ef4444" />
                  {scanResult.details?.hostingCountry || 'High Risk'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Recommendation Banner */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Recommendation</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                {scanResult.recommendation || 'Do not visit this URL. Report to your administrator.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
