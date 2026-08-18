import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus, Mic, ArrowUp, Copy, Check, X, FileText, PlusCircle
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   EXACT 1:1 REPLICA OF THE USER'S MINIMALIST SCREENSHOT
───────────────────────────────────────────────────────────────── */
const MINIMAL_CSS = `
  @keyframes ribbon-pulse {
    0%, 100% {
      transform: scale(1);
      filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.4)) drop-shadow(0 0 50px rgba(56, 189, 248, 0.25));
    }
    50% {
      transform: scale(1.04);
      filter: drop-shadow(0 0 38px rgba(168, 85, 247, 0.65)) drop-shadow(0 0 75px rgba(56, 189, 248, 0.45));
    }
  }

  @keyframes twinkle-sparkle {
    0%, 100% { opacity: 0.25; transform: scale(0.75); }
    50%      { opacity: 1; transform: scale(1.3); }
  }

  @keyframes chat-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Canvas Background: Deep Pure Midnight/Black ── */
  .minimal-ai-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #03050c;
    color: #ffffff;
    position: relative;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
    flex: 1 1 0;
    min-height: 0;
  }
  .light-theme .minimal-ai-canvas {
    background: #0a0e1c;
    color: #ffffff;
  }

  /* ── Top Bar (Minimal Top Right + Button) ── */
  .minimal-ai-topbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 14px 18px 4px 18px;
    background: transparent;
    flex-shrink: 0;
    z-index: 20;
  }
  .minimal-ai-btn-top-plus {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #0d1222;
    border: 1.5px solid #8b5cf6;
    box-shadow: 0 0 16px rgba(139, 92, 246, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s;
    -webkit-tap-highlight-color: transparent;
  }
  .minimal-ai-btn-top-plus:active {
    transform: scale(0.92);
  }

  /* ── Scroll Area ── */
  .minimal-ai-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Stage (Centered Glowing Ribbon Loop) ── */
  .minimal-ai-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 20px 40px 20px;
    text-align: center;
    user-select: none;
  }

  .minimal-ai-ribbon-wrap {
    position: relative;
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .minimal-ai-sparkle {
    position: absolute;
    color: #60a5fa;
    animation: twinkle-sparkle 2.5s infinite ease-in-out;
  }

  /* ── Floating Glowing Capsule Input Dock ── */
  .minimal-ai-dock {
    padding: 8px 16px calc(env(safe-area-inset-bottom, 0px) + 14px) 16px;
    flex-shrink: 0;
    background: transparent;
    z-index: 30;
    width: 100%;
    max-width: 540px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .minimal-ai-capsule {
    background: #080d1c;
    border: 1.5px solid transparent;
    border-radius: 9999px;
    background-image: linear-gradient(#080d1c, #080d1c), linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    padding: 6px 10px 6px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.28), 0 8px 30px rgba(0, 0, 0, 0.6);
    box-sizing: border-box;
    min-height: 52px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .minimal-ai-capsule.multiline {
    border-radius: 26px;
    align-items: flex-end;
    padding-bottom: 8px;
  }
  .minimal-ai-capsule:focus-within {
    box-shadow: 0 0 35px rgba(99, 102, 241, 0.45), 0 8px 32px rgba(0, 0, 0, 0.7);
  }

  /* ── Auto-Growing Textarea (Never remounts) ── */
  .minimal-ai-textarea {
    flex: 1 1 0;
    min-width: 0;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.45;
    font-family: inherit;
    min-height: 26px;
    max-height: 160px;
    padding: 3px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .minimal-ai-textarea::placeholder {
    color: #64748b;
    font-size: 0.98rem;
  }

  /* ── Right Action Buttons (Plus & Mic/Send) ── */
  .minimal-ai-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .minimal-ai-btn-plus {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .minimal-ai-btn-plus:hover {
    color: #ffffff;
    border-color: #6366f1;
  }
  .minimal-ai-btn-mic {
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
    box-shadow: 0 0 16px rgba(124, 58, 237, 0.5);
    transition: transform 0.18s, box-shadow 0.18s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .minimal-ai-btn-mic:hover {
    transform: scale(1.08);
    box-shadow: 0 0 22px rgba(124, 58, 237, 0.75);
  }
  .minimal-ai-btn-mic:active {
    transform: scale(0.92);
  }

  /* ── Chat Messages Stream ── */
  .minimal-ai-msg-row {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 14px;
    padding: 0 16px;
    box-sizing: border-box;
    animation: chat-fade-in 0.2s ease-out both;
  }
  .minimal-ai-bubble {
    max-width: 86%;
    padding: 12px 18px;
    font-size: 0.96rem;
    line-height: 1.6;
    border-radius: 22px;
    word-break: break-word;
  }
  .minimal-ai-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
  }
  .minimal-ai-bubble-bot {
    align-self: flex-start;
    background: #0d1322;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 768px) {
    .minimal-ai-canvas {
      height: 100%;
      border-radius: 0;
      border: none;
    }
    .minimal-ai-dock {
      padding: 6px 12px calc(env(safe-area-inset-bottom, 0px) + 8px) 12px;
    }
    .minimal-ai-capsule {
      min-height: 48px;
      padding: 5px 8px 5px 14px;
    }
    .minimal-ai-textarea {
      font-size: 16px; /* Prevents auto-zoom on iOS */
    }
    .minimal-ai-bubble {
      max-width: 90%;
      font-size: 0.94rem;
    }
  }
`;

