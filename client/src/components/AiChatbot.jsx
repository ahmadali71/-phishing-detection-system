import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Copy, Check, Terminal, Zap, Shield, Search,
  RefreshCw, ArrowUp, X, Paperclip, FileText, AlertTriangle,
  Maximize2, Minimize2, Sparkles, Bot, CornerDownLeft
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   DYNAMIC CSS STYLES FOR DESKTOP & MOBILE
───────────────────────────────────────────────────────────────── */
const APDS_CHAT_STYLES = `
  @keyframes apds-bounce {
    0%, 80%, 100% { transform: scale(0.65); opacity: 0.35; }
    40%           { transform: scale(1.05); opacity: 1;    }
  }
  @keyframes apds-fadein {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes apds-pulse-ring {
    0%   { transform: scale(0.95); opacity: 0.8; }
    50%  { transform: scale(1.15); opacity: 0.3; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }

  .apds-chat-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    max-height: 840px;
    min-height: 480px;
    background: var(--bg-primary);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    position: relative;
  }

  .apds-chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    z-index: 10;
  }

  .apds-chat-scroll-area {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    padding: 14px 14px 6px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  .apds-msg-row {
    animation: apds-fadein 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* ── Bottom Input Dock ── */
  .apds-input-dock {
    flex-shrink: 0;
    margin-top: auto;
    padding: 8px 14px 12px;
    background: var(--bg-primary);
    border-top: 1px solid var(--border-color);
    z-index: 30;
    box-sizing: border-box;
    width: 100%;
  }

  /* ── Auto-Expanding Input Card ── */
  .apds-input-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 18px;
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
    position: relative;
    max-width: 760px;
    margin: 0 auto;
  }
  .apds-input-card:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18), 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  /* Textarea auto-expanding with smooth scaling */
  .apds-dynamic-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    padding: 12px 14px 4px;
    font-size: 0.95rem;
    line-height: 1.5;
    background: transparent;
    color: var(--text-primary);
    font-family: inherit;
    min-height: 42px;
    max-height: 260px;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    transition: height 0.12s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-dynamic-textarea.expanded {
    max-height: 380px;
    min-height: 160px;
  }
  .apds-dynamic-textarea::placeholder {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  /* Scrollbar styling for textarea */
  .apds-dynamic-textarea::-webkit-scrollbar {
    width: 5px;
  }
  .apds-dynamic-textarea::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 3px;
  }

  /* Mode selection pills */
  .apds-mode-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .apds-mode-pill.active {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #ffffff !important;
    border: 1.5px solid transparent;
    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.35);
  }
  .apds-mode-pill.inactive {
    background: var(--bg-card);
    color: var(--text-secondary);
    border: 1.5px solid var(--border-color);
  }
  .apds-mode-pill.inactive:hover {
    border-color: #6366f1;
    color: #6366f1;
    background: rgba(99, 102, 241, 0.05);
  }

  /* Suggestion button chips */
  .apds-suggestion-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 12px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
    text-align: left;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-suggestion-btn:hover {
    border-color: #6366f1;
    color: #6366f1;
    background: rgba(99, 102, 241, 0.06);
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.12);
  }
  .apds-suggestion-btn:active {
    transform: scale(0.98);
  }

  /* File attachment chip */
  .apds-file-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    margin: 6px 10px 2px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 8px;
    font-size: 0.78rem;
    color: #6366f1;
    font-weight: 700;
    max-width: calc(100% - 20px);
  }

  /* Send circle button */
  .apds-send-circle-btn {
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
  .apds-send-circle-btn.ready {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
  }
  .apds-send-circle-btn.ready:hover {
    transform: scale(1.08);
  }
  .apds-send-circle-btn.ready:active {
    transform: scale(0.92);
  }
  .apds-send-circle-btn.disabled {
    background: var(--bg-input);
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.65;
  }

  /* ── MOBILE VIEWPORT OPTIMIZATIONS ── */
  @media (max-width: 768px) {
    .apds-chat-container {
      height: calc(100dvh - 165px);
      max-height: none;
      min-height: 340px;
      border-radius: 14px;
      margin: 0;
    }
    .apds-chat-header {
      padding: 8px 12px;
    }
    .apds-chat-scroll-area {
      padding: 10px 10px 4px;
      gap: 8px;
    }
    .apds-dynamic-textarea {
      font-size: 0.92rem;
      padding: 10px 12px 4px;
      min-height: 40px;
      max-height: 200px;
    }
    .apds-input-dock {
      padding: 6px 8px calc(env(safe-area-inset-bottom, 0px) + 6px) 8px !important;
    }
    .hide-mobile-text {
      display: none !important;
    }
  }
`;

