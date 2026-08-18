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
    from { opacity: 0; transform: translateY(8px); }
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
    height: calc(100vh - 120px);
    min-height: 540px;
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
    padding: 12px 18px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    z-index: 10;
  }

  .apds-chat-messages-area {
    flex: 1 1 0;
    overflow-y: auto;
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  .apds-msg-row {
    animation: apds-fadein 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* ── Auto-Expanding Input Card ── */
  .apds-input-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
    transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), 
                box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                height 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: relative;
  }
  .apds-input-card:focus-within {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18), 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  /* Textarea auto-expanding with scroll when full */
  .apds-dynamic-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    padding: 14px 16px 8px;
    font-size: 0.96rem;
    line-height: 1.55;
    background: transparent;
    color: var(--text-primary);
    font-family: inherit;
    min-height: 48px;
    max-height: 280px;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    transition: height 0.15s ease-out;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-dynamic-textarea.expanded {
    max-height: 420px;
    min-height: 180px;
  }
  .apds-dynamic-textarea::placeholder {
    color: var(--text-muted);
    font-size: 0.92rem;
  }

  /* Scrollbar styling for textarea */
  .apds-dynamic-textarea::-webkit-scrollbar {
    width: 6px;
  }
  .apds-dynamic-textarea::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 3px;
  }

  /* Mode selection tabs */
  .apds-mode-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .apds-mode-pill.active {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #ffffff !important;
    border: 1.5px solid transparent;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    transform: scale(1.02);
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
    gap: 6px;
    padding: 8px 14px;
    border-radius: 12px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 0.82rem;
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
    background: rgba(99, 102, 241, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
  }
  .apds-suggestion-btn:active {
    transform: scale(0.97);
  }

  /* File attachment badge */
  .apds-file-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    margin: 8px 12px 2px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    font-size: 0.8rem;
    color: #6366f1;
    font-weight: 700;
    max-width: calc(100% - 24px);
  }

  /* Send button */
  .apds-send-circle-btn {
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
  .apds-send-circle-btn.ready {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
    transform: scale(1.04);
  }
  .apds-send-circle-btn.ready:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 18px rgba(99, 102, 241, 0.6);
  }
  .apds-send-circle-btn.ready:active {
    transform: scale(0.94);
  }
  .apds-send-circle-btn.disabled {
    background: var(--bg-input);
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.7;
  }

  /* Mobile specific fine-tuning */
  @media (max-width: 768px) {
    .apds-chat-container {
      height: calc(100vh - 84px);
      min-height: 0;
      border-radius: 16px;
      margin: 0 -4px;
    }
    .apds-chat-header {
      padding: 10px 14px;
    }
    .apds-chat-messages-area {
      padding: 12px 10px 6px;
      gap: 10px;
    }
    .apds-dynamic-textarea {
      font-size: 0.94rem;
      padding: 12px 14px 6px;
      min-height: 44px;
      max-height: 240px;
    }
    .apds-input-dock {
      padding: 8px 10px calc(env(safe-area-inset-bottom, 0px) + 8px) 10px !important;
    }
  }
