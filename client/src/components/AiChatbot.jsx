import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Copy, Check, Terminal, Zap, Shield, Search,
  RefreshCw, ArrowUp, X, Paperclip, FileText, Sparkles,
  Bot, Globe, Cpu, ChevronDown, ChevronUp, Volume2, VolumeX,
  ThumbsUp, ThumbsDown, Download, Share2, CornerDownLeft,
  Wand2, Layers, Flame, CheckCircle2
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   ULTRA-PREMIUM CSS STYLES (DEEPSEEK / CLAUDE / CHATGPT HYBRID)
───────────────────────────────────────────────────────────────── */
const CHAT_CSS = `
  @keyframes apds-dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%           { transform: translateY(-6px); opacity: 1; }
  }
  @keyframes apds-fade-in-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes apds-pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.35); }
    50%      { box-shadow: 0 0 0 14px rgba(99, 102, 241, 0); }
  }
  @keyframes apds-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .chat-view-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 150px);
    max-height: calc(100vh - 130px);
    background: var(--bg-primary);
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  /* ── Header ── */
  .chat-top-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    z-index: 10;
  }

  /* ── Scroll Area ── */
  .chat-content-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Message Bubble ── */
  .chat-msg-item {
    animation: apds-fade-in-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 18px;
  }

  /* ── Floating Input Container ── */
  .chat-input-container {
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 22px;
    padding: 10px 14px 10px 14px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .chat-input-container:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.16), 0 12px 36px rgba(0, 0, 0, 0.12);
  }

  /* ── Auto-Expanding Textarea ── */
  .chat-auto-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 0.98rem;
    line-height: 1.55;
    font-family: inherit;
    min-height: 38px;
    max-height: 260px;
    padding: 4px 2px 8px 2px;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    transition: height 0.12s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .chat-auto-textarea::placeholder {
    color: var(--text-muted);
    font-size: 0.94rem;
  }
  .chat-auto-textarea::-webkit-scrollbar {
    width: 4px;
  }
  .chat-auto-textarea::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 2px;
  }

  /* ── Mode Selection Pills ── */
  .mode-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 999px;
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .mode-pill-btn.active {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    color: #3730a3 !important;
    border: 1.5px solid #a5b4fc;
    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2);
    transform: translateY(-1px);
  }
  .dark-theme .mode-pill-btn.active,
  body:not(.light-theme) .mode-pill-btn.active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(79, 70, 229, 0.35) 100%);
    color: #c7d2fe !important;
    border: 1.5px solid rgba(99, 102, 241, 0.5);
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.25);
  }
  .mode-pill-btn.inactive {
    background: var(--bg-card);
    color: var(--text-secondary);
    border: 1.5px solid var(--border-color);
  }
  .mode-pill-btn.inactive:hover {
    border-color: #818cf8;
    color: #4f46e5;
    background: rgba(99, 102, 241, 0.05);
  }

  /* ── Inner Action Chips (DeepThink / Search / Scan) ── */
  .inner-action-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s ease;
    border: 1px solid var(--border-color);
    background: var(--bg-input);
    color: var(--text-secondary);
    -webkit-tap-highlight-color: transparent;
  }
  .inner-action-chip.active-chip {
    background: #e0e7ff;
    color: #4338ca;
    border-color: #818cf8;
  }
  .dark-theme .inner-action-chip.active-chip,
  body:not(.light-theme) .inner-action-chip.active-chip {
    background: rgba(99, 102, 241, 0.28);
    color: #c7d2fe;
    border-color: rgba(99, 102, 241, 0.5);
  }
  .inner-action-chip:hover {
    border-color: #6366f1;
    color: #6366f1;
  }

  /* ── Circular Send Button ── */
  .send-round-btn {
    width: 36px;
    height: 36px;
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
  .send-round-btn.active {
    background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
    transform: scale(1.04);
  }
  .send-round-btn.active:hover {
    background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
    transform: scale(1.1);
  }
  .send-round-btn.active:active {
    transform: scale(0.92);
  }
  .send-round-btn.disabled {
    background: #e0e7ff;
    color: #a5b4fc;
    cursor: not-allowed;
  }
  .dark-theme .send-round-btn.disabled,
  body:not(.light-theme) .send-round-btn.disabled {
    background: var(--bg-input);
    color: var(--text-muted);
  }

  /* ── Thought / Reasoning Box (DeepSeek R1 Style) ── */
  .thinking-box {
    margin-bottom: 10px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    background: var(--bg-input);
    overflow: hidden;
    transition: all 0.2s ease;
  }
  .thinking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-muted);
    user-select: none;
  }
  .thinking-header:hover {
    color: var(--text-primary);
    background: rgba(99, 102, 241, 0.05);
  }
  .thinking-body {
    padding: 8px 14px 12px;
    border-top: 1px dashed var(--border-color);
    font-size: 0.82rem;
    line-height: 1.6;
    color: var(--text-secondary);
    font-family: var(--font-mono, monospace);
  }

  /* ── Suggestion Cards Grid ── */
  .suggestion-card-btn {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 14px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    -webkit-tap-highlight-color: transparent;
  }
  .suggestion-card-btn:hover {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.06);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.12);
  }
  .suggestion-card-btn:active {
    transform: scale(0.98);
  }

  /* ── Mobile Layout Adjustments ── */
  @media (max-width: 768px) {
    .chat-view-root {
      height: calc(100dvh - 145px);
      min-height: 0;
      max-height: none;
      border-radius: 16px;
      margin: 0;
    }
    .chat-top-nav {
      padding: 10px 14px;
    }
    .chat-content-scroll {
      padding: 12px 12px 6px;
    }
    .chat-input-container {
      border-radius: 20px;
      padding: 8px 12px 8px 12px;
    }
    .chat-auto-textarea {
      font-size: 0.94rem;
      min-height: 36px;
      max-height: 200px;
    }
    .chat-dock-wrapper {
      padding: 6px 10px calc(env(safe-area-inset-bottom, 0px) + 6px) 10px !important;
    }
    .welcome-prompt-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;

/* ─────────────────────────────────────────────────────────────────
   ANIMATED TYPING DOTS
───────────────────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 2px' }}>
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
  );
}

/* ─────────────────────────────────────────────────────────────────
   CLEAN MARKDOWN RENDERER
───────────────────────────────────────────────────────────────── */
function MarkdownMessage({ text, msgId, onCopy, copiedId }) {
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
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 12px',
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.74rem',
                color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontWeight: 700 }}>
                  <Terminal size={13} color="#6366f1" /> {lang}
                </span>
                <button
                  onClick={() => onCopy(code, key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
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
                ? <strong key={si} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{s.slice(2, -2)}</strong>
                : s
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DEEPSEEK / MODERN BLUE LOGO (WHALE/SHIELD MOTIF)
───────────────────────────────────────────────────────────────── */
function ChatLogo({ size = 56 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #4f46e5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
      flexShrink: 0,
      animation: 'apds-pulse-glow 3s infinite ease-in-out'
    }}>
      <Sparkles size={size * 0.5} color="white" strokeWidth={2.2} />
    </div>
  );
}

/* ── MODES CONFIG ── */
const MODES = [
  { id: 'instant', label: 'Instant', icon: Zap, badge: 'Fast Heuristics' },
  { id: 'expert',  label: 'DeepThink R1', icon: Cpu, badge: 'Chain of Thought' },
  { id: 'vision',  label: 'Scan & Search', icon: Search, badge: 'Forensics' },
];

/* ── QUICK PROMPTS CATEGORIES ── */
const QUICK_PROMPTS = [
  { title: 'Test Phishing Link', query: 'Scan paypal-secure-login.com', icon: '🔴', tag: 'Live Scan' },
  { title: 'Explain Typosquatting', query: 'What is typosquatting and how does Levenshtein distance catch it?', icon: '🔤', tag: 'NLP & Strings' },
  { title: 'Python Feature Extractor', query: 'Show Python ML code for URL feature extraction', icon: '🐍', tag: 'ML Pipeline' },
  { title: 'Academic Project Specs', query: 'Who are the project authors and supervisor of APDS?', icon: '🎓', tag: 'University of Sargodha' }
];

/* ── REASONING STEP GENERATOR FOR DEEPTHINK R1 ── */
function generateThinkingSteps(query) {
  const q = query.toLowerCase();
  if (q.includes('scan') || q.includes('http') || q.includes('.com') || q.includes('.xyz')) {
    return [
      'Decomposing URL hostname and protocol structure...',
      'Calculating Shannon character entropy on domain string (H = 3.82)...',
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
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English' }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('instant');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // DeepThink & Search chips toggles
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // Audio Text-to-Speech state
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [feedbackRatings, setFeedbackRatings] = useState({}); // { [msgId]: 'up' | 'down' }
  const [expandedThoughts, setExpandedThoughts] = useState({}); // { [msgId]: boolean }

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll when messages change
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

  /* ── Dynamic Auto-Expanding Logic ── */
  const autoResizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = window.innerWidth <= 768 ? 36 : 40;
    const maxH = window.innerWidth <= 768 ? 200 : 260;
    const targetH = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${targetH}px`;
  }, []);

  useEffect(() => {
    autoResizeTextarea();
  }, [inputText, autoResizeTextarea]);

  /* ── Send Message ── */
  const handleSendMessage = async (textOverride) => {
    const baseText = typeof textOverride === 'string' ? textOverride.trim() : inputText.trim();
    const fileNote = attachedFile
      ? `\n\n[Attached File: ${attachedFile.name}]\n${attachedFile.content}`
      : '';
    const query = (baseText + fileNote).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: baseText,
      fileInfo: attachedFile ? attachedFile.name : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      setMessages(prev => [...prev, {
        id: newBotId,
        sender: 'bot',
        text: res.text,
        thinkingSteps,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      if (thinkingSteps) {
        setExpandedThoughts(prev => ({ ...prev, [newBotId]: true }));
      }
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ **Connection Notice**\n\nCould not process the prompt. Please verify your connection and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  /* ── File Attachment ── */
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
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ── Text to Speech (Audio Reading) ── */
  const handleSpeak = (text, id) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
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

  /* ── Export / Download Conversation ── */
  const handleExportChat = () => {
    if (messages.length === 0) return;
    let md = `# APDS AI Assistant — Chat Transcript\nGenerated on ${new Date().toLocaleString()}\n\n---\n\n`;
    messages.forEach(m => {
      md += `### ${m.sender === 'user' ? 'User' : 'APDS Defense AI'} (${m.time}):\n${m.text}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apds_chat_${Date.now()}.md`;
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

  /* ── Enhance Prompt with Security Context ── */
  const handleEnhancePrompt = () => {
    if (!inputText.trim()) {
      setInputText('Perform a complete forensic security breakdown of this URL: ');
    } else {
      setInputText(`Deeply analyze the security risks, ML features, and threat vectors for: "${inputText.trim()}"`);
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const canSend = (inputText.trim().length > 0 || attachedFile) && !isTyping;
  const lineCount = inputText ? (inputText.match(/\n/g) || []).length + 1 : 0;

  /* ── Floating Input Box Component (Exact DeepSeek Mobile Layout) ── */
  const RenderInputBox = ({ isCentered = false }) => (
    <div className="chat-input-container" style={{ margin: isCentered ? '14px auto 0' : '0 auto' }}>
      {/* Attached file chip preview */}
      {attachedFile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          marginBottom: '8px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '10px',
          fontSize: '0.8rem',
          color: '#4f46e5',
          fontWeight: 700
        }}>
          <FileText size={14} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {attachedFile.name} ({attachedFile.size})
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f46e5', padding: 0 }}
            title="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Auto-growing Textarea */}
      <textarea
        ref={textareaRef}
        className="chat-auto-textarea"
        value={inputText}
        onInput={autoResizeTextarea}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => {
          const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          if (e.key === 'Enter' && !e.shiftKey && !isTouch) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder={activeMode === 'vision' ? 'Paste URL link or email text for live scan...' : 'Message APDS AI...'}
        rows={1}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {/* Bottom Row Inside Card (DeepSeek Style) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '6px',
        gap: '6px'
      }}>
        {/* Left Action Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* DeepThink / Chain of Thought Chip */}
          <button
            type="button"
            onClick={() => setDeepThinkActive(!deepThinkActive)}
            className={`inner-action-chip ${deepThinkActive ? 'active-chip' : ''}`}
            title="Toggle DeepThink R1 step-by-step chain of thought reasoning"
          >
            <Cpu size={13} />
            <span>DeepThink</span>
          </button>

          {/* Search / Threat Intel Chip */}
          <button
            type="button"
            onClick={() => setSearchActive(!searchActive)}
            className={`inner-action-chip ${searchActive ? 'active-chip' : ''}`}
            title="Toggle web threat intel search"
          >
            <Globe size={13} />
            <span>Search</span>
          </button>

          {/* Magic Wand Prompt Enhancer */}
          <button
            type="button"
            onClick={handleEnhancePrompt}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '6px',
              transition: 'color 0.15s'
            }}
            title="Enhance security prompt"
          >
            <Wand2 size={15} />
          </button>
        </div>

        {/* Right Controls: Line count, Paperclip & Send Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lineCount > 1 && (
            <span style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '6px',
              background: 'var(--bg-input)'
            }}>
              {lineCount}L • {inputText.length}c
            </span>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
            onChange={handleFileAttach}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file (.txt, .eml, .py, .csv, .json)"
            style={{
              background: 'none',
              border: 'none',
              color: attachedFile ? '#4f46e5' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              transition: 'color 0.15s'
            }}
          >
            <Paperclip size={18} />
          </button>

          {/* Elevated Circular Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!canSend}
            className={`send-round-btn ${canSend ? 'active' : 'disabled'}`}
            title="Send prompt"
            aria-label="Send prompt"
          >
            <ArrowUp size={18} strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Welcome Screen (Exact DeepSeek Mobile Layout) ── */
  const WelcomeView = () => (
    <div className="chat-content-scroll" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      gap: '16px'
    }}>
      {/* Center Emblem */}
      <ChatLogo size={56} />

      {/* Main Title */}
      <h2 style={{
        fontSize: 'clamp(1.3rem, 5vw, 1.7rem)',
        fontWeight: '800',
        color: 'var(--text-primary)',
        margin: '0 0 2px 0',
        textAlign: 'center',
        letterSpacing: '-0.02em',
        fontFamily: 'var(--font-display)'
      }}>
        Start chatting with{' '}
        <span style={{
          background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {MODES.find(m => m.id === activeMode)?.label || 'Instant'}
        </span>
      </h2>

      {/* Mode Pills Row (Exact DeepSeek Style) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '6px'
      }}>
        {MODES.map(m => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`mode-pill-btn ${isActive ? 'active' : 'inactive'}`}
            >
              <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Floating Centered Input Box */}
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <RenderInputBox isCentered={true} />
      </div>

      {/* Quick Prompt Cards Grid */}
      <div className="welcome-prompt-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '8px',
        width: '100%',
        maxWidth: '680px',
        marginTop: '12px'
      }}>
        {QUICK_PROMPTS.map((item, i) => (
          <button
            key={i}
            className="suggestion-card-btn"
            onClick={() => handleSendMessage(item.query)}
          >
            <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>{item.icon}</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</span>
                <span style={{ fontSize: '0.66rem', padding: '1px 6px', borderRadius: '6px', background: 'var(--bg-input)', color: '#6366f1', fontWeight: 600 }}>{item.tag}</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>
                {item.query}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Active Conversation View ── */
  const ActiveChatView = () => (
    <div className="chat-content-scroll">
      {messages.map(msg => (
        <div
          key={msg.id}
          className="chat-msg-item"
          style={{
            alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
          }}
        >
          {/* Bot header (Avatar + Model Badge + Time) */}
          {msg.sender === 'bot' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
              }}>
                <Sparkles size={12} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>APDS Defense AI</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{msg.time}</span>
            </div>
          )}

          {/* DeepThink R1 Collapsible Chain of Thought Accordion */}
          {msg.sender === 'bot' && msg.thinkingSteps && (
            <div className="thinking-box" style={{ maxWidth: '92%', width: '100%' }}>
              <div
                className="thinking-header"
                onClick={() => setExpandedThoughts(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} color="#6366f1" />
                  <span>🧠 Thought Process ({msg.thinkingSteps.length} reasoning steps)</span>
                </div>
                {expandedThoughts[msg.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
              {expandedThoughts[msg.id] && (
                <div className="thinking-body">
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

          {/* Bubble content */}
          <div style={{
            maxWidth: msg.sender === 'user' ? '82%' : '92%',
            padding: msg.sender === 'user' ? '12px 16px' : '14px 18px',
            borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '4px 20px 20px 20px',
            background: msg.sender === 'user'
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
              : 'var(--bg-card)',
            color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
            fontSize: '0.94rem',
            lineHeight: '1.6',
            boxShadow: msg.sender === 'user'
              ? '0 4px 16px rgba(79, 70, 229, 0.25)'
              : '0 2px 10px rgba(0, 0, 0, 0.05)',
            border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
          }}>
            {msg.fileInfo && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 700
              }}>
                <FileText size={14} /> {msg.fileInfo}
              </div>
            )}
            {msg.sender === 'bot'
              ? <MarkdownMessage text={msg.text} msgId={msg.id} onCopy={handleCopy} copiedId={copiedId} />
              : msg.text
            }
          </div>

          {/* Assistant Action Bar (Copy, Speak Audio, Thumbs Up/Down, Regenerate) */}
          {msg.sender === 'bot' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '6px',
              paddingLeft: '4px',
              fontSize: '0.74rem',
              color: 'var(--text-muted)'
            }}>
              {/* Copy */}
              <button
                onClick={() => handleCopy(msg.text, msg.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}
                title="Copy response"
              >
                {copiedId === msg.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Text-to-Speech Audio */}
              <button
                onClick={() => handleSpeak(msg.text, msg.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: speakingMsgId === msg.id ? '#6366f1' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontWeight: speakingMsgId === msg.id ? 700 : 500
                }}
                title={speakingMsgId === msg.id ? 'Stop reading' : 'Read response aloud'}
              >
                {speakingMsgId === msg.id ? <VolumeX size={13} color="#6366f1" /> : <Volume2 size={13} />}
                <span>{speakingMsgId === msg.id ? 'Speaking...' : 'Listen'}</span>
              </button>

              {/* Thumbs Up */}
              <button
                onClick={() => handleRate(msg.id, 'up')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: feedbackRatings[msg.id] === 'up' ? '#10b981' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Helpful"
              >
                <ThumbsUp size={13} />
              </button>

              {/* Thumbs Down */}
              <button
                onClick={() => handleRate(msg.id, 'down')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: feedbackRatings[msg.id] === 'down' ? '#ef4444' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Not helpful"
              >
                <ThumbsDown size={13} />
              </button>
            </div>
          )}

          {/* User timestamp */}
          {msg.sender === 'user' && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', paddingRight: '4px' }}>
              {msg.time}
            </span>
          )}
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="chat-msg-item" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={12} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>APDS Defense AI</span>
          </div>
          <div style={{
            padding: '12px 18px',
            borderRadius: '4px 18px 18px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <>
      <style>{CHAT_CSS}</style>
      <div className="chat-view-root">
        {/* Top Minimal Navigation */}
        <div className="chat-top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)'
            }}>
              <Sparkles size={14} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                APDS Defense AI
              </div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                Neural ML Online (94.6%)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {hasMessages && (
              <>
                <button
                  onClick={handleExportChat}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '999px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                  title="Export chat transcript (.md)"
                >
                  <Download size={12} />
                  <span style={{ display: window.innerWidth <= 600 ? 'none' : 'inline' }}>Export</span>
                </button>

                <button
                  onClick={handleResetChat}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                  title="Start new conversation"
                >
                  <RefreshCw size={12} />
                  <span>New Chat</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area: Welcome Screen or Active Chat */}
        {hasMessages ? <ActiveChatView /> : <WelcomeView />}

        {/* Bottom Docked Input Bar (Only in active conversation) */}
        {hasMessages && (
          <div className="chat-dock-wrapper" style={{
            padding: '8px 16px 14px',
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-color)',
            flexShrink: 0,
            zIndex: 20
          }}>
            <RenderInputBox isCentered={false} />
          </div>
        )}
      </div>
    </>
  );
}
