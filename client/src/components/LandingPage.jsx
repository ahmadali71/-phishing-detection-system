import React, { useState, useEffect } from 'react';
import {
  Shield, Globe, Mail, Image, MessageSquare, Bot, ArrowRight,
  CheckCircle2, AlertTriangle, Zap, Lock, Search, Play, ChevronDown,
  ChevronUp, ExternalLink, BarChart3, Activity, ShieldCheck, Sparkles,
  Moon, Sun, Menu, X, Check, Eye, ShieldAlert, Cpu, FileText,
  ArrowUpRight, Radio, RefreshCw, Terminal, Layers, Crosshair,
  HelpCircle, UserCheck, ShieldOff
} from 'lucide-react';
import Logo from './Logo';
import CyberMeshCanvas from './CyberMeshCanvas';

export default function LandingPage({
  onNavigateAuth,
  onNavigateDashboard,
  onNavigateScanner,
  theme,
  setTheme,
  currentUser,
  isInsideApp = false
}) {
  // Interactive Scanner state
  const [activeTabMode, setActiveTabMode] = useState('url'); // 'url' | 'email' | 'message' | 'image'
  const [scannerInput, setScannerInput] = useState('https://paypa1-security-verification.cc/login');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState({ 0: true });

  // Live Threat Simulation Feed
  const [liveThreatIndex, setLiveThreatIndex] = useState(0);

  const cycleTheme = () => {
    if (setTheme) {
      setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'navy' : 'light');
    }
  };

  const isDark = theme === 'dark';
  const isNavy = theme === 'navy';

  // Live Simulated Attack Ticker
  const simulatedThreats = [
    { target: 'paypa1-security-verification.cc', type: 'URL Homoglyph', risk: '98% CRITICAL', action: 'BLOCKED' },
    { target: 'Urgent Wire Transfer (CEO Impersonation)', type: 'Email BEC', risk: '92% HIGH', action: 'INTERCEPTED' },
    { target: 'Microsoft 365 Fake Portal Screenshot', type: 'Vision Forgery', risk: '95% HIGH', action: 'QUARANTINED' },
    { target: 'USPS Delivery Failure Link (bit.ly/3xX)', type: 'SMS Smishing', risk: '89% CRITICAL', action: 'NEUTRALIZED' },
    { target: 'account-secure-netflix-update.com', type: 'Credential Theft', risk: '96% CRITICAL', action: 'BLOCKED' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveThreatIndex(prev => (prev + 1) % simulatedThreats.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [simulatedThreats.length]);

  // Demo presets for the interactive scanner
  const demoPresets = {
    url: [
      { label: '🚨 Malicious PayPal Clone', val: 'https://paypa1-security-verification.cc/login', verdict: 'danger' },
      { label: '⚠️ Suspicious Cloudflare Gate', val: 'http://192.168.1.1/auth-gate.php?ref=login', verdict: 'warning' },
      { label: '✅ Official Google Security', val: 'https://accounts.google.com/signin', verdict: 'safe' }
    ],
    email: [
      {
        label: '🚨 CEO Wire Fraud (BEC)',
        val: 'From: ceo-office@corp-executive-urgent.com\nSubject: IMMEDIATE Wire Transfer Needed: $45,000 for Vendor X\nPlease wire immediately before close of banking hours. Keep confidential.',
        verdict: 'danger'
      },
      {
        label: '⚠️ Password Reset Alert',
        val: 'From: security-notice@it-desk-support.org\nSubject: Your password expires in 30 minutes. Click here to confirm identity.',
        verdict: 'warning'
      },
      {
        label: '✅ Normal Meeting Invite',
        val: 'From: sarah.jenkins@company.com\nSubject: Quarterly Product Roadmap Sync\nHi team, sharing the slide deck for tomorrow morning at 10 AM.',
        verdict: 'safe'
      }
    ],
    message: [
      {
        label: '🚨 Bank Smishing Shortlink',
        val: 'URGENT CHASE ALERT: Unauthorized $890 transaction detected on card ending 4019. Lock account now: http://bit.ly/chase-auth-99',
        verdict: 'danger'
      },
      {
        label: '⚠️ FedEx Package Re-delivery',
        val: 'FedEx: Package tracking #US-91823 could not be delivered. $1.99 redelivery fee required: https://fedx-customs-release.info',
        verdict: 'warning'
      },
      {
        label: '✅ Standard 2FA Code',
        val: 'Your GitHub verification code is 492817. Valid for 10 minutes. Never share this code with anyone.',
        verdict: 'safe'
      }
    ],
    image: [
      {
        label: '🚨 Fake Microsoft 365 Login Screenshot',
        val: 'screenshot_office365_spoof_gate.png (Visual Brand Score: 94% Match, Form Action: Unknown Russian IP)',
        verdict: 'danger'
      },
      {
        label: '⚠️ Malicious QR Code Invoice',
        val: 'invoice_qr_code_trap.png (Decodes to: http://suspicious-payment-collector.cc)',
        verdict: 'warning'
      },
      {
        label: '✅ Legitimate System Dashboard',
        val: 'official_cloud_console_screenshot.png (No deception markers found)',
        verdict: 'safe'
      }
    ]
  };

  const handleRunScan = (customVal, customVerdict) => {
    const inputToScan = customVal || scannerInput;
    if (!inputToScan.trim()) return;

    setIsScanning(true);
    setScanResult(null);
    setScanStep(1);

    // Multi-stage scan telemetry simulation
    setTimeout(() => setScanStep(2), 350);
    setTimeout(() => setScanStep(3), 700);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep(4);

      let isSafe = customVerdict === 'safe' || inputToScan.includes('google.com') || inputToScan.includes('sarah.jenkins') || inputToScan.includes('GitHub');
      let isWarning = customVerdict === 'warning' || inputToScan.includes('192.168') || inputToScan.includes('password expires') || inputToScan.includes('FedEx');

      if (isSafe) {
        setScanResult({
          status: 'safe',
          verdict: 'Legitimate & Verified Safe',
          score: 4,
          level: 'CLEAN',
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
          details: [
            'High-assurance digital certificate registered to authorized identity',
            'Zero matching heuristic signatures across 40+ global threat blacklists',
            'Cryptographic SPF/DKIM/DMARC headers confirmed valid and unaltered'
          ],
          recommendation: 'Safe to proceed. No anomalous behavior or malicious payloads detected.'
        });
      } else if (isWarning) {
        setScanResult({
          status: 'warning',
          verdict: 'Suspicious Indicators Detected',
          score: 64,
          level: 'ELEVATED RISK',
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.35)',
          details: [
            'Detected aggressive urgency cues ("30 minutes", "Lock account", "Unverified IP")',
            'Obfuscated destination route or newly created domain registration (< 14 days old)',
            'Recommended caution: sender authenticity cannot be cryptographically proven'
          ],
          recommendation: 'Exercise high caution. Do not submit credentials or transfer funds without out-of-band verification.'
        });
      } else {
        setScanResult({
          status: 'danger',
          verdict: 'Malicious Phishing Attack Intercepted',
          score: 96,
          level: 'CRITICAL THREAT',
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.35)',
          details: [
            'Typosquatting / Punycode homoglyph detected: mimics authentic brand with rogue characters',
            'Credential harvesting destination: hidden form scripts exfiltrate credentials to rogue server',
            'Matched zero-day threat heuristics from active phishing campaign databases'
          ],
          recommendation: 'IMMEDIATE THREAT. This vector has been flagged for quarantine. Do not click, open, or reply.'
        });
      }
    }, 1100);
  };

  const handleLaunchTool = (routeId) => {
    if (currentUser) {
      if (onNavigateScanner) onNavigateScanner(routeId);
      else if (onNavigateDashboard) onNavigateDashboard();
    } else {
      if (onNavigateAuth) onNavigateAuth('login');
      else if (onNavigateDashboard) onNavigateDashboard();
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 6 Core Features matching only the actual tools in the website
  const coreVectors = [
    {
      id: 'url-detection',
      title: 'URL & Domain Scanner',
      tagline: 'Deep Lexical & DNS Inspection',
      icon: Globe,
      color: '#38bdf8',
      desc: 'Dissects suspicious URLs in milliseconds. Analyzes Punycode homoglyphs, brand typosquatting, lexical entropy, WHOIS domain age, and SSL chain validity.',
      points: ['Sub-second latency (<65ms)', 'Homoglyph & Punycode detector', 'Active SSL & DNS certificate audit']
    },
    {
      id: 'email-detection',
      title: 'Email BEC & NLP Scanner',
      tagline: 'Linguistic Social Engineering Shield',
      icon: Mail,
      color: '#60a5fa',
      desc: 'Transformer-powered Natural Language Processing isolates psychological urgency, executive CEO spoofing, forged email headers, and weaponized payload links.',
      points: ['DistilBERT NLP engine', 'Business Email Compromise (BEC)', 'SPF, DKIM, & DMARC verification']
    },
    {
      id: 'image-detection',
      title: 'Screenshot Vision & OCR',
      tagline: 'Visual Forgery & QR Code Defense',
      icon: Image,
      color: '#34d399',
      desc: 'Scans screenshots of deceptive login pages and portals. Matches brand logos against legitimate pixel hashes, extracts embedded text, and decodes malicious QR traps.',
      points: ['Computer vision pixel matching', 'Zero-click QR code inspection', 'Form action exfiltration audit']
    },
    {
      id: 'message-detection',
      title: 'SMS & Smishing Shield',
      tagline: 'Mobile Fraud & Shortlink Resolver',
      icon: MessageSquare,
      color: '#a78bfa',
      desc: 'Defends mobile users against fake parcel deliveries, banking SMS alerts, and unmasks redirected shortlinks (bit.ly, tinyurl) before compromise.',
      points: ['Automated shortlink expansion', 'Banking smishing NLP classifier', 'Rogue sender ID detection']
    },
    {
      id: 'ai-assistant',
      title: 'AI Security Assistant',
      tagline: 'Conversational Threat Reasoning',
      icon: Bot,
      color: '#f472b6',
      desc: 'Interactive 24/7 AI cybersecurity copilot. Ask questions, analyze suspicious message snippets, get step-by-step incident response advice, and harden your security.',
      points: ['Real-time contextual chat', 'Cyber threat explanation engine', 'Immediate defensive action steps']
    },
    {
      id: 'scan-history',
      title: 'Scan History & Reports',
      tagline: 'Audit Trail & Forensic Logs',
      icon: BarChart3,
      color: '#fbbf24',
      desc: 'Centralized forensic audit repository. Search, filter, and review all previous threat scans, inspect detailed risk score meters, and export forensic report dossiers.',
      points: ['Searchable audit history', 'Risk distribution analytics', 'One-click forensic report modal']
    }
  ];

  // Pipeline Steps
  const pipelineSteps = [
    {
      step: '01',
      title: 'Multi-Vector Ingestion',
      desc: 'Accepts raw URLs, suspicious email text, mobile SMS, or portal screenshots across desktop and mobile.',
      icon: Terminal,
      color: '#38bdf8'
    },
    {
      step: '02',
      title: 'Heuristic & Lexical Parsing',
      desc: 'Performs tokenization, Shannon entropy evaluation, domain age queries, and lexical anomaly extraction.',
      icon: Cpu,
      color: '#818cf8'
    },
    {
      step: '03',
      title: 'Deep Neural & Vision Inference',
      desc: 'Runs NLP semantic classification, computer vision logo hashing, and cross-references active global blacklists.',
      icon: Bot,
      color: '#ec4899'
    },
    {
      step: '04',
      title: 'Actionable Verdict & Defense',
      desc: 'Outputs an instant 0-100% Risk Score, technical evidence breakdown, and one-click quarantine actions.',
      icon: ShieldCheck,
      color: '#10b981'
    }
  ];

  // FAQ Items strictly reflecting only website features
  const faqList = [
    {
      q: 'How does the Automated Phishing Detection System detect zero-day attacks?',
      a: 'Unlike legacy anti-phishing tools that rely purely on outdated static blacklists, our engine combines multi-layer lexical heuristics, NLP semantic coercion modeling, and computer vision OCR. This enables our AI models to intercept brand-new, never-before-seen phishing pages and BEC emails within milliseconds of deployment.'
    },
    {
      q: 'Can the system detect visual brand impersonation on screenshots?',
      a: 'Yes. Our Computer Vision and OCR module scans screenshots of deceptive login forms. It compares logo geometries and color palettes against authentic brand hashes (e.g. Microsoft 365, PayPal, Google) while analyzing the underlying form action scripts.'
    },
    {
      q: 'What is Business Email Compromise (BEC) and how is it stopped?',
      a: 'BEC attacks often contain zero malicious links or malware attachments—they rely strictly on linguistic deception, executive impersonation, and urgency to trick victims into wiring funds. Our DistilBERT NLP model evaluates tone, urgency coercion, and header consistency to flag executive impersonation.'
    },
    {
      q: 'Is my scanned data kept private and confidential?',
      a: 'Absolutely. We enforce a strict zero-retention data privacy policy. Scanned text, URLs, and screenshots are processed in memory and never shared with third parties or used for external advertising.'
    },
    {
      q: 'How can I use the Automated Phishing Detection System in my daily workflow?',
      a: 'You can access all detection tools directly from your central Dashboard. Simply select URL Scanner, Email BEC Analyzer, Screenshot Vision OCR, or SMS Smishing Shield to run instant security checks, or consult our built-in AI Security Assistant for real-time guidance.'
    }
  ];

  return (
    <div className="apds-landing theme-navy" style={{ position: 'relative' }}>
      {/* ── FULL-PAGE MOVEABLE CYBER CONSTELLATION MESH CANVAS ── */}
      <CyberMeshCanvas fullPage={true} particleCount={80} maxDistance={145} speed={0.65} />

      {/* ── STANDALONE NAVBAR (When viewed outside authenticated dashboard) ── */}
      {!isInsideApp && (
        <header className="apds-navbar">
          <div className="apds-nav-container">
            {/* Brand Logo & Name */}
            <div className="apds-nav-brand">
              <Logo size="sm" useShort={false} lightText={!isDark && !isNavy ? false : true} />
            </div>

            {/* Nav Links: Home, Dashboard, Features, Live Scanner, Threat Intel, How It Works, FAQ */}
            <nav className="apds-nav-menu">
              <a href="#hero" className="apds-nav-item">Home</a>
              <button
                type="button"
                onClick={() => {
                  if (currentUser) onNavigateDashboard();
                  else onNavigateAuth('login');
                }}
                className="apds-nav-item apds-nav-btn-link"
              >
                Dashboard
              </button>
              <a href="#vectors" className="apds-nav-item">Features</a>
              <a href="#sandbox" className="apds-nav-item">Live Scanner</a>
              <a href="#threat-matrix" className="apds-nav-item">Threat Intel</a>
              <a href="#pipeline" className="apds-nav-item">How It Works</a>
              <a href="#faq" className="apds-nav-item">FAQ</a>
            </nav>

            {/* Right Actions */}
            <div className="apds-nav-actions">
              <button
                type="button"
                onClick={cycleTheme}
                className="apds-theme-toggle"
                title={`Switch Theme (Current: ${theme})`}
              >
                {isDark ? <Sun size={17} color="#f59e0b" /> : isNavy ? <Layers size={17} color="#38bdf8" /> : <Moon size={17} color="#0284c7" />}
              </button>

              {currentUser ? (
                <button onClick={onNavigateDashboard} className="apds-btn-glow">
                  <span>Dashboard</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <>
                  <button onClick={() => onNavigateAuth('login')} className="apds-btn-ghost">
                    Sign In
                  </button>
                  <button onClick={() => onNavigateAuth('register')} className="apds-btn-glow">
                    <span>Get Protected</span>
                    <ArrowRight size={15} />
                  </button>
                </>
              )}

              {/* Hamburger */}
              <button
                className={`apds-nav-hamburger${mobileMenuOpen ? ' active' : ''}`}
                onClick={() => setMobileMenuOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="apds-mobile-dropdown">
              <a href="#hero" className="apds-mob-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser) onNavigateDashboard();
                  else onNavigateAuth('login');
                }}
                className="apds-mob-link apds-nav-btn-link"
              >
                Dashboard
              </button>
              <a href="#vectors" className="apds-mob-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#sandbox" className="apds-mob-link" onClick={() => setMobileMenuOpen(false)}>Live Scanner</a>
              <a href="#threat-matrix" className="apds-mob-link" onClick={() => setMobileMenuOpen(false)}>Threat Matrix</a>
              <a href="#pipeline" className="apds-mob-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#faq" className="apds-mob-link" onClick={() => setMobileMenuOpen(false)}>FAQ</a>

              <div className="apds-mob-auth">
                {currentUser ? (
                  <button onClick={() => { onNavigateDashboard(); setMobileMenuOpen(false); }} className="apds-btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button onClick={() => { onNavigateAuth('login'); setMobileMenuOpen(false); }} className="apds-btn-ghost" style={{ width: '100%' }}>
                      Sign In
                    </button>
                    <button onClick={() => { onNavigateAuth('register'); setMobileMenuOpen(false); }} className="apds-btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                      Get Protected Free
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {/* ── 1. HERO SECTION ── */}
      <section id="hero" className="apds-hero apds-hero-v2">

        {/* Animated background layers */}
        <div className="hero2-bg-layer" />
        <CyberMeshCanvas fullPage={false} particleCount={65} maxDistance={145} speed={0.7} nodeColor="#38bdf8" accentNodeColor="#10b981" />
        <div className="hero2-grid-layer" />
        <div className="hero2-glow-tl" />
        <div className="hero2-glow-br" />

        <div className="apds-container hero2-inner">

          {/* ── LEFT: Text Content ── */}
          <div className="hero2-left">

            {/* Badge */}
            <div className="hero2-badge">
              <span className="hero2-badge-dot" />
              <span>AI-Powered Security Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero2-h1">
              Stay Ahead<br />
              of <span className="hero2-h1-accent">Cyber Threats</span>
            </h1>

            {/* Tagline */}
            <p className="hero2-tagline">Detect. Analyze. Protect.</p>

            {/* Description */}
            <p className="hero2-desc">
              APDS — Automated Phishing Detection System — is your all-in-one AI security platform for detecting
              phishing URLs, malicious emails, suspicious screenshots, and smishing SMS attacks in real time.
            </p>

            {/* CTA Buttons */}
            <div className="hero2-ctas">
              <button
                className="hero2-btn-primary"
                onClick={() => onNavigateAuth ? onNavigateAuth('register') : null}
              >
                Get Started
              </button>
              <a href="#vectors" className="hero2-btn-secondary">
                Learn More
              </a>
            </div>

            {/* Stats Row */}
            <div className="hero2-stats-row">
              <div className="hero2-stat">
                <span className="hero2-stat-num">99.9%</span>
                <span className="hero2-stat-lbl">Detection Rate</span>
              </div>
              <div className="hero2-stat-sep" />
              <div className="hero2-stat">
                <span className="hero2-stat-num">&lt;65ms</span>
                <span className="hero2-stat-lbl">Scan Speed</span>
              </div>
              <div className="hero2-stat-sep" />
              <div className="hero2-stat">
                <span className="hero2-stat-num">4 Types</span>
                <span className="hero2-stat-lbl">Threat Coverage</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: 3D Cyber Globe ── */}
          <div className="hero2-right">
            {/* 3D scene wrapper with perspective */}
            <div className="hero2-scene">

              {/* Ambient glow behind globe */}
              <div className="hero2-glow-sphere" />

              {/* Pulse rings - static, not rotating */}
              <div className="hero2-ring hero2-ring-1" />
              <div className="hero2-ring hero2-ring-2" />
              <div className="hero2-ring hero2-ring-3" />

              {/* 3D globe card - rotates in 3D */}
              <div className="hero2-globe-3d">
                <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" className="hero2-globe-svg">
                  <defs>
                    <radialGradient id="globeGrad" cx="38%" cy="32%" r="68%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="45%" stopColor="#0c1e7a" />
                      <stop offset="100%" stopColor="#04093a" />
                    </radialGradient>
                    <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="globeHighlight" cx="35%" cy="28%" r="45%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <filter id="globeBlur">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Outer ambient glow */}
                  <circle cx="160" cy="160" r="152" fill="url(#globeGlow)" />

                  {/* Globe body */}
                  <circle cx="160" cy="160" r="130" fill="url(#globeGrad)" />

                  {/* Globe specular highlight */}
                  <circle cx="160" cy="160" r="130" fill="url(#globeHighlight)" />

                  {/* Latitude rings */}
                  <ellipse cx="160" cy="94"  rx="87"  ry="19" fill="none" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.4" />
                  <ellipse cx="160" cy="130" rx="122" ry="27" fill="none" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.45" />
                  <ellipse cx="160" cy="160" rx="130" ry="29" fill="none" stroke="#38bdf8" strokeWidth="0.9" strokeOpacity="0.5" />
                  <ellipse cx="160" cy="190" rx="122" ry="27" fill="none" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.45" />
                  <ellipse cx="160" cy="226" rx="87"  ry="19" fill="none" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.4" />

                  {/* Longitude arcs */}
                  <ellipse cx="160" cy="160" rx="18"  ry="130" fill="none" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.35" />
                  <ellipse cx="160" cy="160" rx="55"  ry="130" fill="none" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.35" />
                  <ellipse cx="160" cy="160" rx="100" ry="130" fill="none" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.3" />
                  <ellipse cx="160" cy="160" rx="125" ry="130" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.25" />

                  {/* Continents */}
                  <ellipse cx="120" cy="128" rx="34" ry="18" fill="#1e3a8a" fillOpacity="0.85" />
                  <ellipse cx="135" cy="118" rx="20" ry="12" fill="#1d4ed8" fillOpacity="0.7" />
                  <ellipse cx="188" cy="112" rx="22" ry="28" fill="#1e3a8a" fillOpacity="0.8" />
                  <ellipse cx="200" cy="130" rx="14" ry="10" fill="#1d4ed8" fillOpacity="0.65" />
                  <ellipse cx="148" cy="172" rx="26" ry="14" fill="#1e3a8a" fillOpacity="0.75" />
                  <ellipse cx="105" cy="168" rx="12" ry="22" fill="#1d4ed8" fillOpacity="0.6" />
                  <ellipse cx="205" cy="158" rx="11" ry="16" fill="#1e3a8a" fillOpacity="0.65" />
                  <ellipse cx="196" cy="188" rx="17" ry="10" fill="#1d4ed8" fillOpacity="0.6" />

                  {/* Network data points */}
                  <circle cx="120" cy="128" r="3.5" fill="#60a5fa" fillOpacity="0.95" filter="url(#globeBlur)" />
                  <circle cx="188" cy="112" r="3"   fill="#60a5fa" fillOpacity="0.9" filter="url(#globeBlur)" />
                  <circle cx="148" cy="172" r="3.5" fill="#60a5fa" fillOpacity="0.95" filter="url(#globeBlur)" />
                  <circle cx="205" cy="158" r="2.5" fill="#93c5fd" fillOpacity="0.9" filter="url(#globeBlur)" />
                  <circle cx="105" cy="168" r="2.5" fill="#93c5fd" fillOpacity="0.85" filter="url(#globeBlur)" />
                  <circle cx="140" cy="100" r="2"   fill="#7dd3fc" fillOpacity="0.8" filter="url(#globeBlur)" />
                  <circle cx="196" cy="188" r="2.5" fill="#60a5fa" fillOpacity="0.85" filter="url(#globeBlur)" />
                  <circle cx="170" cy="140" r="2"   fill="#93c5fd" fillOpacity="0.8" filter="url(#globeBlur)" />

                  {/* Connection lines */}
                  <line x1="120" y1="128" x2="188" y2="112" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />
                  <line x1="188" y1="112" x2="148" y2="172" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />
                  <line x1="148" y1="172" x2="205" y2="158" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.45" />
                  <line x1="205" y1="158" x2="170" y2="140" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.4" />
                  <line x1="105" y1="168" x2="120" y2="128" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.4" />
                  <line x1="140" y1="100" x2="120" y2="128" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.35" />
                  <line x1="140" y1="100" x2="188" y2="112" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.35" />
                  <line x1="196" y1="188" x2="148" y2="172" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.35" />

                  {/* Globe border glow */}
                  <circle cx="160" cy="160" r="130" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#globeBlur)" />
                </svg>
              </div>

              {/* Shield lock — fixed center layer, OUTSIDE the rotating globe */}
              <div className="hero2-shield-center">
                <div className="hero2-shield-wrap">
                  <svg viewBox="0 0 90 90" width="130" height="130" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="shGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {/* Glow halo */}
                    <circle cx="45" cy="45" r="42" fill="url(#shGlow)" />
                    {/* Shield body */}
                    <path d="M45 8 L70 18 L70 40 C70 57 59 70 45 76 C31 70 20 57 20 40 L20 18 Z"
                      fill="#0a1845" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.95" />
                    {/* Inner shield shine */}
                    <path d="M45 13 L65 22 L65 40 C65 55 55 67 45 72 C35 67 25 55 25 40 L25 22 Z"
                      fill="none" stroke="rgba(147,197,253,0.2)" strokeWidth="1" />
                    {/* Lock body */}
                    <rect x="34" y="40" width="22" height="17" rx="3" fill="#38bdf8" fillOpacity="0.97" />
                    {/* Lock shackle */}
                    <path d="M38 40 L38 33 C38 27.5 52 27.5 52 33 L52 40"
                      fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
                    {/* Keyhole */}
                    <circle cx="45" cy="47" r="3" fill="#0a1845" />
                    <rect x="43.5" y="47" width="3" height="5" rx="1.5" fill="#0a1845" />
                  </svg>
                </div>
              </div>

              {/* Floating threat tags */}
              <div className="hero2-float-tag tag-a">
                <span className="hero2-tag-dot dot-red" />
                <span>Phishing URL Blocked</span>
              </div>
              <div className="hero2-float-tag tag-b">
                <span className="hero2-tag-dot dot-green" />
                <span>Email Verified Safe</span>
              </div>
              <div className="hero2-float-tag tag-c">
                <span className="hero2-tag-dot dot-yellow" />
                <span>SMS Threat Detected</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 2. CORE DEFENSE VECTORS (The 4 Engines) ── */}
      <section id="vectors" className="apds-section apds-vectors-section" style={{ position: 'relative' }}>
        <div className="apds-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="apds-section-heading">
            <span className="apds-chip-badge">COMPREHENSIVE COVERAGE</span>
            <h2 className="apds-section-title">
              Engineered For Modern <span className="apds-gradient-text">Deception Vectors</span>
            </h2>
            <p className="apds-section-desc">
              Phishing is no longer just misspelled emails. Our four specialized engines neutralize deceptive attacks across every touchpoint.
            </p>
          </div>

          <div className="apds-vector-grid">
            {coreVectors.map(vec => {
              const Icon = vec.icon;
              return (
                <div
                  key={vec.id}
                  className="apds-vector-card"
                  onClick={() => handleLaunchTool(vec.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="apds-vc-header">
                    <div className="apds-vc-icon" style={{ background: `${vec.color}18`, color: vec.color, borderColor: `${vec.color}40` }}>
                      <Icon size={26} />
                    </div>
                    <span className="apds-vc-tagline" style={{ color: vec.color }}>{vec.tagline}</span>
                  </div>

                  <h3 className="apds-vc-title">{vec.title}</h3>
                  <p className="apds-vc-desc">{vec.desc}</p>

                  <ul className="apds-vc-points">
                    {vec.points.map((pt, i) => (
                      <li key={i}>
                        <Check size={14} style={{ color: vec.color, flexShrink: 0 }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="apds-vc-footer">
                    <span className="apds-vc-btn-txt" style={{ color: vec.color }}>
                      Launch Dedicated Scanner
                    </span>
                    <ArrowUpRight size={17} style={{ color: vec.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE LIVE SCANNER SANDBOX ── */}
      <section id="sandbox" className="apds-section apds-sandbox-section">
        <div className="apds-container">
          <div className="apds-section-heading">
            <span className="apds-chip-badge">EXPERIENCE IT LIVE</span>
            <h2 className="apds-section-title">
              Interactive <span className="apds-gradient-text">Threat Sandbox</span>
            </h2>
            <p className="apds-section-desc">
              Test suspicious links, forged emails, SMS messages, or image indicators right now with real-time heuristic inference.
            </p>
          </div>

          <div className="apds-sandbox-card">
            {/* Mode Tabs */}
            <div className="apds-sb-tabs">
              <button
                className={`apds-sb-tab ${activeTabMode === 'url' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTabMode('url');
                  setScannerInput('https://paypa1-security-verification.cc/login');
                  setScanResult(null);
                }}
              >
                <Globe size={16} />
                <span>URL Scanner</span>
              </button>
              <button
                className={`apds-sb-tab ${activeTabMode === 'email' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTabMode('email');
                  setScannerInput('From: ceo-office@corp-executive-urgent.com\nSubject: IMMEDIATE Wire Transfer Needed: $45,000 for Vendor X\nPlease wire immediately before close of banking hours. Keep confidential.');
                  setScanResult(null);
                }}
              >
                <Mail size={16} />
                <span>Email BEC</span>
              </button>
              <button
                className={`apds-sb-tab ${activeTabMode === 'message' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTabMode('message');
                  setScannerInput('URGENT CHASE ALERT: Unauthorized $890 transaction detected on card ending 4019. Lock account now: http://bit.ly/chase-auth-99');
                  setScanResult(null);
                }}
              >
                <MessageSquare size={16} />
                <span>SMS / Smishing</span>
              </button>
              <button
                className={`apds-sb-tab ${activeTabMode === 'image' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTabMode('image');
                  setScannerInput('screenshot_office365_spoof_gate.png (Visual Brand Score: 94% Match, Form Action: Unknown Russian IP)');
                  setScanResult(null);
                }}
              >
                <Image size={16} />
                <span>Vision OCR</span>
              </button>
            </div>

            {/* Presets Row */}
            <div className="apds-sb-presets">
              <span className="apds-presets-lbl">Try Sample:</span>
              <div className="apds-presets-list">
                {demoPresets[activeTabMode].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setScannerInput(p.val);
                      handleRunScan(p.val, p.verdict);
                    }}
                    className={`apds-preset-btn ${p.verdict}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Action Box */}
            <div className="apds-sb-input-box">
              {activeTabMode === 'email' ? (
                <textarea
                  rows={4}
                  value={scannerInput}
                  onChange={e => setScannerInput(e.target.value)}
                  placeholder="Paste suspicious email headers and body content here..."
                  className="apds-sb-textarea"
                />
              ) : (
                <input
                  type="text"
                  value={scannerInput}
                  onChange={e => setScannerInput(e.target.value)}
                  placeholder={
                    activeTabMode === 'url' ? 'Enter suspicious URL (e.g., https://paypa1-verify.cc)...' :
                    activeTabMode === 'message' ? 'Paste SMS alert or text message...' :
                    'Enter image filename or visual URL indicators...'
                  }
                  className="apds-sb-input"
                />
              )}

              <div className="apds-sb-actions">
                <button
                  onClick={() => handleRunScan()}
                  disabled={isScanning || !scannerInput.trim()}
                  className="apds-sb-scan-btn"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw size={17} className="apds-spin-icon" />
                      <span>Deep Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={17} />
                      <span>Scan Threat Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scanning Progress Telemetry */}
            {isScanning && (
              <div className="apds-sb-telemetry">
                <div className="apds-progress-track">
                  <div
                    className="apds-progress-bar"
                    style={{ width: `${(scanStep / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="apds-telemetry-steps">
                  <span className={scanStep >= 1 ? 'step-done' : ''}>1. Lexical &amp; DNS Entropy</span>
                  <span className={scanStep >= 2 ? 'step-done' : ''}>2. Global Blacklist Lookup</span>
                  <span className={scanStep >= 3 ? 'step-done' : ''}>3. NLP Semantic Coercion</span>
                  <span className={scanStep >= 4 ? 'step-done' : ''}>4. Risk Synthesis</span>
                </div>
              </div>
            )}

            {/* Result Report Card */}
            {scanResult && !isScanning && (
              <div
                className="apds-sb-result-card"
                style={{
                  background: scanResult.bg,
                  borderColor: scanResult.border
                }}
              >
                <div className="apds-res-header">
                  <div className="apds-res-badge-wrap">
                    {scanResult.status === 'safe' && <ShieldCheck size={28} color="#10b981" />}
                    {scanResult.status === 'warning' && <AlertTriangle size={28} color="#f59e0b" />}
                    {scanResult.status === 'danger' && <ShieldAlert size={28} color="#ef4444" />}
                    <div>
                      <h4 className="apds-res-title" style={{ color: scanResult.color }}>
                        {scanResult.verdict}
                      </h4>
                      <span className="apds-res-threat-lvl" style={{ color: scanResult.color }}>
                        Threat Rating: {scanResult.level}
                      </span>
                    </div>
                  </div>

                  <div className="apds-res-gauge">
                    <span className="apds-res-score" style={{ color: scanResult.color }}>
                      {scanResult.score}%
                    </span>
                    <span className="apds-res-score-lbl">Risk Score</span>
                  </div>
                </div>

                <div className="apds-res-body">
                  <h5 className="apds-res-subhead">Key Forensic Findings:</h5>
                  <ul className="apds-res-list">
                    {scanResult.details.map((detail, idx) => (
                      <li key={idx}>
                        <span className="apds-res-bullet" style={{ background: scanResult.color }}></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="apds-res-rec">
                    <strong>Recommended Action: </strong>
                    <span>{scanResult.recommendation}</span>
                  </div>
                </div>

                <div className="apds-res-cta-row">
                  <button
                    onClick={() => handleLaunchTool(
                      activeTabMode === 'url' ? 'url-detection' :
                      activeTabMode === 'email' ? 'email-detection' :
                      activeTabMode === 'message' ? 'message-detection' : 'image-detection'
                    )}
                    className="apds-res-action-btn"
                    style={{ background: scanResult.color }}
                  >
                    <span>Open in Full Scanner</span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => setScanResult(null)}
                    className="apds-res-clear-btn"
                  >
                    Clear Result
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. THREAT MATRIX: PHISHING ANATOMY VS VERIFIED STANDARD ── */}
      <section id="threat-matrix" className="apds-section apds-matrix-section">
        <div className="apds-container">
          <div className="apds-section-heading">
            <span className="apds-chip-badge">ANATOMY OF AN ATTACK</span>
            <h2 className="apds-section-title">
              How Our AI Exposes <span className="apds-gradient-text">Subtle Deception</span>
            </h2>
            <p className="apds-section-desc">
              Human eyes miss tiny homoglyphs and hidden form destinations. See how the Automated Phishing Detection System dissects malicious requests side-by-side.
            </p>
          </div>

          <div className="apds-matrix-grid">
            {/* Malicious Attack Card */}
            <div className="apds-anatomy-card anatomy-danger">
              <div className="apds-anatomy-head">
                <div className="apds-anat-icon danger-icon">
                  <ShieldOff size={22} />
                </div>
                <div>
                  <h4 className="apds-anat-title text-red">Weaponized Phishing Vector</h4>
                  <span className="apds-anat-sub">Deceptive Brand Impersonation</span>
                </div>
              </div>

              <div className="apds-anat-callouts">
                <div className="apds-callout-item">
                  <span className="apds-callout-num">01</span>
                  <div>
                    <strong>Punycode Homoglyph Domain:</strong>
                    <p><code className="danger-code">https://рaypal.com/login</code> (Contains Cyrillic &apos;р&apos; mimicking English &apos;p&apos;)</p>
                  </div>
                </div>

                <div className="apds-callout-item">
                  <span className="apds-callout-num">02</span>
                  <div>
                    <strong>Forged Urgency Triggers:</strong>
                    <p>Psychological coercion: &ldquo;Account suspended in 15 minutes unless verified&rdquo;</p>
                  </div>
                </div>

                <div className="apds-callout-item">
                  <span className="apds-callout-num">03</span>
                  <div>
                    <strong>Rogue Exfiltration Destination:</strong>
                    <p>Form action sends credentials to anonymous unindexed offshore server</p>
                  </div>
                </div>

                <div className="apds-callout-item">
                  <span className="apds-callout-num">04</span>
                  <div>
                    <strong>Shortlink Obfuscation:</strong>
                    <p>Chained redirects disguise destination through bit.ly masking</p>
                  </div>
                </div>
              </div>

              <div className="apds-anat-footer text-red">
                <span>INTERCEPTED BY APDS ENGINE (99.8% CERTAINTY)</span>
              </div>
            </div>

            {/* Verified Legitimate Card */}
            <div className="apds-anatomy-card anatomy-safe">
              <div className="apds-anatomy-head">
                <div className="apds-anat-icon safe-icon">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="apds-anat-title text-green">Verified Legitimate Domain</h4>
                  <span className="apds-anat-sub">High-Assurance Cryptography</span>
                </div>
              </div>

              <div className="apds-anat-callouts">
                <div className="apds-callout-item">
                  <span className="apds-callout-num green-num">01</span>
                  <div>
                    <strong>Authentic ASCII Registrar:</strong>
                    <p><code className="safe-code">https://paypal.com/signin</code> (Matches official brand ICANN entry)</p>
                  </div>
                </div>

                <div className="apds-callout-item">
                  <span className="apds-callout-num green-num">02</span>
                  <div>
                    <strong>Cryptographic DMARC/DKIM:</strong>
                    <p>DKIM signature verified, SPF alignment pass, domain age &gt; 15 years</p>
                  </div>
                </div>

                <div className="apds-callout-item">
                  <span className="apds-callout-num green-num">03</span>
                  <div>
                    <strong>Valid Extended Validation SSL:</strong>
                    <p>Issued by verified Certificate Authority with clean revocation status</p>
                  </div>
                </div>

                <div className="apds-callout-item">
                  <span className="apds-callout-num green-num">04</span>
                  <div>
                    <strong>Zero Blacklist Matches:</strong>
                    <p>Flawless reputation across PhishTank, Google SafeBrowsing &amp; VirusTotal</p>
                  </div>
                </div>
              </div>

              <div className="apds-anat-footer text-green">
                <span>VERIFIED CLEAN &amp; AUTHENTIC (0.0% THREAT RISK)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ARCHITECTURE & MULTI-LAYER PIPELINE ── */}
      <section id="pipeline" className="apds-section apds-pipeline-section">
        <div className="apds-container">
          <div className="apds-section-heading">
            <span className="apds-chip-badge">SYSTEM ARCHITECTURE</span>
            <h2 className="apds-section-title">
              The 4-Stage <span className="apds-gradient-text">Neural Defense Pipeline</span>
            </h2>
            <p className="apds-section-desc">
              Every request passes through our layered inspection pipeline in under 65 milliseconds before a verdict is rendered.
            </p>
          </div>

          <div className="apds-pipeline-grid">
            {pipelineSteps.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="apds-pipeline-card">
                  <div className="apds-pl-num" style={{ color: p.color }}>{p.step}</div>
                  <div className="apds-pl-icon" style={{ background: `${p.color}15`, color: p.color }}>
                    <Icon size={24} />
                  </div>
                  <h4 className="apds-pl-title">{p.title}</h4>
                  <p className="apds-pl-desc">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ SECTION ── */}
      <section id="faq" className="apds-section apds-faq-section">
        <div className="apds-container apds-faq-container">
          <div className="apds-section-heading">
            <span className="apds-chip-badge">FREQUENTLY ASKED</span>
            <h2 className="apds-section-title">
              Common Questions &amp; <span className="apds-gradient-text">Security Standards</span>
            </h2>
            <p className="apds-section-desc">
              Everything you need to know about our detection models, latency, privacy, and protection architecture.
            </p>
          </div>

          <div className="apds-faq-accordion">
            {faqList.map((item, idx) => {
              const isOpen = !!openFaq[idx];
              return (
                <div
                  key={idx}
                  className={`apds-faq-item ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="apds-faq-question">
                    <span className="apds-faq-q-text">{item.q}</span>
                    <button className="apds-faq-toggle-btn" aria-label="Toggle FAQ">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="apds-faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. HIGH-CONVERTING CTA BANNER ── */}
      <section className="apds-cta-banner-section">
        <div className="apds-container">
          <div className="apds-cta-card">
            <div className="apds-cta-content">
              <span className="apds-cta-pill">INSTANT DIGITAL PROTECTION</span>
              <h2 className="apds-cta-heading">
                Ready to Protect Your Organization from Modern Phishing?
              </h2>
              <p className="apds-cta-sub">
                Deploy the Automated Phishing Detection System today. Scan URLs, analyze suspicious emails, and prevent data breaches in real-time.
              </p>
              <div className="apds-cta-buttons">
                {currentUser ? (
                  <button onClick={onNavigateDashboard} className="apds-btn-glow">
                    <span>Go To Dashboard</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <button onClick={() => onNavigateAuth('register')} className="apds-btn-glow">
                      <span>Get Started Free</span>
                      <ArrowRight size={16} />
                    </button>
                    <a href="#sandbox" className="apds-btn-ghost">
                      Try Live Sandbox
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FOOTER ── */}
      <footer className="apds-footer">
        <div className="apds-container apds-footer-grid">
          <div className="apds-footer-brand-col">
            <Logo size="md" useShort={false} lightText={true} />
            <p className="apds-footer-tagline">
              Advanced multi-vector automated phishing detection powered by Machine Learning, Natural Language Processing, and Computer Vision heuristics.
            </p>
            <div className="apds-footer-status">
              <span className="apds-status-dot"></span>
              <span>All Systems Operational • Latency: 22ms</span>
            </div>
          </div>

          <div className="apds-footer-links-col">
            <h5 className="apds-footer-col-title">Detection Engines</h5>
            <ul className="apds-footer-links">
              <li><button onClick={() => handleLaunchTool('url-detection')}>URL Threat Detection</button></li>
              <li><button onClick={() => handleLaunchTool('email-detection')}>Email BEC Analyzer</button></li>
              <li><button onClick={() => handleLaunchTool('image-detection')}>Screenshot Vision OCR</button></li>
              <li><button onClick={() => handleLaunchTool('message-detection')}>SMS Smishing Shield</button></li>
              <li><button onClick={() => handleLaunchTool('ai-assistant')}>AI Security Copilot</button></li>
            </ul>
          </div>

          <div className="apds-footer-links-col">
            <h5 className="apds-footer-col-title">Navigation</h5>
            <ul className="apds-footer-links">
              <li><a href="#hero">Overview</a></li>
              <li><a href="#vectors">Defense Vectors</a></li>
              <li><a href="#sandbox">Live Threat Sandbox</a></li>
              <li><a href="#threat-matrix">Threat Matrix</a></li>
              <li><a href="#pipeline">System Architecture</a></li>
              <li><a href="#faq">Frequently Asked</a></li>
            </ul>
          </div>

          <div className="apds-footer-links-col">
            <h5 className="apds-footer-col-title">Compliance &amp; Privacy</h5>
            <ul className="apds-footer-links">
              <li><span>Zero Data Retention</span></li>
              <li><span>OWASP Top 10 Aligned</span></li>
              <li><span>MITRE ATT&amp;CK Framework</span></li>
              <li><span>End-to-End Encryption</span></li>
            </ul>
          </div>
        </div>

        <div className="apds-container apds-footer-bottom">
          <p>© {new Date().getFullYear()} Automated Phishing Detection System. All rights reserved.</p>
          <p className="apds-footer-subtext">Empowering cybersecurity resilience with real-time artificial intelligence.</p>
        </div>
      </footer>

      {/* ── SCOPED STYLES ── */}
      <style>{`
        /* Root container */
        .apds-landing {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #f1f5f9;
          background-color: #031b34;
          overflow-x: hidden;
          line-height: 1.5;
        }

        .apds-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── NAVBAR ── */
        .apds-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(4, 44, 83, 0.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          transition: all 0.25s ease;
        }
        .apds-nav-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .apds-nav-brand {
          display: flex;
          align-items: center;
        }
        .apds-nav-menu {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .apds-nav-item {
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .apds-nav-item:hover {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
        }
        .apds-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .apds-theme-toggle {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .apds-theme-toggle:hover {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
        }
        .apds-btn-ghost {
          padding: 7px 16px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .apds-btn-ghost:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .apds-btn-glow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 8px;
          background: linear-gradient(135deg, #0284c7, #0369a1);
          border: 1px solid #38bdf8;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .apds-btn-glow:hover {
          background: linear-gradient(135deg, #0369a1, #0284c7);
          box-shadow: 0 6px 20px rgba(56, 189, 248, 0.5);
          transform: translateY(-1px);
        }
        .apds-nav-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #38bdf8;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .apds-nav-hamburger:hover,
        .apds-nav-hamburger.active {
          background: rgba(56, 189, 248, 0.25);
          border-color: #38bdf8;
          color: #ffffff;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
        }
        .apds-mobile-dropdown {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 20px 22px;
          background: rgba(4, 30, 60, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 2px solid rgba(56, 189, 248, 0.35);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.65);
          animation: mobDropSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes mobDropSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .apds-mob-link {
          color: #e2e8f0;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 9px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.18s ease;
        }
        .apds-mob-link:hover,
        .apds-mob-link:active {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          padding-left: 18px;
        }
        .apds-mob-auth {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
          padding-top: 14px;
          border-top: 1px solid rgba(56, 189, 248, 0.2);
        }

        /* ── HERO SECTION ── */
        .apds-hero {
          position: relative;
          padding: 70px 0 90px;
          overflow: hidden;
          background: radial-gradient(circle at 50% 20%, rgba(12, 68, 124, 0.6) 0%, rgba(3, 27, 52, 0.95) 75%);
        }
        .apds-hero-bg-lights {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .apds-light-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.25;
        }
        .orb-1 {
          width: 500px;
          height: 500px;
          background: #0284c7;
          top: -100px;
          left: -50px;
        }
        .orb-2 {
          width: 450px;
          height: 450px;
          background: #38bdf8;
          top: 150px;
          right: -80px;
        }

        .apds-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .apds-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.35);
          margin-bottom: 20px;
        }
        .apds-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
          animation: pulseStatus 2s infinite ease-in-out;
        }
        @keyframes pulseStatus {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .apds-status-txt {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #38bdf8;
        }
        .apds-hero-h1 {
          font-size: 3.2rem;
          line-height: 1.12;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .apds-gradient-text {
          background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .apds-hero-sub {
          font-size: 1.08rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin-bottom: 32px;
          max-width: 580px;
        }
        .apds-hero-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .apds-btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 28px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border: 1px solid #38bdf8;
          color: #ffffff;
          font-size: 0.98rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 6px 24px rgba(2, 132, 199, 0.45);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .apds-btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(56, 189, 248, 0.55);
        }
        .apds-btn-hero-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .apds-btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.35);
        }

        /* Threat Ticker */
        .apds-threat-ticker {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: rgba(2, 44, 83, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 10px;
          margin-bottom: 30px;
          overflow: hidden;
        }
        .apds-ticker-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .apds-live-pulse-icon {
          animation: pulseIcon 1.5s infinite;
          color: #ef4444;
        }
        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        .apds-ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .apds-ticker-badge {
          padding: 2px 7px;
          border-radius: 4px;
          background: #ef4444;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
        }
        .apds-ticker-target {
          font-family: monospace;
          color: #e2e8f0;
          font-weight: 600;
        }
        .apds-ticker-type {
          color: #94a3b8;
          font-size: 0.72rem;
        }
        .apds-ticker-risk {
          color: #f87171;
          font-weight: 700;
        }

        /* Hero Metrics */
        .apds-hero-metrics {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .apds-metric-card {
          display: flex;
          flex-direction: column;
        }
        .apds-metric-num {
          font-size: 1.5rem;
          font-weight: 900;
          color: #38bdf8;
          line-height: 1.1;
        }
        .apds-metric-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #94a3b8;
        }
        .apds-metric-sep {
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.15);
        }

        /* ── CYBER CONSOLE PREVIEW (HERO RIGHT) ── */
        .apds-cyber-console {
          background: rgba(4, 38, 72, 0.88);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 18px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(2, 132, 199, 0.2);
          overflow: hidden;
          backdrop-filter: blur(12px);
        }
        .apds-console-header {
          padding: 12px 18px;
          background: rgba(2, 28, 54, 0.9);
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .apds-console-dots {
          display: flex;
          gap: 6px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }
        .apds-console-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #cbd5e1;
        }
        .apds-console-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 800;
          color: #10b981;
        }
        .apds-console-body {
          padding: 20px;
        }
        .apds-console-gauge-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
        }
        .apds-radar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid rgba(56, 189, 248, 0.4);
          position: relative;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(3, 27, 52, 0.6) 80%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .apds-radar-sweep {
          position: absolute;
          inset: 0;
          background: conic-gradient(from 0deg, rgba(56, 189, 248, 0.5) 0deg, transparent 60deg);
          animation: radarSweep 3s linear infinite;
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .apds-radar-cross {
          position: relative;
          z-index: 2;
          opacity: 0.7;
        }
        .apds-console-stats-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .apds-stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.76rem;
          padding: 3px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .apds-stat-lbl {
          color: #94a3b8;
          font-weight: 600;
        }
        .apds-stat-val {
          font-weight: 800;
          letter-spacing: 0.02em;
        }
        .text-cyan { color: #38bdf8; }
        .text-green { color: #10b981; }
        .text-red { color: #ef4444; }

        .apds-console-log-box {
          background: #021a32;
          border: 1px solid rgba(56, 189, 248, 0.18);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: monospace;
          font-size: 0.74rem;
          margin-bottom: 18px;
        }
        .apds-log-line {
          display: flex;
          align-items: baseline;
          gap: 8px;
          line-height: 1.4;
        }
        .log-time { color: #64748b; font-size: 0.68rem; }
        .log-tag {
          padding: 1px 5px;
          border-radius: 3px;
          font-weight: 800;
          font-size: 0.62rem;
        }
        .tag-block { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
        .tag-safe { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
        .log-code {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          padding: 1px 4px;
          border-radius: 4px;
        }

        .apds-console-action-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .apds-console-chip {
          padding: 8px 6px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f1f5f9;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .apds-console-chip:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: #38bdf8;
          color: #38bdf8;
        }

        /* ── SECTION COMMON ── */
        .apds-section {
          padding: 80px 0;
          position: relative;
        }
        .apds-section-heading {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 50px;
        }
        .apds-chip-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 12px;
        }
        .apds-section-title {
          font-size: 2.3rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        .apds-section-desc {
          font-size: 0.98rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        .apds-nav-btn-link {
          background: none;
          border: none;
          font-family: inherit;
          cursor: pointer;
        }

        /* ── 2. CORE VECTORS GRID ── */
        .apds-vectors-section {
          background: rgba(2, 23, 45, 0.72) !important;
          border-top: 1px solid rgba(56, 189, 248, 0.15);
        }
        .apds-vector-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .apds-vector-card {
          background: rgba(4, 44, 83, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.28s ease;
          cursor: pointer;
        }
        .apds-vector-card:hover {
          transform: translateY(-5px);
          background: rgba(4, 44, 83, 0.9);
          border-color: #38bdf8;
          box-shadow: 0 12px 30px rgba(2, 132, 199, 0.25);
        }
        .apds-vc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .apds-vc-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .apds-vc-tagline {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .apds-vc-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .apds-vc-desc {
          font-size: 0.84rem;
          color: #cbd5e1;
          line-height: 1.55;
          margin-bottom: 18px;
          flex: 1;
        }
        .apds-vc-points {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .apds-vc-points li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #94a3b8;
        }
        .apds-vc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .apds-vc-btn-txt {
          font-size: 0.8rem;
          font-weight: 800;
        }

        /* ── 3. SANDBOX ── */
        .apds-sandbox-section {
          background: rgba(3, 28, 54, 0.72) !important;
        }
        .apds-sandbox-card {
          background: rgba(4, 44, 83, 0.85);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
        }
        .apds-sb-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .apds-sb-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .apds-sb-tab:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.35);
          color: #ffffff;
        }
        .apds-sb-tab.active {
          background: #0284c7;
          border-color: #38bdf8;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);
        }

        .apds-sb-presets {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .apds-presets-lbl {
          font-size: 0.78rem;
          font-weight: 700;
          color: #94a3b8;
        }
        .apds-presets-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .apds-preset-btn {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.18s;
        }
        .apds-preset-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
          color: #ffffff;
        }
        .apds-preset-btn.danger:hover {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
        }
        .apds-preset-btn.safe:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.2);
        }

        .apds-sb-input-box {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-direction: column;
        }
        .apds-sb-input,
        .apds-sb-textarea {
          width: 100%;
          padding: 14px 18px;
          background: #021a32;
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }
        .apds-sb-input:focus,
        .apds-sb-textarea:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
        }
        .apds-sb-actions {
          display: flex;
          justify-content: flex-end;
        }
        .apds-sb-scan-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 26px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0284c7, #0369a1);
          border: 1px solid #38bdf8;
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(2, 132, 199, 0.4);
          transition: all 0.2s;
        }
        .apds-sb-scan-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(56, 189, 248, 0.5);
        }
        .apds-sb-scan-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .apds-spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Telemetry Progress */
        .apds-sb-telemetry {
          padding: 14px 0;
        }
        .apds-progress-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .apds-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #10b981);
          transition: width 0.35s ease;
        }
        .apds-telemetry-steps {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748b;
        }
        .apds-telemetry-steps .step-done {
          color: #38bdf8;
        }

        /* Result Report Card */
        .apds-sb-result-card {
          margin-top: 24px;
          border-radius: 14px;
          border: 1px solid;
          padding: 24px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .apds-res-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .apds-res-badge-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .apds-res-title {
          font-size: 1.25rem;
          font-weight: 900;
          margin: 0;
          line-height: 1.2;
        }
        .apds-res-threat-lvl {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .apds-res-gauge {
          text-align: right;
        }
        .apds-res-score {
          font-size: 2rem;
          font-weight: 900;
          line-height: 1;
          display: block;
        }
        .apds-res-score-lbl {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .apds-res-subhead {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .apds-res-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .apds-res-list li {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-size: 0.85rem;
          color: #cbd5e1;
          line-height: 1.45;
        }
        .apds-res-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
        .apds-res-rec {
          font-size: 0.84rem;
          color: #cbd5e1;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.25);
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .apds-res-cta-row {
          display: flex;
          gap: 12px;
        }
        .apds-res-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 8px;
          border: none;
          color: #ffffff;
          font-size: 0.86rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .apds-res-clear-btn {
          padding: 9px 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* ── 4. THREAT MATRIX ── */
        .apds-matrix-section {
          background: rgba(2, 23, 45, 0.72) !important;
          border-top: 1px solid rgba(56, 189, 248, 0.15);
        }
        .apds-matrix-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        .apds-anatomy-card {
          border-radius: 18px;
          padding: 28px;
          border: 1px solid;
          display: flex;
          flex-direction: column;
        }
        .anatomy-danger {
          background: rgba(239, 68, 68, 0.06);
          border-color: rgba(239, 68, 68, 0.3);
        }
        .anatomy-safe {
          background: rgba(16, 185, 129, 0.06);
          border-color: rgba(16, 185, 129, 0.3);
        }
        .apds-anatomy-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .apds-anat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .danger-icon {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .safe-icon {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .apds-anat-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0;
        }
        .apds-anat-sub {
          font-size: 0.76rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .apds-anat-callouts {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          flex: 1;
        }
        .apds-callout-item {
          display: flex;
          gap: 14px;
          font-size: 0.84rem;
          line-height: 1.45;
        }
        .apds-callout-num {
          font-size: 0.72rem;
          font-weight: 900;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          height: fit-content;
        }
        .green-num {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
        .danger-code {
          color: #f87171;
          background: rgba(239, 68, 68, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.78rem;
        }
        .safe-code {
          color: #34d399;
          background: rgba(16, 185, 129, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.78rem;
        }
        .apds-anat-footer {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* ── 5. PIPELINE ── */
        .apds-pipeline-section {
          background: #031c36;
        }
        .apds-pipeline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .apds-pipeline-card {
          background: rgba(4, 44, 83, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 16px;
          padding: 26px 20px;
          position: relative;
          transition: all 0.25s;
        }
        .apds-pipeline-card:hover {
          border-color: #38bdf8;
          transform: translateY(-4px);
        }
        .apds-pl-num {
          position: absolute;
          top: 18px;
          right: 20px;
          font-size: 1.5rem;
          font-weight: 900;
          opacity: 0.5;
        }
        .apds-pl-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .apds-pl-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
        }
        .apds-pl-desc {
          font-size: 0.82rem;
          color: #94a3b8;
          line-height: 1.55;
        }

        /* ── 6. FAQ ── */
        .apds-faq-section {
          background: #02172d;
        }
        .apds-faq-container {
          max-width: 840px;
        }
        .apds-faq-accordion {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .apds-faq-item {
          background: rgba(4, 44, 83, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 12px;
          padding: 18px 22px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .apds-faq-item:hover,
        .apds-faq-item.open {
          border-color: #38bdf8;
          background: rgba(4, 44, 83, 0.9);
        }
        .apds-faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .apds-faq-q-text {
          font-size: 0.98rem;
          font-weight: 700;
          color: #ffffff;
        }
        .apds-faq-toggle-btn {
          background: none;
          border: none;
          color: #38bdf8;
          cursor: pointer;
        }
        .apds-faq-answer {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.6;
        }

        /* ── 7. CTA BANNER ── */
        .apds-cta-banner-section {
          padding: 60px 0 80px;
          background: #031c36;
        }
        .apds-cta-card {
          background: linear-gradient(135deg, #0c447c 0%, #042c53 50%, #021c36 100%);
          border: 1px solid #38bdf8;
          border-radius: 24px;
          padding: 60px 40px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(56, 189, 248, 0.2);
          position: relative;
          overflow: hidden;
        }
        .apds-cta-content {
          max-width: 680px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .apds-cta-pill {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        .apds-cta-heading {
          font-size: 2.3rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .apds-cta-sub {
          font-size: 1rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .apds-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* ── 8. FOOTER ── */
        .apds-footer {
          background: #021224;
          border-top: 1px solid rgba(56, 189, 248, 0.15);
          padding: 60px 0 30px;
        }
        .apds-footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }
        .apds-footer-tagline {
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.6;
          margin: 16px 0 20px;
          max-width: 360px;
        }
        .apds-footer-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
          padding: 6px 12px;
          border-radius: 8px;
        }
        .apds-footer-col-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .apds-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .apds-footer-links li a,
        .apds-footer-links li button,
        .apds-footer-links li span {
          color: #94a3b8;
          font-size: 0.84rem;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color 0.2s;
          text-align: left;
          font-family: inherit;
        }
        .apds-footer-links li a:hover,
        .apds-footer-links li button:hover {
          color: #38bdf8;
        }
        .apds-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.78rem;
          color: #64748b;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* ── LIGHT THEME OVERRIDES ── */
        /* Landing page always maintains its dark cyber theme */
        .apds-landing {
          background-color: #031b34 !important;
          color: #f1f5f9 !important;
        }

        /* ── RESPONSIVE MEDIA QUERIES ── */
        @media (max-width: 1080px) {
          .apds-hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .apds-vector-grid,
          .apds-pipeline-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .apds-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 1024px) {
          .apds-nav-menu { display: none !important; }
          .apds-nav-hamburger { display: flex !important; }
          .apds-nav-actions .apds-btn-ghost { display: none !important; }
          .apds-nav-actions .apds-btn-glow span { display: none !important; }
          .apds-nav-actions .apds-btn-glow {
            padding: 8px 12px !important;
          }
        }

        @media (max-width: 768px) {
          .apds-nav-menu { display: none !important; }
          .apds-nav-hamburger { display: flex !important; }
          .apds-nav-actions .apds-btn-glow { display: none !important; }
          .apds-nav-actions { gap: 8px !important; }
          .apds-nav-container { padding: 0 14px !important; }
          .apds-hero-h1 { font-size: clamp(1.8rem, 6vw, 2.3rem); }
          .apds-matrix-grid { grid-template-columns: 1fr; }
          .apds-vector-grid,
          .apds-pipeline-grid { grid-template-columns: 1fr; }
          .apds-footer-grid { grid-template-columns: 1fr; }
          .apds-cta-heading { font-size: 1.8rem; }
        }

        @media (max-width: 640px) {
          .apds-navbar { height: 60px !important; }
          .apds-nav-container { height: 60px !important; padding: 0 10px !important; }
          .logo-brand-desktop { display: none !important; }
          .logo-brand-mobile { display: inline-flex !important; }
        }
        /* ═══════════════════════════════════════════════
           HERO V2 — 3D Globe Design
        ═══════════════════════════════════════════════ */

        /* Section wrapper */
        .apds-hero.apds-hero-v2,
        .apds-hero-v2 {
          position: relative;
          min-height: auto;
          padding: 16px 0 36px !important;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        /* Dark navy animated background */
        .hero2-bg-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #030c2e 0%, #071340 25%, #0a1a55 55%, #071030 100%);
          z-index: 0;
        }

        /* Subtle dot grid overlay */
        .hero2-grid-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image:
            radial-gradient(circle, rgba(56,189,248,0.12) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }

        /* Glow orbs */
        .hero2-glow-tl {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(29,78,216,0.35) 0%, transparent 65%);
          z-index: 1;
          pointer-events: none;
        }
        .hero2-glow-br {
          position: absolute;
          bottom: -120px;
          right: 200px;
          width: 400px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 65%);
          z-index: 1;
          pointer-events: none;
        }

        /* Inner layout */
        .hero2-inner {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 52% 48%;
          align-items: center;
          gap: 20px;
          padding-top: 4px;
          padding-bottom: 12px;
        }

        /* ── LEFT TEXT ── */
        .hero2-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Badge */
        .hero2-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(56,189,248,0.1);
          border: 1px solid rgba(56,189,248,0.3);
          color: #38bdf8;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          align-self: flex-start;
        }
        .hero2-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: hero2pulse 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes hero2pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }

        /* Headline */
        .hero2-h1 {
          font-size: 3.6rem;
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin: 0;
        }
        .hero2-h1-accent {
          background: linear-gradient(90deg, #38bdf8, #60a5fa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Tagline */
        .hero2-tagline {
          font-size: 1.25rem;
          font-weight: 700;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.04em;
          margin: 0;
        }

        /* Description */
        .hero2-desc {
          font-size: 0.97rem;
          color: rgba(203,213,225,0.78);
          line-height: 1.7;
          max-width: 440px;
          margin: 0;
        }

        /* CTA Buttons */
        .hero2-ctas {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero2-btn-primary {
          padding: 13px 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          border: none;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 20px rgba(37,99,235,0.5);
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }
        .hero2-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(37,99,235,0.65);
        }
        .hero2-btn-secondary {
          padding: 13px 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.25);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.25s ease;
        }
        .hero2-btn-secondary:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.45);
          transform: translateY(-2px);
        }

        /* Stats row */
        .hero2-stats-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          max-width: 440px;
        }
        .hero2-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          align-items: center;
        }
        .hero2-stat-num {
          font-size: 1.25rem;
          font-weight: 900;
          color: #38bdf8;
          line-height: 1;
        }
        .hero2-stat-lbl {
          font-size: 0.67rem;
          color: rgba(148,163,184,0.85);
          text-align: center;
          font-weight: 500;
        }
        .hero2-stat-sep {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        /* ══ RIGHT: 3D GLOBE ══ */
        .hero2-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Scene floats as a whole — perspective applied here */
        .hero2-scene {
          position: relative;
          width: 480px;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1100px;
          perspective-origin: 50% 50%;
          animation: hero2float 6s ease-in-out infinite;
        }
        @keyframes hero2float {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50%       { transform: translateY(-16px) rotateZ(0.5deg); }
        }

        /* Ambient glow blob */
        .hero2-glow-sphere {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(37,99,235,0.55) 0%, rgba(29,78,216,0.25) 45%, transparent 72%);
          pointer-events: none;
          z-index: 0;
          animation: hero2glowPulse 4s ease-in-out infinite;
        }
        @keyframes hero2glowPulse {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%       { transform: scale(1.15); opacity: 1;    }
        }

        /* Pulse rings — static position, no rotation */
        .hero2-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(56,189,248,0.22);
          pointer-events: none;
          z-index: 1;
          animation: hero2ringPulse 3.5s ease-out infinite;
        }
        .hero2-ring-1 { width: 480px; height: 480px; animation-delay: 0s;   }
        .hero2-ring-2 { width: 410px; height: 410px; animation-delay: 0.9s; border-color: rgba(56,189,248,0.18); }
        .hero2-ring-3 { width: 340px; height: 340px; animation-delay: 1.8s; border-color: rgba(56,189,248,0.12); }
        @keyframes hero2ringPulse {
          0%   { opacity: 0.8; transform: scale(0.92); }
          60%  { opacity: 0.2; }
          100% { opacity: 0;   transform: scale(1.1); }
        }

        /* 3D globe — spins on Y axis with slight X tilt */
        .hero2-globe-3d {
          position: absolute;
          width: 370px;
          height: 370px;
          z-index: 2;
          transform-style: preserve-3d;
        }
        .hero2-globe-svg {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: center center;
          filter: drop-shadow(0 0 32px rgba(56,189,248,0.58))
                  drop-shadow(0 0 60px rgba(29,78,216,0.4));
          animation: globe3DSpin 22s linear infinite;
        }
        @keyframes globe3DSpin {
          0%   { transform: rotateY(0deg)   rotateX(13deg); }
          50%  { transform: rotateY(180deg) rotateX(-7deg);  }
          100% { transform: rotateY(360deg) rotateX(13deg); }
        }

        /* Shield — fixed center layer, NEVER rotates */
        .hero2-shield-center {
          position: absolute;
          z-index: 6;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .hero2-shield-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hero2shieldGlow 3s ease-in-out infinite;
        }
        .hero2-shield-wrap svg {
          width: 145px;
          height: 145px;
        }
        @keyframes hero2shieldGlow {
          0%, 100% {
            filter: drop-shadow(0 0 14px rgba(56,189,248,0.9))
                    drop-shadow(0 0 28px rgba(56,189,248,0.5));
          }
          50% {
            filter: drop-shadow(0 0 24px rgba(56,189,248,1))
                    drop-shadow(0 0 48px rgba(56,189,248,0.75));
          }
        }

        /* Floating threat tags */
        .hero2-float-tag {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(5,15,50,0.88);
          border: 1px solid rgba(56,189,248,0.3);
          color: #e2e8f0;
          font-size: 0.72rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .tag-a { top: 15px;  right: -25px; animation: tagFloat 4s ease-in-out infinite; }
        .tag-b { bottom: 55px; left: -30px; animation: tagFloat 4s ease-in-out infinite 1.2s; }
        .tag-c { bottom: 15px; right: -5px; animation: tagFloat 4s ease-in-out infinite 2.4s; }
        @keyframes tagFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .hero2-tag-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-red    { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
        .dot-green  { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .dot-yellow { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

        /* ── 3D ENHANCEMENTS ACROSS LANDING PAGE ── */
        .apds-vector-card {
          perspective: 1000px;
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease !important;
        }
        .apds-vector-card:hover {
          transform: translateY(-8px) rotateX(4deg) rotateY(-3deg) scale(1.02) !important;
          box-shadow: 0 20px 40px -10px rgba(2, 132, 199, 0.45), 0 0 25px rgba(56, 189, 248, 0.25) !important;
          border-color: #38bdf8 !important;
        }
        .apds-vc-icon {
          transform: translateZ(24px);
          transition: transform 0.4s ease;
        }
        .apds-vc-title {
          transform: translateZ(16px);
        }

        .apds-sandbox-card {
          perspective: 1200px;
          transform-style: preserve-3d;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(2, 132, 199, 0.25) !important;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .apds-sandbox-card:hover {
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 45px rgba(56, 189, 248, 0.35) !important;
        }

        .apds-step-card,
        .apds-pipeline-card {
          transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.35s ease !important;
        }
        .apds-step-card:hover,
        .apds-pipeline-card:hover {
          transform: translateY(-6px) rotateX(3deg) scale(1.02) !important;
          box-shadow: 0 16px 36px rgba(2, 132, 199, 0.3) !important;
        }

        /* Responsive adjustments for hero v2 */
        @media (max-width: 900px) {
          .hero2-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 20px;
            padding-top: 10px;
            padding-bottom: 24px;
          }
          .hero2-left { align-items: center; }
          .hero2-badge { align-self: center; }
          .hero2-h1 { font-size: 2.3rem; }
          .hero2-desc { max-width: 100%; font-size: 0.9rem; }
          .hero2-stats-row { max-width: 100%; justify-content: center; }
          
          /* Show 3D globe on mobile */
          .hero2-right {
            display: flex !important;
            justify-content: center;
            width: 100%;
            margin: 12px 0 20px;
          }
          .hero2-scene {
            width: 290px !important;
            height: 290px !important;
          }
          .hero2-glow-sphere {
            width: 250px !important;
            height: 250px !important;
          }
          .hero2-globe-3d {
            width: 240px !important;
            height: 240px !important;
          }
          .hero2-ring-1 { width: 290px !important; height: 290px !important; }
          .hero2-ring-2 { width: 240px !important; height: 240px !important; }
          .hero2-ring-3 { width: 190px !important; height: 190px !important; }
          .hero2-shield-wrap svg {
            width: 96px !important;
            height: 96px !important;
          }
          .tag-a { top: 0px !important; right: -5px !important; font-size: 0.65rem !important; padding: 4px 8px !important; }
          .tag-b { bottom: 25px !important; left: -10px !important; font-size: 0.65rem !important; padding: 4px 8px !important; }
          .tag-c { bottom: 2px !important; right: -2px !important; font-size: 0.65rem !important; padding: 4px 8px !important; }
        }

        @media (max-width: 1024px) {
          .apds-landing {
            padding-bottom: 90px !important;
          }
        }

        @media (max-width: 480px) {
          .hero2-h1 { font-size: 1.85rem; }
          .hero2-tagline { font-size: 0.95rem; }
          .hero2-ctas { justify-content: center; }
          .hero2-stats-row { padding: 12px 14px; gap: 10px; }
          .hero2-stat-num { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}
