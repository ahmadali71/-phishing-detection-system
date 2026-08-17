import React, { useState } from 'react';
import {
  Mail, Upload, Clock, Download, Info, AlertTriangle,
  CheckCircle2, FileText, Link, ShieldAlert, Cpu, Sparkles, Check, X
} from 'lucide-react';
import { analyzeEmailText } from '../utils/emailAnalyzer';
import RadialGauge from './RadialGauge';

export default function EmailScanner({ onScanComplete, t }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
  const [emailContent, setEmailContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = (contentToScan = null) => {
    setErrorMessage(null);
    const targetText = contentToScan || (activeTab === 'file'
      ? `Subject: Urgent Invoice Overdue #8921\nFrom: billing@finance-update-secure.top\n\nDear User,\nYour account payment failed. Please click here to update your payment method and verify your password within 24 hours to prevent account suspension.\n\nAttachment: ${selectedFile?.name || 'invoice.pdf.exe'}`
      : emailContent);

    if (!targetText || targetText.trim().length === 0) {
      setErrorMessage(t.emailScanError || 'Please enter email content or select a preset to analyze.');
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      const result = analyzeEmailText(targetText, selectedFile ? selectedFile.name : null);
      if (result.error) {
        setErrorMessage(result.message);
        setIsScanning(false);
      } else {
        setScanResult(result);
        setIsScanning(false);
        if (onScanComplete) onScanComplete(result);
      }
    }, 500);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setEmailContent(text);
      };
      reader.readAsText(file);
    }
  };

  const isPhishing = scanResult?.verdict?.includes('Phishing');
  const isSuspicious = scanResult?.verdict?.includes('Suspicious');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px', margin: '0 auto' }}>
      {/* ── Desktop Top Badge & Title (Hidden on Mobile) ── */}
      <div className="desktop-header-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#ffffff',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '0.9rem',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
            flexShrink: 0
          }}>
            6
          </div>
          <span style={{
            fontWeight: '900',
            fontSize: '0.88rem',
            letterSpacing: '0.08em',
            color: '#818cf8',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase'
          }}>
            {t.emailDetectionHeader || 'EMAIL DETECTION SCREEN'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', fontWeight: '800' }}>NLP Email Threat Inspector</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Deep linguistic and semantic scanning for social engineering, urgency coercions, and embedded malicious links.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile Vibrant Hero Banner (ONLY ON MOBILE) ── */}
      <div className="mobile-vibrant-hero">
        <div className="mobile-vibrant-hero-content">
          <h2 className="mobile-vibrant-hero-title">Email Phishing Detection</h2>
          <p className="mobile-vibrant-hero-desc">
            Scans email content for manufactured urgency, deceptive links, financial harvesting phrasing, and malicious attachments.
          </p>
          <div className="mobile-vibrant-chips">
            <div className="mobile-vibrant-chip-item">⏱️ Urgency Triggers</div>
            <div className="mobile-vibrant-chip-item">🔗 Deceptive Links</div>
            <div className="mobile-vibrant-chip-item">💳 Credential Phishing</div>
            <div className="mobile-vibrant-chip-item">📎 Malicious Files</div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('email-scan-textarea');
              if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth' }); }
            }}
            className="mobile-vibrant-hero-btn"
          >
            Analyze Now →
          </button>
        </div>
        <div className="mobile-vibrant-hero-circle">
          <Mail size={42} strokeWidth={2.2} />
        </div>
      </div>

      {/* ── Tabs & Input Box ── */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        <div className="email-scanner-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'text' ? '#635fec' : 'var(--bg-input)',
              color: activeTab === 'text' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-display)',
              boxShadow: activeTab === 'text' ? '0 4px 12px rgba(99, 95, 236, 0.35)' : 'none'
            }}
          >
            {t.pasteTab || 'Paste Email Content'}
          </button>
          <button
            onClick={() => setActiveTab('file')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'file' ? '#635fec' : 'var(--bg-input)',
              color: activeTab === 'file' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-display)',
              boxShadow: activeTab === 'file' ? '0 4px 12px rgba(99, 95, 236, 0.35)' : 'none'
            }}
          >
            {t.uploadTab || 'Upload .eml File'}
          </button>
        </div>

        {activeTab === 'text' ? (
          <div>
            <textarea
              id="email-scan-textarea"
              rows={5}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste email headers, subject line, or body text here..."
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                fontSize: '0.92rem',
                lineHeight: '1.55',
                resize: 'vertical',
                border: '1.5px solid var(--border-color)'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>{emailContent.length} / 5000 characters</span>
            </div>
          </div>
        ) : (
          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: '14px',
            padding: '30px 20px',
            textAlign: 'center',
            background: 'var(--bg-input)'
          }}>
            <Upload size={32} color="#635fec" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Drag &amp; Drop .eml or .txt message file</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Supports standard RFC 822 email format</div>
            <input
              type="file"
              accept=".eml,.msg,.txt"
              onChange={handleFileUpload}
              style={{ marginTop: '12px', fontSize: '0.82rem' }}
            />
            {selectedFile && (
              <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#10b981', fontWeight: '700' }}>
                ✓ Selected: {selectedFile.name}
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <div style={{ marginTop: '12px', color: '#ef4444', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
            <AlertTriangle size={15} /> {errorMessage}
          </div>
        )}

        {/* 1-Click Live Presets */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Presets:
          </span>
          <button
            onClick={() => {
              const sample = `Subject: URGENT: Account Suspension Notice\nFrom: "PayPal Security Team" <security-alerts@paypal-verify-account.xyz>\n\nDear Customer,\nWe detected unauthorized login attempts from IP 185.220.101.5. To protect your funds, your account has been locked. You must verify your password and confirm billing details within 24 hours at http://paypal-secure-login.xyz/verify or your account will be permanently terminated.`;
              setEmailContent(sample);
              handleScan(sample);
            }}
            className="btn-secondary"
            style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            🔴 Phishing: Urgent Account Lock
          </button>
          <button
            onClick={() => {
              const sample = `Subject: Direct Wire Transfer Request\nFrom: "CEO Office" <ceo.office.direct@gmail.com>\n\nHi finance team,\nI am currently in an urgent confidential meeting. Please initiate an immediate wire transfer of $45,000 to our new vendor invoice account. Send payment receipt immediately.`;
              setEmailContent(sample);
              handleScan(sample);
            }}
            className="btn-secondary"
            style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
          >
            🔴 BEC: CEO Wire Transfer
          </button>
          <button
            onClick={() => {
              const sample = `Subject: Department Curriculum Committee Meeting\nFrom: "Dr. Shaista Ghafoor" <shaista.ghafoor@uos.edu.pk>\n\nDear Faculty Members,\nPlease find attached the agenda for the upcoming Board of Studies meeting scheduled for tomorrow at 10:30 AM in Conference Room B.\n\nBest regards,\nDepartment of CS & IT, University of Sargodha`;
              setEmailContent(sample);
              handleScan(sample);
            }}
            className="btn-secondary"
            style={{ fontSize: '0.74rem', padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}
          >
            🟢 Safe: UOS Department Meeting
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            onClick={() => handleScan()}
            disabled={isScanning}
            className="btn-primary"
            style={{ padding: '12px 32px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: '800' }}
          >
            {isScanning ? (t.scanningBtn || 'Analyzing...') : (t.analyzeEmailBtn || 'Analyze Email Text')}
          </button>
        </div>
      </div>

      {/* ── Result Section ── */}
      {scanResult && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Row: Result Box & Semicircle Radial Gauge */}
          <div className="responsive-grid-2-1" style={{ alignItems: 'stretch', gap: '18px' }}>
            {/* Result Box */}
            <div style={{
              padding: '24px',
              borderRadius: '16px',
              background: isPhishing
                ? 'rgba(239, 68, 68, 0.12)'
                : (isSuspicious ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)'),
              border: `1.5px solid ${isPhishing ? 'rgba(239, 68, 68, 0.45)' : (isSuspicious ? 'rgba(245, 158, 11, 0.45)' : 'rgba(16, 185, 129, 0.45)')}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.06em' }}>
                NLP Security Verdict
              </div>
              <div style={{
                fontSize: '1.45rem',
                fontWeight: '900',
                color: isPhishing ? '#ef4444' : (isSuspicious ? '#f59e0b' : '#10b981'),
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {isPhishing ? <ShieldAlert size={28} /> : (isSuspicious ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />)}
                {scanResult.verdict}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                {scanResult.recommendation}
              </p>
            </div>

            {/* Risk Score Semicircle Arc Radial Gauge */}
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RadialGauge
                score={scanResult.riskScore}
                label={scanResult.riskScore >= 60 ? 'Phishing Risk' : (scanResult.riskScore >= 25 ? 'Suspicious' : 'Clean')}
              />
            </div>
          </div>

          {/* Detected Keywords Chips */}
          {scanResult.keywordsFound && scanResult.keywordsFound.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🔑 Detected Threat Phrases &amp; Harvesting Prompts:
              </h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {scanResult.keywordsFound.map((kw, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Flagged Threat Indicators */}
          {scanResult.indicators && scanResult.indicators.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: '800', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="#635fec" /> NLP Semantic Threat Indicators ({scanResult.indicators.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scanResult.indicators.map((ind, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: ind.severity === 'danger' ? 'rgba(239,68,68,0.1)' : (ind.severity === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'),
                      border: `1px solid ${ind.severity === 'danger' ? 'rgba(239,68,68,0.3)' : (ind.severity === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)')}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {ind.severity === 'danger' ? <AlertTriangle size={16} color="#ef4444" /> : (ind.severity === 'warning' ? <AlertTriangle size={16} color="#f59e0b" /> : <Check size={16} color="#10b981" />)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.84rem', color: ind.severity === 'danger' ? '#ef4444' : (ind.severity === 'warning' ? '#f59e0b' : '#10b981') }}>
                        {ind.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {ind.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Analysis Details Grid (Screen 6) */}
          <div>
            <h4 style={{ fontSize: '0.94rem', fontWeight: '800', marginBottom: '12px' }}>{t.emailAnalysisTitle || 'NLP Forensic Metrics'}</h4>
            <div className="responsive-grid-4">
              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Suspicious Keywords</div>
                <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '3px', color: (scanResult.metrics?.suspiciousKeywordsCount > 0 ? '#ef4444' : '#10b981') }}>
                  {scanResult.metrics?.suspiciousKeywordsCount || 0} Found
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Deceptive Links</div>
                <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '3px', color: (scanResult.metrics?.deceptiveLinksCount > 0 ? '#ef4444' : '#10b981') }}>
                  {scanResult.metrics?.deceptiveLinksCount || 0} Found
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Attachments</div>
                <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '3px' }}>
                  {scanResult.metrics?.attachmentsCount || 0} Attached
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Sender Reputation</div>
                <div style={{ fontSize: '0.86rem', fontWeight: '800', marginTop: '3px', color: isPhishing ? '#ef4444' : (isSuspicious ? '#f59e0b' : '#10b981') }}>
                  {scanResult.metrics?.senderReputation}
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Phishing Indicators</div>
                <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '3px' }}>
                  {scanResult.metrics?.phishingIndicatorsCount || 0} Signals
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Word &amp; Token Count</div>
                <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '3px' }}>
                  {scanResult.metrics?.wordCount || 0} Words
                </div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '700' }}>Spam Probability</div>
                <div style={{ fontSize: '1rem', fontWeight: '900', marginTop: '3px', color: isPhishing ? '#ef4444' : (isSuspicious ? '#f59e0b' : '#10b981') }}>
                  {scanResult.metrics?.spamProbability}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Security Recommendation */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: isPhishing ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-input)',
            border: `1.5px solid ${isPhishing ? 'rgba(239, 68, 68, 0.35)' : 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <AlertTriangle size={24} color={isPhishing ? '#ef4444' : '#f59e0b'} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {t.recommendation || 'Actionable Defense Guidance'}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.45' }}>
                {scanResult.recommendation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
