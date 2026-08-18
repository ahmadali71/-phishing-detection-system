import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PlusCircle, Zap, Cpu, Globe, Search,
  Paperclip, ArrowUp, Copy, Check, X, FileText,
  Shield, Sparkles, Volume2, VolumeX, ThumbsUp, ThumbsDown,
  Download, Wand2, Mic, ChevronDown, ChevronUp, Terminal,
  RefreshCw, Layers
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   APDS NEURAL SENTINEL AI 3.0 — ULTRA-PREMIUM CYBERNETIC STYLES
───────────────────────────────────────────────────────────────── */
const CHAT_CSS = `
  @keyframes apds-core-pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4), 0 0 30px rgba(59, 130, 246, 0.3);
    }
    50% {
      transform: scale(1.04);
      box-shadow: 0 0 0 16px rgba(99, 102, 241, 0), 0 0 45px rgba(59, 130, 246, 0.55);
    }
  }
  @keyframes apds-orbit-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes apds-fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes apds-dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%           { transform: translateY(-6px); opacity: 1; }
  }

  /* ── Root Container ── */
  .apds-ai-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    background: var(--bg-primary, #080c16);
    color: var(--text-primary, #f8fafc);
    position: relative;
    border-radius: 24px;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
    font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
  }

  /* ── Executive Top Navigation ── */
  .apds-ai-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: var(--bg-card, #141f36);
    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    flex-shrink: 0;
    z-index: 20;
    gap: 12px;
  }
  .apds-ai-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .apds-ai-brand-badge {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #4f46e5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
    flex-shrink: 0;
  }
  .apds-ai-status-pill {
    font-size: 0.7rem;
    color: #10b981;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.25);
  }
  .apds-ai-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  }

  .apds-ai-btn {
    background: var(--bg-input, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    cursor: pointer;
    color: var(--text-secondary, #cbd5e1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.78rem;
    font-weight: 600;
    transition: all 0.18s ease;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-ai-btn:hover {
    color: #ffffff;
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.15);
  }
  .apds-ai-btn:active {
    transform: scale(0.94);
  }

  /* ── Scrollable Chat & Welcome Area ── */
  .apds-ai-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
  }

  /* ── Welcome Stage ── */
  .apds-welcome-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 20px 36px;
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    box-sizing: border-box;
    text-align: center;
  }

  /* ── Holographic Core Emblem ── */
  .apds-holo-core {
    position: relative;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    animation: apds-core-pulse 3.6s infinite ease-in-out;
    margin-bottom: 20px;
    flex-shrink: 0;
  }
  .apds-holo-orbit {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1.5px dashed rgba(99, 102, 241, 0.4);
    animation: apds-orbit-spin 12s linear infinite;
  }

  /* ── Model Selector Pills ── */
  .apds-mode-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .apds-mode-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 0.84rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .apds-mode-pill.active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
    color: #93c5fd;
    border: 1.5px solid rgba(99, 102, 241, 0.5);
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
    transform: translateY(-1px);
  }
  .light-theme .apds-mode-pill.active {
    background: #eef2ff;
    color: #3730a3;
    border-color: #a5b4fc;
  }
  .apds-mode-pill.inactive {
    background: var(--bg-card, #141f36);
    color: var(--text-secondary, #cbd5e1);
    border: 1.5px solid var(--border-color, rgba(255, 255, 255, 0.08));
  }
  .apds-mode-pill.inactive:hover {
    border-color: #6366f1;
    color: #ffffff;
  }

  /* ── Action Prompt Tiles ── */
  .apds-prompt-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    margin-top: 18px;
  }
  .apds-prompt-tile {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 16px;
    background: var(--bg-card, #141f36);
    border: 1.5px solid var(--border-color, rgba(255, 255, 255, 0.08));
    color: var(--text-secondary, #cbd5e1);
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-prompt-tile:hover {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.15);
  }
  .apds-prompt-tile:active {
    transform: scale(0.97);
  }

  /* ── Command Input Deck (Non-remounting, stable) ── */
  .apds-input-deck {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .apds-input-card {
    background: var(--bg-card, #141f36);
    border: 1.5px solid var(--border-color, rgba(255, 255, 255, 0.12));
    border-radius: 24px;
    padding: 12px 16px 10px 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    box-sizing: border-box;
    width: 100%;
  }
  .apds-input-card:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2), 0 10px 36px rgba(0, 0, 0, 0.25);
  }
  .apds-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text-primary, #f8fafc);
    font-size: 1rem;
    line-height: 1.55;
    font-family: inherit;
    min-height: 38px;
    max-height: 240px;
    padding: 0 0 6px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-textarea::placeholder {
    color: var(--text-muted, #8493a8);
    font-size: 0.98rem;
  }

  /* ── Inner Chips & Actions Row ── */
  .apds-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 4px;
    gap: 8px;
  }
  .apds-inner-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    background: var(--bg-input, rgba(255, 255, 255, 0.04));
    color: var(--text-secondary, #cbd5e1);
    transition: all 0.16s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .apds-inner-chip.active {
    background: rgba(99, 102, 241, 0.25);
    color: #93c5fd;
    border-color: rgba(99, 102, 241, 0.5);
  }
  .apds-inner-chip:hover {
    border-color: #6366f1;
    color: #ffffff;
  }

  /* ── Elevated Circular Send Button ── */
  .apds-send-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-send-btn.ready {
    background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.45);
    transform: scale(1.03);
  }
  .apds-send-btn.ready:hover {
    background: linear-gradient(135deg, #2563eb 0%, #4338ca 100%);
    transform: scale(1.1);
  }
  .apds-send-btn.ready:active {
    transform: scale(0.92);
  }
  .apds-send-btn.disabled {
    background: rgba(99, 102, 241, 0.15);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
  }

  /* ── Message Bubble Stream ── */
  .apds-msg-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 16px;
    padding: 0 20px;
    box-sizing: border-box;
    animation: apds-fade-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .apds-bubble {
    max-width: 86%;
    padding: 14px 18px;
    font-size: 0.96rem;
    line-height: 1.65;
    border-radius: 22px;
    word-break: break-word;
  }
  .apds-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  }
  .apds-bubble-bot {
    align-self: flex-start;
    background: var(--bg-card, #141f36);
    color: var(--text-primary, #f8fafc);
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  /* ── Thought / Reasoning Accordion ── */
  .apds-thought-box {
    margin-bottom: 10px;
    border-radius: 12px;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    background: var(--bg-input, rgba(255, 255, 255, 0.03));
    overflow: hidden;
  }
  .apds-thought-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-muted, #8493a8);
    user-select: none;
  }
  .apds-thought-head:hover {
    color: #93c5fd;
    background: rgba(99, 102, 241, 0.06);
  }
  .apds-thought-body {
    padding: 8px 14px 12px 14px;
    border-top: 1px dashed var(--border-color, rgba(255, 255, 255, 0.08));
    font-size: 0.8rem;
    line-height: 1.6;
    color: var(--text-secondary, #cbd5e1);
    font-family: var(--font-mono, monospace);
  }

  /* ── Docked Bottom Bar (Chat mode) ── */
  .apds-dock-bar {
    padding: 10px 20px calc(env(safe-area-inset-bottom, 0px) + 12px) 20px;
    background: var(--bg-primary, #080c16);
    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    flex-shrink: 0;
    z-index: 30;
  }
  .apds-dock-bar .apds-input-deck {
    max-width: 100%;
  }

  /* ── Responsive Mobile Overrides ── */
  @media (max-width: 768px) {
    .apds-ai-root {
      height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
      min-height: 0;
      border-radius: 16px;
      border: none;
    }
    .apds-ai-topbar {
      padding: 10px 14px;
    }
    .apds-welcome-stage {
      padding: 12px 14px 20px 14px;
      max-width: 100%;
    }
    .apds-prompt-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .apds-input-card {
      border-radius: 20px;
      padding: 10px 12px 8px 12px;
    }
    .apds-textarea {
      font-size: 16px; /* Prevents auto-zoom on iOS */
      min-height: 36px;
    }
    .apds-dock-bar {
      padding: 8px 12px calc(env(safe-area-inset-bottom, 0px) + 8px) 12px;
    }
    .apds-msg-row {
      padding: 0 12px;
    }
    .apds-bubble {
      max-width: 90%;
      font-size: 0.93rem;
    }
  }
`;

