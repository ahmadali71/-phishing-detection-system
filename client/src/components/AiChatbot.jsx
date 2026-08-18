import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Zap, Gem, Image as ImageIcon,
  MessageSquare, Lightbulb, Code2, PenTool,
  Atom, Globe, PlusCircle, ArrowUp, Copy, Check,
  Terminal, X, Paperclip, FileText, ArrowRight
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   EXACT 1:1 REPLICA CSS (PIXEL-PERFECT FIT ON ALL SCREEN SIZES)
───────────────────────────────────────────────────────────────── */
const SCREENSHOT_CSS = `
  @keyframes orb-pulse-glow {
    0%, 100% {
      box-shadow: 0 0 28px rgba(99, 102, 241, 0.5), 0 0 50px rgba(56, 189, 248, 0.35);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 40px rgba(99, 102, 241, 0.75), 0 0 75px rgba(168, 85, 247, 0.5);
      transform: scale(1.04);
    }
  }

  @keyframes sparkle-twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50%      { opacity: 1; transform: scale(1.25); }
  }

  @keyframes msg-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Canvas Background: Deep Midnight Navy/Black ── */
  .app-ai-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #070a14;
    color: #ffffff;
    position: relative;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
    flex: 1 1 0;
    min-height: 0;
  }
  .light-theme .app-ai-canvas {
    background: #f8fafc;
    color: #0f172a;
  }

  /* ── Scroll Area ── */
  .app-ai-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Stage (Compact Vertical Flow) ── */
  .app-ai-welcome {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 14px 4px 14px;
    text-align: center;
    max-width: 460px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Central Glowing Star Orb (High Contrast & Vibrant) ── */
  .app-ai-orb-wrap {
    position: relative;
    width: 74px;
    height: 74px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .app-ai-orb {
    width: 66px;
    height: 66px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1b4b 0%, #0f172a 65%, #030712 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: orb-pulse-glow 3.6s infinite ease-in-out;
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.6);
  }
  .light-theme .app-ai-orb {
    background: radial-gradient(circle at 35% 35%, #1e293b 0%, #0f172a 75%, #020617 100%);
  }
  .app-ai-orb::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
    z-index: -1;
  }

  /* Tiny sparkles around orb */
  .app-ai-twinkle {
    position: absolute;
    color: #60a5fa;
    animation: sparkle-twinkle 2.4s infinite ease-in-out;
  }

  /* ── Headlines ── */
  .app-ai-greeting {
    font-size: clamp(1.4rem, 5.2vw, 1.75rem);
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 2px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .light-theme .app-ai-greeting {
    color: #0f172a;
  }
  .app-ai-name {
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .app-ai-question {
    font-size: clamp(1rem, 3.8vw, 1.22rem);
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 10px 0;
    letter-spacing: -0.01em;
  }
  .light-theme .app-ai-question {
    color: #1e293b;
  }

  /* ── 3 Mode Selector Bar ── */
  .app-ai-mode-container {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9999px;
    padding: 3px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }
  .light-theme .app-ai-mode-container {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }
  .app-ai-mode-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 14px;
    border-radius: 9999px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: transparent;
    color: #94a3b8;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .light-theme .app-ai-mode-btn {
    color: #64748b;
  }
  .app-ai-mode-btn.active {
    background: #1e3a8a;
    color: #60a5fa;
    border: 1px solid #3b82f6;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.35);
  }
  .light-theme .app-ai-mode-btn.active {
    background: #ffffff;
    color: #2563eb;
    border-color: #93c5fd;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
  }

  /* ── 2x2 Quick Action Cards ── */
  .app-ai-grid-2x2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    width: 100%;
    margin-bottom: 4px;
    flex-shrink: 0;
  }
  .app-ai-action-card {
    background: #0d1322;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.16s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
  }
  .light-theme .app-ai-action-card {
    background: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }
  .app-ai-action-card:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: #131b2e;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  }
  .light-theme .app-ai-action-card:hover {
    background: #f1f5f9;
    border-color: #93c5fd;
  }
  .app-ai-action-card:active {
    transform: scale(0.97);
  }
  .app-ai-card-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .app-ai-card-content {
    flex: 1;
    overflow: hidden;
  }
  .app-ai-card-title {
    font-size: 0.78rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.2;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .light-theme .app-ai-card-title {
    color: #0f172a;
  }
  .app-ai-card-desc {
    font-size: 0.66rem;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .app-ai-card-arrow {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    flex-shrink: 0;
  }

  /* ── Glowing Floating Input Card (Always Docked & Visible) ── */
  .app-ai-input-dock {
    padding: 4px 12px calc(env(safe-area-inset-bottom, 0px) + 6px) 12px;
    flex-shrink: 0;
    background: transparent;
    z-index: 30;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .app-ai-input-card {
    background: #0a0f1d;
    border: 1.5px solid transparent;
    border-radius: 20px;
    background-image: linear-gradient(#0a0f1d, #0a0f1d), linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    padding: 8px 12px 6px 12px;
    box-shadow: 0 0 18px rgba(99, 102, 241, 0.22), 0 4px 18px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    width: 100%;
    transition: box-shadow 0.2s;
  }
  .light-theme .app-ai-input-card {
    background: #ffffff;
    background-image: linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%);
    box-shadow: 0 4px 18px rgba(99, 102, 241, 0.15);
  }
  .app-ai-input-card:focus-within {
    box-shadow: 0 0 26px rgba(99, 102, 241, 0.4), 0 6px 24px rgba(0, 0, 0, 0.5);
  }

  /* ── Auto-Growing Textarea (Never remounts) ── */
  .app-ai-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: #ffffff;
    font-size: 0.96rem;
    line-height: 1.4;
    font-family: inherit;
    min-height: 28px;
    max-height: 140px;
    padding: 0 0 2px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .light-theme .app-ai-textarea {
    color: #0f172a;
  }
  .app-ai-textarea::placeholder {
    color: #64748b;
    font-size: 0.9rem;
  }

  /* ── Input Bottom Action Row ── */
  .app-ai-action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 2px;
    gap: 6px;
  }
  .app-ai-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 9999px;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #111827;
    color: #cbd5e1;
    transition: all 0.15s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .light-theme .app-ai-chip {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
  }
  .app-ai-chip.active {
    background: #1e3a8a;
    color: #60a5fa;
    border-color: #3b82f6;
  }
  .light-theme .app-ai-chip.active {
    background: #dbeafe;
    color: #1d4ed8;
    border-color: #93c5fd;
  }

  /* ── Purple Soundwaves / Send Button ── */
  .app-ai-btn-purple-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
    transition: transform 0.18s, box-shadow 0.18s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .app-ai-btn-purple-circle:hover {
    transform: scale(1.08);
    box-shadow: 0 0 18px rgba(168, 85, 247, 0.6);
  }
  .app-ai-btn-purple-circle:active {
    transform: scale(0.92);
  }

  /* ── Chat Messages ── */
  .app-ai-msg-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
    padding: 0 14px;
    box-sizing: border-box;
    animation: msg-fade-in 0.2s ease-out both;
  }
  .app-ai-bubble {
    max-width: 86%;
    padding: 10px 14px;
    font-size: 0.92rem;
    line-height: 1.5;
    border-radius: 18px;
    word-break: break-word;
  }
  .app-ai-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.28);
  }
  .app-ai-bubble-bot {
    align-self: flex-start;
    background: #0f172a;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  }
  .light-theme .app-ai-bubble-bot {
    background: #ffffff;
    color: #0f172a;
    border-color: #e2e8f0;
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 768px) {
    .app-ai-canvas {
      height: 100%;
      border-radius: 0;
      border: none;
    }
    .app-ai-textarea {
      font-size: 16px; /* Prevents auto-zoom on iOS */
    }
  }
`;

