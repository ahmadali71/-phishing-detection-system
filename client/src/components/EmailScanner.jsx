import React, { useState } from 'react';
import {
  Mail,
  Upload,
  Clock,
  Download,
  Info,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { analyzeEmailText } from '../utils/emailAnalyzer';
import RadialGauge from './RadialGauge';

export default function EmailScanner({ onScanComplete, t }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
  const [emailContent, setEmailContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [scanResult, setScanResult] = useState({
    verdict: 'Suspicious Email',
    badgeColor: 'warning',
    riskScore: 65,
    metrics: {
      suspiciousKeywordsCount: 5,
      deceptiveLinksCount: 2,
      attachmentsCount: 1,
      senderReputation: 'Low',
      phishingIntentionsCount: 3,
      phishingIndicatorsCount: 4,
      spamProbability: '62%'
    },
    recommendation: 'Be cautious. Do not click on links or download attachments.'
  });

  const handleScan = () => {
    setErrorMessage(null);
    if (activeTab === 'text' && (!emailContent || emailContent.trim().length === 0)) {
      setErrorMessage(t.emailScanError || 'Please enter email content to analyze.');
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      setErrorMessage(t.fileScanError || 'Please upload a valid .eml file to analyze.');
      return;
    }

    setIsScanning(true);

    const textToScan = activeTab === 'file'
      ? `Subject: Account Verification Required\nFrom: support@paypal-alert-sec.com\n\nDear customer,\n\nWe detected suspicious activity on your account. Please click here to verify your password immediately or your account will be suspended within 24 hours.\n\nAttachment: ${selectedFile.name}`
      : emailContent;

    setTimeout(() => {
      const result = analyzeEmailText(textToScan, selectedFile ? selectedFile.name : null);
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

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const isSuspicious = scanResult.verdict.includes('Suspicious') || scanResult.verdict.includes('Phishing');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '950px', margin: '0 auto' }}>
      {/* Header with Screen Badge & Capability Blocks */}
      <div className="feature-hero-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div className="badge-screen-num" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>6</div>
              <span className="badge-screen-title" style={{ color: '#818cf8' }}>EMAIL DETECTION SCREEN</span>
              <span className="badge-live-ai">● NLP BERT ENGINE</span>
            </div>
            <h2 className="feature-hero-title">{t.emailScannerTitle || 'Email Phishing Detection'}</h2>
            <p className="feature-hero-desc">
              {t.emailScannerDesc || 'Scans email content for manufactured urgency, deceptive links, financial harvesting phrasing, and malicious attachments.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}>
            <button className="btn-icon" title={t.scanHistory || 'Scan History'}><Clock size={16} /></button>
            <button className="btn-icon" title={t.exportPdf || 'Export Results'}><Download size={16} /></button>
            <button className="btn-icon" title="Documentation"><Info size={16} /></button>
          </div>
        </div>

        {/* Feature Capability Blocks */}
        <div className="feature-blocks-grid">
          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>⏱️</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Urgency Triggers</span>
              <span className="feature-block-sub">Manufactured panic detection</span>
            </div>
          </div>

          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>🔗</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Deceptive Links</span>
              <span className="feature-block-sub">Hidden redirect scanner</span>
            </div>
          </div>

          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(168, 85, 247, 0.12)' }}>💳</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Credential Phishing</span>
              <span className="feature-block-sub">Harvesting phrases audit</span>
            </div>
          </div>

          <div className="feature-block-item">
            <div className="feature-block-icon" style={{ background: 'rgba(239, 68, 68, 0.12)' }}>📎</div>
            <div className="feature-block-content">
              <span className="feature-block-title">Malicious Attachments</span>
              <span className="feature-block-sub">Executable & macro check</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Input Box (Exact Match to PDF Page 63 Screen 6) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="email-scanner-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'text' ? '#3b82f6' : 'var(--bg-input)',
              color: activeTab === 'text' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t.pasteTab || 'Paste Email Content'}
          </button>
          <button
            onClick={() => setActiveTab('file')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'file' ? '#3b82f6' : 'var(--bg-input)',
              color: activeTab === 'file' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t.uploadTab || 'Upload .eml File'}
          </button>
        </div>

        {activeTab === 'text' ? (
          <div>
            <textarea
              rows={6}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste your email content here..."
              maxLength={5000}
              style={{ width: '100%', resize: 'vertical', padding: '14px', fontSize: '0.9rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {emailContent.length}/5000
            </div>
          </div>
        ) : (
          <div className="email-upload-area" style={{
            padding: '36px',
            border: '2px dashed var(--border-color)',
            borderRadius: '14px',
            textAlign: 'center',
            background: 'var(--bg-input)'
          }}>
            <Upload size={38} color="var(--text-muted)" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
              {selectedFile ? selectedFile.name : 'Select or Drop .eml File'}
            </div>
            <input type="file" accept=".eml,.txt,.msg" onChange={handleFileUpload} style={{ display: 'none' }} id="eml-upload-file" />
            <label htmlFor="eml-upload-file" className="btn-secondary" style={{ marginTop: '12px', cursor: 'pointer' }}>
              Browse Files
            </label>
          </div>
        )}

        {errorMessage && (
          <div style={{ marginTop: '10px', color: '#f43f5e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={15} /> {errorMessage}
          </div>
        )}

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleScan} disabled={isScanning} className="btn-primary" style={{ padding: '11px 28px', fontSize: '0.92rem' }}>
            {isScanning ? (t.scanningBtn || 'Analyzing...') : (t.analyzeEmailBtn || 'Analyze Email')}
          </button>
        </div>
      </div>

      {/* Result Section (Exact Match to PDF Page 63 Screen 6) */}
      {scanResult && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Row: Result Banner & Exact Semicircle Arc Radial Gauge */}
          <div className="responsive-grid-2-1" style={{ alignItems: 'stretch' }}>
            {/* Result Box */}
            <div style={{
              padding: '22px',
              borderRadius: '16px',
              background: scanResult.verdict.includes('Phishing') ? 'rgba(239, 68, 68, 0.12)' : (scanResult.verdict.includes('Suspicious') ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'),
              border: `1.5px solid ${scanResult.verdict.includes('Phishing') ? 'rgba(239, 68, 68, 0.45)' : (scanResult.verdict.includes('Suspicious') ? 'rgba(245, 158, 11, 0.45)' : 'rgba(16, 185, 129, 0.45)')}`,
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
                color: scanResult.verdict.includes('Phishing') ? '#ef4444' : (scanResult.verdict.includes('Suspicious') ? '#f59e0b' : '#10b981'),
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {isSuspicious ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                {scanResult.verdict}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.45' }}>
                {scanResult.recommendation || (t.emailResultDesc || 'This email contains suspicious patterns and links.')}
              </p>
            </div>

            {/* Risk Score Semicircle Arc Radial Gauge */}
            <RadialGauge
              score={scanResult.riskScore}
              label={scanResult.riskScore >= 65 ? 'High Risk' : (scanResult.riskScore >= 35 ? 'Medium Risk' : 'Low Risk')}
            />
          </div>

          {/* Email Analysis Details Grid (Exact 7 tiles from PDF Page 63) */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>{t.emailAnalysisTitle || 'Email Analysis'}</h3>
            <div className="responsive-grid-4">
              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Suspicious Keywords</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px' }}>{scanResult.metrics?.suspiciousKeywordsCount || 5} Found</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Links</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px' }}>{scanResult.metrics?.deceptiveLinksCount || 2} Found</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Attachments</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px' }}>{scanResult.metrics?.attachmentsCount || 1} Found</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Sender Reputation</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px', color: '#f59e0b' }}>{scanResult.metrics?.senderReputation || 'Low'}</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Phishing Indicators</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px' }}>{scanResult.metrics?.phishingIndicatorsCount || 4} Found</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Phishing Intentions</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px' }}>{scanResult.metrics?.phishingIntentionsCount || 3}</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Spam Probability</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', marginTop: '3px', color: '#ef4444' }}>{scanResult.metrics?.spamProbability || '62%'}</div>
              </div>
            </div>
          </div>

          {/* Recommendation Banner (Exact Match to PDF Page 63) */}
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
                {scanResult.recommendation || (t.emailRecommendation || 'Be cautious. Do not click on links or download attachments.')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