/* ─────────────────────────────────────────────────────────────────
   TYPING DOTS
───────────────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 2px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#6366f1', display: 'inline-block',
          animation: `apds-bounce 1.1s ease-in-out ${i * 0.18}s infinite`
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MARKDOWN RENDERER (code blocks + bold + linebreaks)
───────────────────────────────────────────────────────────────── */
function MsgContent({ text, msgId, onCopy, copiedId }) {
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
              margin: '8px 0', borderRadius: '10px', overflow: 'hidden',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 12px', background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.73rem', color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'monospace', fontWeight: 700 }}>
                  <Terminal size={13} color="#6366f1" /> {lang}
                </span>
                <button
                  onClick={() => onCopy(code, key)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.72rem',
                    display: 'flex', alignItems: 'center', gap: '3px',
                    fontWeight: 600
                  }}
                >
                  {copiedId === key ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <pre style={{
                margin: 0, padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8rem', color: '#818cf8', overflowX: 'auto', lineHeight: 1.5
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
                ? <strong key={si} style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{s.slice(2, -2)}</strong>
                : s
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATED LOGO
───────────────────────────────────────────────────────────────── */
function Logo({ size = 52 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.25)',
        animation: 'apds-pulse-ring 2.4s infinite ease-in-out'
      }} />
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #3730a3 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 2,
        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
      }}>
        <Shield size={size * 0.46} color="white" strokeWidth={2.2} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MODES & PRESETS
───────────────────────────────────────────────────────────────── */
const MODES = [
  { id: 'instant', label: 'Instant', icon: Zap },
  { id: 'expert',  label: 'Expert', icon: Shield },
  { id: 'scan',    label: 'Scan', icon: Search },
];

