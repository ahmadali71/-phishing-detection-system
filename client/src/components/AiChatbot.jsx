import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, Plus, ArrowUp, Copy, Check, Terminal,
  RefreshCw, X, Paperclip, FileText, Sparkles,
  Volume2, VolumeX, ThumbsUp, ThumbsDown, Download,
  Wand2, Mic, Cpu, Shield, Globe, Lock, Code2,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   ULTRA-PREMIUM AI CHATBOT DESIGN SYSTEM
   Modern, sleek, cyber-luxury aesthetic with glassmorphism
───────────────────────────────────────────────────────────────── */
const CHATBOT_STYLES = `
  @keyframes ai-glow-breathe {
    0%, 100% {
      box-shadow: 0 0 25px rgba(59, 130, 246, 0.35), 0 0 50px rgba(99, 102, 241, 0.2);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 70px rgba(99, 102, 241, 0.35);
      transform: scale(1.04);
    }
  }

  @keyframes ai-fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes ai-dot-wave {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* ── Main Container ── */
  .ai-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 145px);
    background: var(--bg-primary, #080c16);
    color: var(--text-primary, #f8fafc);
    border-radius: 20px;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    box-shadow: var(--shadow-card, 0 12px 40px rgba(0, 0, 0, 0.25));
    position: relative;
    overflow: hidden;
    font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
    box-sizing: border-box;
  }

  /* ── Header Bar ── */
  .ai-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: var(--bg-card, #141f36);
    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    flex-shrink: 0;
    z-index: 20;
  }
  .ai-header-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ai-header-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
    flex-shrink: 0;
  }
  .ai-header-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .ai-header-title {
    font-size: 0.95rem;
    font-weight: 800;
    font-family: var(--font-display, 'Outfit', sans-serif);
    color: var(--text-primary, #f8fafc);
    line-height: 1.1;
  }
  .ai-header-status {
    font-size: 0.7rem;
    font-weight: 600;
    color: #10b981;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .ai-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
    display: inline-block;
  }

  .ai-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ai-btn-ghost {
    background: var(--bg-input, rgba(255, 255, 255, 0.05));
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    color: var(--text-secondary, #cbd5e1);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 0.78rem;
    font-weight: 600;
    transition: all 0.16s ease;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-btn-ghost:hover {
    color: #ffffff;
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.12);
  }
  .ai-btn-ghost:active {
    transform: scale(0.95);
  }

  /* ── Scrollable Viewport ── */
  .ai-viewport {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Stage ── */
  .ai-welcome-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 20px 32px;
    text-align: center;
    max-width: 640px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .ai-welcome-avatar {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    animation: ai-glow-breathe 4s infinite ease-in-out;
    margin-bottom: 20px;
    flex-shrink: 0;
  }

  .ai-welcome-title {
    font-size: clamp(1.45rem, 6vw, 1.95rem);
    font-weight: 800;
    font-family: var(--font-display, 'Outfit', sans-serif);
    color: var(--text-primary, #f8fafc);
    margin: 0 0 6px 0;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }
  .ai-welcome-title span {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ai-welcome-sub {
    font-size: 0.88rem;
    color: var(--text-muted, #8493a8);
    margin: 0 0 22px 0;
    line-height: 1.5;
  }

  /* ── Mode Switcher Pills ── */
  .ai-mode-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .ai-mode-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s ease;
    border: 1.5px solid transparent;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .ai-mode-item.active {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border-color: rgba(59, 130, 246, 0.45);
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }
  .light-theme .ai-mode-item.active {
    background: #eef2ff;
    color: #3730a3;
    border-color: #a5b4fc;
  }
  .ai-mode-item.inactive {
    background: var(--bg-card, #141f36);
    color: var(--text-secondary, #cbd5e1);
    border-color: var(--border-color, rgba(255, 255, 255, 0.08));
  }
  .ai-mode-item.inactive:hover {
    border-color: #3b82f6;
    color: #ffffff;
  }

  /* ── Quick Prompt Cards Grid ── */
  .ai-prompt-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    margin-top: 18px;
  }
  .ai-prompt-card {
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
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
  }
  .ai-prompt-card:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15);
  }
  .ai-prompt-card:active {
    transform: scale(0.97);
  }

  /* ── Floating Input Deck ── */
  .ai-input-wrapper {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .ai-input-card {
    background: var(--bg-card, #141f36);
    border: 1.5px solid var(--border-color, rgba(255, 255, 255, 0.12));
    border-radius: 22px;
    padding: 12px 16px 10px 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    box-sizing: border-box;
    width: 100%;
  }
  .ai-input-card:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 10px 36px rgba(0, 0, 0, 0.25);
  }

  .ai-textarea {
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
    max-height: 220px;
    padding: 0 0 6px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-textarea::placeholder {
    color: var(--text-muted, #8493a8);
    font-size: 0.96rem;
  }

  .ai-controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 4px;
    gap: 8px;
  }
  .ai-chips-group {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .ai-chip-btn {
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
  .ai-chip-btn.active {
    background: rgba(59, 130, 246, 0.22);
    color: #93c5fd;
    border-color: rgba(59, 130, 246, 0.45);
  }
  .ai-chip-btn:hover {
    border-color: #3b82f6;
    color: #ffffff;
  }

  .ai-send-btn {
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
  .ai-send-btn.ready {
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.45);
    transform: scale(1.02);
  }
  .ai-send-btn.ready:hover {
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    transform: scale(1.1);
  }
  .ai-send-btn.ready:active {
    transform: scale(0.92);
  }
  .ai-send-btn.disabled {
    background: rgba(59, 130, 246, 0.15);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
  }

  /* ── Message Bubbles ── */
  .ai-msg-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 16px;
    padding: 0 20px;
    box-sizing: border-box;
    animation: ai-fade-in-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .ai-bubble {
    max-width: 86%;
    padding: 14px 18px;
    font-size: 0.96rem;
    line-height: 1.65;
    border-radius: 20px;
    word-break: break-word;
  }
  .ai-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  }
  .ai-bubble-bot {
    align-self: flex-start;
    background: var(--bg-card, #141f36);
    color: var(--text-primary, #f8fafc);
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  /* ── Bottom Dock Bar (Chat Active Mode) ── */
  .ai-dock-bar {
    padding: 10px 20px calc(env(safe-area-inset-bottom, 0px) + 12px) 20px;
    background: var(--bg-primary, #080c16);
    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    flex-shrink: 0;
    z-index: 30;
  }
  .ai-dock-bar .ai-input-wrapper {
    max-width: 100%;
  }

  /* ── Mobile Responsive System ── */
  @media (max-width: 768px) {
    .ai-container {
      height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
      min-height: 0;
      border-radius: 16px;
      border: none;
    }
    .ai-header {
      padding: 10px 14px;
    }
    .ai-welcome-box {
      padding: 12px 14px 20px 14px;
      max-width: 100%;
    }
    .ai-prompt-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .ai-input-card {
      border-radius: 20px;
      padding: 10px 12px 8px 12px;
    }
    .ai-textarea {
      font-size: 16px; /* Prevents auto-zoom on mobile */
      min-height: 36px;
    }
    .ai-dock-bar {
      padding: 8px 12px calc(env(safe-area-inset-bottom, 0px) + 8px) 12px;
    }
    .ai-msg-item {
      padding: 0 12px;
    }
    .ai-bubble {
      max-width: 90%;
      font-size: 0.93rem;
    }
  }
`;

