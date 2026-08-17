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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px', margin: '0 auto' }}>
      {/* ── Top Badge & Title ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #635fec, #4338ca)',
            color: '#ffffff',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '0.9rem',
            boxShadow: '0 2px 10px rgba(99, 95, 236, 0.45)',
            flexShrink: 0
          }}>
            5
          </div>
          <span style={{
            fontWeight: '900',
            fontSize: '0.88rem',
            letterSpacing: '0.08em',
            color: '#818cf8',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase'
          }}>
            URL DETECTION SCREEN
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', fontWeight: '800' }}>{t.urlDetection || 'URL Detection'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {t.urlScannerDesc || 'Analyze any URL for potential threats'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
            <button className="btn-icon" title={t.scanHistory || 'Scan History'}><Clock size={16} /></button>
            <button className="btn-icon" title={t.exportPdf || 'Export Results'}><Download size={16} /></button>
            <button className="btn-icon" title="Documentation"><Info size={16} /></button>
          </div>
        </div>
      </div>

      {/* ── Mobile Feature Capability Hero (Electric Indigo #635fec Blocks) ── */}
      <div className="mobile-feature-hero">
        <div className="mobile-feature-header">
          <div className="mobile-feature-title-wrap">
            <div className="mobile-feature-icon-badge">
              <Globe size={18} />
            </div>
            <div>
              <div className="mobile-feature-title">URL Phishing Detection</div>
              <div className="mobile-feature-tag">Real-Time Threat Analysis</div>
            </div>
          </div>
        </div>

        {/* 4 Capability Blocks */}
        <div className="mobile-capability-grid">
          <div className="mobile-capability-pill">
            <span className="mobile-cap-emoji">🛡️</span>
            <div className="mobile-cap-text">
              <span className="mobile-cap-name">Typosquatting</span>
              <span className="mobile-cap-sub">Domain spoofing detection</span>
            </div>
          </div>

          <div className="mobile-capability-pill">
            <span className="mobile-cap-emoji">🌐</span>
            <div className="mobile-cap-text">
              <span className="mobile-cap-name">Raw IP Hosting</span>
              <span className="mobile-cap-sub">Direct IP bypass analysis</span>
            </div>
          </div>

          <div className="mobile-capability-pill">
            <span className="mobile-cap-emoji">🔒</span>
            <div className="mobile-cap-text">
              <span className="mobile-cap-name">SSL Anomalies</span>
              <span className="mobile-cap-sub">Cert chain & validity check</span>
            </div>
          </div>

          <div className="mobile-capability-pill">
            <span className="mobile-cap-emoji">🚫</span>
            <div className="mobile-cap-text">
              <span className="mobile-cap-name">Blacklisted Domains</span>
              <span className="mobile-cap-sub">Global threat intelligence</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Input Box & Preset Chips (Exact Match to PDF Page 62 Screen 5) ── */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder="http://165.199.108.153/verify-account"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 18px',
              fontSize: '0.95rem',
              borderRadius: '12px'
            }}
          />
          <button
            onClick={() => handleScan()}
            disabled={isScanning}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem', borderRadius: '12px', flexShrink: 0 }}
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
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Presets:</span>
          <button onClick={() => { setInputUrl('https://paypal-secure-login.com'); handleScan('https://paypal-secure-login.com'); }} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
            paypal-secure-login.com
          </button>
          <button onClick={() => { setInputUrl('https://google.com'); handleScan('https://google.com'); }} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
            google.com
          </button>
          <button onClick={() => { setInputUrl('http://165.199.108.153/verify-account'); handleScan('http://165.199.108.153/verify-account'); }} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
            165.199.108.153 (IP Host)
          </button>
        </div>
      </div>

      {/* ── Result Section (Exact Match to PDF Page 62 Screen 5) ── */}
      {scanResult && (
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top Row: Result Card & Radial Gauge */}
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
              <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.05em' }}>
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

            {/* Risk Score Semicircle Arc Radial Gauge */}
            <RadialGauge
              score={scanResult.riskScore}
              label={scanResult.riskScore >= 65 ? 'High Risk' : (scanResult.riskScore >= 35 ? 'Medium Risk' : 'Low Risk')}
            />
          </div>

          {/* Middle Section: URL Analysis Details Grid (Exact 6 items from PDF Page 62) */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>{t.urlAnalysisTitle || 'URL Analysis Details'}</h3>
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
            padding: '16px 18px',
            borderRadius: '12px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={22} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t.recommendation || 'Recommendation'}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                {scanResult.recommendation || (t.urlRecommendation || 'Do not visit this URL. Report to your administrator.')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