/* ── 4-Pointed Glowing Star SVG for the Orb Center (Crisp White/Cyan) ── */
function GlowingStar({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 0C50 27.614 27.614 50 0 50C27.614 50 50 72.386 50 100C50 72.386 72.386 50 100 50C72.386 50 50 27.614 50 0Z"
        fill="url(#star_crisp_glow)"
      />
      <circle cx="50" cy="50" r="8" fill="#ffffff" />
      <defs>
        <linearGradient id="star_crisp_glow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Soundwave Bars Icon ── */
function SoundwavesIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="9" x2="5" y2="15" />
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="13" y1="3" x2="13" y2="21" />
      <line x1="17" y1="7" x2="17" y2="17" />
      <line x1="21" y1="10" x2="21" y2="14" />
    </svg>
  );
}

/* ── 4 Quick Actions (Exact Match to Reference Screenshot) ── */
const ACTION_CARDS = [
  {
    id: 'explain',
    title: 'Explain a concept',
    desc: 'in simple terms',
    icon: MessageSquare,
    iconBg: '#1e3a8a',
    iconColor: '#60a5fa',
    query: 'Explain how phishing detection algorithms analyze suspicious URLs in simple terms'
  },
  {
    id: 'ideas',
    title: 'Get ideas',
    desc: 'for anything',
    icon: Lightbulb,
    iconBg: '#4c1d95',
    iconColor: '#c084fc',
    query: 'Give me best security practices and ideas to protect personal accounts from social engineering'
  },
  {
    id: 'code',
    title: 'Write code',
    desc: 'or debug',
    icon: Code2,
    iconBg: '#064e3b',
    iconColor: '#34d399',
    query: 'Show Python ML code for URL feature extraction and Random Forest phishing classification'
  },
  {
    id: 'content',
    title: 'Write content',
    desc: 'emails, blogs & more',
    icon: PenTool,
    iconBg: '#78350f',
    iconColor: '#fbbf24',
    query: 'Write an email security awareness guide warning employees about spear phishing'
  }
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', currentUser }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('instant');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [thinkActive, setThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(true);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasMessages = messages.length > 0;
  const canSend = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;

  // Clean User Name: display real name or fallback to "Ahmad"
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
    const minH = 28;
    const maxH = window.innerWidth <= 768 ? 140 : 160;
    const targetH = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${targetH}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [inputText, autoResize]);

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

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INLINE FLOATING INPUT CARD (100% VISIBLE AT BOTTOM)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const InputCardJSX = (
    <div className="app-ai-input-dock">
      <div className="app-ai-input-card">
        {/* File preview tag if attached */}
        {attachedFile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            marginBottom: '4px',
            background: 'rgba(59, 130, 246, 0.18)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '8px',
            fontSize: '0.74rem',
            color: '#60a5fa',
            fontWeight: 600
          }}>
            <FileText size={12} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {attachedFile.name}
            </span>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => setAttachedFile(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', padding: 0 }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Stable Textarea Input — NEVER remounted */}
        <textarea
          ref={textareaRef}
          className="app-ai-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or hold to speak"
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Bottom Control Row */}
        <div className="app-ai-action-row">
          {/* Left Chips: Think & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setThinkActive(!thinkActive)}
              className={`app-ai-chip ${thinkActive ? 'active' : ''}`}
            >
              <Atom size={12} />
              <span>Think</span>
            </button>

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setSearchActive(!searchActive)}
              className={`app-ai-chip ${searchActive ? 'active' : ''}`}
            >
              <Globe size={12} />
              <span>Search</span>
            </button>
          </div>

          {/* Right Controls: Plus & Soundwaves / Send button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                color: attachedFile ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px'
              }}
              title="Add attachment"
            >
              <PlusCircle size={18} />
            </button>

            {/* Circular Purple Soundwaves or Send Arrow */}
            <button
              type="button"
              className="app-ai-btn-purple-circle"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSend()}
              disabled={!canSend}
              title="Send message"
              aria-label="Send message"
            >
              {inputText.trim().length > 0 || attachedFile ? (
                <ArrowUp size={16} strokeWidth={2.8} />
              ) : (
                <SoundwavesIcon size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{SCREENSHOT_CSS}</style>
      <div className="app-ai-canvas">

        {/* ── Scrollable Body Area ── */}
        <div className="app-ai-scroll">
          {!hasMessages ? (
            /* ── Welcome Stage (100% Fit on Mobile Screen) ── */
            <div className="app-ai-welcome">
              {/* Glowing Orb with Star & Twinkles */}
              <div className="app-ai-orb-wrap">
                <span className="app-ai-twinkle" style={{ top: '6%', left: '8%', fontSize: '10px' }}>✦</span>
                <span className="app-ai-twinkle" style={{ top: '12%', right: '6%', fontSize: '12px', animationDelay: '0.8s' }}>✦</span>
                <span className="app-ai-twinkle" style={{ bottom: '8%', left: '10%', fontSize: '11px', animationDelay: '1.4s' }}>✦</span>
                <span className="app-ai-twinkle" style={{ bottom: '12%', right: '8%', fontSize: '9px', animationDelay: '1.9s' }}>✦</span>

                <div className="app-ai-orb">
                  <GlowingStar size={32} />
                </div>
              </div>

              {/* Greeting & Headline */}
              <h1 className="app-ai-greeting">
                Hi, <span className="app-ai-name">{getUserName()}!</span> 👋
              </h1>
              <h2 className="app-ai-question">
                How can I help you today?
              </h2>

              {/* Mode Selector Pill Bar */}
              <div className="app-ai-mode-container">
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setActiveMode('instant')}
                  className={`app-ai-mode-btn ${activeMode === 'instant' ? 'active' : ''}`}
                >
                  <Zap size={12} strokeWidth={2.5} />
                  <span>Instant</span>
                </button>
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setActiveMode('expert')}
                  className={`app-ai-mode-btn ${activeMode === 'expert' ? 'active' : ''}`}
                >
                  <Gem size={12} strokeWidth={2} />
                  <span>Expert</span>
                </button>
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setActiveMode('vision')}
                  className={`app-ai-mode-btn ${activeMode === 'vision' ? 'active' : ''}`}
                >
                  <ImageIcon size={12} strokeWidth={2} />
                  <span>Vision</span>
                </button>
              </div>

              {/* 2x2 Action Cards */}
              <div className="app-ai-grid-2x2">
                {ACTION_CARDS.map(card => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="app-ai-action-card"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleSend(card.query)}
                    >
                      <div className="app-ai-card-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                        <Icon size={15} strokeWidth={2.2} />
                      </div>
                      <div className="app-ai-card-content">
                        <div className="app-ai-card-title">{card.title}</div>
                        <div className="app-ai-card-desc">{card.desc}</div>
                      </div>
                      <div className="app-ai-card-arrow">
                        <ArrowRight size={10} strokeWidth={2.5} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Active Chat Messages Stream ── */
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 14px 6px 14px' }}>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={handleNewChat}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '9999px',
                    color: '#94a3b8',
                    padding: '3px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + New Chat
                </button>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className="app-ai-msg-item">
                  <div className={`app-ai-bubble ${msg.sender === 'user' ? 'app-ai-bubble-user' : 'app-ai-bubble-bot'}`}>
                    {msg.fileInfo && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '4px',
                        fontSize: '0.76rem',
                        opacity: 0.9,
                        fontWeight: 700
                      }}>
                        <FileText size={12} /> {msg.fileInfo}
                      </div>
                    )}
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                    {msg.sender === 'bot' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleCopy(msg.text, msg.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            fontSize: '0.72rem',
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
                    fontSize: '0.66rem',
                    color: '#64748b',
                    marginTop: '2px',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 4px'
                  }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="app-ai-msg-item">
                  <div className="app-ai-bubble app-ai-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GlowingStar size={14} />
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Floating Input Dock at Bottom (Always 100% Visible) ── */}
        {InputCardJSX}

      </div>
    </>
  );
}
