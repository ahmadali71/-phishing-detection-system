import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Copy, Check, Terminal, Zap, Shield, Search,
  RefreshCw, ArrowUp, X, Paperclip, FileText, Sparkles,
  Bot, Globe, Cpu, ChevronDown
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   DEEPSEEK / MODERN LLM AESTHETIC CSS
───────────────────────────────────────────────────────────────── */
const CHAT_CSS = `
  @keyframes apds-dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes apds-fade-in-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes apds-pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.3); }
    50%      { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
  }

  .chat-view-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 160px);
    max-height: calc(100vh - 140px);
    background: var(--bg-primary);
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--border-color);
  }

  /* ── Header ── */
  .chat-top-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
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
    padding: 16px;
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
    margin-bottom: 14px;
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
    max-width: 680px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .chat-input-container:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), 0 12px 36px rgba(0, 0, 0, 0.12);
  }

  /* ── Auto-Expanding Textarea ── */
  .chat-auto-textarea {
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
    max-height: 240px;
    padding: 4px 2px 8px 2px;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    transition: height 0.12s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .chat-auto-textarea::placeholder {
    color: var(--text-muted);
    font-size: 0.95rem;
  }
  .chat-auto-textarea::-webkit-scrollbar {
    width: 4px;
  }
  .chat-auto-textarea::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 2px;
  }

  /* ── DeepSeek Style Mode Pills ── */
  .mode-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .mode-pill-btn.active {
    background: #e0e7ff;
    color: #4338ca !important;
    border: 1.5px solid #c7d2fe;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
  }
  .dark-theme .mode-pill-btn.active,
  body:not(.light-theme) .mode-pill-btn.active {
    background: rgba(99, 102, 241, 0.25);
    color: #a5b4fc !important;
    border: 1.5px solid rgba(99, 102, 241, 0.4);
  }
  .mode-pill-btn.inactive {
    background: var(--bg-card);
    color: var(--text-secondary);
    border: 1.5px solid var(--border-color);
  }
  .mode-pill-btn.inactive:hover {
    border-color: #a5b4fc;
    color: #4f46e5;
  }

  /* ── Inner Action Chips (DeepThink / Search) ── */
  .inner-action-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
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
    border-color: #c7d2fe;
  }
  .dark-theme .inner-action-chip.active-chip,
  body:not(.light-theme) .inner-action-chip.active-chip {
    background: rgba(99, 102, 241, 0.25);
    color: #a5b4fc;
    border-color: rgba(99, 102, 241, 0.4);
  }
  .inner-action-chip:hover {
    border-color: #6366f1;
    color: #6366f1;
  }

  /* ── Circular Send Button ── */
  .send-round-btn {
    width: 34px;
    height: 34px;
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
    background: #4f46e5;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
    transform: scale(1.04);
  }
  .send-round-btn.active:hover {
    background: #4338ca;
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

  /* ── Mobile Layout Adjustments ── */
  @media (max-width: 768px) {
    .chat-view-root {
      height: calc(100dvh - 145px);
      min-height: 0;
      max-height: none;
      border-radius: 16px;
      border: 1px solid var(--border-color);
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
      font-size: 0.95rem;
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
          const lang = lines[0].trim() || 'code';
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
function ChatLogo({ size = 52 }) {
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
  { id: 'instant', label: 'Instant', icon: Zap },
  { id: 'expert',  label: 'Expert',  icon: Shield },
  { id: 'vision',  label: 'Scan',    icon: Search },
];

/* ── QUICK SUGGESTIONS ── */
const QUICK_PROMPTS = [
  'Scan paypal-secure-login.com',
  'What is typosquatting?',
  'Show Python ML code',
  'How does APDS detect phishing?'
];

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

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── Dynamic Auto-Expanding Logic ── */
  const autoResizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = window.innerWidth <= 768 ? 36 : 40;
    const maxH = window.innerWidth <= 768 ? 200 : 240;
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
        text: '⚠️ **Connection Notice**\n\nCould not process the prompt. Please try again.',
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

  /* ── Reset Chat ── */
  const handleResetChat = () => {
    setMessages([]);
    setAttachedFile(null);
    setInputText('');
  };

  const canSend = (inputText.trim().length > 0 || attachedFile) && !isTyping;

  /* ── Floating Input Box Component ── */
  const RenderInputBox = ({ isCentered = false }) => (
    <div className="chat-input-container" style={{ margin: isCentered ? '16px auto 0' : '0 auto' }}>
      {/* Attached file chip */}
      {attachedFile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          marginBottom: '6px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '8px',
          fontSize: '0.78rem',
          color: '#4f46e5',
          fontWeight: 600
        }}>
          <FileText size={13} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {attachedFile.name}
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f46e5', padding: 0 }}
          >
            <X size={13} />
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
        placeholder={activeMode === 'vision' ? 'Paste URL link or email text to scan...' : 'Message APDS AI...'}
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
        paddingTop: '4px',
        gap: '6px'
      }}>
        {/* Left Action Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* DeepThink / Expert Chip */}
          <button
            type="button"
            onClick={() => setDeepThinkActive(!deepThinkActive)}
            className={`inner-action-chip ${deepThinkActive ? 'active-chip' : ''}`}
          >
            <Cpu size={13} />
            <span>DeepThink</span>
          </button>

          {/* Search / Scan Chip */}
          <button
            type="button"
            onClick={() => setSearchActive(!searchActive)}
            className={`inner-action-chip ${searchActive ? 'active-chip' : ''}`}
          >
            <Globe size={13} />
            <span>Search</span>
          </button>
        </div>

        {/* Right Controls: Paperclip & Send */}
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

          {/* Round Send Button */}
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
      {/* Top Logo */}
      <ChatLogo size={56} />

      {/* Main Title */}
      <h2 style={{
        fontSize: 'clamp(1.3rem, 5vw, 1.65rem)',
        fontWeight: '800',
        color: 'var(--text-primary)',
        margin: '0 0 2px 0',
        textAlign: 'center',
        letterSpacing: '-0.02em',
        fontFamily: 'var(--font-display)'
      }}>
        Start chatting with{' '}
        <span style={{ color: '#4f46e5' }}>
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
      <div style={{ width: '100%', maxWidth: '680px' }}>
        <RenderInputBox isCentered={true} />
      </div>

      {/* Quick Prompt Chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        justifyContent: 'center',
        maxWidth: '560px',
        marginTop: '12px'
      }}>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#4f46e5'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {prompt}
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
          {/* Bot avatar & title */}
          {msg.sender === 'bot' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Sparkles size={11} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>APDS AI</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{msg.time}</span>
            </div>
          )}

          {/* Bubble content */}
          <div style={{
            maxWidth: msg.sender === 'user' ? '82%' : '92%',
            padding: msg.sender === 'user' ? '10px 15px' : '12px 16px',
            borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
            background: msg.sender === 'user'
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
              : 'var(--bg-card)',
            color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
            fontSize: '0.92rem',
            lineHeight: '1.55',
            boxShadow: msg.sender === 'user'
              ? '0 4px 14px rgba(79, 70, 229, 0.25)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
            border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
          }}>
            {msg.fileInfo && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginBottom: '5px',
                fontSize: '0.76rem',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 700
              }}>
                <FileText size={13} /> {msg.fileInfo}
              </div>
            )}
            {msg.sender === 'bot'
              ? <MarkdownMessage text={msg.text} msgId={msg.id} onCopy={handleCopy} copiedId={copiedId} />
              : msg.text
            }
          </div>

          {/* User timestamp */}
          {msg.sender === 'user' && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', paddingRight: '4px' }}>
              {msg.time}
            </span>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="chat-msg-item" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={11} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>APDS AI</span>
          </div>
          <div style={{
            padding: '10px 16px',
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
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={13} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              APDS AI
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {hasMessages && (
              <button
                onClick={handleResetChat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <RefreshCw size={11} /> New Chat
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {hasMessages ? <ActiveChatView /> : <WelcomeView />}

        {/* Bottom Docked Input Bar (Only when in active conversation) */}
        {hasMessages && (
          <div className="chat-dock-wrapper" style={{
            padding: '8px 14px 12px',
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