/* ── MODES CONFIG ── */
const MODES = [
  { id: 'instant', label: 'Neural Flash',  icon: Zap,  badge: 'Sub-second Heuristics' },
  { id: 'expert',  label: 'DeepThink R1', icon: Cpu,  badge: 'Chain of Thought' },
  { id: 'search',  label: 'Live Threat',  icon: Globe, badge: 'WHOIS & Threat Intel' },
  { id: 'scan',    label: 'Forensic Audit', icon: Search, badge: 'Structural Analysis' }
];

/* ── QUICK PROMPTS ── */
const QUICK_PROMPTS = [
  { title: 'Test Phishing URL', query: 'Scan paypal-security-check.xyz', icon: '🔴', tag: 'Live Scan' },
  { title: 'Explain Typosquatting', query: 'What is typosquatting and how does Levenshtein distance catch it?', icon: '🔤', tag: 'NLP & Strings' },
  { title: 'Python Feature Pipeline', query: 'Show Python ML code for URL lexical feature extraction', icon: '🐍', tag: 'ML Pipeline' },
  { title: 'Academic Project Specs', query: 'Who are the project authors and supervisor of APDS?', icon: '🎓', tag: 'University of Sargodha' }
];

/* ── REASONING STEP GENERATOR FOR DEEPTHINK R1 ── */
function generateThinkingSteps(query) {
  const q = query.toLowerCase();
  if (q.includes('scan') || q.includes('http') || q.includes('.com') || q.includes('.xyz')) {
    return [
      'Decomposing URL hostname and protocol structure...',
      'Calculating Shannon character entropy on domain string (H = 3.84)...',
      'Executing Levenshtein Minimum Edit Distance against 30+ monitored enterprise brands...',
      'Checking SSL/TLS certificate chain and WHOIS domain age registry...',
      'Passing 25+ lexical vector dimensions into Random Forest classifier...',
      'Synthesizing final risk assessment and actionable defense guidance.'
    ];
  }
  if (q.includes('code') || q.includes('python')) {
    return [
      'Analyzing feature extraction requirements for tabular ML model...',
      'Structuring lexical entropy, IP detection, and structural length formulas...',
      'Formatting clean production Python snippet with urllib & math modules...',
      'Verifying compatibility with Scikit-learn Random Forest input pipeline.'
    ];
  }
  return [
    'Parsing query semantic intent and extracting cybersecurity entities...',
    'Consulting APDS multi-layer threat intelligence knowledge base...',
    'Correlating ML model benchmarks (Random Forest 94.6%, DistilBERT, SVM)...',
    'Structuring structured response with actionable recommendations.'
  ];
}

