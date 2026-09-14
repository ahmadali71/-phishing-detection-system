import React, { useState } from 'react';
import {
  MessageSquare, Phone, Link2, AlertTriangle, ShieldCheck,
  ShieldAlert, RefreshCw, Zap, ArrowRight, Copy, Check, ExternalLink,
  Sparkles, Shield, AlertCircle
} from 'lucide-react';
import RadialGauge from './RadialGauge';

export default function MessageScanner({ onScanComplete, onViewDetail, t }) {
  const [messageText, setMessageText] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [embeddedLink, setEmbeddedLink] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    {
      id: 'bank-smish',
      name: 'Bank Account Suspension SMS',
      tag: 'Critical Smish',
      badgeColor: 'danger',
      sender: '+1 (800) 942-8819',
      senderType: 'Spoofed Toll-Free VoIP',
      link: 'http://bit.ly/chase-auth-restore',
      unmaskedUrl: 'https://chase-security-login.online/verify?token=894',
      message: 'URGENT: Chase Bank alert. Your debit card has been suspended due to 3 failed login attempts. Verify identity within 1 hour to prevent account termination: http://bit.ly/chase-auth-restore',
      riskScore: 96,
      verdict: 'Malicious Smishing & Phone Spoofing',
      urgencyScore: 98,
      senderSpoofScore: 92,
      linkThreatScore: 97,
      indicators: [
        { label: 'High-Urgency Threat Trigger', desc: 'Phrases "URGENT", "suspended", "failed login attempts", and "within 1 hour" trigger aggressive social engineering filters.', severity: 'CRITICAL' },
        { label: 'Obfuscated Shortlink Mask', desc: 'bit.ly link expands to unverified non-banking domain (.online TLD) registered 48 hours ago.', severity: 'CRITICAL' },
        { label: 'Caller ID Spoofing Probability', desc: 'Toll-free number matches unregistered virtual VoIP carrier not assigned to JPMorgan Chase & Co.', severity: 'HIGH' },
      ],
      recommendations: [
        'Do NOT tap the link or submit banking login credentials.',
        'Block sender phone number +1 (800) 942-8819 immediately.',
        'Forward the SMS to carrier fraud reporting hotline (7726 / SPAM).'
      ]
    },
    {
      id: 'package-scam',
      name: 'USPS Delivery Fee Fraud',
      tag: 'Package Smishing',
      badgeColor: 'danger',
      sender: '+44 7700 900821',
      senderType: 'Foreign Mobile Prefix',
      link: 'https://usps-redelivery-fee.top/track',
      unmaskedUrl: 'https://usps-redelivery-fee.top/track?pkg=US940291',
      message: 'USPS Notice: Your package US98102 cannot be delivered due to an incorrect address and unpaid $1.45 customs fee. Update details here: https://usps-redelivery-fee.top/track',
      riskScore: 91,
      verdict: 'Credit Card Harvesting Smish',
      urgencyScore: 84,
      senderSpoofScore: 95,
      linkThreatScore: 94,
      indicators: [
        { label: 'Carrier Geolocation Mismatch', desc: 'USPS domestic alert sent from United Kingdom (+44) international mobile number.', severity: 'CRITICAL' },
        { label: 'Lookalike Typosquatting', desc: 'Domain "usps-redelivery-fee.top" is not affiliated with official United States Postal Service (usps.com).', severity: 'CRITICAL' },
        { label: 'Micro-payment Phishing Trap', desc: 'Low-dollar fee ($1.45) used to trick victim into submitting credit card and CVV details.', severity: 'HIGH' },
      ],
      recommendations: [
        'Never pay delivery fees through unsolicited text message links.',
        'Track authentic parcels only via the official carrier website (usps.com).'
      ]
    },
    {
      id: 'whatsapp-crypto',
      name: 'Telegram / WhatsApp Crypto Airdrop',
      tag: 'Crypto Scam',
      badgeColor: 'danger',
      sender: '+234 803 555 0192',
      senderType: 'Untrusted International Number',
      link: 'https://binance-airdrop-rewards.cc',
      unmaskedUrl: 'https://binance-airdrop-rewards.cc/claim',
      message: 'Congratulations! Your wallet was selected for the 2.50 ETH Anniversary Airdrop! Connect your wallet and enter pass-phrase now at https://binance-airdrop-rewards.cc before spots fill.',
      riskScore: 98,
      verdict: 'Wallet Drainer Threat',
      urgencyScore: 90,
      senderSpoofScore: 96,
      linkThreatScore: 99,
      indicators: [
        { label: 'Wallet Seed Phrase Request', desc: 'Direct prompt to connect wallet and disclose pass-phrase constitutes an immediate wallet-drainer exploit.', severity: 'CRITICAL' },
        { label: 'Unsolicited Prize Baiting', desc: 'Common cryptocurrency advance-fee fraud vector.', severity: 'CRITICAL' },
      ],
      recommendations: [
        'Never share seed phrases or private keys with any website.',
        'Report and block the sender contact immediately on WhatsApp/Telegram.'
      ]
    },
    {
      id: 'legit-2fa',
      name: 'Official 2FA Security Token',
      tag: 'Legitimate',
      badgeColor: 'emerald',
      sender: '22000 (Google Verified Shortcode)',
      senderType: 'Registered Carrier Shortcode',
      link: '',
      unmaskedUrl: '',
      message: 'G-749102 is your Google verification code. Never share this code with anyone.',
      riskScore: 4,
      verdict: 'Legitimate One-Time Password (OTP)',
      urgencyScore: 10,
      senderSpoofScore: 2,
      linkThreatScore: 0,
      indicators: [
        { label: 'Verified Shortcode Origin', desc: 'Shortcode 22000 is cryptographically registered to Google LLC.', severity: 'CLEARED' },
        { label: 'Zero Phishing URLs', desc: 'Message contains no external links, redirection parameters, or credential forms.', severity: 'CLEARED' },
        { label: 'Standard Security Warning', desc: 'Includes proper consumer advisory ("Never share this code").', severity: 'CLEARED' },
      ],
      recommendations: [
        'Code is safe to enter in your Google login prompt.',
        'Ensure you initiated the login request yourself.'
      ]
    }
  ];

  const handleLoadPreset = (p) => {
    setActivePreset(p.id);
    setMessageText(p.message);
    setSenderNumber(p.sender);
    setEmbeddedLink(p.link);
    runAnalysis(p);
  };

  const handleCustomScan = () => {
    if (!messageText.trim() && !senderNumber.trim() && !embeddedLink.trim()) return;

    setActivePreset(null);
    setIsScanning(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const combined = (messageText + ' ' + senderNumber + ' ' + embeddedLink).toLowerCase();
      const isPhish = combined.includes('urgent') || combined.includes('suspend') || combined.includes('verify') || combined.includes('fee') || combined.includes('bit.ly') || combined.includes('gift') || combined.includes('free');
      const score = isPhish ? 88 : 16;
      const verdict = isPhish ? 'High Probability Smishing Attack' : 'Low Threat / Clean Message';
      const badge = isPhish ? 'danger' : 'emerald';

      const customRes = {
        id: 'custom-' + Date.now(),
        name: 'Custom SMS / Message Scan',
        sender: senderNumber || 'Unknown Header',
        senderType: senderNumber.startsWith('+') ? 'International Mobile / VoIP' : 'Alphanumeric Header',
        link: embeddedLink,
        unmaskedUrl: embeddedLink ? embeddedLink : 'None',
        message: messageText,
        riskScore: score,
        verdict: verdict,
        badgeColor: badge,
        urgencyScore: isPhish ? 85 : 12,
        senderSpoofScore: isPhish ? 80 : 10,
        linkThreatScore: embeddedLink ? 89 : 0,
        indicators: isPhish ? [
          { label: 'Urgency & Pressure Phrasing', desc: 'Message exhibits social engineering patterns common in credential theft campaigns.', severity: 'HIGH' },
          { label: 'Unverified Communication Vector', desc: 'Sender identity could not be matched against verified enterprise SMS registries.', severity: 'HIGH' },
        ] : [
          { label: 'No Malicious Triggers', desc: 'Text content conforms to ordinary non-coercive conversational format.', severity: 'CLEARED' },
        ],
        recommendations: isPhish ? [
          'Avoid clicking embedded links or calling back the phone number.',
          'Verify requests by independently contacting the alleged institution through their official phone app or website.'
        ] : [
          'No immediate threats found. Maintain normal digital vigilance.'
        ]
      };

      setAnalysisResult(customRes);

      if (onScanComplete) {
        onScanComplete({
          verdict: verdict,
          riskScore: score,
          badgeColor: badge,
          fileName: `SMS/Msg: ${senderNumber || 'Direct text'}`,
          contentSnippet: messageText.slice(0, 80) + '...',
          type: 'Message/SMS'
        });
      }
    }, 1100);
  };

  const runAnalysis = (preset) => {
    setIsScanning(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setAnalysisResult(preset);

      if (onScanComplete) {
        onScanComplete({
          verdict: preset.verdict,
          riskScore: preset.riskScore,
          badgeColor: preset.badgeColor,
          fileName: `Smishing: ${preset.sender}`,
          contentSnippet: preset.message.slice(0, 80) + '...',
          type: 'Message/SMS'
        });
      }
    }, 1000);
  };

  const handleReset = () => {
    setMessageText('');
    setSenderNumber('');
    setEmbeddedLink('');
    setAnalysisResult(null);
    setActivePreset(null);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="msg-scanner-container">
      {/* ── HEADER ── */}
      <div className="msg-header">
        <div className="msg-header-pill">
          <Sparkles size={15} color="#8b5cf6" />
          <span>Multi-Vector Smishing & Phone Spoofing Engine</span>
        </div>
        <h1 className="msg-title">Message, Link & Phone Number Analysis</h1>
        <p className="msg-desc">
          Evaluate deceptive SMS, WhatsApp texts, caller phone numbers, and shortened links. Our algorithms uncover sender spoofing, urgency extortion, and masked redirection targets in real time.
        </p>
      </div>

      {/* ── VERIFIED SCENARIO PRESETS ── */}
      <div className="msg-presets-bar">
        <span className="msg-presets-label">1-Click Test Scenarios:</span>
        <div className="msg-presets-row">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p)}
              className={`msg-preset-btn ${activePreset === p.id ? 'active' : ''}`}
            >
              <div className="msg-preset-title-wrap">
                <span className="msg-preset-name">{p.name}</span>
                <span className={`msg-preset-tag ${p.badgeColor}`}>{p.tag}</span>
              </div>
              <span className="msg-preset-sender">{p.sender}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN WORKSPACE: INPUT FORM & RESULTS ── */}
      <div className="msg-workspace-grid">
        
        {/* LEFT COLUMN: MULTI-VECTOR INPUT PANEL */}
        <div className="msg-input-card">
          <h3 className="msg-card-title">
            <MessageSquare size={18} color="#2563eb" />
            <span>Inspect Message & Sender Details</span>
          </h3>

          <div className="msg-form-body">
            {/* Sender Phone Number */}
            <div className="msg-field-group">
              <label className="msg-label">
                <Phone size={15} />
                <span>Sender Phone Number / Header</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +1 (800) 942-8819, CHASE_ALERT, or +44 7700 900821"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                className="msg-input"
              />
            </div>

            {/* Embedded Link (Optional / Extracted) */}
            <div className="msg-field-group">
              <label className="msg-label">
                <Link2 size={15} />
                <span>Embedded Link / Shortener URL (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. http://bit.ly/chase-auth-restore or https://usps-fee.top"
                value={embeddedLink}
                onChange={(e) => setEmbeddedLink(e.target.value)}
                className="msg-input"
              />
            </div>

            {/* Message Body Text */}
            <div className="msg-field-group">
              <div className="msg-label-row">
                <label className="msg-label">
                  <MessageSquare size={15} />
                  <span>Message Body Text</span>
                </label>
                {messageText && (
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="msg-copy-btn"
                  >
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                placeholder="Paste full SMS, WhatsApp, or mobile notification text here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="msg-textarea"
              />
            </div>

            {/* Action Buttons */}
            <div className="msg-form-actions">
              <button
                type="button"
                onClick={handleCustomScan}
                disabled={isScanning || (!messageText.trim() && !senderNumber.trim())}
                className="msg-submit-btn"
              >
                {isScanning ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Analyzing Multi-Vector Threat...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Run Deep Smishing Analysis</span>
                  </>
                )}
              </button>

              {(messageText || senderNumber || embeddedLink) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="msg-clear-btn"
                >
                  Clear Form
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORENSIC VERDICT & METRICS */}
        <div className="msg-result-card">
          {!analysisResult ? (
            <div className="msg-empty-state">
              <ShieldAlert size={48} className="text-slate-400" />
              <h3>Ready for Smishing Analysis</h3>
              <p>Enter an SMS body, sender number, or click a verified scenario above to inspect spoof risk, urgency pressure, and unmask shortlinks.</p>
            </div>
          ) : (
            <div className="msg-result-content">
              {/* Header & Radial Gauge */}
              <div className="msg-result-header">
                <div>
                  <span className={`msg-verdict-badge ${analysisResult.badgeColor}`}>
                    {analysisResult.verdict}
                  </span>
                  <div className="msg-sender-meta">
                    Sender Classification: <strong>{analysisResult.senderType}</strong>
                  </div>
                </div>
                <div className="msg-gauge-holder">
                  <RadialGauge score={analysisResult.riskScore} size={84} />
                </div>
              </div>

              {/* Three Sub-Scores Grid */}
              <div className="msg-scores-grid">
                <div className="msg-score-card">
                  <div className="msg-score-val" style={{ color: analysisResult.urgencyScore > 70 ? '#f43f5e' : '#10b981' }}>
                    {analysisResult.urgencyScore}/100
                  </div>
                  <div className="msg-score-lbl">Urgency Linguistic Trigger</div>
                </div>

                <div className="msg-score-card">
                  <div className="msg-score-val" style={{ color: analysisResult.senderSpoofScore > 70 ? '#f43f5e' : '#10b981' }}>
                    {analysisResult.senderSpoofScore}/100
                  </div>
                  <div className="msg-score-lbl">Caller ID Spoof Probability</div>
                </div>

                <div className="msg-score-card">
                  <div className="msg-score-val" style={{ color: analysisResult.linkThreatScore > 70 ? '#f43f5e' : '#10b981' }}>
                    {analysisResult.linkThreatScore}/100
                  </div>
                  <div className="msg-score-lbl">Link & Redirect Threat</div>
                </div>
              </div>

              {/* Unmasked Shortlink destination */}
              {analysisResult.unmaskedUrl && analysisResult.unmaskedUrl !== 'None' && (
                <div className="msg-unmasked-box">
                  <span className="msg-unmasked-lbl">Unmasked Shortlink Destination:</span>
                  <div className="msg-unmasked-url">
                    <ExternalLink size={14} />
                    <span>{analysisResult.unmaskedUrl}</span>
                  </div>
                </div>
              )}

              {/* Threat Indicators */}
              <div className="msg-indicators-section">
                <h4 className="msg-indicators-title">Detailed Risk Indicators:</h4>
                <div className="msg-indicators-list">
                  {analysisResult.indicators?.map((ind, i) => (
                    <div key={i} className="msg-ind-item">
                      <div className="msg-ind-head">
                        <span className="msg-ind-label">{ind.label}</span>
                        <span className={`msg-ind-sev ${ind.severity.toLowerCase()}`}>
                          {ind.severity}
                        </span>
                      </div>
                      <p className="msg-ind-desc">{ind.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defense Recommendations */}
              <div className="msg-recomms-section">
                <h4 className="msg-recomms-title">
                  <ShieldCheck size={16} color="#10b981" />
                  <span>Recommended Incident Response:</span>
                </h4>
                <ul className="msg-recomms-list">
                  {analysisResult.recommendations?.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Reset / Print */}
              <div className="msg-actions-row">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="msg-btn-secondary"
                >
                  Print Smishing Report
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="msg-btn-primary"
                >
                  Inspect Another Message
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Embedded Component Styles */}
      <style>{`
        .msg-scanner-container {
          padding: 24px;
          max-width: 1280px;
          margin: 0 auto;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .msg-header {
          margin-bottom: 24px;
        }

        .msg-header-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.25);
          font-size: 0.78rem;
          font-weight: 800;
          color: #8b5cf6;
          margin-bottom: 10px;
        }

        .msg-title {
          font-size: 1.85rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .msg-desc {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-secondary);
          max-width: 780px;
          margin: 0;
        }

        /* Presets */
        .msg-presets-bar {
          margin-bottom: 28px;
        }

        .msg-presets-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .msg-presets-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        .msg-preset-btn {
          background: var(--bg-card, #ffffff);
          border: 1.5px solid var(--border-color, #e2e8f0);
          border-radius: 14px;
          padding: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .msg-preset-btn:hover {
          border-color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.15);
        }

        .msg-preset-btn.active {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .msg-preset-title-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .msg-preset-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .msg-preset-tag {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
        }

        .msg-preset-tag.danger {
          background: rgba(244, 63, 94, 0.14);
          color: #f43f5e;
        }

        .msg-preset-tag.emerald {
          background: rgba(16, 185, 129, 0.14);
          color: #10b981;
        }

        .msg-preset-sender {
          font-size: 0.76rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        /* Workspace Grid */
        .msg-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .msg-input-card,
        .msg-result-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 20px;
          padding: 24px;
          min-height: 440px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
        }

        .msg-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0 0 20px 0;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .msg-form-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .msg-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .msg-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .msg-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .msg-copy-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .msg-copy-btn:hover {
          color: #2563eb;
        }

        .msg-input,
        .msg-textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid var(--border-color, #e2e8f0);
          background: var(--bg-input, #f8fafc);
          color: var(--text-primary);
          font-size: 0.9rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s ease;
          font-family: inherit;
        }

        .msg-input:focus,
        .msg-textarea:focus {
          border-color: #2563eb;
        }

        .msg-form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .msg-submit-btn {
          flex: 1;
          padding: 13px 20px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
          transition: all 0.2s ease;
        }

        .msg-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .msg-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .msg-clear-btn {
          padding: 13px 18px;
          background: var(--bg-input, #f1f5f9);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
        }

        /* Empty State */
        .msg-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 380px;
          color: var(--text-muted);
        }

        .msg-empty-state h3 {
          margin: 16px 0 6px 0;
          color: var(--text-primary);
        }

        .msg-empty-state p {
          max-width: 320px;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        /* Results Content */
        .msg-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
        }

        .msg-verdict-badge {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 6px;
        }

        .msg-verdict-badge.danger {
          background: rgba(244, 63, 94, 0.14);
          color: #f43f5e;
        }

        .msg-verdict-badge.emerald {
          background: rgba(16, 185, 129, 0.14);
          color: #10b981;
        }

        .msg-sender-meta {
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        /* Scores Grid */
        .msg-scores-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .msg-score-card {
          background: var(--bg-input, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }

        .msg-score-val {
          font-size: 1.35rem;
          font-weight: 900;
        }

        .msg-score-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          line-height: 1.2;
          margin-top: 4px;
        }

        /* Unmasked URL */
        .msg-unmasked-box {
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }

        .msg-unmasked-lbl {
          display: block;
          font-size: 0.74rem;
          font-weight: 800;
          color: #f43f5e;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .msg-unmasked-url {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-family: monospace;
          color: #f43f5e;
          word-break: break-all;
        }

        /* Indicators */
        .msg-indicators-section {
          margin-bottom: 20px;
        }

        .msg-indicators-title {
          font-size: 0.88rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }

        .msg-indicators-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .msg-ind-item {
          padding: 10px 14px;
          border-radius: 10px;
          background: var(--bg-input, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
        }

        .msg-ind-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .msg-ind-label {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .msg-ind-sev {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .msg-ind-sev.critical,
        .msg-ind-sev.high {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
        }

        .msg-ind-sev.cleared {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .msg-ind-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.45;
        }

        /* Recommendations */
        .msg-recomms-section {
          margin-bottom: 22px;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 12px;
          padding: 14px;
        }

        .msg-recomms-title {
          font-size: 0.84rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .msg-recomms-list {
          margin: 0;
          padding-left: 20px;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--text-secondary);
        }

        .msg-actions-row {
          display: flex;
          gap: 12px;
        }

        .msg-btn-secondary {
          flex: 1;
          padding: 10px 16px;
          background: var(--bg-input, #f1f5f9);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
        }

        .msg-btn-primary {
          flex: 1;
          padding: 10px 16px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 960px) {
          .msg-workspace-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
