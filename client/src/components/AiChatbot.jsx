import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shield, Sparkles, Plus, Mic, ArrowUp, Copy, Check,
  X, FileText, Lock, Globe, Terminal, RefreshCw,
  Search, MessageSquare, Code2, AlertTriangle, ArrowRight
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   APDS AI ASSISTANT — SEAMLESS DESIGN SYSTEM (100% MATCH WITH SITE)
───────────────────────────────────────────────────────────────── */
const APDS_AI_CSS = `
  @keyframes apds-shield-glow {
    0%, 100% {
      box-shadow: 0 0 25px rgba(59, 130, 246, 0.4), 0 0 50px rgba(139, 92, 246, 0.25);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 38px rgba(59, 130, 246, 0.65), 0 0 70px rgba(139, 92, 246, 0.45);
      transform: scale(1.04);
    }
  }

  @keyframes apds-sparkle-twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50%      { opacity: 1; transform: scale(1.2); }
  }

  @keyframes apds-fade-up {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Canvas Container (Inherits Website Theme Colors) ── */
  .apds-chat-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--bg-primary, #080c16);
    color: var(--text-primary, #f8fafc);
    position: relative;
    box-sizing: border-box;
    font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
    overflow: hidden;
    flex: 1 1 0;
    min-height: 0;
  }

  /* ── Scrollable Viewport ── */
  .apds-chat-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Stage ── */
  .apds-welcome-container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 16px 10px 16px;
    text-align: center;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Signature Glowing APDS Shield Logo ── */
  .apds-shield-logo-wrap {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .apds-shield-logo-core {
    width: 70px;
    height: 70px;
    border-radius: 20px;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    animation: apds-shield-glow 3.6s infinite ease-in-out;
    position: relative;
  }
  .apds-shield-sparkle {
    position: absolute;
    color: #60a5fa;
    animation: apds-sparkle-twinkle 2.4s infinite ease-in-out;
  }

  /* ── Brand Title & Status ── */
  .apds-brand-title {
    font-size: 1.1rem;
    font-weight: 800;
    font-family: var(--font-display, 'Outfit', sans-serif);
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 3px 0;
    letter-spacing: -0.01em;
  }
  .apds-brand-badge {
    font-size: 0.72rem;
    font-weight: 700;
    color: #10b981;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 10px;
    border-radius: 9999px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.25);
    margin-bottom: 12px;
  }
  .apds-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }

  /* ── Headlines ── */
  .apds-welcome-greeting {
    font-size: clamp(1.45rem, 5.2vw, 1.8rem);
    font-weight: 800;
    font-family: var(--font-display, 'Outfit', sans-serif);
    color: var(--text-primary, #f8fafc);
    margin: 0 0 2px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .apds-user-name {
    color: #3b82f6;
  }
  .apds-welcome-question {
    font-size: clamp(1rem, 3.8vw, 1.25rem);
    font-weight: 700;
    color: var(--text-secondary, #cbd5e1);
    margin: 0 0 16px 0;
    letter-spacing: -0.01em;
  }

  /* ── 2x2 Quick Action Prompt Cards (Theme Matched) ── */
  .apds-prompt-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: 100%;
    margin-bottom: 8px;
    flex-shrink: 0;
  }
  .apds-prompt-card {
    background: var(--bg-card, #141f36);
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    border-radius: 14px;
    padding: 9px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.16s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
    color: var(--text-secondary, #cbd5e1);
  }
  .apds-prompt-card:hover {
    border-color: #3b82f6;
    background: var(--bg-card-hover, #1c2b4a);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
  .apds-prompt-card:active {
    transform: scale(0.97);
  }
  .apds-card-icon-box {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .apds-card-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-primary, #f8fafc);
    line-height: 1.2;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .apds-card-desc {
    font-size: 0.68rem;
    color: var(--text-muted, #8493a8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .apds-card-arrow {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--bg-input, rgba(255, 255, 255, 0.05));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted, #8493a8);
    flex-shrink: 0;
  }

  /* ── Floating Glowing Input Capsule (Website Theme Matched) ── */
  .apds-input-dock {
    padding: 6px 14px calc(env(safe-area-inset-bottom, 0px) + 8px) 14px;
    flex-shrink: 0;
    background: transparent;
    z-index: 30;
    width: 100%;
    max-width: 540px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .apds-input-capsule {
    background: var(--bg-card, #141f36);
    border: 1.5px solid var(--border-color, rgba(255, 255, 255, 0.12));
    border-radius: 9999px;
    padding: 6px 10px 6px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    min-height: 50px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .apds-input-capsule.multiline {
    border-radius: 24px;
    align-items: flex-end;
    padding-bottom: 8px;
  }
  .apds-input-capsule:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 24px rgba(59, 130, 246, 0.35);
  }

  /* ── Textarea ── */
  .apds-input-textarea {
    flex: 1 1 0;
    min-width: 0;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text-primary, #f8fafc);
    font-size: 0.98rem;
    line-height: 1.45;
    font-family: inherit;
    min-height: 26px;
    max-height: 150px;
    padding: 3px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-input-textarea::placeholder {
    color: var(--text-muted, #8493a8);
    font-size: 0.94rem;
  }

  /* ── Actions ── */
  .apds-input-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .apds-btn-attach {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
    background: var(--bg-input, rgba(255, 255, 255, 0.05));
    color: var(--text-muted, #8493a8);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-btn-attach:hover {
    color: #3b82f6;
    border-color: #3b82f6;
  }
  .apds-btn-send {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
    transition: transform 0.18s, box-shadow 0.18s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-btn-send:hover {
    transform: scale(1.08);
    background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
  }
  .apds-btn-send:active {
    transform: scale(0.92);
  }

  /* ── Chat Messages ── */
  .apds-chat-msg {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 12px;
    padding: 0 16px;
    box-sizing: border-box;
    animation: apds-fade-up 0.2s ease-out both;
  }
  .apds-chat-bubble {
    max-width: 86%;
    padding: 12px 16px;
    font-size: 0.94rem;
    line-height: 1.55;
    border-radius: 20px;
    word-break: break-word;
  }
  .apds-chat-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  }
  .apds-chat-bubble-bot {
    align-self: flex-start;
    background: var(--bg-card, #141f36);
    color: var(--text-primary, #f8fafc);
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 768px) {
    .apds-chat-canvas {
      height: 100%;
      border-radius: 0;
      border: none;
    }
    .apds-welcome-container {
      padding: 10px 12px 6px 12px;
    }
    .apds-welcome-greeting {
      font-size: 1.55rem;
    }
    .apds-welcome-question {
      font-size: 1.1rem;
      margin-bottom: 12px;
    }
    .apds-prompt-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
    .apds-prompt-card {
      padding: 8px 10px;
    }
    .apds-input-dock {
      padding: 4px 10px calc(env(safe-area-inset-bottom, 0px) + 6px) 10px;
    }
    .apds-input-textarea {
      font-size: 16px; /* Prevents auto-zoom on iOS */
    }
  }
`;