/* ── Modes Config ── */
const MODES = [
  { id: 'instant', label: 'Neural Flash',  icon: Zap,  badge: 'Fast Heuristics' },
  { id: 'expert',  label: 'DeepThink R1', icon: Cpu,  badge: 'Chain of Thought' },
  { id: 'search',  label: 'Live Threat',  icon: Globe, badge: 'WHOIS & Threat Intel' },
  { id: 'scan',    label: 'Forensic Scan', icon: Lock,  badge: 'Structural Analysis' }
];

/* ── Quick Starter Prompts ── */
const QUICK_PROMPTS = [
  { title: 'Audit Suspicious Link', query: 'Scan paypal-security-check.xyz', icon: '🔴', tag: 'Live Scan' },
  { title: 'Typosquatting & IDN', query: 'What is typosquatting and how does Levenshtein distance catch it?', icon: '🔤', tag: 'NLP & Strings' },
  { title: 'Feature Extraction Script', query: 'Show Python ML code for URL feature extraction', icon: '🐍', tag: 'ML Pipeline' },
  { title: 'APDS Project Architecture', query: 'Who are the project authors and supervisor of APDS?', icon: '🎓', tag: 'Univ of Sargodha' }
];

/* ── Step Generator for DeepThink R1 ── */
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
   MARKDOWN & CODE RENDERER
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
                  <Terminal size={13} color="#3b82f6" /> {lang}
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
                color: '#93c5fd',
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
   MAIN AI ASSISTANT COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', currentUser, onMenuToggle }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('instant');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // DeepThink & Search chips
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // Audio Speech state
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const [isListening, setIsListening] = useState(false);

  // Single persistent stable refs to guarantee no focus/keyboard blur
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const hasMessages = messages.length > 0;
  const canSend = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;

  // Display Name
  const getUserName = () => {
    if (currentUser?.name) return currentUser.name.split(' ')[0];
    if (currentUser?.username) return currentUser.username;
    return 'Security Analyst';
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Clean up SpeechSynthesis on unmount
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
    const maxH = window.innerWidth <= 768 ? 200 : 220;
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
      alert('Speech recognition is not supported in this browser.');
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
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
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
     INLINE COMMAND DECK (STABLE & NON-REMOUNTING)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const InputDeckJSX = (
    <div className="ai-input-wrapper">
      <div className="ai-input-card">
        {/* Attached file chip preview */}
        {attachedFile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            marginBottom: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
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
          className="ai-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeMode === 'scan' ? 'Paste URL or email headers for live forensic scan...' : 'Message APDS AI...'}
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Card Controls Row */}
        <div className="ai-controls-row">
          {/* Left Action Chips */}
          <div className="ai-chips-group">
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setDeepThinkActive(!deepThinkActive)}
              className={`ai-chip-btn ${deepThinkActive ? 'active' : ''}`}
              title="Toggle DeepThink R1 chain-of-thought reasoning"
            >
              <Cpu size={13} />
              <span>DeepThink</span>
            </button>

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setSearchActive(!searchActive)}
              className={`ai-chip-btn ${searchActive ? 'active' : ''}`}
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
              className="ai-chip-btn"
              title="Enhance prompt with security context"
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
              className={`ai-send-btn ${canSend ? 'ready' : 'disabled'}`}
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
      <style>{CHATBOT_STYLES}</style>
      <div className="ai-container">

        {/* ── Top Bar ── */}
        <div className="ai-header">
          <div className="ai-header-brand">
            <div className="ai-header-icon">
              <Shield size={18} />
            </div>
            <div className="ai-header-info">
              <span className="ai-header-title">APDS Sentinel AI</span>
              <span className="ai-header-status">
                <span className="ai-status-dot" />
                Neural ML Online (94.6%)
              </span>
            </div>
          </div>

          <div className="ai-header-actions">
            {hasMessages && (
              <>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={handleExportChat}
                  className="ai-btn-ghost"
                  title="Export session report (.md)"
                >
                  <Download size={13} />
                  <span style={{ display: window.innerWidth <= 600 ? 'none' : 'inline' }}>Export</span>
                </button>

                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={handleResetChat}
                  className="ai-btn-ghost"
                  title="Start new conversation"
                >
                  <RefreshCw size={13} />
                  <span>New</span>
                </button>
              </>
            )}

            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                if (onMenuToggle) onMenuToggle();
                else {
                  const menuBtn = document.querySelector('.hamburger-btn');
                  if (menuBtn) menuBtn.click();
                }
              }}
              className="ai-btn-ghost"
              title="Toggle navigation"
            >
              <Menu size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* ── Viewport Area: Welcome or Active Chat ── */}
        <div className="ai-viewport">
          {!hasMessages ? (
            /* ── Welcome Stage ── */
            <div className="ai-welcome-box">
              {/* Glowing Avatar */}
              <div className="ai-welcome-avatar">
                <Sparkles size={34} strokeWidth={2.2} />
              </div>

              {/* Title & Greeting */}
              <h1 className="ai-welcome-title">
                Welcome, <span>{getUserName()}</span>
              </h1>
              <p className="ai-welcome-sub">
                How can APDS Neural Intelligence assist your cybersecurity today?
              </p>

              {/* Mode Selection Strip */}
              <div className="ai-mode-strip">
                {MODES.map(m => {
                  const Icon = m.icon;
                  const isActive = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setActiveMode(m.id)}
                      className={`ai-mode-item ${isActive ? 'active' : 'inactive'}`}
                    >
                      <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Centered Input Deck */}
              {InputDeckJSX}

              {/* Quick Prompt Cards Grid */}
              <div className="ai-prompt-grid">
                {QUICK_PROMPTS.map((item, i) => (
                  <button
                    key={i}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSendMessage(item.query)}
                    className="ai-prompt-card"
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
                          background: 'rgba(59, 130, 246, 0.15)',
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
                <div key={msg.id} className="ai-msg-item">
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
                    <div style={{
                      maxWidth: '92%',
                      width: '100%',
                      marginBottom: '10px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                      background: 'var(--bg-input, rgba(255, 255, 255, 0.03))',
                      overflow: 'hidden'
                    }}>
                      <div
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setExpandedThoughts(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-muted, #8493a8)',
                          userSelect: 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Cpu size={14} color="#3b82f6" />
                          <span>🧠 Reasoning Process ({msg.thinkingSteps.length} steps)</span>
                        </div>
                        {expandedThoughts[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                      {expandedThoughts[msg.id] && (
                        <div style={{
                          padding: '8px 14px 12px 14px',
                          borderTop: '1px dashed var(--border-color, rgba(255, 255, 255, 0.08))',
                          fontSize: '0.8rem',
                          lineHeight: '1.6',
                          color: 'var(--text-secondary, #cbd5e1)',
                          fontFamily: 'var(--font-mono, monospace)'
                        }}>
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
                  <div className={`ai-bubble ${msg.sender === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
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
                          color: speakingMsgId === msg.id ? '#3b82f6' : 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontWeight: speakingMsgId === msg.id ? 700 : 500
                        }}
                        title={speakingMsgId === msg.id ? 'Stop reading' : 'Read aloud'}
                      >
                        {speakingMsgId === msg.id ? <VolumeX size={12} color="#3b82f6" /> : <Volume2 size={12} />}
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

              {/* Typing Animation */}
              {isTyping && (
                <div className="ai-msg-item">
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
                  <div className="ai-bubble ai-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}>
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                          display: 'inline-block',
                          animation: `ai-dot-wave 1s ease-in-out ${i * 0.18}s infinite`
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

        {/* ── Bottom Dock Bar (Chat Active Mode) ── */}
        {hasMessages && (
          <div className="ai-dock-bar">
            {InputDeckJSX}
          </div>
        )}

      </div>
    </>
  );
}
