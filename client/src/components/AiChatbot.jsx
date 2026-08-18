import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, Plus, Mic, ArrowUp, Copy, Check, Terminal,
  RefreshCw, X, Paperclip, FileText, Sparkles, Volume2, VolumeX
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   EXACT GOOGLE GEMINI MOBILE AESTHETIC CSS
───────────────────────────────────────────────────────────────── */
const GEMINI_CSS = `
  @keyframes gemini-pulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0.4)); }
    50%      { transform: scale(1.06); filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.6)); }
  }
  @keyframes gemini-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gemini-dot-pulse {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }

  /* ── Root Canvas with Gemini Soft Sky Gradient ── */
  .gemini-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 145px);
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 50%, #ebf5ff 80%, #cde5fe 100%);
    color: #1f1f1f;
    position: relative;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Google Sans', 'Outfit', 'Inter', Roboto, sans-serif;
    overflow: hidden;
  }
  .dark-theme .gemini-root,
  body:not(.light-theme) .gemini-root {
    background: linear-gradient(180deg, #090e17 0%, #0d1527 50%, #11203d 82%, #1a325a 100%);
    color: #f1f5f9;
  }

  /* ── Top Minimal Bar ── */
  .gemini-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px 6px 18px;
    background: transparent;
    flex-shrink: 0;
    z-index: 20;
  }
  .gemini-top-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 50%;
    transition: background 0.15s, opacity 0.15s;
    -webkit-tap-highlight-color: transparent;
    opacity: 0.85;
  }
  .gemini-top-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    opacity: 1;
  }
  .dark-theme .gemini-top-btn:hover,
  body:not(.light-theme) .gemini-top-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* ── Scroll Area ── */
  .gemini-scroll-area {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Stage (Vertical Center) ── */
  .gemini-welcome-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 24px 40px 24px;
    text-align: center;
    user-select: none;
  }

  .gemini-star-wrap {
    margin-bottom: 24px;
    animation: gemini-pulse 4s infinite ease-in-out;
  }

  .gemini-greeting-text {
    font-size: clamp(1.6rem, 6.5vw, 2.1rem);
    font-weight: 500;
    color: #1f1f1f;
    letter-spacing: -0.025em;
    margin: 0;
    line-height: 1.25;
  }
  .dark-theme .gemini-greeting-text,
  body:not(.light-theme) .gemini-greeting-text {
    color: #f8fafc;
  }

  /* ── Floating Capsule Input Bar (Gemini Pill) ── */
  .gemini-input-dock {
    padding: 8px 18px calc(env(safe-area-inset-bottom, 0px) + 16px) 18px;
    flex-shrink: 0;
    background: transparent;
    z-index: 30;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .gemini-capsule-card {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 999px;
    padding: 8px 12px 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
    min-height: 52px;
  }
  .gemini-capsule-card.multiline {
    border-radius: 24px;
    align-items: flex-end;
  }
  .dark-theme .gemini-capsule-card,
  body:not(.light-theme) .gemini-capsule-card {
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
  }
  .gemini-capsule-card:focus-within {
    box-shadow: 0 6px 28px rgba(59, 130, 246, 0.18), 0 0 0 2px #3b82f6;
  }

  /* ── Plus Button on Left ── */
  .gemini-plus-btn {
    background: none;
    border: none;
    color: #4b5563;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 50%;
    transition: transform 0.15s, color 0.15s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .gemini-plus-btn:hover {
    color: #1f1f1f;
    background: rgba(0, 0, 0, 0.05);
  }
  .dark-theme .gemini-plus-btn,
  body:not(.light-theme) .gemini-plus-btn {
    color: #94a3b8;
  }
  .dark-theme .gemini-plus-btn:hover,
  body:not(.light-theme) .gemini-plus-btn:hover {
    color: #f1f5f9;
    background: rgba(255, 255, 255, 0.08);
  }

  /* ── Auto-Growing Input Box (Stable, Non-Remounting) ── */
  .gemini-textarea {
    flex: 1 1 0;
    min-width: 0;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: #1f1f1f;
    font-size: 1.02rem;
    line-height: 1.45;
    font-family: inherit;
    min-height: 26px;
    max-height: 180px;
    padding: 3px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .dark-theme .gemini-textarea,
  body:not(.light-theme) .gemini-textarea {
    color: #f8fafc;
  }
  .gemini-textarea::placeholder {
    color: #757575;
    font-size: 1.02rem;
  }
  .dark-theme .gemini-textarea::placeholder,
  body:not(.light-theme) .gemini-textarea::placeholder {
    color: #94a3b8;
  }

  /* ── Right Action (Mic or Send Arrow) ── */
  .gemini-action-btn {
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
  .gemini-mic-btn {
    background: none;
    color: #4b5563;
  }
  .gemini-mic-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #1f1f1f;
  }
  .gemini-mic-btn.listening {
    background: #ef4444 !important;
    color: #ffffff !important;
    animation: gemini-pulse 1.5s infinite;
  }
  .dark-theme .gemini-mic-btn,
  body:not(.light-theme) .gemini-mic-btn {
    color: #94a3b8;
  }
  .dark-theme .gemini-mic-btn:hover,
  body:not(.light-theme) .gemini-mic-btn:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.08);
  }
  .gemini-send-btn {
    background: #2563eb;
    color: #ffffff;
    box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
    transform: scale(1.02);
  }
  .gemini-send-btn:hover {
    background: #1d4ed8;
    transform: scale(1.08);
  }
  .gemini-send-btn:active {
    transform: scale(0.92);
  }

  /* ── Chat Messages ── */
  .gemini-msg-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 16px;
    padding: 0 18px;
    box-sizing: border-box;
    animation: gemini-fade-in 0.2s ease-out both;
  }
  .gemini-bubble {
    max-width: 86%;
    padding: 12px 18px;
    font-size: 0.98rem;
    line-height: 1.6;
    border-radius: 22px;
    word-break: break-word;
  }
  .gemini-bubble-user {
    align-self: flex-end;
    background: #2563eb;
    color: #ffffff;
    border-bottom-right-radius: 6px;
    box-shadow: 0 3px 12px rgba(37, 99, 235, 0.25);
  }
  .gemini-bubble-bot {
    align-self: flex-start;
    background: #ffffff;
    color: #1f1f1f;
    border: 1px solid rgba(0, 0, 0, 0.07);
    border-bottom-left-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  .dark-theme .gemini-bubble-bot,
  body:not(.light-theme) .gemini-bubble-bot {
    background: #1e293b;
    color: #f8fafc;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 768px) {
    .gemini-root {
      height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
      min-height: 0;
    }
    .gemini-top-bar {
      padding: 10px 14px 4px 14px;
    }
    .gemini-greeting-text {
      font-size: 1.75rem;
    }
    .gemini-input-dock {
      padding: 6px 12px calc(env(safe-area-inset-bottom, 0px) + 12px) 12px;
    }
    .gemini-capsule-card {
      min-height: 48px;
      padding: 6px 10px 6px 14px;
    }
    .gemini-textarea {
      font-size: 16px; /* Prevents auto-zoom on iOS */
    }
  }
`;

