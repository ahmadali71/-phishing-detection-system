import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shield, Sparkles, Plus, Mic, ArrowUp, Copy, Check,
  X, FileText, Lock, Globe, Terminal, RefreshCw,
  Search, MessageSquare, Code2, Volume2, VolumeX,
  ThumbsUp, ThumbsDown, ArrowRight, Wand2
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   MODERN & CLEAN DESIGN SYSTEM (CLAUDE & CHATGPT MOBILE AESTHETIC)
───────────────────────────────────────────────────────────────── */
const CHATBOT_CSS = `
  @keyframes apds-breathe {
    0%, 100% {
      box-shadow: 0 0 25px rgba(59, 130, 246, 0.4), 0 0 50px rgba(99, 102, 241, 0.2);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.65), 0 0 75px rgba(168, 85, 247, 0.4);
      transform: scale(1.03);
    }
  }

  @keyframes apds-orbit-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes apds-fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes apds-dot-pulse {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }

  /* ── Canvas Container ── */
  .apds-ai-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--bg-primary, #080c16);
    background-image: radial-gradient(circle at 50% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
    color: var(--text-primary, #f8fafc);
    position: relative;
    box-sizing: border-box;
    font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    overflow: hidden;
    flex: 1 1 0;
    min-height: 0;
  }
  .light-theme .apds-ai-canvas {
    background-image: radial-gradient(circle at 50% 25%, rgba(59, 130, 246, 0.06) 0%, transparent 60%);
  }

  /* ── Scrollable Viewport ── */
  .apds-ai-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Stage ── */
  .apds-ai-welcome {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 18px 12px 18px;
    text-align: center;
    max-width: 520px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Glowing Emblem ── */
  .apds-ai-emblem-wrap {
    position: relative;
    width: 84px;
    height: 84px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .apds-ai-emblem-orbit {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1.5px dashed rgba(99, 102, 241, 0.4);
    animation: apds-orbit-spin 14s linear infinite;
  }
  .apds-ai-emblem-core {
    width: 72px;
    height: 72px;
    border-radius: 22px;
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    animation: apds-breathe 3.8s infinite ease-in-out;
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.45);
  }

  /* ── Title & Greetings ── */
  .apds-ai-title {
    font-size: 1.1rem;
    font-weight: 800;
    font-family: var(--font-display, 'Outfit', sans-serif);
    color: var(--text-primary, #f8fafc);
    letter-spacing: -0.01em;
    margin: 0 0 4px 0;
  }
  .apds-ai-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 9999px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.25);
    font-size: 0.72rem;
    font-weight: 700;
    color: #10b981;
    margin-bottom: 16px;
  }
  .apds-ai-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  }

  .apds-ai-greeting {
    font-size: clamp(1.4rem, 5.5vw, 1.85rem);
    font-weight: 800;
    font-family: var(--font-display, 'Outfit', sans-serif);
    color: var(--text-primary, #f8fafc);
    letter-spacing: -0.02em;
    margin: 0 0 4px 0;
    line-height: 1.25;
  }
  .apds-ai-greeting span {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .apds-ai-subtitle {
    font-size: 0.88rem;
    color: var(--text-muted, #8493a8);
    margin: 0 0 20px 0;
    line-height: 1.45;
  }

  /* ── Sleek Suggestion Chips ── */
  .apds-ai-chips-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    margin-bottom: 8px;
  }
  .apds-ai-chip-card {
    background: var(--bg-card, #141f36);
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    border-radius: 16px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;
    text-align: left;
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
    color: var(--text-secondary, #cbd5e1);
  }
  .apds-ai-chip-card:hover {
    border-color: #3b82f6;
    background: var(--bg-card-hover, #1c2b4a);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
  .apds-ai-chip-card:active {
    transform: scale(0.98);
  }
  .apds-ai-chip-left {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
  }
  .apds-ai-chip-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .apds-ai-chip-text {
    font-size: 0.84rem;
    font-weight: 700;
    color: var(--text-primary, #f8fafc);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .apds-ai-chip-arrow {
    color: var(--text-muted, #8493a8);
    flex-shrink: 0;
  }

  /* ── Floating Capsule Input Deck (Always Docked & Visible) ── */
  .apds-ai-dock {
    padding: 6px 14px calc(env(safe-area-inset-bottom, 0px) + 8px) 14px;
    flex-shrink: 0;
    background: transparent;
    z-index: 30;
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .apds-ai-capsule {
    background: var(--bg-card, #141f36);
    border: 1.5px solid var(--border-color, rgba(255, 255, 255, 0.12));
    border-radius: 24px;
    padding: 8px 10px 8px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    min-height: 52px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .apds-ai-capsule.multiline {
    border-radius: 22px;
    align-items: flex-end;
    padding-bottom: 8px;
  }
  .apds-ai-capsule:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 28px rgba(59, 130, 246, 0.35);
  }

  /* ── Textarea ── */
  .apds-ai-textarea {
    flex: 1 1 0;
    min-width: 0;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text-primary, #f8fafc);
    font-size: 1rem;
    line-height: 1.45;
    font-family: inherit;
    min-height: 28px;
    max-height: 160px;
    padding: 2px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-ai-textarea::placeholder {
    color: var(--text-muted, #8493a8);
    font-size: 0.96rem;
  }

  /* ── Controls Row ── */
  .apds-ai-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .apds-ai-btn-attach {
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
  .apds-ai-btn-attach:hover {
    color: #3b82f6;
    border-color: #3b82f6;
  }
  .apds-ai-btn-send {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
    transition: transform 0.18s, box-shadow 0.18s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .apds-ai-btn-send:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 22px rgba(37, 99, 235, 0.6);
  }
  .apds-ai-btn-send:active {
    transform: scale(0.92);
  }

  /* ── Chat Messages ── */
  .apds-ai-msg-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 14px;
    padding: 0 16px;
    box-sizing: border-box;
    animation: apds-fade-up 0.2s ease-out both;
  }
  .apds-ai-bubble {
    max-width: 86%;
    padding: 12px 16px;
    font-size: 0.95rem;
    line-height: 1.6;
    border-radius: 20px;
    word-break: break-word;
  }
  .apds-ai-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  }
  .apds-ai-bubble-bot {
    align-self: flex-start;
    background: var(--bg-card, #141f36);
    color: var(--text-primary, #f8fafc);
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 768px) {
    .apds-ai-canvas {
      height: 100%;
      border-radius: 0;
      border: none;
    }
    .apds-ai-welcome {
      padding: 12px 14px 8px 14px;
    }
    .apds-ai-greeting {
      font-size: 1.55rem;
    }
    .apds-ai-dock {
      padding: 4px 10px calc(env(safe-area-inset-bottom, 0px) + 6px) 10px;
    }
    .apds-ai-textarea {
      font-size: 16px; /* Prevents auto-zoom on iOS */
    }
  }
`;

