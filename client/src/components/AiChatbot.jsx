import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, PlusCircle, Zap, Gem, Globe, Atom,
  Paperclip, ArrowUp, Copy, Check, X, FileText,
  Shield, Bot, Sparkles
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   STYLES — uses app CSS tokens so they match the site theme
───────────────────────────────────────────────────────────────── */
const CSS = `
  @keyframes ai-glow-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
    50%      { box-shadow: 0 0 0 18px rgba(59,130,246,0); }
  }
  @keyframes ai-fade-up {
    from { opacity:0; transform:translateY(7px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ai-dot-bounce {
    0%,80%,100% { transform:translateY(0); opacity:.35; }
    40%         { transform:translateY(-6px); opacity:1; }
  }

  /* ── Root ── */
  .ai-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100dvh - 145px);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-sans, system-ui, sans-serif);
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-card);
  }

  /* ── Top bar ── */
  .ai-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px 10px;
    flex-shrink: 0;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
  }
  .ai-topbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ai-topbar-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 3px 10px rgba(37,99,235,0.4);
    flex-shrink: 0;
  }
  .ai-topbar-info { line-height: 1.2; }
  .ai-topbar-name { font-weight: 800; font-size: 0.92rem; font-family: var(--font-display, 'Outfit', sans-serif); }
  .ai-topbar-status {
    font-size: 0.68rem;
    color: #10b981;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ai-topbar-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #10b981;
    display: inline-block;
  }
  .ai-nav-btn {
    background: var(--bg-input, rgba(255,255,255,0.06));
    border: 1px solid var(--border-color);
    cursor: pointer;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px;
    border-radius: 10px;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
  }
  .ai-nav-btn:hover  { color: var(--text-primary); border-color: var(--accent-blue, #3b82f6); }
  .ai-nav-btn:active { transform: scale(0.91); }

  /* ── Scroll area ── */
  .ai-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome ── */
  .ai-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 20px 20px 28px;
    gap: 0;
  }
  .ai-logo {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ai-glow-pulse 3.2s ease-in-out infinite;
    margin-bottom: 16px;
    flex-shrink: 0;
  }
  .ai-welcome-title {
    font-size: clamp(1.28rem, 5vw, 1.6rem);
    font-weight: 800;
    margin: 0 0 4px;
    text-align: center;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    font-family: var(--font-display, 'Outfit', sans-serif);
    line-height: 1.2;
  }
  .ai-welcome-sub {
    font-size: 0.84rem;
    color: var(--text-muted);
    margin: 0 0 22px;
    text-align: center;
  }

  /* ── Mode pills ── */
  .ai-mode-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .ai-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    font-family: var(--font-display, inherit);
    border: 1.5px solid transparent;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }
  .ai-pill.on  {
    background: rgba(59,130,246,0.18);
    color: #3b82f6;
    border-color: rgba(59,130,246,0.4);
    box-shadow: 0 2px 10px rgba(37,99,235,0.18);
  }
  .ai-pill.off {
    background: var(--bg-card);
    color: var(--text-secondary);
    border-color: var(--border-color);
  }
  .ai-pill.off:hover { border-color: #3b82f6; color: #3b82f6; }

  /* ── Suggestion cards ── */
  .ai-suggestions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
    max-width: 440px;
    margin-top: 16px;
  }
  .ai-sug {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-sug:hover {
    border-color: rgba(59,130,246,0.5);
    background: rgba(59,130,246,0.06);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(37,99,235,0.15);
  }
  .ai-sug:active { transform: scale(0.97); }
  .ai-sug-icon  { font-size: 1.05rem; flex-shrink: 0; margin-top: 1px; }
  .ai-sug-text  { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); line-height: 1.4; }

  /* ── Messages ── */
  .ai-messages {
    padding: 12px 0 6px;
    display: flex;
    flex-direction: column;
  }
  .ai-msg-row {
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    margin-bottom: 14px;
  }
  .ai-bot-header {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 6px;
  }
  .ai-bot-avatar {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }
  .ai-bot-name { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); }
  .ai-bot-ts   { font-size: 0.68rem; color: var(--text-muted); }

  .ai-bubble {
    max-width: 84%;
    padding: 11px 16px;
    font-size: 0.94rem;
    line-height: 1.65;
    word-break: break-word;
    animation: ai-fade-up 0.2s cubic-bezier(0.16,1,0.3,1) both;
    white-space: pre-line;
  }
  .ai-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #fff;
    border-radius: 18px 18px 4px 18px;
    box-shadow: 0 4px 14px rgba(37,99,235,0.3);
  }
  .ai-bubble-bot {
    align-self: flex-start;
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px 18px 18px 18px;
    box-shadow: var(--shadow-card);
  }
  .ai-user-ts {
    font-size: 0.66rem;
    color: var(--text-muted);
    margin-top: 4px;
    padding: 0 4px;
    align-self: flex-end;
  }
  .ai-copy-btn {
    align-self: flex-start;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 0.71rem;
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 5px;
    padding: 2px 4px;
    border-radius: 6px;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.14s;
  }
  .ai-copy-btn:hover { color: var(--text-primary); }

  /* ── Typing dots ── */
  .ai-dots span {
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #3b82f6;
    margin: 0 2px;
    animation: ai-dot-bounce 1.1s ease-in-out infinite;
  }
  .ai-dots span:nth-child(2) { animation-delay:.16s; }
  .ai-dots span:nth-child(3) { animation-delay:.32s; }

  /* ── Input card ── */
  .ai-card-wrap {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .ai-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 22px;
    padding: 12px 14px 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    width: 100%;
  }
  .ai-card:focus-within {
    border-color: rgba(59,130,246,0.6);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12), 0 6px 24px rgba(0,0,0,0.16);
  }
  .ai-file-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    margin-bottom: 8px;
    background: rgba(59,130,246,0.12);
    border: 1px solid rgba(59,130,246,0.3);
    border-radius: 8px;
    font-size: 0.77rem;
    color: #3b82f6;
    font-weight: 700;
  }
  .ai-file-x {
    background: none;
    border: none;
    cursor: pointer;
    color: #3b82f6;
    padding: 0;
    display: flex;
    margin-left: auto;
    -webkit-tap-highlight-color: transparent;
  }
  /* CRITICAL: textarea must never be in a nested component */
  .ai-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 1rem;
    line-height: 1.55;
    font-family: inherit;
    min-height: 38px;
    max-height: 220px;
    padding: 0 0 6px;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
    /* Prevent scroll jump on mobile */
    touch-action: manipulation;
  }
  .ai-textarea::placeholder { color: var(--text-muted); font-size: 0.96rem; }

  .ai-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 4px;
    gap: 6px;
  }
  .ai-chips { display: flex; align-items: center; gap: 5px; flex-wrap: nowrap; }
  .ai-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid var(--border-color);
    background: var(--bg-input, rgba(255,255,255,0.04));
    color: var(--text-secondary);
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
    user-select: none;
  }
  .ai-chip.on  { background: rgba(59,130,246,0.18); color: #3b82f6; border-color: rgba(59,130,246,0.4); }
  .ai-chip:hover { border-color: #3b82f6; }

  .ai-card-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .ai-attach {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 8px;
    transition: color 0.15s, background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-attach:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
  .ai-send {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-send.on  {
    background: #3b82f6;
    color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,235,0.45);
  }
  .ai-send.on:hover  { background: #2563eb; transform: scale(1.08); }
  .ai-send.on:active { transform: scale(0.92); }
  .ai-send.off {
    background: rgba(59,130,246,0.15);
    color: rgba(255,255,255,0.3);
    cursor: not-allowed;
  }

  /* ── Dock (active chat bottom bar) ── */
  .ai-dock {
    flex-shrink: 0;
    padding: 8px 16px 14px;
    background: var(--bg-secondary, var(--bg-primary));
    border-top: 1px solid var(--border-color);
    z-index: 10;
  }
  .ai-dock .ai-card-wrap { max-width: 100%; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .ai-root {
      height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
      min-height: 0;
      border-radius: 12px;
    }
    .ai-topbar { padding: 10px 14px 8px; }
    .ai-welcome { padding: 10px 14px 18px; }
    .ai-welcome-title { font-size: 1.25rem; }
    .ai-suggestions { grid-template-columns: 1fr 1fr; gap: 7px; max-width: 100%; }
    .ai-card-wrap { max-width: 100%; }
    .ai-card { border-radius: 20px; padding: 10px 12px 9px; }
    .ai-textarea { font-size: 16px; /* prevent iOS zoom */ }
    .ai-dock {
      padding: 8px 12px calc(env(safe-area-inset-bottom, 0px) + 8px);
    }
    .ai-msg-row { padding: 0 12px; }
    .ai-bubble { max-width: 90%; font-size: 0.92rem; }
    .ai-chip { font-size: 0.74rem; padding: 4px 9px; }
  }
`;

