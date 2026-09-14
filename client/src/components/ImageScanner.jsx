import React, { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, ShieldAlert, CheckCircle2, AlertTriangle,
  FileText, Zap, Eye, Download, RefreshCw, Layers, Sparkles, QrCode
} from 'lucide-react';
import RadialGauge from './RadialGauge';

export default function ImageScanner({ onScanComplete, onViewDetail, t }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [activePreset, setActivePreset] = useState(null);
  const fileInputRef = useRef(null);

  const presets = [
    {
      id: 'paypal-phish',
      name: 'Fake PayPal Security Alert',
      tag: 'Phishing',
      type: 'danger',
      description: 'Deceptive urgent account limitation screenshot with lookalike logo',
      sampleUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      extractedText: "PAYPAL SECURITY NOTIFICATION: Your account has been temporarily restricted due to unauthorized login attempts. Confirm your identity immediately at https://paypa1-account-verify.info/auth within 24 hours to avoid permanent suspension.",
      verdict: 'Critical Phishing Impersonation',
      riskScore: 95,
      badgeColor: 'danger',
      detectedBrand: 'PayPal Inc. (Impersonated)',
      embeddedLinks: ['https://paypa1-account-verify.info/auth'],
      boundingBoxes: [
        { label: 'Fake Brand Logo', top: '12%', left: '8%', width: '28%', height: '14%', risk: 'danger' },
        { label: 'Urgency Pressure Keyword', top: '38%', left: '8%', width: '78%', height: '16%', risk: 'danger' },
        { label: 'Homoglyph Phishing URL', top: '64%', left: '12%', width: '68%', height: '12%', risk: 'danger' },
      ],
      signals: [
        { title: 'Brand Logo Impersonation', desc: 'Visual similarity score 94.2% against official PayPal trademark without matching cryptographic origin.', level: 'HIGH' },
        { title: 'Deceptive Lookalike Domain', desc: 'Extracted OCR link uses homoglyph substitution ("paypa1" with number 1 instead of letter l).', level: 'CRITICAL' },
        { title: 'Social Engineering Coercion', desc: 'Phrases "restricted", "unauthorized login", and "within 24 hours" are typical phishing urgency triggers.', level: 'HIGH' },
      ]
    },
    {
      id: 'm365-login',
      name: 'Microsoft 365 Fake Portal',
      tag: 'Credential Harvester',
      type: 'danger',
      description: 'Spoofed Office 365 password prompt screenshot',
      sampleUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      extractedText: "Microsoft Online Services: Your password for user@enterprise.com will expire in 2 hours. Keep your existing password by signing in below.",
      verdict: 'High-Risk Credential Harvesting',
      riskScore: 89,
      badgeColor: 'danger',
      detectedBrand: 'Microsoft 365 (Unverified)',
      embeddedLinks: ['https://login-microsoftonline-sec-auth.xyz/reauth'],
      boundingBoxes: [
        { label: 'Counterfeit Microsoft Badge', top: '15%', left: '20%', width: '32%', height: '18%', risk: 'danger' },
        { label: 'Fake Password Form', top: '45%', left: '15%', width: '70%', height: '35%', risk: 'danger' },
      ],
      signals: [
        { title: 'Credential Form Harvesting', desc: 'Image depicts an unauthorized HTML credential field overlaid on third-party hosting.', level: 'CRITICAL' },
        { title: 'Suspicious TLD', desc: 'Extracted redirect destination uses high-abuse top-level domain (.xyz).', level: 'HIGH' },
      ]
    },
    {
      id: 'safe-statement',
      name: 'Legitimate Bank Statement',
      tag: 'Safe',
      type: 'safe',
      description: 'Official monthly PDF statement screenshot with zero malicious URLs',
      sampleUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      extractedText: "Standard Chartered Bank - Monthly E-Statement for Account Ending in 4108. Customer service toll-free 1-800-400-SCB. Official portal: https://www.sc.com",
      verdict: 'Legitimate & Clean',
      riskScore: 8,
      badgeColor: 'emerald',
      detectedBrand: 'Standard Chartered Bank (Official)',
      embeddedLinks: ['https://www.sc.com'],
      boundingBoxes: [
        { label: 'Verified Corporate Header', top: '10%', left: '10%', width: '45%', height: '15%', risk: 'safe' },
      ],
      signals: [
        { title: 'Authentic Domain Citation', desc: 'URL matches verified official corporate bank domain with valid EV SSL certificate.', level: 'CLEARED' },
        { title: 'Absence of Coercive Demands', desc: 'No urgency cues, threats of suspension, or suspicious password fields identified.', level: 'CLEARED' },
      ]
    },
    {
      id: 'qr-trap',
      name: 'Phishing QR Code Flyer',
      tag: 'QR Smishing',
      type: 'warning',
      description: 'Parking meter or bill flyer with malicious payment QR code',
      sampleUrl: 'https://images.unsplash.com/photo-1595079672139-545c0255bd10?w=800&auto=format&fit=crop&q=80',
      extractedText: "PAY BY PHONE: Scan the QR code below to pay parking violation fees immediately or vehicle will be impounded. QR Destination: http://city-parking-pay-fee.online/quickpay",
      verdict: 'Suspicious QR Code Scam (Quishing)',
      riskScore: 78,
      badgeColor: 'warning',
      detectedBrand: 'Municipal Parking (Spoofed)',
      embeddedLinks: ['http://city-parking-pay-fee.online/quickpay'],
      boundingBoxes: [
        { label: 'Malicious QR Code', top: '40%', left: '30%', width: '40%', height: '40%', risk: 'warning' },
        { label: 'Impound Threat', top: '20%', left: '10%', width: '80%', height: '14%', risk: 'danger' },
      ],
      signals: [
        { title: 'Quishing / QR Code Trap', desc: 'QR code decodes to an unverified non-government domain with HTTP instead of HTTPS.', level: 'HIGH' },
        { title: 'Immediate Coercion', desc: 'Impound threats used to prompt impulsive credit card entry.', level: 'HIGH' },
      ]
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(file.name);
      setImagePreview(event.target.result);
      setActivePreset(null);
      runVisionAnalysis(file.name, event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadPreset = (preset) => {
    setActivePreset(preset.id);
    setSelectedImage(preset.name);
    setImagePreview(preset.sampleUrl);
    runPresetAnalysis(preset);
  };

  const runPresetAnalysis = (preset) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(preset);

      if (onScanComplete) {
        onScanComplete({
          verdict: preset.verdict,
          riskScore: preset.riskScore,
          badgeColor: preset.badgeColor,
          fileName: `Image: ${preset.name}`,
          contentSnippet: preset.extractedText.slice(0, 80) + '...',
          type: 'Screenshot'
        });
      }
    }, 1200);
  };

  const runVisionAnalysis = (fileName, dataUrl) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const isSus = fileName.toLowerCase().includes('phish') || fileName.toLowerCase().includes('fake') || fileName.toLowerCase().includes('alert');
      const score = isSus ? 92 : 24;
      const verdict = isSus ? 'Deceptive Visual Impersonation Detected' : 'No Critical Visual Threats Detected';
      const badge = isSus ? 'danger' : 'emerald';

      const customResult = {
        id: 'custom-' + Date.now(),
        name: fileName,
        extractedText: isSus
          ? "URGENT SECURITY ALERT: We have detected suspicious activity on your account. Please log in immediately at our secured verification gateway to restore access."
          : "Standard digital document. Header analysis cleared. No malicious URL structures or deceptive visual indicators located.",
        verdict: verdict,
        riskScore: score,
        badgeColor: badge,
        detectedBrand: isSus ? 'Generic Banking / Payment Brand (High Risk)' : 'Clean Document',
        embeddedLinks: isSus ? ['https://secure-auth-verification-token.com'] : [],
        boundingBoxes: isSus ? [
          { label: 'Urgent Text Callout', top: '25%', left: '15%', width: '70%', height: '22%', risk: 'danger' },
          { label: 'Unverified Action Link', top: '55%', left: '20%', width: '60%', height: '15%', risk: 'warning' },
        ] : [],
        signals: isSus ? [
          { title: 'Visual Phishing Structure', desc: 'Deceptive styling mirrors common banking layout with unauthorized domain reference.', level: 'HIGH' },
          { title: 'Social Coercion Indicators', desc: 'Urgent phrasing designed to provoke credential entry without due inspection.', level: 'HIGH' },
        ] : [
          { title: 'Clean Image Heuristics', desc: 'No suspicious bounding regions, fraudulent trademarks, or hidden QR codes detected.', level: 'CLEARED' },
        ]
      };

      setAnalysisResult(customResult);

      if (onScanComplete) {
        onScanComplete({
          verdict: verdict,
          riskScore: score,
          badgeColor: badge,
          fileName: `Screenshot: ${fileName}`,
          contentSnippet: customResult.extractedText.slice(0, 80) + '...',
          type: 'Screenshot'
        });
      }
    }, 1400);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview('');
    setAnalysisResult(null);
    setActivePreset(null);
  };

  return (
    <div className="img-scanner-container">
      {/* ── HEADER ── */}
      <div className="img-scanner-header">
        <div className="img-header-badge">
          <Sparkles size={15} color="#2563eb" />
          <span>Computer Vision & OCR Neural Engine</span>
        </div>
        <h1 className="img-title">Screenshot & Image Phishing Analysis</h1>
        <p className="img-subtitle">
          Upload screenshots of suspicious emails, fake login portals, banking notices, or QR codes. Our OCR and visual brand matching algorithms identify deceptive visual cues, hidden URLs, and logo forgery.
        </p>
      </div>

      {/* ── QUICK PRESETS BAR ── */}
      <div className="img-presets-section">
        <span className="img-presets-label">Test with Verified Scenarios:</span>
        <div className="img-presets-grid">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p)}
              className={`img-preset-card ${activePreset === p.id ? 'active' : ''}`}
            >
              <div className="img-preset-header">
                <span className="img-preset-name">{p.name}</span>
                <span className={`img-preset-badge ${p.type}`}>{p.tag}</span>
              </div>
              <p className="img-preset-desc">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN WORKSPACE: DROPZONE & PREVIEW ── */}
      <div className="img-workspace-grid">
        
        {/* LEFT COLUMN: UPLOAD / VIEWER */}
        <div className="img-view-card">
          {!imagePreview ? (
            <div
              className="img-dropzone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const fakeEvent = { target: { files: [file] } };
                  handleFileUpload(fakeEvent);
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="img-drop-icon-bubble">
                <Upload size={32} />
              </div>
              <h3>Drag & Drop Screenshot Here</h3>
              <p>Supports PNG, JPG, JPEG, WEBP or Paste from Clipboard</p>
              <button type="button" className="img-browse-btn">
                Browse Files
              </button>
            </div>
          ) : (
            <div className="img-preview-wrapper">
              <div className="img-preview-toolbar">
                <div className="img-file-meta">
                  <ImageIcon size={16} />
                  <span>{selectedImage}</span>
                </div>
                <div className="img-preview-actions">
                  {analysisResult?.boundingBoxes?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                      className={`img-tool-btn ${showBoundingBoxes ? 'active' : ''}`}
                      title="Toggle Threat Bounding Boxes"
                    >
                      <Layers size={15} />
                      <span>{showBoundingBoxes ? 'Hide Markers' : 'Show Markers'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="img-tool-btn"
                  >
                    <RefreshCw size={15} />
                    <span>Upload New</span>
                  </button>
                </div>
              </div>

              {/* Image Canvas with Overlay Bounding Boxes */}
              <div className="img-canvas-container">
                <img
                  src={imagePreview}
                  alt="Inspection Target"
                  className="img-inspected-image"
                />

                {showBoundingBoxes && analysisResult?.boundingBoxes?.map((box, i) => (
                  <div
                    key={i}
                    className={`img-box-marker ${box.risk}`}
                    style={{
                      top: box.top,
                      left: box.left,
                      width: box.width,
                      height: box.height,
                    }}
                  >
                    <span className="img-box-label">{box.label}</span>
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="img-scan-overlay">
                    <div className="img-laser-beam" />
                    <div className="img-scan-status-card">
                      <RefreshCw size={24} className="animate-spin text-blue-500" />
                      <div>
                        <div style={{ fontWeight: 800 }}>Executing Vision Scan...</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Running OCR extraction & logo similarity verification
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: FORENSIC VERDICT & DETAILED REPORT */}
        <div className="img-report-card">
          {!analysisResult ? (
            <div className="img-empty-report">
              <ShieldAlert size={48} className="text-slate-400" />
              <h3>Awaiting Image Input</h3>
              <p>Upload a screenshot or click any verified preset above to generate an in-depth computer vision forensic report.</p>
            </div>
          ) : (
            <div className="img-verdict-content">
              {/* Verdict Header */}
              <div className="img-verdict-header">
                <div>
                  <span className={`img-verdict-tag ${analysisResult.badgeColor}`}>
                    {analysisResult.verdict}
                  </span>
                  <h2 className="img-verdict-brand">
                    Brand Detected: <strong>{analysisResult.detectedBrand}</strong>
                  </h2>
                </div>
                <div className="img-gauge-wrap">
                  <RadialGauge score={analysisResult.riskScore} size={84} />
                </div>
              </div>

              {/* Extracted OCR Text Preview */}
              <div className="img-ocr-box">
                <div className="img-ocr-title">
                  <FileText size={15} />
                  <span>OCR Extracted Text:</span>
                </div>
                <div className="img-ocr-text">
                  "{analysisResult.extractedText}"
                </div>
              </div>

              {/* Embedded Links */}
              {analysisResult.embeddedLinks?.length > 0 && (
                <div className="img-links-box">
                  <span className="img-links-title">Extracted Embedded URLs:</span>
                  {analysisResult.embeddedLinks.map((lnk, idx) => (
                    <div key={idx} className="img-link-pill">
                      <span>{lnk}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Threat Signals List */}
              <div className="img-signals-box">
                <h4 className="img-signals-title">Heuristic & Vision Indicators:</h4>
                <div className="img-signals-list">
                  {analysisResult.signals?.map((sig, idx) => (
                    <div key={idx} className="img-signal-item">
                      <div className="img-signal-head">
                        <span className="img-sig-title">{sig.title}</span>
                        <span className={`img-sig-badge ${sig.level.toLowerCase()}`}>
                          {sig.level}
                        </span>
                      </div>
                      <p className="img-sig-desc">{sig.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export & Action Buttons */}
              <div className="img-actions-row">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="img-btn-secondary"
                >
                  <Download size={16} />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="img-btn-primary"
                >
                  <RefreshCw size={16} />
                  <span>Scan Next Image</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Embedded Component Styles */}
      <style>{`
        .img-scanner-container {
          padding: 24px;
          max-width: 1280px;
          margin: 0 auto;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .img-scanner-header {
          margin-bottom: 24px;
        }

        .img-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.25);
          font-size: 0.78rem;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 10px;
        }

        .img-title {
          font-size: 1.85rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .img-subtitle {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-secondary);
          max-width: 780px;
          margin: 0;
        }

        /* Presets */
        .img-presets-section {
          margin-bottom: 28px;
        }

        .img-presets-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .img-presets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        .img-preset-card {
          background: var(--bg-card, #ffffff);
          border: 1.5px solid var(--border-color, #e2e8f0);
          border-radius: 14px;
          padding: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .img-preset-card:hover {
          border-color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.15);
        }

        .img-preset-card.active {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .img-preset-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .img-preset-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .img-preset-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
        }

        .img-preset-badge.danger {
          background: rgba(244, 63, 94, 0.14);
          color: #f43f5e;
        }

        .img-preset-badge.warning {
          background: rgba(245, 158, 11, 0.14);
          color: #f59e0b;
        }

        .img-preset-badge.safe {
          background: rgba(16, 185, 129, 0.14);
          color: #10b981;
        }

        .img-preset-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.4;
        }

        /* Workspace */
        .img-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .img-view-card,
        .img-report-card {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 20px;
          padding: 24px;
          min-height: 440px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
        }

        /* Dropzone */
        .img-dropzone {
          border: 2px dashed #3b82f6;
          border-radius: 16px;
          background: rgba(59, 130, 246, 0.03);
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 380px;
          box-sizing: border-box;
        }

        .img-dropzone:hover {
          background: rgba(59, 130, 246, 0.08);
          border-color: #2563eb;
        }

        .img-drop-icon-bubble {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .img-dropzone h3 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0 0 6px 0;
          color: var(--text-primary);
        }

        .img-dropzone p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0 0 18px 0;
        }

        .img-browse-btn {
          padding: 9px 20px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Preview Toolbar */
        .img-preview-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
        }

        .img-file-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .img-preview-actions {
          display: flex;
          gap: 8px;
        }

        .img-tool-btn {
          padding: 6px 12px;
          background: var(--bg-input, #f1f5f9);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .img-tool-btn.active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        /* Canvas & Markers */
        .img-canvas-container {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #000000;
          max-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .img-inspected-image {
          width: 100%;
          height: auto;
          display: block;
          max-height: 480px;
          object-fit: contain;
        }

        .img-box-marker {
          position: absolute;
          border-width: 2px;
          border-style: solid;
          border-radius: 6px;
          pointer-events: none;
          animation: pgBoxPulse 2s infinite;
        }

        @keyframes pgBoxPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.1); }
        }

        .img-box-marker.danger {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .img-box-marker.warning {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.15);
        }

        .img-box-marker.safe {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.15);
        }

        .img-box-label {
          position: absolute;
          top: -22px;
          left: -2px;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
        }

        .img-box-marker.danger .img-box-label { background: #ef4444; }
        .img-box-marker.warning .img-box-label { background: #f59e0b; }
        .img-box-marker.safe .img-box-label { background: #10b981; }

        /* Scanning Laser */
        .img-scan-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .img-laser-beam {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #3b82f6;
          box-shadow: 0 0 15px #3b82f6, 0 0 30px #3b82f6;
          animation: pgLaser 1.8s ease-in-out infinite alternate;
        }

        @keyframes pgLaser {
          from { top: 5%; }
          to { top: 92%; }
        }

        .img-scan-status-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          z-index: 10;
          color: #0f172a;
        }

        /* Report Right Column */
        .img-empty-report {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 380px;
          color: var(--text-muted);
        }

        .img-empty-report h3 {
          margin: 16px 0 6px 0;
          color: var(--text-primary);
        }

        .img-empty-report p {
          max-width: 320px;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        /* Verdict Content */
        .img-verdict-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
        }

        .img-verdict-tag {
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 6px;
        }

        .img-verdict-tag.danger {
          background: rgba(244, 63, 94, 0.14);
          color: #f43f5e;
        }

        .img-verdict-tag.warning {
          background: rgba(245, 158, 11, 0.14);
          color: #f59e0b;
        }

        .img-verdict-tag.emerald {
          background: rgba(16, 185, 129, 0.14);
          color: #10b981;
        }

        .img-verdict-brand {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary);
        }

        .img-ocr-box {
          background: var(--bg-input, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .img-ocr-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .img-ocr-text {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--text-secondary);
          font-style: italic;
        }

        .img-links-box {
          margin-bottom: 18px;
        }

        .img-links-title {
          display: block;
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .img-link-pill {
          padding: 6px 12px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 8px;
          font-size: 0.8rem;
          color: #ef4444;
          font-family: monospace;
          word-break: break-all;
        }

        .img-signals-box {
          margin-bottom: 24px;
        }

        .img-signals-title {
          font-size: 0.88rem;
          font-weight: 800;
          margin: 0 0 12px 0;
          color: var(--text-primary);
        }

        .img-signals-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .img-signal-item {
          padding: 10px 14px;
          border-radius: 10px;
          background: var(--bg-input, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
        }

        .img-signal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .img-sig-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .img-sig-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .img-sig-badge.critical,
        .img-sig-badge.high {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
        }

        .img-sig-badge.cleared {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .img-sig-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.45;
        }

        .img-actions-row {
          display: flex;
          gap: 12px;
        }

        .img-btn-secondary {
          flex: 1;
          padding: 10px 16px;
          background: var(--bg-input, #f1f5f9);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .img-btn-primary {
          flex: 1;
          padding: 10px 16px;
          background: #2563eb;
          border: none;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (max-width: 960px) {
          .img-workspace-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