/* ── Quick Starter Prompts ── */
const PROMPT_SUGGESTIONS = [
  {
    id: 'scan',
    title: 'Scan a suspicious URL for phishing',
    icon: Search,
    iconBg: 'rgba(239, 68, 68, 0.15)',
    iconColor: '#f43f5e',
    query: 'Scan paypal-security-verification.xyz'
  },
  {
    id: 'explain',
    title: 'How do phishing attacks work and how to stay safe?',
    icon: Lock,
    iconBg: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#3b82f6',
    query: 'How do phishing attacks work and how can I protect myself?'
  },
  {
    id: 'code',
    title: 'Show Python ML code for URL feature extraction',
    icon: Code2,
    iconBg: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#10b981',
    query: 'Show Python code for URL feature extraction and Random Forest classifier'
  },
  {
    id: 'project',
    title: 'APDS Project authors, supervisor & university specs',
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
    const minH = 28;
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
     INLINE FLOATING CAPSULE INPUT DECK
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const InputCapsuleJSX = (
    <div className="apds-ai-dock">
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

      <div className={`apds-ai-capsule ${isMultiLine ? 'multiline' : ''}`}>
        {/* Stable Textarea Input */}
        <textarea
          ref={textareaRef}
          className="apds-ai-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message APDS AI..."
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Right Actions: Plus & Send/Mic */}
        <div className="apds-ai-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
            onChange={handleFileAttach}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="apds-ai-btn-attach"
            onMouseDown={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Plus size={18} strokeWidth={2.4} />
          </button>

          {inputText.trim().length > 0 || attachedFile ? (
            <button
              type="button"
              className="apds-ai-btn-send"
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
              className="apds-ai-btn-send"
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
      <style>{CHATBOT_CSS}</style>
      <div className="apds-ai-canvas">

        {/* ── Scroll Area ── */}
        <div className="apds-ai-scroll">
          {!hasMessages ? (
            /* ── Clean Hero Welcome Stage ── */
            <div className="apds-ai-welcome">
              {/* Glowing Shield Emblem */}
              <div className="apds-ai-emblem-wrap">
                <div className="apds-ai-emblem-orbit" />
                <div className="apds-ai-emblem-core">
                  <Shield size={38} strokeWidth={2.2} />
                </div>
              </div>

              {/* Title & Status */}
              <div className="apds-ai-title">APDS Sentinel AI</div>
              <div className="apds-ai-status-pill">
                <span className="apds-ai-dot" />
                <span>Neural ML Online (94.6% Accuracy)</span>
              </div>

              {/* Greeting */}
              <h1 className="apds-ai-greeting">
                How can I help you today, <span>{getUserName()}?</span>
              </h1>
              <p className="apds-ai-subtitle">
                Ask questions, scan suspicious links, or analyze cybersecurity threats.
              </p>

              {/* Minimalist Suggestion Cards */}
              <div className="apds-ai-chips-wrap">
                {PROMPT_SUGGESTIONS.map(card => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="apds-ai-chip-card"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleSend(card.query)}
                    >
                      <div className="apds-ai-chip-left">
                        <div className="apds-ai-chip-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                          <Icon size={16} strokeWidth={2.2} />
                        </div>
                        <div className="apds-ai-chip-text">{card.title}</div>
                      </div>
                      <ArrowRight size={14} className="apds-ai-chip-arrow" />
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
                <div key={msg.id} className="apds-ai-msg-row">
                  <div className={`apds-ai-bubble ${msg.sender === 'user' ? 'apds-ai-bubble-user' : 'apds-ai-bubble-bot'}`}>
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
                <div className="apds-ai-msg-row">
                  <div className="apds-ai-bubble apds-ai-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