/* ── 4 Quick Actions (APDS Security Themed) ── */
const SECURITY_ACTIONS = [
  {
    id: 'scan',
    title: 'Scan Suspicious URL',
    desc: 'Deep ML & Lexical Audit',
    icon: Shield,
    iconBg: 'rgba(239, 68, 68, 0.15)',
    iconColor: '#f43f5e',
    query: 'Scan paypal-security-verification.xyz'
  },
  {
    id: 'email',
    title: 'Analyze Phishing Email',
    desc: 'Header & NLP Inspection',
    icon: Lock,
    iconBg: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#3b82f6',
    query: 'How do I detect phishing in an urgent account suspension email?'
  },
  {
    id: 'code',
    title: 'ML Feature Pipeline',
    desc: 'Python Extraction Script',
    icon: Code2,
    iconBg: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#10b981',
    query: 'Show Python code for URL feature extraction and Random Forest classifier'
  },
  {
    id: 'project',
    title: 'APDS Architecture',
    desc: 'Authors, Supervisor & Stats',
    icon: Sparkles,
    iconBg: 'rgba(168, 85, 247, 0.15)',
    iconColor: '#a855f7',
    query: 'Tell me about the APDS project authors, supervisor, and University of Sargodha'
  }
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const hasMessages = messages.length > 0;
  const canSend = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;

  // Clean User Display Name
  const getUserName = () => {
    const raw = currentUser?.name || currentUser?.username;
    if (raw && !raw.toLowerCase().includes('system') && !raw.toLowerCase().includes('admin')) {
      const first = raw.split(' ')[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    return 'Ahmad';
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea height without remounting
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = 26;
    const maxH = window.innerWidth <= 768 ? 140 : 160;
    const targetH = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${targetH}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [inputText, autoResize]);

  // Voice speech recognition
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
  const handleSend = async (overrideText) => {
    const baseText = typeof overrideText === 'string' ? overrideText.trim() : inputText.trim();
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

    try {
      const res = await generateChatbotResponse(query, [...messages, userMsg], language);
      setIsTyping(false);
      const tsBot = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.text,
        time: tsBot
      }]);
    } catch {
      setIsTyping(false);
      const tsBot = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ Connection notice. Please try again.',
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

  /* ── Reset Chat ── */
  const handleNewChat = () => {
    setMessages([]);
    setInputText('');
    setAttachedFile(null);
  };

  /* ── Keydown (no mobile submit on enter) ── */
  const handleKeyDown = (e) => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (e.key === 'Enter' && !e.shiftKey && !isTouch) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMultiLine = inputText.includes('\n') || (textareaRef.current?.scrollHeight || 0) > 34;

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INLINE FLOATING CAPSULE (SEAMLESS SITE MATCH)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const InputCapsuleJSX = (
    <div className="apds-input-dock">
      {/* File preview badge */}
      {attachedFile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          marginBottom: '6px',
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '9999px',
          fontSize: '0.76rem',
          color: '#3b82f6',
          fontWeight: 600
        }}>
          <FileText size={13} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {attachedFile.name}
          </span>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => setAttachedFile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: 0 }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className={`apds-input-capsule ${isMultiLine ? 'multiline' : ''}`}>
        {/* Stable Textarea Input */}
        <textarea
          ref={textareaRef}
          className="apds-input-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask APDS AI or scan a threat..."
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Right Actions: Plus & Send/Mic */}
        <div className="apds-input-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
            onChange={handleFileAttach}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="apds-btn-attach"
            onMouseDown={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Plus size={18} strokeWidth={2.4} />
          </button>

          {inputText.trim().length > 0 || attachedFile ? (
            <button
              type="button"
              className="apds-btn-send"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSend()}
              disabled={!canSend}
              title="Send message"
              aria-label="Send message"
            >
              <ArrowUp size={18} strokeWidth={2.8} />
            </button>
          ) : (
            <button
              type="button"
              className="apds-btn-send"
              onMouseDown={e => e.preventDefault()}
              onClick={toggleVoiceInput}
              title={isListening ? 'Listening...' : 'Voice message'}
              aria-label="Voice message"
            >
              <Mic size={18} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{APDS_AI_CSS}</style>
      <div className="apds-chat-canvas">

        {/* ── Scroll Area: Logo + Title + Quick Actions or Chat Stream ── */}
        <div className="apds-chat-scroll">
          {!hasMessages ? (
            /* ── Welcome Stage (Glowing APDS Logo + Title) ── */
            <div className="apds-welcome-container">
              {/* Glowing APDS Shield Logo */}
              <div className="apds-shield-logo-wrap">
                <span className="apds-shield-sparkle" style={{ top: '4%', left: '0%', fontSize: '11px' }}>✦</span>
                <span className="apds-shield-sparkle" style={{ top: '10%', right: '2%', fontSize: '13px', animationDelay: '0.8s' }}>✦</span>
                <span className="apds-shield-sparkle" style={{ bottom: '8%', left: '4%', fontSize: '12px', animationDelay: '1.4s' }}>✦</span>
                <span className="apds-shield-sparkle" style={{ bottom: '4%', right: '0%', fontSize: '10px', animationDelay: '1.9s' }}>✦</span>

                <div className="apds-shield-logo-core">
                  <Shield size={36} strokeWidth={2.2} />
                </div>
              </div>

              {/* Title & Status Badge */}
              <div className="apds-brand-title">APDS Sentinel AI</div>
              <div className="apds-brand-badge">
                <span className="apds-status-dot" />
                <span>Neural Defense Active · 94.6% Acc</span>
              </div>

              {/* Greeting & Headline */}
              <h1 className="apds-welcome-greeting">
                Hi, <span className="apds-user-name">{getUserName()}!</span> 👋
              </h1>
              <h2 className="apds-welcome-question">
                How can I protect your security today?
              </h2>

              {/* 2x2 Action Cards */}
              <div className="apds-prompt-grid">
                {SECURITY_ACTIONS.map(card => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="apds-prompt-card"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleSend(card.query)}
                    >
                      <div className="apds-card-icon-box" style={{ background: card.iconBg, color: card.iconColor }}>
                        <Icon size={16} strokeWidth={2.2} />
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div className="apds-card-title">{card.title}</div>
                        <div className="apds-card-desc">{card.desc}</div>
                      </div>
                      <div className="apds-card-arrow">
                        <ArrowRight size={11} strokeWidth={2.5} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Active Chat Messages Stream ── */
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px 6px 16px' }}>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={handleNewChat}
                  style={{
                    background: 'var(--bg-card, #141f36)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                    borderRadius: '9999px',
                    color: 'var(--text-muted, #8493a8)',
                    padding: '4px 12px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + New Chat
                </button>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className="apds-chat-msg">
                  <div className={`apds-chat-bubble ${msg.sender === 'user' ? 'apds-chat-bubble-user' : 'apds-chat-bubble-bot'}`}>
                    {msg.fileInfo && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '6px',
                        fontSize: '0.78rem',
                        opacity: 0.9,
                        fontWeight: 700
                      }}>
                        <FileText size={13} /> {msg.fileInfo}
                      </div>
                    )}
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                    {msg.sender === 'bot' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleCopy(msg.text, msg.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted, #8493a8)',
                            fontSize: '0.74rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {copiedId === msg.id ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted, #8493a8)',
                    marginTop: '3px',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 4px'
                  }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="apds-chat-msg">
                  <div className="apds-chat-bubble apds-chat-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={15} color="#3b82f6" />
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted, #8493a8)' }}>Analyzing threat...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Floating Input Dock at Bottom ── */}
        {InputCapsuleJSX}

      </div>
    </>
  );
}