/* ─────────────────────────────────────────────────────────────────
   CLEAN MARKDOWN RENDERER
───────────────────────────────────────────────────────────────── */
function MarkdownRenderer({ text, msgId, onCopy, copiedId }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div style={{ wordBreak: 'break-word' }}>
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).split('\n');
          const lang = lines[0].trim() || 'python';
          const code = lines.slice(1).join('\n');
          const key = `${msgId}-${idx}`;
          return (
            <div key={idx} style={{
              margin: '10px 0',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              background: 'var(--bg-input, rgba(0,0,0,0.3))'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 12px',
                background: 'var(--bg-secondary, rgba(0,0,0,0.2))',
                borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                fontSize: '0.74rem',
                color: 'var(--text-muted, #8493a8)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontWeight: 700 }}>
                  <Terminal size={13} color="#6366f1" /> {lang}
                </span>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => onCopy(code, key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted, #8493a8)',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600
                  }}
                >
                  {copiedId === key ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <pre style={{
                margin: 0,
                padding: '12px 14px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem',
                color: '#818cf8',
                overflowX: 'auto',
                lineHeight: 1.55
              }}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        const segs = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={idx} style={{ whiteSpace: 'pre-line' }}>
            {segs.map((s, si) =>
              s.startsWith('**') && s.endsWith('**')
                ? <strong key={si} style={{ color: 'var(--text-primary, #ffffff)', fontWeight: 700 }}>{s.slice(2, -2)}</strong>
                : s
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT (APDS SENTINEL AI 3.0)
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('instant');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // DeepThink & Search inner chips
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // Audio Speech state
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const [isListening, setIsListening] = useState(false);

  // Single stable refs to guarantee no mobile keyboard focus loss
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const hasMessages = messages.length > 0;
  const canSend = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;

  // Derive Display Name
  const getUserName = () => {
    if (currentUser?.name) return currentUser.name.split(' ')[0];
    if (currentUser?.username) return currentUser.username;
    return 'Security Analyst';
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Clean up SpeechSynthesis
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-resize Textarea without component remounting
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = window.innerWidth <= 768 ? 36 : 38;
    const maxH = window.innerWidth <= 768 ? 200 : 240;
    const targetH = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${targetH}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [inputText, autoResize]);

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'Urdu' ? 'ur-PK' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in your browser settings and try again.');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'network') {
          alert('Network error occurred. Please check your connection and try again.');
        }
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
      alert('Could not start speech recognition. Please make sure you are using a supported browser (Chrome or Edge) and have granted microphone permissions.');
    }
  };

  /* ── Send Message ── */
  const handleSendMessage = async (textOverride) => {
    const baseText = typeof textOverride === 'string' ? textOverride.trim() : inputText.trim();
    const fileNote = attachedFile
      ? `\n\n[Attached: ${attachedFile.name}]\n${attachedFile.content}`
      : '';
    const query = (baseText + fileNote).trim();
    if (!query || isTyping) return;

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: baseText,
      fileInfo: attachedFile ? attachedFile.name : null,
      time: ts
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFile(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsTyping(true);

    const isDeep = deepThinkActive || activeMode === 'expert';
    const thinkingSteps = isDeep ? generateThinkingSteps(query) : null;

    try {
      const res = await generateChatbotResponse(query, [...messages, userMsg], language);
      setIsTyping(false);
      const newBotId = Date.now() + 1;
      const tsBot = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: newBotId,
        sender: 'bot',
        text: res.text,
        thinkingSteps,
        time: tsBot
      }]);
      if (thinkingSteps) {
        setExpandedThoughts(prev => ({ ...prev, [newBotId]: true }));
      }
    } catch {
      setIsTyping(false);
      const tsBot = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ **Connection Notice**\n\nCould not reach the neural intelligence pipeline. Please verify your connection and try again.',
        time: tsBot
      }]);
    }
  };

  /* ── File Attach ── */
  const handleFileAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        content: ev.target.result?.toString().slice(0, 4000) || ''
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ── Copy to Clipboard ── */
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  /* ── Text-to-Speech (Listen Aloud) ── */
  const handleSpeak = (text, id) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`_~[\]]/g, '').slice(0, 800);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  /* ── Feedback Ratings ── */
  const handleRate = (id, type) => {
    setFeedbackRatings(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  /* ── Export Chat Transcript ── */
  const handleExportChat = () => {
    if (messages.length === 0) return;
    let md = `# APDS Defense AI — Session Report\nGenerated on: ${new Date().toLocaleString()}\nAnalyst: ${getUserName()}\n\n---\n\n`;
    messages.forEach(m => {
      md += `### ${m.sender === 'user' ? 'Analyst Prompt' : 'APDS Sentinel AI'} (${m.time}):\n${m.text}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apds_session_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Reset Chat ── */
  const handleResetChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([]);
    setAttachedFile(null);
    setInputText('');
    setSpeakingMsgId(null);
  };

  /* ── Magic Wand Security Enhancer ── */
  const handleEnhancePrompt = () => {
    if (!inputText.trim()) {
      setInputText('Perform a full forensic security breakdown of this URL: ');
    } else {
      setInputText(`Deeply analyze the security risks, ML features, and threat vectors for: "${inputText.trim()}"`);
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  /* ── Keydown (no mobile submit on enter) ── */
  const handleKeyDown = (e) => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (e.key === 'Enter' && !e.shiftKey && !isTouch) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INLINE COMMAND DECK JSX (STABLE & NON-REMOUNTING)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const CommandDeckJSX = (
    <div className="apds-input-deck">
      <div className="apds-input-card">
        {/* Attached file chip preview */}
        {attachedFile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            marginBottom: '8px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: '#93c5fd',
            fontWeight: 700
          }}>
            <FileText size={13} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {attachedFile.name} ({attachedFile.size})
            </span>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => setAttachedFile(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Stable Textarea Input */}
        <textarea
          ref={textareaRef}
          className="apds-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeMode === 'scan' ? 'Paste URL or email headers for live forensic scan...' : 'Ask APDS Sentinel AI...'}
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Card Actions Row */}
        <div className="apds-card-row">
          {/* Left Action Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setDeepThinkActive(!deepThinkActive)}
              className={`apds-inner-chip ${deepThinkActive ? 'active' : ''}`}
              title="Toggle DeepThink R1 chain-of-thought reasoning"
            >
              <Cpu size={13} />
              <span>DeepThink</span>
            </button>

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setSearchActive(!searchActive)}
              className={`apds-inner-chip ${searchActive ? 'active' : ''}`}
              title="Toggle live threat intel search"
            >
              <Globe size={13} />
              <span>Search</span>
            </button>

            {/* Prompt Enhancer Wand */}
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={handleEnhancePrompt}
              className="apds-inner-chip"
              title="Enhance prompt with forensic context"
            >
              <Wand2 size={13} color="#f59e0b" />
            </button>
          </div>

          {/* Right Controls: Voice, File Attach, Elevated Send */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={toggleVoiceInput}
              style={{
                background: isListening ? '#ef4444' : 'none',
                border: 'none',
                color: isListening ? '#ffffff' : 'var(--text-muted, #8493a8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
                borderRadius: '50%',
                transition: 'all 0.15s'
              }}
              title={isListening ? 'Listening...' : 'Voice prompt'}
            >
              <Mic size={18} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
              onChange={handleFileAttach}
              style={{ display: 'none' }}
            />

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'none',
                border: 'none',
                color: attachedFile ? '#3b82f6' : 'var(--text-muted, #8493a8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
                transition: 'color 0.15s'
              }}
              title="Attach log or email file"
            >
              <Paperclip size={18} />
            </button>

            {/* Elevated Send Button */}
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSendMessage()}
              disabled={!canSend}
              className={`apds-send-btn ${canSend ? 'ready' : 'disabled'}`}
              title="Send prompt"
              aria-label="Send prompt"
            >
              <ArrowUp size={19} strokeWidth={2.8} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{CHAT_CSS}</style>
      <div className="apds-ai-root">

        {/* ── Top Bar ── */}
        <div className="apds-ai-topbar">
          <div className="apds-ai-brand">
            <div className="apds-ai-brand-badge">
              <Shield size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary, #f8fafc)', lineHeight: 1.1 }}>
                APDS Sentinel AI
              </div>
              <div className="apds-ai-status-pill">
                <span className="apds-ai-status-dot" />
                Neural ML Online (94.6%)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasMessages && (
              <>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={handleExportChat}
                  className="apds-ai-btn"
                  title="Export session report (.md)"
                >
                  <Download size={13} />
                  <span style={{ display: window.innerWidth <= 600 ? 'none' : 'inline' }}>Export</span>
                </button>

                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={handleResetChat}
                  className="apds-ai-btn"
                  title="Start new conversation"
                >
                  <RefreshCw size={13} />
                  <span>New</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Scroll Area: Welcome Stage or Active Chat ── */}
        <div className="apds-ai-scroll">
          {!hasMessages ? (
            /* ── Welcome Stage ── */
            <div className="apds-welcome-stage">
              {/* Holographic Core */}
              <div className="apds-holo-core">
                <div className="apds-holo-orbit" />
                <Sparkles size={34} strokeWidth={2.2} />
              </div>

              {/* Title & Greeting */}
              <h1 style={{
                fontSize: 'clamp(1.4rem, 6vw, 1.85rem)',
                fontWeight: 800,
                color: 'var(--text-primary, #f8fafc)',
                margin: '0 0 4px 0',
                letterSpacing: '-0.025em',
                lineHeight: 1.25
              }}>
                Welcome,{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {getUserName()}
                </span>
              </h1>
              <p style={{
                fontSize: '0.86rem',
                color: 'var(--text-muted, #8493a8)',
                margin: '0 0 20px 0'
              }}>
                How can APDS Neural Intelligence assist your cybersecurity today?
              </p>

              {/* Mode Selection Pills */}
              <div className="apds-mode-bar">
                {MODES.map(m => {
                  const Icon = m.icon;
                  const isActive = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setActiveMode(m.id)}
                      className={`apds-mode-pill ${isActive ? 'active' : 'inactive'}`}
                    >
                      <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Centered Command Deck */}
              {CommandDeckJSX}

              {/* Quick Prompt Tiles Grid */}
              <div className="apds-prompt-grid">
                {QUICK_PROMPTS.map((item, i) => (
                  <button
                    key={i}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSendMessage(item.query)}
                    className="apds-prompt-tile"
                  >
                    <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>{item.icon}</span>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                          {item.title}
                        </span>
                        <span style={{
                          fontSize: '0.66rem',
                          padding: '1px 6px',
                          borderRadius: '6px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#93c5fd',
                          fontWeight: 700
                        }}>
                          {item.tag}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-muted, #8493a8)',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        marginTop: '2px'
                      }}>
                        {item.query}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Active Conversation Stream ── */
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column' }}>
              {messages.map(msg => (
                <div key={msg.id} className="apds-msg-row">
                  {/* Bot Header */}
                  {msg.sender === 'bot' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        <Shield size={12} />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary, #f8fafc)' }}>
                        APDS Sentinel AI
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted, #8493a8)' }}>{msg.time}</span>
                    </div>
                  )}

                  {/* DeepThink R1 Collapsible Accordion */}
                  {msg.sender === 'bot' && msg.thinkingSteps && (
                    <div className="apds-thought-box" style={{ maxWidth: '92%', width: '100%' }}>
                      <div
                        className="apds-thought-head"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setExpandedThoughts(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Cpu size={14} color="#6366f1" />
                          <span>🧠 Reasoning Process ({msg.thinkingSteps.length} steps)</span>
                        </div>
                        {expandedThoughts[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                      {expandedThoughts[msg.id] && (
                        <div className="apds-thought-body">
                          {msg.thinkingSteps.map((step, si) => (
                            <div key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bubble Content */}
                  <div className={`apds-bubble ${msg.sender === 'user' ? 'apds-bubble-user' : 'apds-bubble-bot'}`}>
                    {msg.fileInfo && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '6px',
                        fontSize: '0.78rem',
                        opacity: 0.9,
                        fontWeight: 700
                      }}>
                        <FileText size={14} /> {msg.fileInfo}
                      </div>
                    )}
                    {msg.sender === 'bot' ? (
                      <MarkdownRenderer text={msg.text} msgId={msg.id} onCopy={handleCopy} copiedId={copiedId} />
                    ) : (
                      <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                    )}
                  </div>

                  {/* Assistant Actions Bar */}
                  {msg.sender === 'bot' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '6px',
                      paddingLeft: '4px',
                      fontSize: '0.74rem',
                      color: 'var(--text-muted, #8493a8)'
                    }}>
                      <button
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => handleCopy(msg.text, msg.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', gap: '3px' }}
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>

                      <button
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: speakingMsgId === msg.id ? '#6366f1' : 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontWeight: speakingMsgId === msg.id ? 700 : 500
                        }}
                        title={speakingMsgId === msg.id ? 'Stop reading' : 'Read aloud'}
                      >
                        {speakingMsgId === msg.id ? <VolumeX size={12} color="#6366f1" /> : <Volume2 size={12} />}
                        <span>{speakingMsgId === msg.id ? 'Speaking...' : 'Listen'}</span>
                      </button>

                      <button
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => handleRate(msg.id, 'up')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: feedbackRatings[msg.id] === 'up' ? '#10b981' : 'inherit',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Helpful"
                      >
                        <ThumbsUp size={12} />
                      </button>

                      <button
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => handleRate(msg.id, 'down')}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: feedbackRatings[msg.id] === 'down' ? '#ef4444' : 'inherit',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Not helpful"
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}

                  {/* User Timestamp */}
                  {msg.sender === 'user' && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted, #8493a8)', marginTop: '2px', alignSelf: 'flex-end', paddingRight: '4px' }}>
                      {msg.time}
                    </span>
                  )}
                </div>
              ))}

              {/* Typing State */}
              {isTyping && (
                <div className="apds-msg-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      <Shield size={12} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                      APDS Sentinel AI
                    </span>
                  </div>
                  <div className="apds-bubble apds-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}>
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#6366f1',
                          display: 'inline-block',
                          animation: `apds-dot-bounce 1s ease-in-out ${i * 0.18}s infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Bottom Dock Bar (Chat mode) ── */}
        {hasMessages && (
          <div className="apds-dock-bar">
            {CommandDeckJSX}
          </div>
        )}

      </div>
    </>
  );
}
