import React, { useState } from 'react';
import {
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Info,
  X,
  Check
} from 'lucide-react';
import { analyzeUrl } from '../utils/urlAnalyzer';
import RadialGauge from './RadialGauge';

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
      hostingRisk: 'High Risk'
    },
    recommendation: 'Do not visit this URL. Report to your administrator.'
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleScan = (urlToScan = inputUrl) => {
    setErrorMessage(null);
    const target = typeof urlToScan === 'string' ? urlToScan.trim() : '';
    if (!target) {
      setErrorMessage(t.urlScanError || 'Please enter or paste a valid URL to analyze.');
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

  const det = scanResult.details || {};
  const isPhishing = scanResult.verdict?.includes('Phishing');

  const detailItems = [
    { labelKey: 'domainAge', label: t.domainAge || 'Domain Age', value: det.domainAge || '2 months' },
    { labelKey: 'ipAddress', label: t.ipAddress || 'IP Address', value: det.ipAddress || '165.199.108.153', mono: true },
    {
      labelKey: 'sslCertificate',
      label: t.sslCertificate || 'SSL Certificate',
      value: det.sslCertificate || 'Invalid',
      icon: (det.sslCertificate === 'Valid' || (det.sslCertificate && det.sslCertificate.includes('Valid'))) ? <Check size={15} color="#10b981" /> : <X size={15} color="#ef4444" />,
      color: (det.sslCertificate === 'Valid' || (det.sslCertificate && det.sslCertificate.includes('Valid'))) ? '#10b981' : '#ef4444'
    },
    { labelKey: 'redirectCount', label: t.redirectCount || 'Redirect Count', value: det.redirectCount || '3' },
    { labelKey: 'blacklistStatus', label: t.blacklistStatus || 'Blacklist Status', value: det.blacklistStatus || 'Blacklisted', color: '#ef4444' },
    {
      labelKey: 'hostingRisk',
      label: t.hostingRisk || 'Hosting',
      value: det.hostingRisk || det.hostingCountry || 'High Risk',
      icon: <X size={15} color="#ef4444" />,
      color: '#ef4444'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '950px', margin: '0 auto' }}>
      {/* Header with Screen Badge & Capability Blocks */}
      <div className="feature-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div className="badge-screen-num">5</div>
              <span className="badge-screen-title">URL DETECTION SCREEN</span>
              <span className="badge-live-ai">● LIVE ML SCANNER</span>
            </div>
            <h2 className="feature-hero-title">{t.urlScannerTitle || 'URL Phishing Detection'}</h2>
            <p className="feature-hero-desc">
              {t.urlScannerDesc || 'Analyze any website link in real time to detect typosquatting, raw IP hosting, SSL anomalies, and blacklisted domains.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
            <button className="btn-icon" title={t.scanHistory || 'Scan History'}><Clock size={16} /></button>
            <button className="btn-icon" title={t.exportPdf || 'Export Results'}><Download size={16} /></button>
            <button className="btn-icon" title="Documentation"><Info size={16} /></button>
          </div>
        </div>

        {/* Feature Capability Blocks (Highlighted on Mobile & Desktop) */}
        <div className="feature-blocks-grid">
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>🛡️</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Typosquatting</span>
              <span className="feature-block-sub">Domain spoofing detection</span>
            </div>
          </div>

          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>🌐</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Raw IP Hosting</span>
              <span className="feature-block-sub">Direct IP bypass analysis</span>
            </div>
          </div>

          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>🔒</div>
            <div className="feature-block-content">
              <span className="feature-block-title">SSL Anomalies</span>
              <span className="feature-block-sub">Cert chain & validity check</span>
            </div>
          </div>

          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>🚫</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Blacklisted Domains</span>
              <span className="feature-block-sub">Global threat match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Panel (Exact Match to PDF Page 62 Screen 5) */}
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
            {isScanning ? (t.scanningBtn || 'Analyzing...') : (t.analyzeBtn || 'Analyze')}
          </button>
        </div>

        {errorMessage && (
          <div style={{ marginTop: '10px', color: '#f43f5e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={15} /> {errorMessage}
          </div>
        )}

        {/* Preset sample links */}
        <div className="url-scanner-presets" style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>{t.testPresets || 'Test Presets:'}</span>
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

      {/* Result Section (Exact Match to PDF Page 62 Screen 5) */}
      {scanResult && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Row: Result Banner & Exact Semicircle Arc Radial Gauge */}
          <div className="responsive-grid-2-1" style={{ alignItems: 'stretch' }}>
            {/* Result Box */}
            <div style={{
              padding: '22px',
              borderRadius: '16px',
              background: isPhishing ? 'rgba(239, 68, 68, 0.12)' : (scanResult.verdict.includes('Suspicious') ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'),
              border: `1.5px solid ${isPhishing ? 'rgba(239, 68, 68, 0.45)' : (scanResult.verdict.includes('Suspicious') ? 'rgba(245, 158, 11, 0.45)' : 'rgba(16, 185, 129, 0.45)')}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                {t.result || 'Result'}
              </div>
              <div style={{
                fontSize: '1.45rem',
                fontWeight: '900',
                color: isPhishing ? '#ef4444' : (scanResult.verdict.includes('Suspicious') ? '#f59e0b' : '#10b981'),
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {isPhishing ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                {scanResult.verdict}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.45' }}>
                {isPhishing
                  ? (t.urlPhishingMsg || 'This URL is malicious and may harm your device or steal your information.')
                  : (t.urlSafeMsg || 'This URL passed security validation checks and appears clean.')}
              </p>
            </div>

            {/* Risk Score Semicircle Arc Radial Gauge (Exact Match to User Screenshot) */}
            <RadialGauge
              score={scanResult.riskScore}
              label={scanResult.riskScore >= 65 ? 'High Risk' : (scanResult.riskScore >= 35 ? 'Medium Risk' : 'Low Risk')}
            />
          </div>

          {/* Middle Section: URL Analysis Details Grid (Exact 6 items from PDF Page 62) */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>{t.urlAnalysisTitle || 'URL Analysis Details'}</h3>
            <div className="responsive-grid-3">
              {detailItems.map((item, idx) => (
                <div key={idx} style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>{item.label}</div>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: '800',
                    marginTop: '4px',
                    color: item.color || 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: item.mono ? 'var(--font-mono)' : 'inherit'
                  }}>
                    {item.icon}
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Recommendation Banner (Exact Match to PDF Page 62) */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={22} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t.recommendation || 'Recommendation'}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                {scanResult.recommendation || (t.urlRecommendation || 'Do not visit this URL. Report to your administrator.')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
