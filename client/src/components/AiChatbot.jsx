import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, PlusCircle, Zap, Gem, Globe, Atom, Paperclip,
  ArrowUp, Copy, Check, Terminal, RefreshCw, X, Sparkles,
  FileText
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   EXACT DEEPSEEK MOBILE AESTHETIC CSS
───────────────────────────────────────────────────────────────── */
const DEEPSEEK_CSS = `
  .ds-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 160px);
    background: var(--bg-primary, #ffffff);
    color: var(--text-primary, #0f172a);
    position: relative;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  /* ── Minimal Top Bar (Exact Match) ── */
  .ds-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 8px 20px;
    background: transparent;
    flex-shrink: 0;
    z-index: 20;
  }
  .ds-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-primary, #1e293b);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 8px;
    transition: opacity 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ds-icon-btn:hover {
    opacity: 0.7;
  }
  .ds-icon-btn:active {
    transform: scale(0.92);
  }

  /* ── Scroll Area ── */
  .ds-scroll-area {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Center Stage (Exact Match) ── */
  .ds-welcome-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 20px 40px 20px;
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  /* ── Title & Logo Row ── */
  .ds-title-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .ds-title-text {
    font-size: clamp(1.25rem, 5.5vw, 1.55rem);
    font-weight: 800;
    color: var(--text-primary, #0f172a);
    margin: 0;
    letter-spacing: -0.02em;
  }

  /* ── 3 Mode Pills Row ── */
  .ds-mode-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 26px;
    flex-wrap: wrap;
  }
  .ds-mode-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 18px;
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  .ds-mode-pill.active {
    background: #eef2ff;
    color: #3b82f6;
    border: 1.5px solid #c7d2fe;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);
  }
  .dark-theme .ds-mode-pill.active,
  body:not(.light-theme) .ds-mode-pill.active {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border: 1.5px solid rgba(59, 130, 246, 0.4);
  }
  .ds-mode-pill.inactive {
    background: var(--bg-card, #ffffff);
    color: var(--text-secondary, #475569);
    border: 1.5px solid var(--border-color, #e2e8f0);
  }
  .ds-mode-pill.inactive:hover {
    border-color: #93c5fd;
    color: #3b82f6;
  }

  /* ── DeepSeek Floating Input Card ── */
  .ds-input-card {
    background: var(--bg-card, #ffffff);
    border: 1.5px solid var(--border-color, #e2e8f0);
    border-radius: 26px;
    padding: 14px 16px 12px 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ds-input-card:focus-within {
    border-color: #818cf8;
    box-shadow: 0 6px 30px rgba(99, 102, 241, 0.12);
  }

  /* ── Auto-Expanding Textarea ── */
  .ds-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text-primary, #0f172a);
    font-size: 1.02rem;
    line-height: 1.5;
    font-family: inherit;
    min-height: 38px;
    max-height: 260px;
    padding: 0 0 8px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    transition: height 0.12s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .ds-textarea::placeholder {
    color: var(--text-muted, #94a3b8);
    font-size: 1rem;
  }

  /* ── Inner Action Chips (DeepThink / Search) ── */
  .ds-chip-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    border: 1px solid var(--border-color, #e2e8f0);
    background: var(--bg-card, #ffffff);
    color: var(--text-secondary, #334155);
    -webkit-tap-highlight-color: transparent;
  }
  .ds-chip-btn.active {
    background: #eef2ff;
    color: #3b82f6;
    border-color: #c7d2fe;
  }
  .dark-theme .ds-chip-btn.active,
  body:not(.light-theme) .ds-chip-btn.active {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border-color: rgba(59, 130, 246, 0.4);
  }

  /* ── Lavender Send Circle Button (Exact Match) ── */
  .ds-send-btn {
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
  .ds-send-btn.ready {
    background: #818cf8;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(129, 140, 248, 0.45);
    transform: scale(1.04);
  }
  .ds-send-btn.ready:hover {
    background: #6366f1;
    transform: scale(1.1);
  }
  .ds-send-btn.ready:active {
    transform: scale(0.94);
  }
  .ds-send-btn.disabled {
    background: #c7d2fe;
    color: #ffffff;
    cursor: not-allowed;
    opacity: 0.8;
  }
  .dark-theme .ds-send-btn.disabled,
  body:not(.light-theme) .ds-send-btn.disabled {
    background: rgba(129, 140, 248, 0.25);
    color: rgba(255, 255, 255, 0.4);
  }

  /* ── Message Bubble ── */
  .ds-msg-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 16px;
    padding: 0 16px;
    box-sizing: border-box;
  }
  .ds-bubble {
    max-width: 86%;
    padding: 12px 18px;
    font-size: 0.96rem;
    line-height: 1.6;
    border-radius: 20px;
    word-break: break-word;
  }
  .ds-bubble-user {
    align-self: flex-end;
    background: #4f46e5;
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
  }
  .ds-bubble-bot {
    align-self: flex-start;
    background: var(--bg-card, #ffffff);
    color: var(--text-primary, #0f172a);
    border: 1px solid var(--border-color, #e2e8f0);
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  }

  /* ── Mobile Viewport ── */
  @media (max-width: 768px) {
    .ds-root {
      height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
      min-height: 0;
      border-radius: 0;
      border: none;
    }
    .ds-top-bar {
      padding: 12px 16px 4px 16px;
    }
    .ds-welcome-center {
      padding: 0 16px 20px 16px;
      max-width: 100%;
    }
    .ds-title-text {
      font-size: 1.3rem;
    }
    .ds-mode-pill {
      padding: 6px 14px;
      font-size: 0.84rem;
    }
    .ds-input-card {
      border-radius: 22px;
      padding: 12px 14px 10px 14px;
    }
    .ds-textarea {
      font-size: 0.98rem;
    }
    .ds-dock {
      padding: 8px 12px calc(env(safe-area-inset-bottom, 0px) + 8px) 12px !important;
    }
  }
`;

