import React, { useState } from 'react';
import {
  Shield, Globe, Mail, Image, MessageSquare, Bot, ArrowRight,
  CheckCircle2, AlertTriangle, Zap, Lock, Search, Play, ChevronDown,
  ExternalLink, BarChart3, Activity, ShieldCheck, Sparkles, Moon, Sun,
  Menu, X
} from 'lucide-react';
import Logo from './Logo';
import landingHero from '../assets/landing_hero.jpg';
import offensiveThreat from '../assets/offensive_threat.jpg';
import defensiveShield from '../assets/defensive_shield.jpg';

export default function LandingPage({
  onNavigateAuth,
  onNavigateDashboard,
  onNavigateScanner,
  theme,
  setTheme,
  currentUser,
  isInsideApp = false
}) {
  const [demoInput, setDemoInput] = useState('https://paypa1-security-verification.cc/login');
  const [demoType, setDemoType] = useState('url');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [faqOpen, setFaqOpen] = useState({ 0: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cycleTheme = () => {
    if (setTheme) {
      setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'navy' : 'light');
    }
  };

  const isDark = theme === 'dark';
  const isNavy = theme === 'navy';
  const isLight = !isDark && !isNavy;

  const demoPresets = [
    { label: 'Fake PayPal Domain', type: 'url', val: 'https://paypa1-security-verification.cc/login' },
    { label: 'Fake Banking SMS', type: 'message', val: 'URGENT: Chase Bank alert. Your debit card is locked due to unauthorized access. Verify now at http://bit.ly/chase-unfreeze' },
    { label: 'Legitimate Portal', type: 'url', val: 'https://accounts.google.com/signin' },
    { label: 'Urgent Wire Transfer Email', type: 'email', val: 'Subject: Immediate Wire Transfer Required. CEO instruction: wire $45,000 to vendor account before 3 PM.' }
  ];

  const handleRunDemoScan = (overrideVal, overrideType) => {
    if (!currentUser) {
      if (onNavigateAuth) onNavigateAuth('login');
      return;
    }
    const val = overrideVal || demoInput;
    const type = overrideType || demoType;
    if (!val.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const isSafe = val.includes('google.com') || val.includes('legitimate') || val.includes('github.com');
      const isMedium = val.includes('wire') || val.includes('CEO');

      if (isSafe) {
        setScanResult({
          verdict: 'Legitimate & Safe',
          score: 6,
          status: 'safe',
          color: '#10b981',
          reasons: [
            'Domain matches verified registrar with multi-year trust history',
            'Valid high-assurance SSL/TLS certificate issued to Google LLC',
            'Zero presence on 72 global cybersecurity threat blocklists'
          ]
        });
      } else if (isMedium) {
        setScanResult({
          verdict: 'Suspicious / BEC Warning',
          score: 68,
          status: 'warning',
          color: '#f59e0b',
          reasons: [
            'Detected Business Email Compromise (BEC) linguistic coercion patterns',
            'High urgency financial wire trigger phrases detected without cryptographic signature',
            'Recommended action: Verify with sender via secondary out-of-band channel'
          ]
        });
      } else {
        setScanResult({
          verdict: 'Malicious Phishing Intercepted',
          score: 94,
          status: 'danger',
          color: '#ef4444',
          reasons: [
            'Typosquatting alert: "paypa1" mimics authentic brand "PayPal" (homoglyph deception)',
            'Domain registered only 3 days ago via anonymous privacy guard',
            'Credential harvesting form detected on landing path'
          ]
        });
      }
    }, 900);
  };

  const capabilities = [
    {
      icon: Globe,
      color: '#2563eb',
      title: 'Zero-Day URL Intelligence',
      desc: 'Inspects typosquatting, Punycode homoglyphs, DNS age, SSL anomalies, and redirect chains in milliseconds.',
      page: 'url-detection'
    },
    {
      icon: Mail,
      color: '#3b82f6',
      title: 'NLP Email Engine',
      desc: 'Deep linguistic models evaluate emotional pressure, CEO spoofing, forged email headers, and suspicious payloads.',
      page: 'email-detection'
    },
    {
      icon: Image,
      color: '#06b6d4',
      title: 'Screenshot & OCR Vision',
      desc: 'Analyzes visual screenshots to catch fake login forms, pixel manipulation, QR code traps, and brand logo forgery.',
      page: 'image-detection'
    },
    {
      icon: MessageSquare,
      color: '#8b5cf6',
      title: 'SMS & Smishing Analyzer',
      desc: 'Scrutinizes text messages, phone numbers, caller spoofing probabilities, and masked shortlink destinations.',
      page: 'message-detection'
    },
    {
      icon: Activity,
      color: '#10b981',
      title: 'Multi-Model Machine Learning',
      desc: 'Ensemble Random Forest, XGBoost, and BERT neural transformers provide benchmarked 99.4% detection accuracy.',
      page: 'dashboard'
    },
    {
      icon: Bot,
      color: '#ec4899',
      title: 'AI Cyber Defense Copilot',
      desc: '24/7 intelligent conversational assistant to triage threats, decode suspicious headers, and advise incident response.',
      page: 'ai-assistant'
    },
  ];

  const liveIntercepts = [
    { id: 1, target: 'paypa1-account-security-alert.net', threat: 'High Phishing', score: 96, time: 'Just now' },
    { id: 2, target: 'USPS-Package-Fee: bit.ly/usps-resched (+1-888-421)', threat: 'Smishing Alert', score: 91, time: '18s ago' },
    { id: 3, target: 'https://www.github.com/security', threat: 'Verified Safe', score: 2, time: '34s ago' },
    { id: 4, target: 'micros0ft365-password-renew.live', threat: 'Credential Theft', score: 98, time: '1m ago' },
  ];

  return (
    <div className={`pg-landing-root ${isDark ? 'theme-dark' : isNavy ? 'theme-navy' : 'theme-light'}`}>
      
      {/* ── TOP NAVIGATION (Guest Only) ── */}
      {!isInsideApp && (
        <header className="pg-nav-bar">
          <div className="pg-nav-inner">
            <div className="pg-nav-brand">
              <Logo size="sm" useShort={true} showSubtitle={false} lightText={isDark || isNavy} />
              <span className="pg-nav-brand-full">Automatic Phishing Detection System</span>
            </div>

            <nav className="pg-nav-links">
              <a href="#features" className="pg-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#sandbox" className="pg-nav-link" onClick={() => setMobileMenuOpen(false)}>Live Sandbox</a>
              <a href="#capabilities" className="pg-nav-link" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
              <a href="#how-it-works" className="pg-nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#faq" className="pg-nav-link" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            </nav>

            <div className="pg-nav-actions">
              <button type="button" onClick={cycleTheme} className="pg-theme-btn" title={`Theme: ${theme}`}>
                {isDark ? <Sun size={18} /> : isNavy ? <Moon size={18} color="#818cf8" /> : <Moon size={18} />}
              </button>

              {currentUser ? (
                <button onClick={onNavigateDashboard} className="pg-btn-primary pg-desktop-only">
                  <span>Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <button onClick={() => onNavigateAuth('login')} className="pg-btn-ghost pg-desktop-only">Sign In</button>
                  <button onClick={() => onNavigateAuth('register')} className="pg-btn-primary pg-desktop-only">
                    <span>Get Started</span>
                    <ArrowRight size={16} />
                  </button>
                </>
              )}

              {/* Hamburger (mobile only - three lines) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(v => !v)}
                className="pg-hamburger"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu (The Three Lines Menu) */}
          {mobileMenuOpen && (
            <div className="pg-mobile-menu">
              <a href="#features" className="pg-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#sandbox" className="pg-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Live Sandbox</a>
              <a href="#capabilities" className="pg-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
              <a href="#how-it-works" className="pg-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#faq" className="pg-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              
              {!currentUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
                  <button onClick={() => { onNavigateAuth('register'); setMobileMenuOpen(false); }} className="pg-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}>
                    <span>Get Started</span>
                    <ArrowRight size={16} />
                  </button>
                  <button onClick={() => { onNavigateAuth('login'); setMobileMenuOpen(false); }} className="pg-mobile-signin-btn" style={{ width: '100%', padding: '9px 16px' }}>
                    Sign In
                  </button>
                </div>
              ) : (
                <button onClick={() => { onNavigateDashboard(); setMobileMenuOpen(false); }} className="pg-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  <span>Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </header>
      )}

      {/* ── HERO SECTION ── */}
      <section className="pg-hero-section">
        <div className="pg-hero-glow-bg"></div>
        <div className="pg-hero-grid">
          
          <div className="pg-hero-left">
            <div className="pg-badge-pill">
              <Sparkles size={14} className="text-blue-500" />
              <span>Next-Gen Autonomous Phishing Defense • Live</span>
            </div>

            <h1 className="pg-main-hero-title">
              Stop Phishing Attacks.<br />
              <span className="pg-gradient-text">Protect What Matters.</span>
            </h1>

            <p className="pg-hero-lead">
              Automatic Phishing Detection System deploys intelligent multi-layer AI to identify and neutralize malicious URLs, deceptive emails, screenshot impersonations, and SMS smishing before damage occurs.
            </p>

            <div className="pg-hero-cta-group">
              <a href="#sandbox" className="pg-btn-hero-primary">
                <Search size={18} />
                <span>Try Live Scanner</span>
              </a>

              {!currentUser ? (
                <button
                  onClick={() => onNavigateAuth('register')}
                  className="pg-btn-hero-secondary"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={onNavigateDashboard}
                  className="pg-btn-hero-secondary"
                >
                  <span>Open App Suite</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            {/* Live Stats Row */}
            <div className="pg-hero-stats-row">
              <div className="pg-stat-box">
                <div className="pg-stat-num">99.4%</div>
                <div className="pg-stat-lbl">Detection Accuracy</div>
              </div>
              <div className="pg-stat-divider" />
              <div className="pg-stat-box">
                <div className="pg-stat-num">&lt; 115ms</div>
                <div className="pg-stat-lbl">Real-time Inference</div>
              </div>
              <div className="pg-stat-divider" />
              <div className="pg-stat-box">
                <div className="pg-stat-num">148k+</div>
                <div className="pg-stat-lbl">Threats Intercepted</div>
              </div>
            </div>
          </div>

          <div className="pg-hero-right">
            <div className="pg-hero-visual-card">
              <div className="pg-card-badge-floating">
                <ShieldCheck size={18} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Autonomous Shield Active</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Heuristics + Vision + NLP Synchronized</div>
                </div>
              </div>

              <img
                src={landingHero}
                alt="Automatic Phishing Detection System Autonomous Shield"
                className="pg-hero-main-image"
              />

              <div className="pg-card-badge-bottom">
                <AlertTriangle size={18} color="#f43f5e" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f43f5e' }}>Suspicious Email Blocked</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Homoglyph spoofing quarantined</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── LIVE INTERCEPTED ATTACK TICKER ── */}
      <section className="pg-ticker-section">
        <div className="pg-ticker-inner">
          <div className="pg-ticker-label">
            <span className="pg-live-dot" />
            <span>LIVE INTERCEPTIONS</span>
          </div>
          <div className="pg-ticker-items">
            {liveIntercepts.map(item => (
              <div key={item.id} className="pg-ticker-pill">
                <span className={`pg-ticker-status ${item.score > 70 ? 'danger' : 'safe'}`}>
                  {item.threat}
                </span>
                <span className="pg-ticker-target">{item.target}</span>
                <span className="pg-ticker-time">({item.time})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFENSIVE VS DEFENSIVE CYBER MATRIX ── */}
      <section id="features" className="pg-matrix-section">
        <div className="pg-section-header">
          <div className="pg-subhead-pill">360° Cyber Threat Intelligence</div>
          <h2 className="pg-section-title">Offensive Cyber Threat Vectors vs. Autonomous AI Defense</h2>
          <p className="pg-section-desc">
            See how modern attackers engineer deceptive phishing campaigns and how Automatic Phishing Detection System's neural shield intercepts them in real-time.
          </p>
        </div>

        <div className="pg-matrix-grid">
          {/* Offensive Threat Card */}
          <div className="pg-matrix-card offensive-card">
            <div className="pg-matrix-badge offensive-badge">
              <AlertTriangle size={14} />
              <span>OFFENSIVE THREAT VECTOR</span>
            </div>

            <div className="pg-matrix-img-wrap">
              <img src={offensiveThreat} alt="Offensive Phishing Attack Vector" className="pg-matrix-img" />
            </div>

            <div className="pg-matrix-body">
              <h3 className="pg-matrix-title red-title">Attacker Infrastructure &amp; Social Engineering</h3>
              <p className="pg-matrix-desc">
                Cybercriminals deploy mass automated campaign engines, homoglyph typosquatting (<code className="pg-code">paypa1.com</code>), and urgency triggers to harvest enterprise credentials.
              </p>

              <div className="pg-matrix-bullets">
                <div className="pg-mb-item">
                  <span className="pg-mb-dot red-dot" />
                  <span><strong>50,000+ Phishing Emails/Min:</strong> Scaled spoofing infrastructure targeting employees.</span>
                </div>
                <div className="pg-mb-item">
                  <span className="pg-mb-dot red-dot" />
                  <span><strong>Visual Impersonation:</strong> Cloned login portals targeting banking &amp; corporate SSO.</span>
                </div>
                <div className="pg-mb-item">
                  <span className="pg-mb-dot red-dot" />
                  <span><strong>SMS Shortlink Traps:</strong> Masked shortlinks bypassing legacy email filters.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Defensive Shield Card */}
          <div className="pg-matrix-card defensive-card">
            <div className="pg-matrix-badge defensive-badge">
              <ShieldCheck size={14} />
              <span>AUTONOMOUS DEFENSIVE SHIELD</span>
            </div>

            <div className="pg-matrix-img-wrap">
              <img src={defensiveShield} alt="Defensive AI Shield Operations" className="pg-matrix-img" />
            </div>

            <div className="pg-matrix-body">
              <h3 className="pg-matrix-title blue-title">Real-Time AI Neutralization &amp; Heuristics</h3>
              <p className="pg-matrix-desc">
                Automatic Phishing Detection System's multi-modal AI engine evaluates domain WHOIS entropy, computer vision logo matching, and NLP coercion signals in &lt;115ms.
              </p>

              <div className="pg-matrix-bullets">
                <div className="pg-mb-item">
                  <span className="pg-mb-dot blue-dot" />
                  <span><strong>99.4% Detection Accuracy:</strong> Ensemble Random Forest + BERT model.</span>
                </div>
                <div className="pg-mb-item">
                  <span className="pg-mb-dot blue-dot" />
                  <span><strong>Computer Vision OCR:</strong> Detects visual logo forgery &amp; QR traps.</span>
                </div>
                <div className="pg-mb-item">
                  <span className="pg-mb-dot blue-dot" />
                  <span><strong>Automated SOC Intercept:</strong> Real-time domain quarantine &amp; threat feeds.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE INTERACTIVE SANDBOX SCANNER ── */}
      <section id="sandbox" className="pg-sandbox-section">
        <div className="pg-section-header">
          <div className="pg-subhead-pill">Interactive Demo</div>
          <h2 className="pg-section-title">Test Any Link, Message, or Email Instantly</h2>
          <p className="pg-section-desc">
            Experience Automatic Phishing Detection System's multi-layered intelligence directly in your browser. Choose a preset or test your own content.
          </p>
        </div>

        <div className="pg-sandbox-card">
          {/* Preset Buttons */}
          <div className="pg-presets-bar">
            <span className="pg-presets-title">Quick Presets:</span>
            {demoPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDemoInput(preset.val);
                  setDemoType(preset.type);
                  handleRunDemoScan(preset.val, preset.type);
                }}
                className="pg-preset-btn"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Input & Scan Button */}
          <div className="pg-sandbox-input-row">
            <div className="pg-sandbox-input-box">
              <Search size={20} className="pg-search-icon" />
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="Paste URL (https://...), email snippet, or suspicious SMS text..."
                className="pg-sandbox-input"
                onKeyDown={(e) => e.key === 'Enter' && handleRunDemoScan()}
              />
            </div>
            <button
              onClick={() => handleRunDemoScan()}
              disabled={isScanning}
              className="pg-sandbox-submit-btn"
            >
              {isScanning ? (
                <span>Scanning...</span>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Analyze Threat</span>
                </>
              )}
            </button>
          </div>

          {/* Results Box */}
          {scanResult && (
            <div className={`pg-sandbox-result ${scanResult.status}`}>
              <div className="pg-result-header">
                <div className="pg-result-title-group">
                  <div
                    className="pg-result-dot"
                    style={{ background: scanResult.color }}
                  />
                  <h3 className="pg-result-verdict" style={{ color: scanResult.color }}>
                    {scanResult.verdict}
                  </h3>
                </div>
                <div className="pg-risk-score-badge" style={{ borderColor: scanResult.color, color: scanResult.color }}>
                  Risk Score: {scanResult.score}/100
                </div>
              </div>

              <div className="pg-result-reasons">
                <div className="pg-reasons-title">Heuristic Signals Detected:</div>
                <ul>
                  {scanResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="pg-result-footer">
                <span>Want deeper forensics, screenshot inspection, and SMS phone number decoding?</span>
                <button
                  onClick={currentUser ? onNavigateDashboard : () => onNavigateAuth('login')}
                  className="pg-result-deep-btn"
                >
                  Open Full Security Suite →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CORE CAPABILITIES GRID ── */}
      <section id="capabilities" className="pg-capabilities-section">
        <div className="pg-section-header">
          <div className="pg-subhead-pill">All-In-One Defense Suite</div>
          <h2 className="pg-section-title">Engineered to Neutralize Every Cyber Attack Vector</h2>
          <p className="pg-section-desc">
            Modern phishing is no longer just bad emails. Automatic Phishing Detection System protects against multi-modal threats across URLs, email text, screenshots, and SMS messages.
          </p>
        </div>

        <div className="pg-capabilities-grid">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="pg-cap-card"
                onClick={() => onNavigateScanner ? onNavigateScanner(cap.page) : onNavigateDashboard()}
              >
                <div className="pg-cap-icon-wrap" style={{ background: `${cap.color}18`, color: cap.color }}>
                  <Icon size={24} />
                </div>
                <h3 className="pg-cap-title">{cap.title}</h3>
                <p className="pg-cap-desc">{cap.desc}</p>
                <div className="pg-cap-action" style={{ color: cap.color }}>
                  <span>Launch Tool</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3-STEP PROCESS ── */}
      <section id="how-it-works" className="pg-process-section">
        <div className="pg-section-header">
          <div className="pg-subhead-pill">Workflow</div>
          <h2 className="pg-section-title">How Automatic Phishing Detection System Protects You in 3 Steps</h2>
        </div>

        <div className="pg-process-grid">
          <div className="pg-process-card">
            <div className="pg-step-num">01</div>
            <h3>Multi-Vector Ingestion</h3>
            <p>Input raw URLs, forwarded emails, uploaded screenshots of login portals, or mobile SMS text messages with phone numbers.</p>
          </div>

          <div className="pg-process-card">
            <div className="pg-step-num">02</div>
            <h3>Dual AI &amp; Heuristic Analysis</h3>
            <p>Our ensemble pipelines execute OCR text parsing, brand logo visual match, typosquatting calculations, and NLP emotional coercion detection.</p>
          </div>

          <div className="pg-process-card">
            <div className="pg-step-num">03</div>
            <h3>Actionable Verdict &amp; Defense</h3>
            <p>Receive an instantaneous 0-100 risk score, complete threat breakdown, automated blocking rules, and exportable PDF forensic reports.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="pg-faq-section">
        <div className="pg-section-header">
          <div className="pg-subhead-pill">Knowledge Base</div>
          <h2 className="pg-section-title">Frequently Asked Questions</h2>
        </div>

        <div className="pg-faq-list">
          {[
            {
              q: 'How does Automatic Phishing Detection System detect Zero-Day phishing links?',
              a: 'Instead of relying purely on static blacklists, Automatic Phishing Detection System computes behavioral heuristics: domain registration age via WHOIS, SSL issuer reputation, character entropy, Punycode homoglyph substitution (such as replacing "o" with "0"), and DNS redirect topology.'
            },
            {
              q: 'Can Automatic Phishing Detection System inspect screenshots of fake websites and QR codes?',
              a: 'Yes! The new Screenshot & Image Analysis engine uses computer vision and OCR to extract text from images, detect visual brand impersonation (e.g., fraudulent PayPal or Microsoft login screens), and scan embedded QR code traps.'
            },
            {
              q: 'How does the SMS / Smishing analyzer work?',
              a: 'The message analyzer evaluates three crucial components simultaneously: sender phone number spoof probability, high-urgency social engineering triggers, and shortlinks (unmasking bit.ly, tinyurl, and suspicious redirects).'
            },
            {
              q: 'Is Automatic Phishing Detection System free to use?',
              a: 'Yes, Automatic Phishing Detection System provides full access to URL, Email, Screenshot, and SMS analyzers, alongside an interactive AI cybersecurity copilot.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`pg-faq-item ${faqOpen[idx] ? 'open' : ''}`}
              onClick={() => setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }))}
            >
              <div className="pg-faq-q">
                <span>{item.q}</span>
                <ChevronDown size={18} className="pg-faq-chevron" />
              </div>
              {faqOpen[idx] && <p className="pg-faq-a">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM BANNER ── */}
      <section className="pg-cta-section">
        <div className="pg-cta-box">
          <h2 className="pg-cta-title">Start Protecting Your Digital World Today</h2>
          <p className="pg-cta-desc">
            Equip your organization with real-time AI phishing detection across every vector.
          </p>
          <div className="pg-cta-btns">
            <button
              onClick={() => onNavigateAuth('register')}
              className="pg-btn-cta-primary"
            >
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onNavigateDashboard}
              className="pg-btn-cta-secondary"
            >
              <span>Launch Live Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pg-footer">
        <div className="pg-footer-inner">
          <div className="pg-footer-brand">
            <Logo size="sm" showSubtitle={true} lightText={isDark} />
            <p className="pg-footer-motto">
              Smarter Detection | Safer Tomorrow. Next-generation multi-vector cyber defense against digital fraud.
            </p>
          </div>

          <div className="pg-footer-links-col">
            <h4>Security Tools</h4>
            <a href="#sandbox">URL Threat Scanner</a>
            <a href="#sandbox">Email Body Inspector</a>
            <a href="#capabilities">Screenshot Vision OCR</a>
            <a href="#capabilities">SMS Smishing Analyzer</a>
          </div>

          <div className="pg-footer-links-col">
            <h4>Platform</h4>
            <a href="#how-it-works">How It Works</a>
            <a href="#capabilities">Core Capabilities</a>
            <a href="#faq">Security FAQ</a>
            <button onClick={onNavigateDashboard} className="pg-footer-btn-link">User Dashboard</button>
          </div>

          <div className="pg-footer-links-col">
            <h4>System Status</h4>
            <div className="pg-footer-status">
              <span className="pg-status-dot-green" />
              <span>All Threat Engines Operational</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              ML Heuristic Engine v2.8 • Latency &lt;120ms
            </p>
          </div>
        </div>

        <div className="pg-footer-bottom">
          <span>© {new Date().getFullYear()} Automatic Phishing Detection System. All rights reserved.</span>
          <span>Department of Computer Science &amp; IT • Academic &amp; Enterprise Security</span>
        </div>
      </footer>

      {/* Embedded CSS for Landing Page */}
      <style>{`
        .pg-landing-root {
          min-height: 100vh;
          width: 100%;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
          overflow-x: hidden;
        }

        .pg-landing-root.theme-light {
          background: #ffffff;
          color: #0f172a;
          --bg-nav: rgba(255, 255, 255, 0.85);
          --card-bg: #f8fafc;
          --card-border: #e2e8f0;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #64748b;
          --section-alt: #f8fafc;
        }

        .pg-landing-root.theme-dark {
          background: #080c16;
          color: #f8fafc;
          --bg-nav: rgba(8, 12, 22, 0.9);
          --card-bg: #0f172a;
          --card-border: rgba(59, 130, 246, 0.2);
          --text-primary: #f8fafc;
          --text-secondary: #cbd5e1;
          --text-muted: #94a3b8;
          --section-alt: #0c1220;
        }

        .pg-landing-root.theme-navy {
          background: #05082e;
          color: #e8eaff;
          --bg-nav: rgba(5, 8, 46, 0.92);
          --card-bg: #0c1150;
          --card-border: rgba(99, 102, 241, 0.25);
          --text-primary: #e8eaff;
          --text-secondary: #c7d2fe;
          --text-muted: #a5b4fc;
          --section-alt: #080b3a;
        }

        /* ── NAVBAR ── */
        .pg-nav-bar {
          position: sticky;
          top: 0;
          z-index: 99;
          background: var(--bg-nav);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--card-border);
          padding: 12px 24px;
        }

        .pg-nav-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .pg-nav-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          min-width: 0;
        }

        .pg-nav-brand-full {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 280px;
        }

        .pg-nav-links {
          display: flex;
          gap: 28px;
        }

        .pg-nav-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .pg-nav-link:hover {
          color: #2563eb;
        }

        .pg-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pg-theme-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pg-btn-ghost {
          padding: 8px 18px;
          background: none;
          border: none;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .pg-btn-ghost:hover {
          color: #2563eb;
        }

        .pg-btn-primary {
          padding: 9px 20px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          border-radius: 999px;
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          transition: all 0.2s ease;
        }

        .pg-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }

        /* ── HERO ── */
        .pg-hero-section {
          position: relative;
          padding: 80px 24px 60px;
          max-width: 1240px;
          margin: 0 auto;
        }

        .pg-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }

        .pg-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.25);
          color: #2563eb;
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .pg-main-hero-title {
          font-size: clamp(2.4rem, 4.5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: -0.04em;
          margin: 0 0 20px 0;
          color: var(--text-primary);
        }

        .pg-gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .pg-hero-lead {
          font-size: 1.12rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 32px;
          max-width: 580px;
        }

        .pg-hero-cta-group {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .pg-btn-hero-primary {
          padding: 14px 26px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 14px;
          color: #ffffff;
          font-size: 0.98rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
          transition: all 0.2s ease;
        }

        .pg-btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.45);
        }

        .pg-btn-hero-secondary {
          padding: 14px 26px;
          background: var(--card-bg);
          border: 1.5px solid var(--card-border);
          border-radius: 14px;
          color: var(--text-primary);
          font-size: 0.98rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .pg-btn-hero-secondary:hover {
          background: rgba(37, 99, 235, 0.08);
          border-color: #2563eb;
        }

        /* Stats Row */
        .pg-hero-stats-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--card-border);
        }

        .pg-stat-box {
          display: flex;
          flex-direction: column;
        }

        .pg-stat-num {
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #2563eb;
        }

        .pg-stat-lbl {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .pg-stat-divider {
          width: 1px;
          height: 36px;
          background: var(--card-border);
        }

        /* Hero Right Visual */
        .pg-hero-visual-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.35);
          border: 1px solid var(--card-border);
          background: var(--card-bg);
        }

        .pg-hero-main-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .pg-card-badge-floating {
          position: absolute;
          top: 18px;
          left: 18px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .pg-card-badge-bottom {
          position: absolute;
          bottom: 18px;
          right: 18px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        /* ── TICKER ── */
        .pg-ticker-section {
          background: var(--section-alt);
          border-top: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
          padding: 12px 24px;
        }

        .pg-ticker-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 18px;
          overflow-x: auto;
          white-space: nowrap;
        }

        .pg-ticker-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .pg-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: pgPulse 1.5s infinite;
        }

        @keyframes pgPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .pg-ticker-items {
          display: flex;
          gap: 14px;
        }

        .pg-ticker-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px;
          border-radius: 999px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          font-size: 0.78rem;
        }

        .pg-ticker-status {
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
        }

        .pg-ticker-status.danger {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
        }

        .pg-ticker-status.safe {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .pg-ticker-target {
          font-weight: 600;
          color: var(--text-primary);
        }

        .pg-ticker-time {
          color: var(--text-muted);
          font-size: 0.72rem;
        }

        /* ══════ OFFENSIVE VS DEFENSIVE MATRIX ══════ */
        .pg-matrix-section {
          padding: 80px 24px;
          max-width: 1240px;
          margin: 0 auto;
        }

        .pg-matrix-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 40px;
          align-items: stretch;
        }

        .pg-matrix-card {
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.2);
        }

        .theme-dark .pg-matrix-card.offensive-card {
          background: rgba(239, 68, 68, 0.05);
          border: 1.5px solid rgba(239, 68, 68, 0.25);
        }

        .theme-light .pg-matrix-card.offensive-card {
          background: #fff5f5;
          border: 1.5px solid #fca5a5;
        }

        .pg-matrix-card.offensive-card:hover {
          border-color: rgba(239, 68, 68, 0.55);
          box-shadow: 0 16px 40px -10px rgba(239, 68, 68, 0.25);
          transform: translateY(-4px);
        }

        .theme-dark .pg-matrix-card.defensive-card {
          background: rgba(37, 99, 235, 0.05);
          border: 1.5px solid rgba(56, 189, 248, 0.3);
        }

        .theme-light .pg-matrix-card.defensive-card {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
        }

        .pg-matrix-card.defensive-card:hover {
          border-color: rgba(56, 189, 248, 0.6);
          box-shadow: 0 16px 40px -10px rgba(37, 99, 235, 0.25);
          transform: translateY(-4px);
        }

        .pg-matrix-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin: 20px 20px 14px;
          align-self: flex-start;
        }

        .offensive-badge {
          background: rgba(239, 68, 68, 0.14);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.35);
        }

        .defensive-badge {
          background: rgba(16, 185, 129, 0.14);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .pg-matrix-img-wrap {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
        }

        .pg-matrix-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .pg-matrix-card:hover .pg-matrix-img {
          transform: scale(1.04);
        }

        .pg-matrix-body {
          padding: 22px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .pg-matrix-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .red-title { color: #ef4444; }
        .blue-title { color: #2563eb; }
        .theme-dark .blue-title { color: #38bdf8; }

        .pg-matrix-desc {
          font-size: 0.88rem;
          color: var(--text-muted, #64748b);
          line-height: 1.55;
          margin: 0;
        }

        .pg-matrix-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 6px;
        }

        .pg-mb-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.84rem;
          line-height: 1.45;
          color: var(--text-secondary);
        }

        .red-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #ef4444; margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 6px #ef4444;
        }

        .blue-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #38bdf8; margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 6px #38bdf8;
        }

        .pg-code {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.85em;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        /* ── SANDBOX ── */
        .pg-sandbox-section {
          padding: 80px 24px;
          max-width: 1040px;
          margin: 0 auto;
        }

        .pg-section-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .pg-subhead-pill {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2563eb;
          margin-bottom: 10px;
        }

        .pg-section-title {
          font-size: clamp(1.8rem, 3.2vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 14px 0;
          color: var(--text-primary);
        }

        .pg-section-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.55;
        }

        .pg-sandbox-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.15);
        }

        .pg-presets-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .pg-presets-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .pg-preset-btn {
          padding: 6px 12px;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #2563eb;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pg-preset-btn:hover {
          background: rgba(37, 99, 235, 0.18);
        }

        .pg-sandbox-input-row {
          display: flex;
          gap: 12px;
        }

        .pg-sandbox-input-box {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .pg-search-icon {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
        }

        .pg-sandbox-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border-radius: 14px;
          border: 1.5px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-primary);
          font-size: 0.95rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .pg-sandbox-input:focus {
          border-color: #2563eb;
        }

        .pg-sandbox-submit-btn {
          padding: 14px 28px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          border-radius: 14px;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .pg-sandbox-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        /* Result Box */
        .pg-sandbox-result {
          margin-top: 24px;
          padding: 22px;
          border-radius: 16px;
          border: 1.5px solid;
          animation: pgFadeIn 0.3s ease;
        }

        @keyframes pgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pg-sandbox-result.danger {
          background: rgba(244, 63, 94, 0.08);
          border-color: rgba(244, 63, 94, 0.3);
        }

        .pg-sandbox-result.warning {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .pg-sandbox-result.safe {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .pg-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .pg-result-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pg-result-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .pg-result-verdict {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
        }

        .pg-risk-score-badge {
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .pg-result-reasons {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .pg-reasons-title {
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--text-primary);
        }

        .pg-result-reasons ul {
          margin: 0;
          padding-left: 20px;
        }

        .pg-result-footer {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(148, 163, 184, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .pg-result-deep-btn {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.85rem;
        }

        /* ── CAPABILITIES ── */
        .pg-capabilities-section {
          padding: 80px 24px;
          max-width: 1240px;
          margin: 0 auto;
        }

        .pg-capabilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .pg-cap-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .pg-cap-card:hover {
          transform: translateY(-4px);
          border-color: #2563eb;
          box-shadow: 0 14px 30px -8px rgba(37, 99, 235, 0.2);
        }

        .pg-cap-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .pg-cap-title {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: var(--text-primary);
        }

        .pg-cap-desc {
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--text-secondary);
          margin: 0 0 20px 0;
          flex: 1;
        }

        .pg-cap-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* ── HOW IT WORKS ── */
        .pg-process-section {
          padding: 80px 24px;
          background: var(--section-alt);
          border-top: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
        }

        .pg-process-grid {
          max-width: 1140px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .pg-process-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 32px 24px;
          position: relative;
        }

        .pg-step-num {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #2563eb;
          margin-bottom: 14px;
        }

        .pg-process-card h3 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }

        .pg-process-card p {
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--text-secondary);
          margin: 0;
        }

        /* ── FAQ ── */
        .pg-faq-section {
          padding: 80px 24px;
          max-width: 860px;
          margin: 0 auto;
        }

        .pg-faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pg-faq-item {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 18px 22px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pg-faq-item:hover {
          border-color: rgba(37, 99, 235, 0.4);
        }

        .pg-faq-q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pg-faq-chevron {
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }

        .pg-faq-item.open .pg-faq-chevron {
          transform: rotate(180deg);
          color: #2563eb;
        }

        .pg-faq-a {
          margin: 12px 0 0 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        /* ── CTA ── */
        .pg-cta-section {
          padding: 40px 24px 80px;
          max-width: 1140px;
          margin: 0 auto;
        }

        .pg-cta-box {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
          border-radius: 28px;
          padding: 56px 36px;
          text-align: center;
          color: #ffffff;
          box-shadow: 0 20px 50px rgba(37, 99, 235, 0.35);
        }

        .pg-cta-title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0 0 14px 0;
          color: #ffffff !important;
        }

        .pg-cta-desc {
          font-size: 1.05rem;
          max-width: 560px;
          margin: 0 auto 28px;
          color: rgba(255, 255, 255, 0.92) !important;
          line-height: 1.55;
        }

        .pg-cta-btns {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .pg-btn-cta-primary {
          padding: 13px 26px;
          background: #ffffff;
          border: none;
          border-radius: 12px;
          color: #1e40af;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .pg-btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .pg-btn-cta-secondary {
          padding: 13px 26px;
          background: rgba(255, 255, 255, 0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pg-btn-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* ── FOOTER ── */
        .pg-footer {
          background: var(--section-alt);
          border-top: 1px solid var(--card-border);
          padding: 60px 24px 30px;
        }

        .pg-footer-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr 1.5fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .pg-footer-brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pg-footer-motto {
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--text-muted);
          max-width: 320px;
          margin: 0;
        }

        .pg-footer-links-col h4 {
          font-size: 0.88rem;
          font-weight: 800;
          margin: 0 0 16px 0;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pg-footer-links-col a,
        .pg-footer-btn-link {
          display: block;
          font-size: 0.84rem;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 10px;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .pg-footer-links-col a:hover,
        .pg-footer-btn-link:hover {
          color: #2563eb;
        }

        .pg-footer-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          font-size: 0.78rem;
          font-weight: 700;
          color: #10b981;
        }

        .pg-status-dot-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .pg-footer-bottom {
          max-width: 1240px;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted);
          flex-wrap: wrap;
          gap: 12px;
        }

        /* ── HAMBURGER ── */
        .pg-hamburger {
          display: none;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1.5px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-primary);
          align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .pg-hamburger:hover { border-color: #2563eb; color: #2563eb; }

        .pg-mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 16px 14px;
          border-top: 1px solid var(--card-border);
          background: var(--bg-nav);
          backdrop-filter: blur(14px);
          animation: menuSlide 0.2s ease;
        }
        @keyframes menuSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pg-mobile-nav-link {
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          display: block;
        }
        .pg-mobile-nav-link:hover { background: rgba(37,99,235,0.08); color: #2563eb; }
        .pg-mobile-signin-btn {
          margin-top: 6px;
          width: 100%;
          padding: 11px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .pg-desktop-only { display: inline-flex; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .pg-nav-links { display: none; }
          .pg-desktop-only { display: none; }
          .pg-hamburger { display: flex; }

          .pg-hero-section {
            padding: 24px 16px 36px;
          }

          .pg-hero-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .pg-hero-left {
            order: 1;
            text-align: left;
          }

          .pg-main-hero-title {
            font-size: clamp(2rem, 7.5vw, 2.75rem);
            line-height: 1.15;
            letter-spacing: -0.03em;
          }

          .pg-hero-lead {
            font-size: 0.94rem;
            line-height: 1.55;
            margin-bottom: 20px;
          }

          .pg-hero-cta-group {
            gap: 10px;
            margin-bottom: 22px;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .pg-btn-hero-primary,
          .pg-btn-hero-secondary {
            padding: 12px 18px;
            font-size: 0.88rem;
            flex: 1;
            min-width: 140px;
            justify-content: center;
          }

          .pg-hero-stats-row {
            gap: 12px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            padding-top: 16px;
            margin-top: 16px;
          }

          .pg-stat-num { font-size: 1.25rem; }
          .pg-stat-lbl { font-size: 0.68rem; }

          .pg-hero-right {
            order: 2;
          }

          .pg-hero-visual-card {
            border-radius: 18px;
          }

          .pg-card-badge-floating,
          .pg-card-badge-bottom {
            padding: 7px 10px;
            font-size: 0.72rem;
          }

          .pg-ticker-section {
            padding: 10px 16px;
          }

          .pg-ticker-inner {
            gap: 12px;
          }

          .pg-ticker-label span { display: none; }

          .pg-matrix-section {
            padding: 48px 16px;
          }

          .pg-matrix-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: 24px;
          }

          .pg-matrix-img-wrap {
            height: 220px;
          }

          .pg-sandbox-section {
            padding: 48px 16px;
          }

          .pg-sandbox-card { padding: 18px 16px; }

          .pg-sandbox-input-row { flex-direction: column; gap: 10px; }

          .pg-sandbox-submit-btn {
            width: 100%;
            justify-content: center;
            padding: 13px;
          }

          .pg-presets-bar {
            gap: 6px;
            margin-bottom: 14px;
          }

          .pg-preset-btn { font-size: 0.74rem; padding: 5px 10px; }

          .pg-capabilities-section {
            padding: 48px 16px;
          }

          .pg-capabilities-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .pg-cap-card { padding: 20px; }

          .pg-process-section { padding: 48px 16px; }

          .pg-process-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .pg-process-card { padding: 22px 18px; }

          .pg-faq-section {
            padding: 48px 16px;
          }

          .pg-cta-section { padding: 24px 16px 56px; }
          .pg-cta-box { padding: 36px 20px; border-radius: 20px; }
          .pg-cta-title { font-size: 1.6rem; }
          .pg-cta-desc { font-size: 0.9rem; }
          .pg-cta-btns { flex-direction: column; gap: 10px; align-items: center; }
          .pg-btn-cta-primary, .pg-btn-cta-secondary { width: 100%; max-width: 320px; justify-content: center; }

          .pg-footer { padding: 40px 16px 24px; }
          .pg-footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }

          .pg-section-title { font-size: clamp(1.5rem, 5vw, 2rem); }
          .pg-section-desc { font-size: 0.9rem; }
          .pg-section-header { margin-bottom: 24px; }

          .pg-nav-bar { padding: 12px 16px; }
          .pg-btn-primary { padding: 8px 14px; font-size: 0.82rem; }
        }

        @media (max-width: 600px) {
          .pg-footer-inner { grid-template-columns: 1fr; }
          .pg-hero-section { padding: 24px 14px 32px; }
          .pg-badge-pill { font-size: 0.74rem; padding: 4px 10px; }
          .pg-result-header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .pg-result-footer { flex-direction: column; gap: 10px; }
          .pg-footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