`;

/* ─────────────────────────────────────────────────────────────────
   TYPING DOTS
───────────────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 2px' }}>
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
              margin: '10px 0', borderRadius: '12px', overflow: 'hidden',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 14px', background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.74rem', color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontWeight: 700 }}>
                  <Terminal size={14} color="#6366f1" /> {lang}
                </span>
                <button
                  onClick={() => onCopy(code, key)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.72rem',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontWeight: 600
                  }}
                >
                  {copiedId === key ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy Code</>}
                </button>
              </div>
              <pre style={{
                margin: 0, padding: '12px 14px', fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem', color: '#818cf8', overflowX: 'auto', lineHeight: 1.55
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
function Logo({ size = 56 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)'
      }}>
        <Shield size={size * 0.48} color="white" strokeWidth={2.2} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MODES & PRESETS
───────────────────────────────────────────────────────────────── */
const MODES = [
  { id: 'instant', label: 'Instant', icon: Zap, desc: 'Fast heuristic response' },
  { id: 'expert',  label: 'Expert AI', icon: Shield, desc: 'Deep cybersecurity reasoning' },
  { id: 'scan',    label: 'Live Scan', icon: Search, desc: 'Direct URL/Email forensic audit' },
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
    // Reset to single-line calculation
    el.style.height = 'auto';
    const isMobile = window.innerWidth <= 768;
    const minH = isMobile ? 44 : 48;
    const maxH = isExpandedInput ? 420 : (isMobile ? 240 : 280);
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
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 16px 20px',
      gap: '16px',
      maxWidth: '680px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Logo size={60} />

      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 4.5vw, 1.65rem)',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
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
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          Autonomous Cyber Defense Assistant • 94.6% ML Accuracy
        </p>
      </div>

      {/* Mode Selection Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {MODES.map(m => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`apds-mode-pill ${active ? 'active' : 'inactive'}`}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Preset Suggestion Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '8px',
        width: '100%',
        marginTop: '6px'
      }}>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            className="apds-suggestion-btn"
            onClick={() => handleSend(s.query)}
          >
            <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.query}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Chat Messages View ── */
  const ChatView = () => (
    <div className="apds-chat-messages-area">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
              }}>
                <Shield size={13} color="white" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>APDS Defense AI</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.time}</span>
            </div>
          )}

          {/* Bubble body */}
          <div style={{
            maxWidth: msg.sender === 'user' ? '82%' : '92%',
            padding: msg.sender === 'user' ? '12px 16px' : '14px 18px',
            borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
            background: msg.sender === 'user'
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
              : 'var(--bg-card)',
            color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
            fontSize: '0.92rem',
            lineHeight: '1.6',
            boxShadow: msg.sender === 'user'
              ? '0 4px 16px rgba(79, 70, 229, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
          }}>
            {msg.fileInfo && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginBottom: '6px', fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.85)', fontWeight: 700
              }}>
                <FileText size={14} /> {msg.fileInfo}
              </div>
            )}
            {msg.sender === 'bot'
              ? <MsgContent text={msg.text} msgId={msg.id} onCopy={handleCopy} copiedId={copiedId} />
              : msg.text
            }
          </div>

          {/* User message time */}
          {msg.sender === 'user' && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', paddingRight: '4px' }}>
              {msg.time}
            </span>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="apds-msg-row" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={13} color="white" />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>APDS Defense AI</span>
          </div>
          <div style={{
            padding: '12px 18px',
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

  /* ── Auto-Expanding Bottom Input Panel ── */
  const InputPanel = () => {
    const canSend = (inputText.trim().length > 0 || attachedFile) && !isTyping;

    return (
      <div
        className="apds-input-dock"
        style={{
          padding: '8px 16px 14px',
          maxWidth: '740px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          flexShrink: 0
        }}
      >
        {/* Chat view header controls (mini mode tabs + new chat) */}
        {hasMessages && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {MODES.map(m => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`apds-mode-pill ${active ? 'active' : 'inactive'}`}
                    style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                  >
                    <Icon size={12} strokeWidth={active ? 2.5 : 2} />
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
                padding: '4px 12px',
                borderRadius: '999px',
                border: '1.5px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                flexShrink: 0
              }}
              title="Reset conversation"
            >
              <RefreshCw size={12} /> New Chat
            </button>
          </div>
        )}

        {/* Dynamic Auto-Expanding Card */}
        <div className="apds-input-card">
          {/* Attached File Preview Chip */}
          {attachedFile && (
            <div className="apds-file-chip">
              <FileText size={14} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'flex', padding: 0 }}
                title="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Textarea with Dynamic Auto-Growing Height */}
          <textarea
            ref={textareaRef}
            className={`apds-dynamic-textarea ${isExpandedInput ? 'expanded' : ''}`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              // Desktop: Enter sends, Shift+Enter new line
              // Mobile: Enter inserts new line (doesn't trigger send)
              const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
              if (e.key === 'Enter' && !e.shiftKey && !isTouchDevice) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              mode === 'scan'
                ? 'Paste URL or email text for live forensic scan...'
                : 'Message APDS AI... (Shift+Enter for newline)'
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
            padding: '6px 12px 10px',
            gap: '6px'
          }}>
            {/* Left Controls: File Attachment & Quick Mode Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  width: '32px', height: '32px', borderRadius: '50%',
                  border: 'none', background: 'none',
                  color: attachedFile ? '#6366f1' : 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'color 0.15s'
                }}
              >
                <Paperclip size={17} />
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'instant' ? 'expert' : 'instant')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '999px', border: 'none',
                  background: mode === 'instant' ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-input)',
                  color: mode === 'instant' ? '#6366f1' : 'var(--text-muted)',
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <Zap size={12} strokeWidth={mode === 'instant' ? 2.5 : 2} />
                Instant
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'scan' ? 'instant' : 'scan')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '999px', border: 'none',
                  background: mode === 'scan' ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-input)',
                  color: mode === 'scan' ? '#6366f1' : 'var(--text-muted)',
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <Search size={12} strokeWidth={mode === 'scan' ? 2.5 : 2} />
                Scan
              </button>
            </div>

            {/* Right Controls: Expand/Collapse, Line/Char Badge, Clear & Send Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Dynamic Size Indicator for Large Prompts */}
              {isLargePrompt && (
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: 'var(--bg-input)'
                }}>
                  {lineCount > 1 ? `${lineCount} lines • ` : ''}{inputText.length}c
                </span>
              )}

              {/* Toggle Expand / Maximize Box */}
              {isLargePrompt && (
                <button
                  type="button"
                  onClick={() => setIsExpandedInput(v => !v)}
                  title={isExpandedInput ? 'Collapse input' : 'Expand input to full view'}
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    border: 'none', background: 'var(--bg-input)',
                    color: isExpandedInput ? '#6366f1' : 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isExpandedInput ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
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
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)', color: 'var(--text-muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={13} />
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
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Academic Project Footnote */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.69rem',
          color: 'var(--text-muted)',
          margin: '6px 0 0',
          lineHeight: 1.3
        }}>
          APDS Cyber AI • 94.6% Accuracy • Dept of CS &amp; IT, Univ of Sargodha
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)'
            }}>
              AI
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                APDS Cyber Defense Assistant
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Neural ML Pipeline Online (94.6%)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => handleSend('Scan paypal-secure-login.com')}
              className="apds-mode-pill inactive"
              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
              title="Test real-time scan"
            >
              <Zap size={12} color="#f59e0b" />
              <span className="hide-mobile">Test Scan</span>
            </button>
            {hasMessages && (
              <button
                onClick={handleNewChat}
                className="apds-mode-pill inactive"
                style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                title="Start new conversation"
              >
                <RefreshCw size={12} />
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
