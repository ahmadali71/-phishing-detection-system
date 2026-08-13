import React, { useState } from 'react';
import {
  Mail,
  Upload,
  FileText,
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Info,
  Link,
  Paperclip,
  Shield,
  Eye
} from 'lucide-react';
import { analyzeEmailText } from '../utils/emailAnalyzer';

export default function EmailScanner({ onScanComplete, t }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
  const [emailContent, setEmailContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
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
  const [errorMessage, setErrorMessage] = useState(null);

  const handleScan = () => {
    setErrorMessage(null);
    if (activeTab === 'text' && (!emailContent || emailContent.trim().length === 0)) {
      setErrorMessage('Please enter email content to analyze.');
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      setErrorMessage('Please upload a valid .eml file to analyze.');
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

  return (
    <div className="email-scanner-container">
      {/* Header */}
      <div className="email-scanner-header">
        <div>
          <h2 className="email-scanner-title">Email Detection</h2>
          <p className="email-scanner-subtitle">Analyze email content for phishing threats</p>
        </div>
        <div className="email-scanner-actions">
          <button className="btn-icon" title="Scan History"><Clock size={16} /></button>
          <button className="btn-icon" title="Export Results"><Download size={16} /></button>
          <button className="btn-icon" title="Documentation"><Info size={16} /></button>
        </div>
      </div>

      {/* Tabs & Input Box */}
      <div className="glass-panel email-scanner-card">
        <div className="email-scanner-tabs">
          <button
            onClick={() => setActiveTab('text')}
            className={`email-tab ${activeTab === 'text' ? 'active' : ''}`}
          >
            Paste Email Content
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`email-tab ${activeTab === 'file' ? 'active' : ''}`}
          >
            Upload .eml File
          </button>
        </div>

        {activeTab === 'text' ? (
          <div className="email-input-section">
            <textarea
              rows={5}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste your email content here..."
              maxLength={5000}
              className="email-textarea"
            />
            <div className="email-char-count">
              {emailContent.length}/5000
            </div>
          </div>
        ) : (
          <div className="email-upload-area">
            <Upload size={32} color="var(--text-muted)" className="email-upload-icon" />
            <div className="email-upload-text">
              {selectedFile ? selectedFile.name : 'Select or Drop .eml File'}
            </div>
            <input type="file" accept=".eml,.txt,.msg" onChange={handleFileUpload} style={{ display: 'none' }} id="eml-upload-file" />
            <label htmlFor="eml-upload-file" className="btn-secondary email-upload-btn">
              Browse Files
            </label>
          </div>
        )}

        {errorMessage && (
          <div className="email-error">
            <AlertTriangle size={15} /> {errorMessage}
          </div>
        )}

        <div className="email-scan-btn-wrap">
          <button onClick={handleScan} disabled={isScanning} className="btn-primary email-scan-btn">
            {isScanning ? 'Analyzing...' : 'Analyze Email'}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {scanResult && (
        <div className="glass-panel email-result-card">
          {/* Top Row: Result Banner & Risk Score */}
          <div className="email-result-top">
            <div className={`email-result-banner ${scanResult.verdict.includes('Phishing') ? 'danger' : scanResult.verdict.includes('Suspicious') ? 'warning' : 'success'}`}>
              <div className="email-result-label">Result</div>
              <div className="email-result-verdict">
                {scanResult.verdict.includes('Phishing') ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
                {scanResult.verdict}
              </div>
              <p className="email-result-desc">This email contains suspicious patterns and links.</p>
            </div>

            <div className="email-risk-gauge">
              <div className="email-risk-label">Risk Score</div>
              <div className={`email-risk-score ${scanResult.riskScore >= 65 ? 'danger' : scanResult.riskScore >= 35 ? 'warning' : 'success'}`}>
                {scanResult.riskScore}<span className="email-risk-max">/100</span>
              </div>
              <div className={`email-risk-level ${scanResult.riskScore >= 65 ? 'danger' : scanResult.riskScore >= 35 ? 'warning' : 'success'}`}>
                {scanResult.riskScore >= 65 ? 'High Risk' : scanResult.riskScore >= 35 ? 'Medium Risk' : 'Low Risk'}
              </div>
            </div>
          </div>

          {/* Email Analysis Details */}
          <div className="email-metrics-section">
            <h3 className="email-metrics-title">Email Analysis</h3>
            <div className="email-metrics-grid">
              <div className="email-metric-card">
                <div className="email-metric-label">Suspicious Keywords</div>
                <div className="email-metric-value">{scanResult.metrics?.suspiciousKeywordsCount || 5} Found</div>
              </div>
              <div className="email-metric-card">
                <div className="email-metric-label">Links</div>
                <div className="email-metric-value">{scanResult.metrics?.deceptiveLinksCount || 2} Found</div>
              </div>
              <div className="email-metric-card">
                <div className="email-metric-label">Attachments</div>
                <div className="email-metric-value">{scanResult.metrics?.attachmentsCount || 1} Found</div>
              </div>
              <div className="email-metric-card">
                <div className="email-metric-label">Sender Reputation</div>
                <div className="email-metric-value warning">{scanResult.metrics?.senderReputation || 'Low'}</div>
              </div>
              <div className="email-metric-card">
                <div className="email-metric-label">Phishing Indicators</div>
                <div className="email-metric-value">{scanResult.metrics?.phishingIndicatorsCount || 4} Found</div>
              </div>
              <div className="email-metric-card">
                <div className="email-metric-label">Phishing Intentions</div>
                <div className="email-metric-value">{scanResult.metrics?.phishingIntentionsCount || 3}</div>
              </div>
              <div className="email-metric-card email-metric-wide">
                <div className="email-metric-label">Spam Probability</div>
                <div className="email-metric-value danger">{scanResult.metrics?.spamProbability || '62%'}</div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="email-recommendation">
            <AlertTriangle size={20} color="#f59e0b" className="email-recommendation-icon" />
            <div>
              <div className="email-recommendation-label">Recommendation</div>
              <div className="email-recommendation-text">
                {scanResult.recommendation || 'Be cautious. Do not click on links or download attachments.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