/* ── Modes ── */
const MODES = [
  { id: 'instant', label: 'Instant',  Icon: Zap  },
  { id: 'expert',  label: 'Expert',   Icon: Gem  },
  { id: 'vision',  label: 'Vision',   Icon: Globe },
];

/* ── Suggestions ── */
const SUGS = [
  { icon: '🔴', text: 'Scan a phishing link',           q: 'Scan paypal-secure-login.xyz'                                       },
  { icon: '🛡️', text: 'How phishing attacks work',      q: 'How do phishing attacks work and how can I protect myself?'         },
  { icon: '🐍', text: 'Python ML feature code',         q: 'Show Python code for URL feature extraction for phishing detection' },
  { icon: '🎓', text: 'About APDS & authors',           q: 'Tell me about APDS project, authors, and University of Sargodha'    },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   NOTE: InputCard is NOT a nested component — it's rendered inline.
   This is the fix for the keyboard-close bug on mobile.
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', onMenuToggle }) {
  const [messages,     setMessages]     = useState([]);
  const [inputText,    setInputText]    = useState('');
  const [activeMode,   setActiveMode]   = useState('instant');
  const [isTyping,     setIsTyping]     = useState(false);
  const [copiedId,     setCopiedId]     = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [deepThink,    setDeepThink]    = useState(false);
  const [searchOn,     setSearchOn]     = useState(false);

  // Single stable textarea ref — NEVER inside a nested component
  const textareaRef = useRef(null);
  const fileRef     = useRef(null);
  const endRef      = useRef(null);

  const hasMessages = messages.length > 0;
  const canSend     = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea height
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const min = 38;
    const max = window.innerWidth <= 768 ? 180 : 220;
    el.style.height = Math.min(Math.max(el.scrollHeight, min), max) + 'px';
  }, []);

  useEffect(() => { resize(); }, [inputText, resize]);

  /* ── Send message ── */
  const send = useCallback(async (override) => {
    const base  = typeof override === 'string' ? override.trim() : inputText.trim();
    const extra = attachedFile ? `\n\n[File: ${attachedFile.name}]\n${attachedFile.content}` : '';
    const query = (base + extra).trim();
    if (!query || isTyping) return;

    const ts  = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const uid = Date.now();
    const userMsg = { id: uid, sender: 'user', text: base, fileInfo: attachedFile?.name, time: ts() };

    setMessages(p => [...p, userMsg]);
    setInputText('');
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
      const res = await generateChatbotResponse(query, [...messages, userMsg], language);
      setIsTyping(false);
      setMessages(p => [...p, { id: uid + 1, sender: 'bot', text: res.text, time: ts() }]);
    } catch {
      setIsTyping(false);
      setMessages(p => [...p, { id: uid + 1, sender: 'bot', text: '⚠️ Connection error — please try again.', time: ts() }]);
    }
  }, [inputText, attachedFile, isTyping, messages, language]);

  /* ── File attach ── */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAttachedFile({ name: file.name, content: ev.target.result?.toString().slice(0, 4000) ?? '' });
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ── Copy ── */
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  /* ── New chat ── */
  const newChat = () => {
    setMessages([]);
    setInputText('');
    setAttachedFile(null);
  };

  /* ── Keyboard handler — no Enter-to-send on mobile ── */
  const handleKeyDown = (e) => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      send();
    }
  };

  const modeName = MODES.find(m => m.id === activeMode)?.label ?? 'Instant';

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INPUT CARD JSX — rendered INLINE (not as a sub-component)
     This prevents React from unmounting the textarea on re-renders,
     which was causing the keyboard to close on mobile.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const inputCardJSX = (
    <div className="ai-card-wrap">
      <div className="ai-card">
        {/* File badge */}
        {attachedFile && (
          <div className="ai-file-tag">
            <FileText size={13} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {attachedFile.name}
            </span>
            <button className="ai-file-x" onClick={() => setAttachedFile(null)}><X size={13} /></button>
          </div>
        )}

        {/* Textarea — stable ref, never remounted */}
        <textarea
          ref={textareaRef}
          className="ai-textarea"
          value={inputText}
          onInput={resize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message APDS AI..."
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Bottom action row */}
        <div className="ai-card-row">
          <div className="ai-chips">
            <button
              type="button"
              className={`ai-chip ${deepThink ? 'on' : ''}`}
              onMouseDown={e => e.preventDefault()} /* prevent blur on click */
              onClick={() => setDeepThink(v => !v)}
            >
              <Atom size={12} /> DeepThink
            </button>
            <button
              type="button"
              className={`ai-chip ${searchOn ? 'on' : ''}`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => setSearchOn(v => !v)}
            >
              <Globe size={12} /> Search
            </button>
          </div>

          <div className="ai-card-actions">
            <input ref={fileRef} type="file" accept=".txt,.eml,.csv,.json,.py,.md,.log" onChange={handleFile} style={{ display: 'none' }} />
            <button
              type="button"
              className="ai-attach"
              onMouseDown={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              title="Attach file"
            >
              <Paperclip size={19} style={{ color: attachedFile ? '#3b82f6' : undefined }} />
            </button>

            <button
              type="button"
              className={`ai-send ${canSend ? 'on' : 'off'}`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => send()}
              disabled={!canSend}
              aria-label="Send"
            >
              <ArrowUp size={18} strokeWidth={2.8} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="ai-root">

        {/* ── Top bar ── */}
        <div className="ai-topbar">
          <div className="ai-topbar-brand">
            <div className="ai-topbar-icon">
              <Shield size={15} />
            </div>
            <div className="ai-topbar-info">
              <div className="ai-topbar-name">APDS Defense AI</div>
              <div className="ai-topbar-status">
                <span className="ai-topbar-dot" />
                ML Active · 94.6% accuracy
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {hasMessages && (
              <button className="ai-nav-btn" onClick={newChat} title="New chat" style={{ fontSize: '0.75rem', gap: 5, padding: '6px 12px', borderRadius: 10 }}>
                <PlusCircle size={14} />
                <span style={{ fontWeight: 700 }}>New</span>
              </button>
            )}
            <button
              className="ai-nav-btn"
              onClick={() => onMenuToggle?.() ?? document.querySelector('.hamburger-btn')?.click()}
              title="Menu"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Scrollable area ── */}
        <div className="ai-scroll">
          {!hasMessages ? (
            /* ── Welcome screen ── */
            <div className="ai-welcome">
              {/* Logo */}
              <div className="ai-logo">
                <svg width={34} height={34} viewBox="0 0 48 48" fill="none">
                  <path d="M24 5C13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19S34.5 5 24 5z" fill="white" fillOpacity="0.92"/>
                  <path d="M14 26c1.5-5.5 7-8.5 13-7.5 4 .7 6.5 3.8 5.7 7-.8 3.2-5 5.8-10 5.8s-7.8-2.6-8.7-5.3z" fill="#1d4ed8"/>
                  <path d="M27 18.5c.9-3.3 3.5-5.5 7-5.5-1.3 2.5-.4 4.3 2 5.2-2.6.6-5.6.7-9 .3z" fill="#1d4ed8"/>
                  <circle cx="20.5" cy="24" r="2" fill="white"/>
                </svg>
              </div>

              <h1 className="ai-welcome-title">Start chatting with {modeName}</h1>
              <p className="ai-welcome-sub">Powered by APDS Neural ML Engine</p>

              {/* Mode pills */}
              <div className="ai-mode-row">
                {MODES.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    className={`ai-pill ${activeMode === id ? 'on' : 'off'}`}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setActiveMode(id)}
                  >
                    <Icon size={13} strokeWidth={activeMode === id ? 2.5 : 2} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Input card — rendered inline, not a sub-component */}
              {inputCardJSX}

              {/* Suggestion cards */}
              <div className="ai-suggestions">
                {SUGS.map((s, i) => (
                  <button
                    key={i}
                    className="ai-sug"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => send(s.q)}
                  >
                    <span className="ai-sug-icon">{s.icon}</span>
                    <span className="ai-sug-text">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Active messages stream ── */
            <div className="ai-messages">
              {messages.map(msg => (
                <div key={msg.id} className="ai-msg-row">
                  {msg.sender === 'bot' && (
                    <div className="ai-bot-header">
                      <div className="ai-bot-avatar"><Shield size={11} /></div>
                      <span className="ai-bot-name">APDS Defense AI</span>
                      <span className="ai-bot-ts">{msg.time}</span>
                    </div>
                  )}

                  <div className={`ai-bubble ${msg.sender === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
                    {msg.fileInfo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, fontSize: '0.75rem', opacity: 0.85, fontWeight: 700 }}>
                        <FileText size={12} /> {msg.fileInfo}
                      </div>
                    )}
                    {msg.text}
                  </div>

                  {msg.sender === 'bot' ? (
                    <button className="ai-copy-btn" onClick={() => handleCopy(msg.text, msg.id)}>
                      {copiedId === msg.id
                        ? <><Check size={12} color="#10b981" /> Copied</>
                        : <><Copy size={12} /> Copy response</>
                      }
                    </button>
                  ) : (
                    <span className="ai-user-ts">{msg.time}</span>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="ai-msg-row">
                  <div className="ai-bot-header">
                    <div className="ai-bot-avatar"><Shield size={11} /></div>
                    <span className="ai-bot-name">APDS Defense AI</span>
                  </div>
                  <div className="ai-bubble ai-bubble-bot">
                    <div className="ai-dots"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* ── Bottom dock (active chat only) ── */}
        {hasMessages && (
          <div className="ai-dock">
            {inputCardJSX}
          </div>
        )}

      </div>
    </>
  );
}