/* ── Exact 3D Glowing Ribbon Loop SVG Emblem ── */
function GlowingRibbonEmblem({ size = 120 }) {
  return (
    <div style={{ position: 'relative', animation: 'ribbon-pulse 3.8s infinite ease-in-out' }}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ribbon_flow_1" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#60a5fa" />
            <stop offset="70%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="ribbon_flow_2" x1="180" y1="20" x2="20" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="40%" stopColor="#a855f7" />
            <stop offset="75%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="ribbon_aura" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Ring */}
        <circle cx="100" cy="100" r="76" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1.5" />

        {/* Outer 3-Lobed Ribbon Knot */}
        <path
          d="M100 42 C120 42 145 60 152 85 C158 110 142 135 120 148 C98 160 68 152 50 130 C32 108 40 76 65 55 C78 44 90 42 100 42 Z"
          stroke="url(#ribbon_flow_1)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ribbon_aura)"
        />

        {/* Inner Counter-Loop Knot */}
        <path
          d="M100 52 C75 52 56 75 62 105 C68 135 105 145 130 128 C155 110 145 75 122 58 C112 52 105 52 100 52 Z"
          stroke="url(#ribbon_flow_2)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea height without remounting
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = 26;
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
     INLINE FLOATING CAPSULE (EXACT MATCH TO SCREENSHOT)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const CapsuleInputJSX = (
    <div className="minimal-ai-dock">
      {/* File preview badge */}
      {attachedFile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          marginBottom: '6px',
          background: 'rgba(99, 102, 241, 0.2)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '9999px',
          fontSize: '0.76rem',
          color: '#93c5fd',
          fontWeight: 600
        }}>
          <FileText size={13} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {attachedFile.name}
          </span>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => setAttachedFile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93c5fd', padding: 0 }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className={`minimal-ai-capsule ${isMultiLine ? 'multiline' : ''}`}>
        {/* Stable Textarea Input — NEVER remounted */}
        <textarea
          ref={textareaRef}
          className="minimal-ai-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or hold to speak"
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        {/* Right Actions: Plus & Mic/Send */}
        <div className="minimal-ai-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
            onChange={handleFileAttach}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="minimal-ai-btn-plus"
            onMouseDown={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Plus size={18} strokeWidth={2.4} />
          </button>

          {/* Glowing Circular Blue/Purple Action Button */}
          {inputText.trim().length > 0 || attachedFile ? (
            <button
              type="button"
              className="minimal-ai-btn-mic"
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
              className="minimal-ai-btn-mic"
              onMouseDown={e => e.preventDefault()}
              onClick={toggleVoiceInput}
              title={isListening ? 'Listening...' : 'Voice message'}
              aria-label="Voice message"
            >
              <Mic size={19} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{MINIMAL_CSS}</style>
      <div className="minimal-ai-canvas">

        {/* ── Top Bar: Minimal Purple Glowing Plus Circle on Right ── */}
        <div className="minimal-ai-topbar">
          <button
            className="minimal-ai-btn-top-plus"
            title="New Chat"
            onMouseDown={e => e.preventDefault()}
            onClick={handleNewChat}
          >
            <Plus size={22} strokeWidth={2.4} />
          </button>
        </div>

        {/* ── Scroll Area: Centered Glowing Ribbon Knot or Active Messages ── */}
        <div className="minimal-ai-scroll">
          {!hasMessages ? (
            /* ── Pure Minimalist Center (Exact Match to Screenshot) ── */
            <div className="minimal-ai-center">
              <div className="minimal-ai-ribbon-wrap">
                {/* Floating sparkles around ribbon */}
                <span className="minimal-ai-sparkle" style={{ top: '8%', left: '0%', fontSize: '11px' }}>✦</span>
                <span className="minimal-ai-sparkle" style={{ top: '15%', right: '4%', fontSize: '13px', animationDelay: '0.8s' }}>✦</span>
                <span className="minimal-ai-sparkle" style={{ bottom: '15%', left: '4%', fontSize: '12px', animationDelay: '1.4s' }}>✦</span>
                <span className="minimal-ai-sparkle" style={{ bottom: '10%', right: '0%', fontSize: '10px', animationDelay: '1.9s' }}>✦</span>

                {/* 3D Glowing Ribbon Emblem */}
                <GlowingRibbonEmblem size={120} />
              </div>
            </div>
          ) : (
            /* ── Active Chat Messages Stream ── */
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column' }}>
              {messages.map(msg => (
                <div key={msg.id} className="minimal-ai-msg-row">
                  <div className={`minimal-ai-bubble ${msg.sender === 'user' ? 'minimal-ai-bubble-user' : 'minimal-ai-bubble-bot'}`}>
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
                            color: '#94a3b8',
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
                    color: '#64748b',
                    marginTop: '3px',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0 4px'
                  }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="minimal-ai-msg-row">
                  <div className="minimal-ai-bubble minimal-ai-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8', animation: 'twinkle-sparkle 1s infinite' }} />
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Floating Capsule Pill Dock at Bottom (Always 100% Visible) ── */}
        {CapsuleInputJSX}

      </div>
    </>
  );
}
