import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, PlusCircle, Zap, Gem, Globe, Atom,
  Paperclip, ArrowUp, Copy, Check, X, FileText,
  ChevronRight
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   STYLES  (self-contained, no conflict with app CSS)
───────────────────────────────────────────────────────────────── */
const CSS = `
  /* ── Root container ── */
  .ai-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100dvh - 145px);
    background: var(--bg-primary);
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  /* ── Top nav bar ── */
  .ai-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px 6px;
    flex-shrink: 0;
  }
  .ai-nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 10px;
    transition: background 0.15s, opacity 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-nav-btn:hover  { background: var(--bg-card); }
  .ai-nav-btn:active { opacity: 0.6; transform: scale(0.92); }

  /* ── Scrollable message area ── */
  .ai-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome stage ── */
  .ai-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px 32px;
    min-height: 100%;
    gap: 0;
  }

  /* Logo animation */
  @keyframes ai-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.35); }
    50%       { box-shadow: 0 0 0 16px rgba(59,130,246,0); }
  }
  .ai-logo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ai-glow 3s ease-in-out infinite;
    margin-bottom: 18px;
    flex-shrink: 0;
  }

  .ai-welcome-title {
    font-size: clamp(1.3rem, 5vw, 1.65rem);
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 20px;
    text-align: center;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }
  .ai-welcome-title span {
    background: linear-gradient(135deg, #3b82f6, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Mode pills row ── */
  .ai-mode-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .ai-mode-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 18px;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
    border: 1.5px solid transparent;
    white-space: nowrap;
  }
  .ai-mode-pill.on {
    background: #eff6ff;
    color: #2563eb;
    border-color: #bfdbfe;
    box-shadow: 0 2px 8px rgba(37,99,235,0.12);
  }
  .ai-mode-pill.off {
    background: var(--bg-card);
    color: var(--text-secondary);
    border-color: var(--border-color);
  }
  .ai-mode-pill.off:hover {
    border-color: #93c5fd;
    color: #2563eb;
  }
  /* Dark theme overrides for active pill */
  @media (prefers-color-scheme: dark) {
    .ai-mode-pill.on {
      background: rgba(37,99,235,0.2);
      color: #93c5fd;
      border-color: rgba(37,99,235,0.4);
    }
  }
  .dark-theme .ai-mode-pill.on,
  [data-theme="dark"] .ai-mode-pill.on {
    background: rgba(37,99,235,0.2);
    color: #93c5fd;
    border-color: rgba(37,99,235,0.4);
  }

  /* ── Suggestion cards ── */
  .ai-suggestions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
    max-width: 440px;
    margin-top: 8px;
  }
  .ai-sug-card {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 14px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: all 0.18s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-sug-card:hover {
    border-color: #93c5fd;
    background: rgba(59,130,246,0.04);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59,130,246,0.1);
  }
  .ai-sug-card:active { transform: scale(0.97); }
  .ai-sug-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
  .ai-sug-text {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  /* ── Messages stream ── */
  .ai-messages {
    padding: 12px 0 4px;
    display: flex;
    flex-direction: column;
  }
  .ai-msg-row {
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    margin-bottom: 14px;
  }
  @keyframes ai-fade-up {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ai-bubble {
    max-width: 84%;
    padding: 11px 16px;
    font-size: 0.95rem;
    line-height: 1.6;
    word-break: break-word;
    animation: ai-fade-up 0.2s cubic-bezier(0.16,1,0.3,1) both;
    white-space: pre-line;
  }
  .ai-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
    color: #fff;
    border-radius: 20px 20px 4px 20px;
    box-shadow: 0 4px 14px rgba(79,70,229,0.28);
  }
  .ai-bubble-bot {
    align-self: flex-start;
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px 20px 20px 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .ai-time {
    font-size: 0.66rem;
    color: var(--text-muted, #94a3b8);
    margin-top: 4px;
    padding: 0 4px;
  }
  .ai-copy-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted, #94a3b8);
    font-size: 0.72rem;
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 4px;
    font-family: inherit;
    padding: 2px 0;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-copy-btn:hover { color: var(--text-primary); }

  /* ── Typing indicator ── */
  @keyframes ai-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%            { transform: translateY(-5px); opacity: 1; }
  }
  .ai-dots span {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #3b82f6;
    margin: 0 2px;
    animation: ai-bounce 1.1s ease-in-out infinite;
  }
  .ai-dots span:nth-child(2) { animation-delay: 0.16s; }
  .ai-dots span:nth-child(3) { animation-delay: 0.32s; }

  /* ── Floating input card ── */
  .ai-input-wrap {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .ai-input-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 26px;
    padding: 12px 14px 10px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    width: 100%;
  }
  .ai-input-card:focus-within {
    border-color: #818cf8;
    box-shadow: 0 6px 28px rgba(99,102,241,0.14);
  }
  .ai-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 1rem;
    line-height: 1.5;
    font-family: inherit;
    min-height: 38px;
    max-height: 220px;
    padding: 0 0 6px;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .ai-textarea::placeholder { color: var(--text-muted, #94a3b8); font-size: 0.97rem; }
  .ai-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding-top: 2px;
  }
  .ai-chips { display: flex; align-items: center; gap: 6px; }
  .ai-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-secondary);
    transition: all 0.15s ease;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
  }
  .ai-chip.on {
    background: #eff6ff;
    color: #2563eb;
    border-color: #bfdbfe;
  }
  .dark-theme .ai-chip.on,
  [data-theme="dark"] .ai-chip.on {
    background: rgba(37,99,235,0.2);
    color: #93c5fd;
    border-color: rgba(37,99,235,0.35);
  }
  .ai-chip:hover { border-color: #93c5fd; }

  .ai-actions { display: flex; align-items: center; gap: 8px; }
  .ai-attach-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted, #94a3b8);
    display: flex;
    align-items: center;
    padding: 4px;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.15s;
    border-radius: 8px;
  }
  .ai-attach-btn:hover { color: var(--text-primary); }
  .ai-send-btn {
    width: 36px;
    height: 36px;
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
  .ai-send-btn.ready {
    background: #818cf8;
    color: #fff;
    box-shadow: 0 4px 14px rgba(129,140,248,0.45);
  }
  .ai-send-btn.ready:hover  { background: #6366f1; transform: scale(1.08); }
  .ai-send-btn.ready:active { transform: scale(0.92); }
  .ai-send-btn.idle {
    background: #c7d2fe;
    color: #fff;
    cursor: not-allowed;
  }
  .dark-theme .ai-send-btn.idle,
  [data-theme="dark"] .ai-send-btn.idle {
    background: rgba(129,140,248,0.25);
    color: rgba(255,255,255,0.35);
  }

  /* ── File badge ── */
  .ai-file-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    margin-bottom: 7px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    font-size: 0.78rem;
    color: #2563eb;
    font-weight: 600;
  }
  .ai-file-badge button {
    background: none;
    border: none;
    cursor: pointer;
    color: #2563eb;
    padding: 0;
    display: flex;
    margin-left: auto;
  }

  /* ── Bottom dock (active chat) ── */
  .ai-dock {
    flex-shrink: 0;
    padding: 8px 16px 14px;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
  }
  .ai-dock .ai-input-wrap { max-width: 100%; }

  /* ── Mobile overrides ── */
  @media (max-width: 768px) {
    .ai-root {
      height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
      min-height: 0;
    }
    .ai-topbar { padding: 10px 14px 4px; }
    .ai-welcome { padding: 0 14px 20px; }
    .ai-welcome-title { font-size: 1.28rem; }
    .ai-suggestions { grid-template-columns: 1fr 1fr; gap: 6px; max-width: 100%; }
    .ai-input-wrap { max-width: 100%; }
    .ai-input-card { border-radius: 22px; padding: 10px 12px 9px; }
    .ai-textarea { font-size: 0.97rem; }
    .ai-dock {
      padding: 7px 12px calc(env(safe-area-inset-bottom, 0px) + 7px);
    }
    .ai-dock .ai-input-wrap { max-width: 100%; }
    .ai-msg-row { padding: 0 12px; }
    .ai-bubble { max-width: 90%; font-size: 0.92rem; }
  }
`;

