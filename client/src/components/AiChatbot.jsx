import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Copy, Check, Terminal, Zap, Shield, Search,
  RefreshCw, User, Bot, Paperclip, ArrowUp, X
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

// ── Typing Dots Animation ───────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#5b5fc7',
            display: 'inline-block',
            animation: `apds-bounce 1.1s ease-in-out ${i * 0.16}s infinite`
          }}
        />
      ))}
    </div>
  );
}

// ── Inline markdown renderer ─────────────────────────────────────────────────
function MessageContent({ text, msgId, onCopy, copiedId }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div>
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).split('\n');
          const lang = lines[0].trim() || 'code';
          const code = lines.slice(1).join('\n');
          return (
            <div key={idx} style={{
              margin: '10px 0',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(91,95,199,0.18)',
              background: 'rgba(91,95,199,0.04)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 14px',
                background: 'rgba(91,95,199,0.07)',
                borderBottom: '1px solid rgba(91,95,199,0.12)',
                fontSize: '0.73rem', color: '#6b7280'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'monospace', fontWeight: 600 }}>
                  <Terminal size={13} color="#5b5fc7" /> {lang}
                </span>
                <button
                  onClick={() => onCopy(code, `${msgId}-${idx}`)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  {copiedId === `${msgId}-${idx}` ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <pre style={{ margin: 0, padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.82rem', color: '#3730a3', overflowX: 'auto', lineHeight: 1.5 }}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        // Render bold (**text**) and newlines
        const segments = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={idx} style={{ whiteSpace: 'pre-line' }}>
            {segments.map((seg, si) =>
              seg.startsWith('**') && seg.endsWith('**')
                ? <strong key={si}>{seg.slice(2, -2)}</strong>
                : seg
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── APDS Logo SVG ────────────────────────────────────────────────────────────
function APDSLogo({ size = 56 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3730a3 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 8px rgba(99,102,241,0.1), 0 0 0 16px rgba(99,102,241,0.05)',
      flexShrink: 0
    }}>
      <Shield size={size * 0.46} color="white" strokeWidth={2} />
    </div>
  );
}

// ── Mode Tab ─────────────────────────────────────────────────────────────────
const MODES = [
  { id: 'instant', label: 'Instant', icon: Zap },
  { id: 'expert',  label: 'Expert',  icon: Shield },
  { id: 'scan',    label: 'Scan',    icon: Search },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function AiChatbot({ t, language = 'English' }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText]   = useState('');
  const [mode, setMode]             = useState('instant');
  const [isTyping, setIsTyping]     = useState(false);
  const [copiedId, setCopiedId]     = useState(null);
  const [suggestions] = useState([
    'Scan paypal-secure-login.com',
    'What is typosquatting?',
    'Show Python ML code',
    'How does DistilBERT detect phishing?',
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);
  const hasMessages    = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-grow textarea
  const growTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  const handleSend = async (textOverride) => {
    const query = typeof textOverride === 'string' ? textOverride.trim() : inputText.trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
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
        text: '⚠️ **Connection Error**\n\nCould not reach the AI service. Please check your connection and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Welcome Screen (no messages yet) ───────────────────────────────────────
  const WelcomeScreen = () => (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px 32px',
      gap: '20px'
    }}>
      {/* Logo */}
      <APDSLogo size={64} />

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.3rem, 5vw, 1.7rem)',
          fontWeight: '800',
          color: '#111827',
          margin: '0 0 4px 0',
          fontFamily: 'var(--font-display, system-ui)',
          letterSpacing: '-0.02em'
        }}>
          Start chatting with{' '}
          <span style={{ color: '#4f46e5' }}>APDS AI</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#9ca3af', margin: 0 }}>
          Cybersecurity intelligence · URL & Email scanner · ML insights
        </p>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {MODES.map(m => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px',
                borderRadius: '999px',
                border: active ? 'none' : '1.5px solid #e5e7eb',
                background: active ? '#4f46e5' : 'white',
                color: active ? 'white' : '#374151',
                fontWeight: active ? '700' : '500',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: active ? '0 4px 14px rgba(79,70,229,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                fontFamily: 'inherit'
              }}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Suggestion chips */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        justifyContent: 'center', maxWidth: '480px', marginTop: '8px'
      }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSend(s)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1.5px solid #e5e7eb',
              background: 'white',
              color: '#4b5563',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#4f46e5'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563'; }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Chat Messages Area ──────────────────────────────────────────────────────
  const ChatArea = () => (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 0 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      {messages.map(msg => (
        <div
          key={msg.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            padding: '6px 24px'
          }}
        >
          {msg.sender === 'bot' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Shield size={13} color="white" />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#374151' }}>APDS AI</span>
              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{msg.time}</span>
            </div>
          )}

          <div style={{
            maxWidth: msg.sender === 'user' ? '72%' : '84%',
            padding: msg.sender === 'user' ? '10px 16px' : '14px 18px',
            borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
            background: msg.sender === 'user'
              ? 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
              : 'white',
            color: msg.sender === 'user' ? 'white' : '#111827',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            boxShadow: msg.sender === 'user'
              ? '0 4px 12px rgba(79,70,229,0.25)'
              : '0 1px 4px rgba(0,0,0,0.08)',
            border: msg.sender === 'bot' ? '1px solid #f0f0f5' : 'none'
          }}>
            {msg.sender === 'bot'
              ? <MessageContent text={msg.text} msgId={msg.id} onCopy={handleCopy} copiedId={copiedId} />
              : msg.text
            }
          </div>

          {msg.sender === 'user' && (
            <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '3px', paddingRight: '2px' }}>
              {msg.time}
            </span>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '6px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={13} color="white" />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#374151' }}>APDS AI</span>
          </div>
          <div style={{
            padding: '12px 18px',
            borderRadius: '4px 18px 18px 18px',
            background: 'white',
            border: '1px solid #f0f0f5',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );

  // ── Input Box ───────────────────────────────────────────────────────────────
  const InputBox = () => (
    <div style={{
      padding: hasMessages ? '12px 20px 16px' : '0 0 8px 0',
      maxWidth: '680px',
      width: '100%',
      margin: '0 auto',
      alignSelf: 'center'
    }}>
      {/* Mode tabs mini (only shown in chat view) */}
      {hasMessages && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', paddingLeft: '2px' }}>
          {MODES.map(m => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: active ? 'none' : '1.5px solid #e5e7eb',
                  background: active ? '#4f46e5' : 'white',
                  color: active ? 'white' : '#6b7280',
                  fontWeight: active ? '700' : '500',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit'
                }}
              >
                <Icon size={12} />
                {m.label}
              </button>
            );
          })}
          <button
            onClick={() => { setMessages([]); }}
            style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1.5px solid #e5e7eb',
              background: 'white',
              color: '#9ca3af',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            title="New chat"
          >
            <RefreshCw size={12} /> New chat
          </button>
        </div>
      )}

      {/* Main input card */}
      <div style={{
        background: 'white',
        borderRadius: '18px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s'
      }}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputText}
          onChange={e => { setInputText(e.target.value); growTextarea(); }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
          }}
          placeholder={mode === 'scan' ? 'Paste a URL or email for instant scan...' : 'Message APDS AI...'}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: '16px 18px 4px',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            color: '#111827',
            background: 'transparent',
            fontFamily: 'inherit',
            maxHeight: '140px',
            minHeight: '52px',
            boxSizing: 'border-box'
          }}
        />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px 12px',
        }}>
          {/* Attachment */}
          <button
            style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.15s'
            }}
            title="Attach file"
            onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <Paperclip size={17} />
          </button>

          {/* Mode chips */}
          <button
            onClick={() => setMode('instant')}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px',
              borderRadius: '999px',
              border: 'none',
              background: mode === 'instant' ? 'rgba(99,102,241,0.1)' : '#f3f4f6',
              color: mode === 'instant' ? '#4f46e5' : '#6b7280',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit'
            }}
          >
            <Zap size={13} strokeWidth={mode === 'instant' ? 2.5 : 2} />
            Instant
          </button>

          <button
            onClick={() => setMode('scan')}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px',
              borderRadius: '999px',
              border: 'none',
              background: mode === 'scan' ? 'rgba(99,102,241,0.1)' : '#f3f4f6',
              color: mode === 'scan' ? '#4f46e5' : '#6b7280',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit'
            }}
          >
            <Search size={13} strokeWidth={mode === 'scan' ? 2.5 : 2} />
            Scan
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Clear if text */}
          {inputText.length > 0 && (
            <button
              onClick={() => { setInputText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; }}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: 'none', background: '#f3f4f6', color: '#9ca3af',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={13} />
            </button>
          )}

          {/* Send button */}
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !inputText.trim()}
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: inputText.trim() && !isTyping
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                : '#e5e7eb',
              color: inputText.trim() && !isTyping ? 'white' : '#9ca3af',
              cursor: inputText.trim() && !isTyping ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: inputText.trim() && !isTyping ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
              flexShrink: 0
            }}
          >
            <ArrowUp size={17} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#c4c7cc', marginTop: '8px' }}>
        APDS AI · 94.6% phishing detection accuracy · Dept of CS &amp; IT, University of Sargodha
      </p>
    </div>
  );

  return (
    <>
      {/* Bounce keyframe */}
      <style>{`
        @keyframes apds-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .apds-chat-wrap {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 140px);
          min-height: 520px;
          background: #f9fafb;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #f0f0f5;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        @media (max-width: 768px) {
          .apds-chat-wrap {
            height: calc(100vh - 90px);
            border-radius: 16px;
          }
        }
      `}</style>

      <div className="apds-chat-wrap">
        {hasMessages ? <ChatArea /> : <WelcomeScreen />}
        <InputBox />
      </div>
    </>
  );
}