/* ── Exact Multi-Color Google Gemini 4-Pointed Star SVG ── */
function GeminiSparkleStar({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 0C50 27.614 27.614 50 0 50C27.614 50 50 72.386 50 100C50 72.386 72.386 50 100 50C72.386 50 50 27.614 50 0Z"
        fill="url(#gemini_multi_grad)"
      />
      <defs>
        <linearGradient id="gemini_multi_grad" x1="10" y1="0" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="25%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="75%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', currentUser, onMenuToggle }) {
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

  // Derive User Display Name (e.g. "ahmad", "Ahmad", or fallback)
  const getUserName = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ')[0].toLowerCase();
    }
    if (currentUser?.username) {
      return currentUser.username.toLowerCase();
    }
    return 'ahmad';
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Dynamic height for textarea without remounting
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = 26;
    const maxH = window.innerWidth <= 768 ? 160 : 180;
    const targetH = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${targetH}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [inputText, autoResize]);

  // Voice speech-to-text recognition
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

  const isMultiLine = inputText.includes('\n') || (textareaRef.current?.scrollHeight || 0) > 36;

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INLINE FLOATING CAPSULE INPUT BAR (GEMINI PILL)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const InputCapsuleJSX = (
    <div className="gemini-input-dock">
      {/* File preview if attached */}
      {attachedFile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          marginBottom: '8px',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '999px',
          fontSize: '0.78rem',
          color: '#2563eb',
          fontWeight: 700
        }}>
          <FileText size={13} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {attachedFile.name}
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', padding: 0 }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className={`gemini-capsule-card ${isMultiLine ? 'multiline' : ''}`}>
        {/* Left Plus Attachment Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.eml,.csv,.json,.py,.md,.log"
          onChange={handleFileAttach}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="gemini-plus-btn"
          onMouseDown={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          title="Add files or scan"
        >
          <Plus size={20} strokeWidth={2.4} />
        </button>

        {/* Stable Textarea Input */}
        <textarea
          ref={textareaRef}
          className="gemini-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini"
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Right Action Button: Mic or Elevated Send Arrow */}
        {inputText.trim().length > 0 || attachedFile ? (
          <button
            type="button"
            className="gemini-action-btn gemini-send-btn"
            onMouseDown={e => e.preventDefault()}
            onClick={() => handleSend()}
            disabled={!canSend}
            title="Send prompt"
            aria-label="Send prompt"
          >
            <ArrowUp size={18} strokeWidth={2.8} />
          </button>
        ) : (
          <button
            type="button"
            className={`gemini-action-btn gemini-mic-btn ${isListening ? 'listening' : ''}`}
            onMouseDown={e => e.preventDefault()}
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening...' : 'Voice input'}
            aria-label="Voice input"
          >
            <Mic size={20} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{GEMINI_CSS}</style>
      <div className="gemini-root">

        {/* ── Top Bar (Minimal Icons) ── */}
        <div className="gemini-top-bar">
          <button
            className="gemini-top-btn"
            title="Menu"
            onClick={() => {
              if (onMenuToggle) onMenuToggle();
              else {
                const menuBtn = document.querySelector('.hamburger-btn');
                if (menuBtn) menuBtn.click();
              }
            }}
          >
            <Menu size={22} strokeWidth={2} />
          </button>

          {hasMessages && (
            <button
              className="gemini-top-btn"
              title="New Chat"
              onClick={handleNewChat}
            >
              <Plus size={22} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* ── Scrollable Area ── */}
        <div className="gemini-scroll-area">
          {!hasMessages ? (
            /* ── Gemini Welcome Center Stage (Exact Match) ── */
            <div className="gemini-welcome-center">
              {/* Iconic Multi-Color 4-Pointed Sparkle Star */}
              <div className="gemini-star-wrap">
                <GeminiSparkleStar size={48} />
              </div>

              {/* Greeting */}
              <h1 className="gemini-greeting-text">
                Your move, {getUserName()}!
              </h1>
            </div>
          ) : (
            /* ── Active Conversation Stream ── */
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
              {messages.map(msg => (
                <div key={msg.id} className="gemini-msg-row">
                  <div className={`gemini-bubble ${msg.sender === 'user' ? 'gemini-bubble-user' : 'gemini-bubble-bot'}`}>
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
                            color: 'inherit',
                            opacity: 0.7,
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
                    opacity: 0.6,
                    marginTop: '3px',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 4px'
                  }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="gemini-msg-row">
                  <div className="gemini-bubble gemini-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GeminiSparkleStar size={16} />
                    <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Bottom Floating Capsule Input Dock ── */}
        {InputCapsuleJSX}

      </div>
    </>
  );
}