/* ── DeepSeek Blue Whale / Swirl Icon SVG (Exact Reference Match) ── */
function DeepSeekWhaleLogo({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path
        d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4Z"
        fill="url(#ds_grad)"
      />
      <path
        d="M14 26C15.5 20 21 16 28 17C33 17.7 36 21 35 25C34 29 29 32 24 32C19 32 15 29 14 26Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M28 17C29 13 32 10 36 10C34.5 13 36 15 38 16C35 17 31 17 28 17Z"
        fill="white"
        fillOpacity="0.95"
      />
      <circle cx="21" cy="24" r="2" fill="#2563eb" />
      <defs>
        <linearGradient id="ds_grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Modes Config (Exact Match to Screenshot) ── */
const MODES = [
  { id: 'instant', label: 'Instant', icon: Zap },
  { id: 'expert',  label: 'Expert',  icon: Gem },
  { id: 'vision',  label: 'Vision',  icon: Globe },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', onMenuToggle }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('instant');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // DeepThink & Search inner chips toggle
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(true);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── Dynamic Auto-Expanding Textarea Height ── */
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = window.innerWidth <= 768 ? 36 : 38;
    const maxH = window.innerWidth <= 768 ? 200 : 260;
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

    try {
      const res = await generateChatbotResponse(query, [...messages, userMsg], language);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ Could not reach AI service. Please verify network and try again.',
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

  /* ── New Chat Reset ── */
  const handleNewChat = () => {
    setMessages([]);
    setAttachedFile(null);
    setInputText('');
  };

  const canSend = (inputText.trim().length > 0 || attachedFile) && !isTyping;

  /* ── Floating Input Box Component (Exact DeepSeek Layout) ── */
  const RenderInputBox = () => (
    <div className="ds-input-card">
      {/* File badge if attached */}
      {attachedFile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          marginBottom: '6px',
          background: '#eef2ff',
          border: '1px solid #c7d2fe',
          borderRadius: '8px',
          fontSize: '0.78rem',
          color: '#3b82f6',
          fontWeight: 600
        }}>
          <FileText size={13} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {attachedFile.name}
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: 0 }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Auto-growing Textarea */}
      <textarea
        ref={textareaRef}
        className="ds-textarea"
        value={inputText}
        onInput={autoResize}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => {
          const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          if (e.key === 'Enter' && !e.shiftKey && !isTouch) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Message DeepSeek"
        rows={1}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {/* Bottom Row Inside Input Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '2px',
        gap: '6px'
      }}>
        {/* Left Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* DeepThink Chip */}
          <button
            type="button"
            onClick={() => setDeepThinkActive(!deepThinkActive)}
            className={`ds-chip-btn ${deepThinkActive ? 'active' : ''}`}
          >
            <Atom size={14} />
            <span>DeepThink</span>
          </button>

          {/* Search Chip */}
          <button
            type="button"
            onClick={() => setSearchActive(!searchActive)}
            className={`ds-chip-btn ${searchActive ? 'active' : ''}`}
          >
            <Globe size={14} />
            <span>Search</span>
          </button>
        </div>

        {/* Right Controls: Paperclip & Send Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            title="Attach file"
            style={{
              background: 'none',
              border: 'none',
              color: attachedFile ? '#3b82f6' : 'var(--text-muted, #64748b)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}
          >
            <Paperclip size={19} />
          </button>

          {/* Lavender Round Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!canSend}
            className={`ds-send-btn ${canSend ? 'ready' : 'disabled'}`}
            title="Send prompt"
            aria-label="Send prompt"
          >
            <ArrowUp size={19} strokeWidth={2.8} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{DEEPSEEK_CSS}</style>
      <div className="ds-root">
        {/* Top Minimal Bar (Exact Match: Hamburger left, PlusCircle right) */}
        <div className="ds-top-bar">
          <button
            className="ds-icon-btn"
            title="Menu"
            onClick={() => {
              if (onMenuToggle) onMenuToggle();
              else {
                const menuBtn = document.querySelector('.hamburger-btn');
                if (menuBtn) menuBtn.click();
              }
            }}
          >
            <Menu size={24} strokeWidth={2} />
          </button>

          <button
            className="ds-icon-btn"
            title="New Chat"
            onClick={handleNewChat}
          >
            <PlusCircle size={24} strokeWidth={1.8} />
          </button>
        </div>

        {/* Main Content: Welcome View or Messages Area */}
        <div className="ds-scroll-area">
          {!hasMessages ? (
            /* ── Welcome Screen (Exact Match to Reference Screenshot) ── */
            <div className="ds-welcome-center">
              {/* Center Logo + Title */}
              <div className="ds-title-row">
                <DeepSeekWhaleLogo size={36} />
                <h1 className="ds-title-text">
                  Start chatting with {MODES.find(m => m.id === activeMode)?.label || 'Instant'}
                </h1>
              </div>

              {/* 3 Mode Pills Row */}
              <div className="ds-mode-row">
                {MODES.map(m => {
                  const Icon = m.icon;
                  const isActive = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveMode(m.id)}
                      className={`ds-mode-pill ${isActive ? 'active' : 'inactive'}`}
                    >
                      <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Floating Input Card */}
              <RenderInputBox />
            </div>
          ) : (
            /* ── Active Conversation Messages Stream ── */
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
              {messages.map(msg => (
                <div key={msg.id} className="ds-msg-row">
                  <div className={`ds-bubble ${msg.sender === 'user' ? 'ds-bubble-user' : 'ds-bubble-bot'}`}>
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
                          onClick={() => handleCopy(msg.text, msg.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted, #94a3b8)',
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {copiedId === msg.id ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted, #94a3b8)',
                    marginTop: '3px',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 4px'
                  }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="ds-msg-row">
                  <div className="ds-bubble ds-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#3b82f6', fontWeight: 600 }}>DeepSeek is thinking...</span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Dock (Shown only when in active conversation) */}
        {hasMessages && (
          <div className="ds-dock" style={{
            padding: '8px 16px 14px 16px',
            background: 'var(--bg-primary, #ffffff)',
            borderTop: '1px solid var(--border-color, #e2e8f0)',
            flexShrink: 0
          }}>
            <RenderInputBox />
          </div>
        )}
      </div>
    </>
  );
}