const SUGGESTIONS = [
  { title: 'Test Phishing Link', query: 'Scan paypal-secure-login.com', icon: '🔴' },
  { title: 'Explain Typosquatting', query: 'What is typosquatting and Levenshtein distance?', icon: '🔤' },
  { title: 'Python ML Code', query: 'Show Python ML code for URL feature extraction', icon: '💻' },
  { title: 'Academic Project Info', query: 'Who are the project authors and supervisor of APDS?', icon: '🎓' },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN CHATBOT COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English' }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('instant');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isExpandedInput, setIsExpandedInput] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── Dynamic Auto-Expanding Logic ── */
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const minH = isMobile ? 40 : 44;
    const maxH = isExpandedInput ? 380 : (isMobile ? 200 : 260);
    const targetH = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${targetH}px`;
  }, [isExpandedInput]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText, isExpandedInput, adjustTextareaHeight]);

  /* ── Send Message Handler ── */
  const handleSend = async (textOverride) => {
    const baseText = typeof textOverride === 'string' ? textOverride.trim() : inputText.trim();
    const fileNote = attachedFile
      ? `\n\n[Attached file: ${attachedFile.name}]\n${attachedFile.content}`
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
    setIsExpandedInput(false);

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
        text: '⚠️ **Service Notice**\n\nCould not process the request. Please verify connection and retry.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  /* ── File Attachment Handler ── */
  const handleFileChange = (e) => {
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
  const handleNewChat = () => {
    setMessages([]);
    setAttachedFile(null);
    setInputText('');
    setIsExpandedInput(false);
  };

  // Helper metrics for dynamic input indicator
  const lineCount = inputText ? (inputText.match(/\n/g) || []).length + 1 : 0;
  const isLargePrompt = inputText.length > 80 || lineCount > 2;

  /* ── Welcome Screen (Empty State) ── */
  const WelcomeScreen = () => (
    <div className="apds-chat-scroll-area" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 14px',
      gap: '12px',
      maxWidth: '680px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Logo size={48} />

      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.15rem, 4vw, 1.5rem)',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 4px 0',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em'
        }}>
          Start chatting with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            APDS AI
          </span>
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
          Cybersecurity Assistant • 94.6% ML Accuracy
        </p>
      </div>

      {/* Mode Selection Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {MODES.map(m => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`apds-mode-pill ${active ? 'active' : 'inactive'}`}
            >
              <Icon size={13} strokeWidth={active ? 2.5 : 2} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Preset Suggestion Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '6px',
        width: '100%',
        marginTop: '4px'
      }}>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            className="apds-suggestion-btn"
            onClick={() => handleSend(s.query)}
          >
            <span style={{ fontSize: '1rem' }}>{s.icon}</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</div>
              <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.query}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Chat Messages View ── */
  const ChatView = () => (
    <div className="apds-chat-scroll-area">
      {messages.map(msg => (
        <div
          key={msg.id}
          className="apds-msg-row"
          style={{
            alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
          }}
        >
          {/* Bot avatar & model tag */}
          {msg.sender === 'bot' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
              }}>
                <Shield size={12} color="white" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>APDS Defense AI</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{msg.time}</span>
            </div>
          )}

          {/* Bubble body */}
          <div style={{
            maxWidth: msg.sender === 'user' ? '82%' : '92%',
            padding: msg.sender === 'user' ? '10px 14px' : '12px 16px',
            borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
            background: msg.sender === 'user'
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
              : 'var(--bg-card)',
            color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
            fontSize: '0.9rem',
            lineHeight: '1.55',
            boxShadow: msg.sender === 'user'
              ? '0 4px 14px rgba(79, 70, 229, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
          }}>
            {msg.fileInfo && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                marginBottom: '5px', fontSize: '0.76rem',
                color: 'rgba(255, 255, 255, 0.85)', fontWeight: 700
              }}>
                <FileText size={13} /> {msg.fileInfo}
              </div>
            )}
            {msg.sender === 'bot'
              ? <MsgContent text={msg.text} msgId={msg.id} onCopy={handleCopy} copiedId={copiedId} />
              : msg.text
            }
          </div>

          {/* User message time */}
          {msg.sender === 'user' && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', paddingRight: '4px' }}>
              {msg.time}
            </span>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="apds-msg-row" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={12} color="white" />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>APDS Defense AI</span>
          </div>
          <div style={{
            padding: '10px 16px',
            borderRadius: '4px 18px 18px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}>
            <TypingDots />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  /* ── Auto-Expanding Bottom Input Dock ── */
  const InputPanel = () => {
    const canSend = (inputText.trim().length > 0 || attachedFile) && !isTyping;

    return (
      <div className="apds-input-dock">
        {/* Chat view mini controls */}
        {hasMessages && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
            gap: '6px',
            maxWidth: '760px',
            margin: '0 auto 6px'
          }}>
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '1px' }}>
              {MODES.map(m => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`apds-mode-pill ${active ? 'active' : 'inactive'}`}
                    style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                  >
                    <Icon size={11} strokeWidth={active ? 2.5 : 2} />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNewChat}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1.5px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                flexShrink: 0
              }}
              title="Reset conversation"
            >
              <RefreshCw size={11} /> New Chat
            </button>
          </div>
        )}

        {/* Dynamic Auto-Expanding Card */}
        <div className="apds-input-card">
          {/* Attached File Preview Chip */}
          {attachedFile && (
            <div className="apds-file-chip">
              <FileText size={13} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'flex', padding: 0 }}
                title="Remove file"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Textarea with Dynamic Auto-Growing Height */}
          <textarea
            ref={textareaRef}
            className={`apds-dynamic-textarea ${isExpandedInput ? 'expanded' : ''}`}
            value={inputText}
            onInput={adjustTextareaHeight}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
              if (e.key === 'Enter' && !e.shiftKey && !isTouchDevice) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              mode === 'scan'
                ? 'Paste URL or email text to scan...'
                : 'Message APDS AI...'
            }
            rows={1}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          {/* Action Bar Bottom Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 10px 8px',
            gap: '4px'
          }}>
            {/* Left Controls: File Attachment & Quick Mode Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach log/email/script file (.txt, .eml, .py, .json)"
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  border: 'none', background: 'none',
                  color: attachedFile ? '#6366f1' : 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'color 0.15s'
                }}
              >
                <Paperclip size={16} />
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'instant' ? 'expert' : 'instant')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '3px',
                  padding: '3px 8px', borderRadius: '999px', border: 'none',
                  background: mode === 'instant' ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-input)',
                  color: mode === 'instant' ? '#6366f1' : 'var(--text-muted)',
                  fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <Zap size={11} strokeWidth={mode === 'instant' ? 2.5 : 2} />
                Instant
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'scan' ? 'instant' : 'scan')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '3px',
                  padding: '3px 8px', borderRadius: '999px', border: 'none',
                  background: mode === 'scan' ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-input)',
                  color: mode === 'scan' ? '#6366f1' : 'var(--text-muted)',
                  fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <Search size={11} strokeWidth={mode === 'scan' ? 2.5 : 2} />
                Scan
              </button>
            </div>

            {/* Right Controls: Expand/Collapse, Line/Char Badge, Clear & Send Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Dynamic Size Indicator for Large Prompts */}
              {isLargePrompt && (
                <span style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  padding: '2px 5px',
                  borderRadius: '5px',
                  background: 'var(--bg-input)'
                }}>
                  {lineCount > 1 ? `${lineCount}L • ` : ''}{inputText.length}c
                </span>
              )}

              {/* Toggle Expand / Maximize Box */}
              {isLargePrompt && (
                <button
                  type="button"
                  onClick={() => setIsExpandedInput(v => !v)}
                  title={isExpandedInput ? 'Collapse input' : 'Expand input to full view'}
                  style={{
                    width: '26px', height: '26px', borderRadius: '6px',
                    border: 'none', background: 'var(--bg-input)',
                    color: isExpandedInput ? '#6366f1' : 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isExpandedInput ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>
              )}

              {/* Clear button */}
              {(inputText.length > 0 || attachedFile) && (
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setAttachedFile(null);
                    setIsExpandedInput(false);
                    if (textareaRef.current) textareaRef.current.style.height = 'auto';
                  }}
                  title="Clear input"
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)', color: 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={12} />
                </button>
              )}

              {/* Send circle button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!canSend}
                className={`apds-send-circle-btn ${canSend ? 'ready' : 'disabled'}`}
                title="Send query"
                aria-label="Send message"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Academic Project Footnote */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.66rem',
          color: 'var(--text-muted)',
          margin: '4px 0 0',
          lineHeight: 1.2
        }}>
          APDS Cyber AI • 94.6% Accuracy • Univ of Sargodha
        </p>
      </div>
    );
  };

  return (
    <>
      <style>{APDS_CHAT_STYLES}</style>
      <div className="apds-chat-container">
        {/* Top Header Identity Bar */}
        <div className="apds-chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontSize: '0.8rem',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.35)'
            }}>
              AI
            </div>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                APDS Cyber Defense Assistant
              </div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }} />
                Neural ML Pipeline Online
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button
              onClick={() => handleSend('Scan paypal-secure-login.com')}
              className="apds-mode-pill inactive"
              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
              title="Test real-time scan"
            >
              <Zap size={11} color="#f59e0b" />
              <span className="hide-mobile-text">Test Scan</span>
            </button>
            {hasMessages && (
              <button
                onClick={handleNewChat}
                className="apds-mode-pill inactive"
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                title="Start new conversation"
              >
                <RefreshCw size={11} />
              </button>
            )}
          </div>
        </div>

        {/* Content: Welcome Screen or Active Chat */}
        {hasMessages ? <ChatView /> : <WelcomeScreen />}

        {/* Bottom Input Dock */}
        <InputPanel />
      </div>
    </>
  );
}