/* ── DeepSeek-style Blue Whale SVG Logo ── */
function WhaleLogo({ size = 60 }) {
  return (
    <div className="ai-logo" style={{ width: size, height: size }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 32 32" fill="none">
        <path d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13S23.18 3 16 3z" fill="white" fillOpacity="0.9"/>
        <path d="M10 17.5c1-4 5.5-6.5 10-5.8 3.3.5 5.3 3 4.7 5.8-.6 2.7-4 4.8-8 4.8s-6.3-2.1-6.7-4.8z" fill="#1d4ed8"/>
        <path d="M20 11.8c.7-2.6 2.8-4.5 5.5-4.5-1 2-0.3 3.5 1.5 4.2-2 .5-4.5.6-7 .3z" fill="#1d4ed8"/>
        <circle cx="14" cy="16" r="1.5" fill="white"/>
      </svg>
    </div>
  );
}

/* ── Modes ── */
const MODES = [
  { id: 'instant', label: 'Instant',    Icon: Zap  },
  { id: 'expert',  label: 'Expert',     Icon: Gem  },
  { id: 'vision',  label: 'Vision',     Icon: Globe },
];

/* ── Suggestion prompts ── */
const SUGGESTIONS = [
  { icon: '🔴', text: 'Scan a suspicious phishing link' },
  { icon: '🛡️', text: 'Explain how phishing attacks work' },
  { icon: '🐍', text: 'Python ML code for URL features' },
  { icon: '🎓', text: 'About APDS project & authors' },
];

const SUGGESTION_QUERIES = [
  'Scan paypal-secure-login.xyz',
  'How do phishing attacks work and how can I protect myself?',
  'Show me Python code for URL feature extraction for ML phishing detection',
  'Tell me about the APDS project, authors, and university',
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', onMenuToggle }) {
  const [messages,      setMessages]      = useState([]);
  const [inputText,     setInputText]     = useState('');
  const [activeMode,    setActiveMode]    = useState('instant');
  const [isTyping,      setIsTyping]      = useState(false);
  const [copiedId,      setCopiedId]      = useState(null);
  const [attachedFile,  setAttachedFile]  = useState(null);
  const [deepThink,     setDeepThink]     = useState(false);
  const [searchOn,      setSearchOn]      = useState(false);

  const endRef      = useRef(null);
  const textareaRef = useRef(null);
  const fileRef     = useRef(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const min = window.innerWidth <= 768 ? 36 : 38;
    const max = window.innerWidth <= 768 ? 200 : 220;
    el.style.height = Math.min(Math.max(el.scrollHeight, min), max) + 'px';
  }, []);

  useEffect(() => { resize(); }, [inputText, resize]);

  /* ── Send ── */
  const send = async (override) => {
    const base = typeof override === 'string' ? override.trim() : inputText.trim();
    const fileAppend = attachedFile ? `\n\n[File: ${attachedFile.name}]\n${attachedFile.content}` : '';
    const query = (base + fileAppend).trim();
    if (!query || isTyping) return;

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: 'user', text: base, fileInfo: attachedFile?.name, time: ts };

    setMessages(p => [...p, userMsg]);
    setInputText('');
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
      const res = await generateChatbotResponse(query, [...messages, userMsg], language);
      setIsTyping(false);
      const ts2 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(p => [...p, { id: Date.now() + 1, sender: 'bot', text: res.text, time: ts2 }]);
    } catch {
      setIsTyping(false);
      const ts2 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(p => [...p, { id: Date.now() + 1, sender: 'bot', text: '⚠️ Connection error. Please try again.', time: ts2 }]);
    }
  };

  /* ── File attach ── */
  const attach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAttachedFile({ name: file.name, content: ev.target.result?.toString().slice(0, 4000) || '' });
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ── Copy ── */
  const copy = (text, id) => {
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

  const canSend = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;
  const modeName = MODES.find(m => m.id === activeMode)?.label ?? 'Instant';

  /* ── Input card (rendered in both welcome and dock) ── */
  const InputCard = () => (
    <div className="ai-input-wrap">
      <div className="ai-input-card">
        {attachedFile && (
          <div className="ai-file-badge">
            <FileText size={13} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {attachedFile.name}
            </span>
            <button onClick={() => setAttachedFile(null)}><X size={13} /></button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="ai-textarea"
          value={inputText}
          onInput={resize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (e.key === 'Enter' && !e.shiftKey && !touch) { e.preventDefault(); send(); }
          }}
          placeholder="Message DeepSeek"
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="ai-card-row">
          <div className="ai-chips">
            <button type="button" className={`ai-chip ${deepThink ? 'on' : ''}`} onClick={() => setDeepThink(v => !v)}>
              <Atom size={13} /> DeepThink
            </button>
            <button type="button" className={`ai-chip ${searchOn ? 'on' : ''}`} onClick={() => setSearchOn(v => !v)}>
              <Globe size={13} /> Search
            </button>
          </div>

          <div className="ai-actions">
            <input ref={fileRef} type="file" accept=".txt,.eml,.csv,.json,.py,.md,.log" onChange={attach} style={{ display: 'none' }} />
            <button type="button" className="ai-attach-btn" onClick={() => fileRef.current?.click()} title="Attach file">
              <Paperclip size={19} style={{ color: attachedFile ? '#2563eb' : undefined }} />
            </button>
            <button
              type="button"
              className={`ai-send-btn ${canSend ? 'ready' : 'idle'}`}
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
          <button className="ai-nav-btn" onClick={() => onMenuToggle?.() ?? document.querySelector('.hamburger-btn')?.click()} title="Menu">
            <Menu size={22} strokeWidth={2} />
          </button>
          <button className="ai-nav-btn" onClick={newChat} title="New chat">
            <PlusCircle size={22} strokeWidth={1.9} />
          </button>
        </div>

        {/* ── Scrollable area ── */}
        <div className="ai-scroll">
          {!hasMessages ? (
            /* ── Welcome screen ── */
            <div className="ai-welcome">
              <WhaleLogo size={60} />

              <h1 className="ai-welcome-title">
                Start chatting with <span>{modeName}</span>
              </h1>

              {/* Mode pills */}
              <div className="ai-mode-row">
                {MODES.map(({ id, label, Icon }) => (
                  <button key={id} className={`ai-mode-pill ${activeMode === id ? 'on' : 'off'}`} onClick={() => setActiveMode(id)}>
                    <Icon size={13} strokeWidth={activeMode === id ? 2.5 : 2} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Input card */}
              <InputCard />

              {/* Suggestion cards */}
              <div className="ai-suggestions" style={{ marginTop: 18 }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="ai-sug-card" onClick={() => send(SUGGESTION_QUERIES[i])}>
                    <span className="ai-sug-icon">{s.icon}</span>
                    <span className="ai-sug-text">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Active messages ── */
            <div className="ai-messages">
              {messages.map(msg => (
                <div key={msg.id} className="ai-msg-row">
                  <div className={`ai-bubble ${msg.sender === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
                    {msg.fileInfo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, fontSize: '0.76rem', opacity: 0.85, fontWeight: 700 }}>
                        <FileText size={12} /> {msg.fileInfo}
                      </div>
                    )}
                    {msg.text}
                  </div>

                  {msg.sender === 'bot' && (
                    <button className="ai-copy-btn" onClick={() => copy(msg.text, msg.id)}>
                      {copiedId === msg.id
                        ? <><Check size={12} color="#10b981" /> Copied</>
                        : <><Copy size={12} /> Copy</>
                      }
                    </button>
                  )}

                  <span className="ai-time" style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {/* Typing dots */}
              {isTyping && (
                <div className="ai-msg-row">
                  <div className="ai-bubble ai-bubble-bot">
                    <div className="ai-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* ── Bottom dock (only when chat is active) ── */}
        {hasMessages && (
          <div className="ai-dock">
            <InputCard />
          </div>
        )}

      </div>
    </>
  );
}
