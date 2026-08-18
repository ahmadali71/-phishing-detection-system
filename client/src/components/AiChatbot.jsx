import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Copy, Check, Terminal, Zap, Shield, Search,
  RefreshCw, ArrowUp, X, Paperclip, FileText, AlertTriangle
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   KEYFRAME STYLES (injected once)
───────────────────────────────────────────────────────────────── */
const APDS_STYLES = `
  @keyframes apds-bounce {
    0%, 80%, 100% { transform: scale(0.65); opacity: 0.35; }
    40%           { transform: scale(1);    opacity: 1;    }
  }
  @keyframes apds-fadein {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  .apds-root {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    min-height: 520px;
    background: var(--bg-primary);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  }
  .apds-messages {
    flex: 1 1 0;
    overflow-y: auto;
    padding: 20px 0 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    scroll-behavior: smooth;
  }
  .apds-msg-row {
    animation: apds-fadein 0.22s ease both;
  }
  .apds-input-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .apds-input-card:focus-within {
    border-color: rgba(99,102,241,0.55);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .apds-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    padding: 14px 18px 6px;
    font-size: 0.95rem;
    line-height: 1.55;
    background: transparent;
    color: var(--text-primary);
    font-family: inherit;
    min-height: 72px;
    max-height: 200px;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
  }
  .apds-textarea::placeholder { color: var(--text-muted); }
  .apds-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 13px;
    border-radius: 999px; border: none; cursor: pointer;
    font-size: 0.8rem; font-weight: 600; font-family: inherit;
    transition: all 0.15s;
  }
  .apds-mode-tab {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 17px;
    border-radius: 999px; cursor: pointer; font-family: inherit;
    font-size: 0.88rem; font-weight: 600; transition: all 0.18s;
  }
  .apds-send-btn {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .apds-send-btn:disabled { cursor: default; }
  .apds-suggestion {
    padding: 7px 15px; border-radius: 999px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 0.82rem; font-weight: 500; cursor: pointer;
    font-family: inherit; transition: all 0.15s;
  }
  .apds-suggestion:hover {
    border-color: #6366f1; color: #6366f1;
    background: rgba(99,102,241,0.06);
  }
  .apds-file-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 12px; margin: 4px 14px 0;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 8px; font-size: 0.8rem;
    color: #6366f1; font-weight: 600;
  }
  @media (max-width: 768px) {
    .apds-root { height: calc(100vh - 90px); border-radius: 14px; }
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
   MARKDOWN RENDERER (bold + code blocks)
───────────────────────────────────────────────────────────────── */
function MsgContent({ text, msgId, onCopy, copiedId }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div>
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).split('\n');
          const lang = lines[0].trim() || 'code';
          const code = lines.slice(1).join('\n');
          const key = `${msgId}-${idx}`;
          return (
            <div key={idx} style={{
              margin: '10px 0', borderRadius: '10px', overflow: 'hidden',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 14px', background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.73rem', color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'monospace', fontWeight: 600 }}>
                  <Terminal size={13} color="#6366f1" /> {lang}
                </span>
                <button onClick={() => onCopy(code, key)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.72rem',
                  display: 'flex', alignItems: 'center', gap: '3px'
                }}>
                  {copiedId === key ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <pre style={{
                margin: 0, padding: '12px 16px', fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem', color: '#818cf8', overflowX: 'auto', lineHeight: 1.5
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
                ? <strong key={si}>{s.slice(2, -2)}</strong>
                : s
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LOGO
───────────────────────────────────────────────────────────────── */
function Logo({ size = 56 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #3730a3 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      boxShadow: '0 0 0 8px rgba(99,102,241,0.12), 0 0 0 16px rgba(99,102,241,0.05)'
    }}>
      <Shield size={size * 0.46} color="white" strokeWidth={2} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MODES
───────────────────────────────────────────────────────────────── */
const MODES = [
  { id: 'instant', label: 'Instant', icon: Zap },
  { id: 'expert',  label: 'Expert',  icon: Shield },
  { id: 'scan',    label: 'Scan',    icon: Search },
];

const SUGGESTIONS = [
  'Scan paypal-secure-login.com',
  'What is typosquatting?',
  'Show Python ML code',
  'How does DistilBERT detect phishing?',
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English' }) {
  const [messages,   setMessages]   = useState([]);
  const [inputText,  setInputText]  = useState('');
  const [mode,       setMode]       = useState('instant');
  const [isTyping,   setIsTyping]   = useState(false);
  const [copiedId,   setCopiedId]   = useState(null);
  const [attachedFile, setAttachedFile] = useState(null); // { name, content }

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const fileInputRef   = useRef(null);

  const hasMessages = messages.length > 0;

  // Scroll to bottom only when messages change — do NOT focus the textarea
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Grow textarea to fit content without focusing it
  const growTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newH = Math.min(el.scrollHeight, 200);
    el.style.height = Math.max(newH, 72) + 'px';
  }, []);

  /* ── Send ─────────────────────────────────────────────────────── */
  const handleSend = async (textOverride) => {
    const baseText = typeof textOverride === 'string' ? textOverride.trim() : inputText.trim();
    const fileNote = attachedFile
      ? `\n\n[Attached file: ${attachedFile.name}]\n${attachedFile.content}`
      : '';
    const query = (baseText + fileNote).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now(), sender: 'user', text: baseText,
      fileInfo: attachedFile ? attachedFile.name : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = '72px';
    setIsTyping(true);

    try {
      const res = await generateChatbotResponse(query, [...messages, userMsg], language);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot', text: res.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot',
        text: '⚠️ **Error**\n\nCould not reach the AI service. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  /* ── File Attach ─────────────────────────────────────────────── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachedFile({ name: file.name, content: ev.target.result?.toString().slice(0, 4000) || '' });
    };
    reader.readAsText(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  /* ── Copy ────────────────────────────────────────────────────── */
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ── Mode Tab ─────────────────────────────────────────────────── */
  const ModeTab = ({ m, compact }) => {
    const Icon = m.icon;
    const active = mode === m.id;
    return (
      <button
        className="apds-mode-tab"
        onClick={() => setMode(m.id)}
        style={{
          border: active ? 'none' : '1.5px solid var(--border-color)',
          background: active ? '#4f46e5' : 'var(--bg-card)',
          color: active ? 'white' : 'var(--text-secondary)',
          fontWeight: active ? '700' : '500',
          padding: compact ? '4px 12px' : '7px 17px',
          fontSize: compact ? '0.78rem' : '0.88rem',
          boxShadow: active ? '0 4px 12px rgba(79,70,229,0.28)' : 'none',
        }}
      >
        <Icon size={compact ? 12 : 14} strokeWidth={active ? 2.5 : 2} />
        {m.label}
      </button>
    );
  };

  /* ── Welcome Screen ───────────────────────────────────────────── */
  const WelcomeScreen = () => (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 24px 24px', gap: '22px'
    }}>
      <Logo size={64} />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 5vw, 1.65rem)', fontWeight: '800',
          color: 'var(--text-primary)', margin: '0 0 6px 0',
          fontFamily: 'var(--font-display)', letterSpacing: '-0.02em'
        }}>
          Start chatting with{' '}
          <span style={{ color: '#6366f1' }}>APDS AI</span>
        </h2>
        <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', margin: 0 }}>
          Cybersecurity intelligence · URL &amp; Email scanner · ML insights
        </p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {MODES.map(m => <ModeTab key={m.id} m={m} />)}
      </div>

      {/* Suggestions */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        justifyContent: 'center', maxWidth: '500px', marginTop: '4px'
      }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="apds-suggestion" onClick={() => handleSend(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Chat View ────────────────────────────────────────────────── */
  const ChatView = () => (
    <div className="apds-messages">
      {messages.map(msg => (
        <div key={msg.id} className="apds-msg-row" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
          padding: '5px 20px'
        }}>
          {/* Bot avatar + name */}
          {msg.sender === 'bot' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Shield size={13} color="white" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>APDS AI</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{msg.time}</span>
            </div>
          )}

          {/* Bubble */}
          <div style={{
            maxWidth: msg.sender === 'user' ? '76%' : '88%',
            padding: msg.sender === 'user' ? '10px 16px' : '13px 17px',
            borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
            background: msg.sender === 'user'
              ? 'linear-gradient(135deg,#4f46e5 0%,#3730a3 100%)'
              : 'var(--bg-card)',
            color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            boxShadow: msg.sender === 'user'
              ? '0 4px 14px rgba(79,70,229,0.3)'
              : '0 1px 4px rgba(0,0,0,0.08)',
            border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
          }}>
            {msg.fileInfo && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                marginBottom: '6px', fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.75)', fontWeight: 600
              }}>
                <FileText size={13} /> {msg.fileInfo}
              </div>
            )}
            {msg.sender === 'bot'
              ? <MsgContent text={msg.text} msgId={msg.id} onCopy={handleCopy} copiedId={copiedId} />
              : msg.text
            }
          </div>

          {/* User timestamp */}
          {msg.sender === 'user' && (
            <span style={{ fontSize: '0.71rem', color: 'var(--text-muted)', marginTop: '3px', paddingRight: '2px' }}>
              {msg.time}
            </span>
          )}
        </div>
      ))}

      {/* Typing dots */}
      {isTyping && (
        <div className="apds-msg-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '5px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={13} color="white" />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>APDS AI</span>
          </div>
          <div style={{
            padding: '11px 17px', borderRadius: '4px 18px 18px 18px',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <TypingDots />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  /* ── Input Panel ──────────────────────────────────────────────── */
  const InputPanel = () => {
    const canSend = (inputText.trim().length > 0 || attachedFile) && !isTyping;
    return (
      <div style={{
        padding: '10px 16px 14px',
        maxWidth: '720px', width: '100%', margin: '0 auto', alignSelf: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Chat view top bar: mini mode tabs + new chat */}
        {hasMessages && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {MODES.map(m => <ModeTab key={m.id} m={m} compact />)}
            <button
              onClick={() => { setMessages([]); setAttachedFile(null); setInputText(''); }}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 12px', borderRadius: '999px',
                border: '1.5px solid var(--border-color)', background: 'var(--bg-card)',
                color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 500
              }}
            >
              <RefreshCw size={12} /> New chat
            </button>
          </div>
        )}

        {/* Main card */}
        <div className="apds-input-card">
          {/* Attached file badge */}
          {attachedFile && (
            <div className="apds-file-badge">
              <FileText size={14} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'flex', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="apds-textarea"
            value={inputText}
            onChange={e => { setInputText(e.target.value); growTextarea(); }}
            onKeyDown={e => {
              // On mobile (touch), Enter should NOT send — use the send button.
              // On desktop, Enter sends, Shift+Enter = newline.
              if (e.key === 'Enter' && !e.shiftKey && !('ontouchstart' in window)) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              mode === 'scan'
                ? 'Paste a URL or email text for instant forensic scan...'
                : 'Message APDS AI... (Shift+Enter for newline)'
            }
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          {/* Bottom action bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 12px 12px', flexWrap: 'wrap'
          }}>
            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Paperclip — triggers real file picker */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach .txt, .eml, .py, .json, .csv file"
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

            {/* Instant chip */}
            <button
              className="apds-chip"
              onClick={() => setMode(mode === 'instant' ? 'expert' : 'instant')}
              style={{
                background: mode === 'instant' ? 'rgba(99,102,241,0.12)' : 'var(--bg-input)',
                color: mode === 'instant' ? '#6366f1' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              <Zap size={13} strokeWidth={mode === 'instant' ? 2.5 : 2} />
              Instant
            </button>

            {/* Scan chip */}
            <button
              className="apds-chip"
              onClick={() => setMode(mode === 'scan' ? 'instant' : 'scan')}
              style={{
                background: mode === 'scan' ? 'rgba(99,102,241,0.12)' : 'var(--bg-input)',
                color: mode === 'scan' ? '#6366f1' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              <Search size={13} strokeWidth={mode === 'scan' ? 2.5 : 2} />
              Scan
            </button>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Clear input */}
            {(inputText.length > 0 || attachedFile) && (
              <button
                onClick={() => {
                  setInputText('');
                  setAttachedFile(null);
                  if (textareaRef.current) textareaRef.current.style.height = '72px';
                }}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-input)', color: 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={13} />
              </button>
            )}

            {/* Send */}
            <button
              className="apds-send-btn"
              onClick={() => handleSend()}
              disabled={!canSend}
              style={{
                background: canSend
                  ? 'linear-gradient(135deg,#6366f1,#4f46e5)'
                  : 'var(--bg-input)',
                color: canSend ? 'white' : 'var(--text-muted)',
                boxShadow: canSend ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
              }}
            >
              <ArrowUp size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)',
          margin: '8px 0 0', lineHeight: 1.4
        }}>
          APDS AI · 94.6% phishing detection accuracy · Dept of CS &amp; IT, University of Sargodha
        </p>
      </div>
    );
  };

  return (
    <>
      <style>{APDS_STYLES}</style>
      <div className="apds-root">
        {hasMessages ? <ChatView /> : <WelcomeScreen />}
        <InputPanel />
      </div>
    </>
  );
}
