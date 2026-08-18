import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, Plus, Zap, Gem, Image as ImageIcon,
  MessageSquare, Lightbulb, Code2, PenTool,
  Atom, Globe, PlusCircle, ArrowUp, Copy, Check,
  Terminal, X, Paperclip, FileText, Sparkles, Mic,
  Volume2, VolumeX, ArrowRight
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   EXACT 1:1 REPLICA CSS OF THE USER'S MOBILE REFERENCE SCREENSHOT
───────────────────────────────────────────────────────────────── */
const SCREENSHOT_CSS = `
  @keyframes orb-pulse-glow {
    0%, 100% {
      box-shadow: 0 0 35px rgba(99, 102, 241, 0.45), 0 0 70px rgba(59, 130, 246, 0.25);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 50px rgba(99, 102, 241, 0.7), 0 0 90px rgba(168, 85, 247, 0.4);
      transform: scale(1.03);
    }
  }

  @keyframes sparkle-twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50%      { opacity: 1; transform: scale(1.2); }
  }

  @keyframes msg-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Canvas Background: Deep Midnight Navy/Black ── */
  .app-ai-canvas {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 145px);
    background: #060913;
    color: #ffffff;
    position: relative;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
  }

  /* ── Top Bar ── */
  .app-ai-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 8px 20px;
    background: transparent;
    flex-shrink: 0;
    z-index: 20;
  }
  .app-ai-icon-square {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .app-ai-icon-square:active {
    transform: scale(0.92);
  }
  .app-ai-icon-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #111827;
    border: 1.5px solid #a855f7;
    box-shadow: 0 0 14px rgba(168, 85, 247, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .app-ai-icon-circle:active {
    transform: scale(0.92);
  }

  /* ── Scroll Area ── */
  .app-ai-scroll {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Stage ── */
  .app-ai-welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 20px 24px 20px;
    text-align: center;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Central Glowing Star Orb ── */
  .app-ai-orb-wrap {
    position: relative;
    width: 110px;
    height: 110px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .app-ai-orb {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #1e1b4b 0%, #0f172a 60%, #030712 100%);
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: orb-pulse-glow 3.6s infinite ease-in-out;
  }
  .app-ai-orb::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
    z-index: -1;
  }

  /* Tiny sparkles around orb */
  .app-ai-twinkle {
    position: absolute;
    color: #60a5fa;
    animation: sparkle-twinkle 2.4s infinite ease-in-out;
  }

  /* ── Headlines ── */
  .app-ai-greeting {
    font-size: clamp(1.75rem, 6.5vw, 2.25rem);
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 4px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .app-ai-name {
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .app-ai-question {
    font-size: clamp(1.2rem, 4.5vw, 1.5rem);
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 10px 0;
    letter-spacing: -0.01em;
  }
  .app-ai-subtext {
    font-size: 0.88rem;
    color: #94a3b8;
    max-width: 320px;
    line-height: 1.45;
    margin: 0 0 24px 0;
  }

  /* ── 3 Mode Selector Bar ── */
  .app-ai-mode-container {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 9999px;
    padding: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
  }
  .app-ai-mode-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: transparent;
    color: #94a3b8;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .app-ai-mode-btn.active {
    background: #1e3a8a;
    color: #60a5fa;
    border: 1px solid #3b82f6;
    box-shadow: 0 0 16px rgba(59, 130, 246, 0.35);
  }
  .app-ai-mode-caption {
    font-size: 0.78rem;
    color: #64748b;
    margin: 0 0 22px 0;
  }

  /* ── 2x2 Quick Action Cards ── */
  .app-ai-grid-2x2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    margin-bottom: 6px;
  }
  .app-ai-action-card {
    background: #0d1322;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
  }
  .app-ai-action-card:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: #131b2e;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
  .app-ai-action-card:active {
    transform: scale(0.97);
  }
  .app-ai-card-icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .app-ai-card-content {
    flex: 1;
    overflow: hidden;
  }
  .app-ai-card-title {
    font-size: 0.84rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.2;
    margin-bottom: 2px;
  }
  .app-ai-card-desc {
    font-size: 0.72rem;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .app-ai-card-arrow {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    flex-shrink: 0;
  }

  /* ── Glowing Floating Input Card (Exact Replica) ── */
  .app-ai-input-dock {
    padding: 8px 16px calc(env(safe-area-inset-bottom, 0px) + 12px) 16px;
    flex-shrink: 0;
    background: transparent;
    z-index: 30;
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .app-ai-input-card {
    background: #0a0f1d;
    border: 1.5px solid transparent;
    border-radius: 24px;
    background-image: linear-gradient(#0a0f1d, #0a0f1d), linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    padding: 12px 14px 10px 14px;
    box-shadow: 0 0 24px rgba(99, 102, 241, 0.22), 0 8px 32px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    width: 100%;
    transition: box-shadow 0.2s;
  }
  .app-ai-input-card:focus-within {
    box-shadow: 0 0 32px rgba(99, 102, 241, 0.4), 0 8px 36px rgba(0, 0, 0, 0.6);
  }

  /* ── Auto-Growing Textarea (Never remounts) ── */
  .app-ai-textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.45;
    font-family: inherit;
    min-height: 36px;
    max-height: 200px;
    padding: 0 0 6px 0;
    box-sizing: border-box;
    display: block;
    overflow-y: auto;
    -webkit-tap-highlight-color: transparent;
  }
  .app-ai-textarea::placeholder {
    color: #64748b;
    font-size: 0.95rem;
  }

  /* ── Input Bottom Action Row ── */
  .app-ai-action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 4px;
    gap: 8px;
  }
  .app-ai-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 9999px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #111827;
    color: #cbd5e1;
    transition: all 0.16s ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .app-ai-chip.active {
    background: #1e3a8a;
    color: #60a5fa;
    border-color: #3b82f6;
  }
  .app-ai-chip:hover {
    color: #ffffff;
    border-color: #6366f1;
  }

  /* ── Purple Soundwaves / Send Button ── */
  .app-ai-btn-purple-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 16px rgba(168, 85, 247, 0.45);
    transition: transform 0.18s, box-shadow 0.18s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .app-ai-btn-purple-circle:hover {
    transform: scale(1.08);
    box-shadow: 0 0 22px rgba(168, 85, 247, 0.65);
  }
  .app-ai-btn-purple-circle:active {
    transform: scale(0.92);
  }

  /* ── Chat Messages ── */
  .app-ai-msg-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 14px;
    padding: 0 16px;
    box-sizing: border-box;
    animation: msg-fade-in 0.2s ease-out both;
  }
  .app-ai-bubble {
    max-width: 86%;
    padding: 12px 16px;
    font-size: 0.95rem;
    line-height: 1.6;
    border-radius: 20px;
    word-break: break-word;
  }
  .app-ai-bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }
  .app-ai-bubble-bot {
    align-self: flex-start;
    background: #0f172a;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 768px) {
    .app-ai-canvas {
      height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
      min-height: 0;
    }
    .app-ai-topbar {
      padding: 12px 16px 4px 16px;
    }
    .app-ai-greeting {
      font-size: 1.85rem;
    }
    .app-ai-question {
      font-size: 1.25rem;
    }
    .app-ai-grid-2x2 {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .app-ai-action-card {
      padding: 10px 12px;
    }
    .app-ai-input-dock {
      padding: 6px 12px calc(env(safe-area-inset-bottom, 0px) + 8px) 12px;
    }
    .app-ai-textarea {
      font-size: 16px; /* Prevents auto-zoom on iOS */
    }
    .app-ai-bubble {
      max-width: 90%;
      font-size: 0.92rem;
    }
  }
`;

/* ── 4-Pointed Glowing Star SVG for the Orb Center ── */
function GlowingStar({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 0C50 27.614 27.614 50 0 50C27.614 50 50 72.386 50 100C50 72.386 72.386 50 100 50C72.386 50 50 27.614 50 0Z"
        fill="url(#star_grad_cyan_blue)"
      />
      <defs>
        <linearGradient id="star_grad_cyan_blue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Soundwave Bars Icon ── */
function SoundwavesIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="9" x2="5" y2="15" />
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="13" y1="3" x2="13" y2="21" />
      <line x1="17" y1="7" x2="17" y2="17" />
      <line x1="21" y1="10" x2="21" y2="14" />
    </svg>
  );
}

/* ── 4 Quick Actions (Exact Match to Screenshot) ── */
const ACTION_CARDS = [
  {
    id: 'explain',
    title: 'Explain a concept',
    desc: 'in simple terms',
    icon: MessageSquare,
    iconBg: '#1e3a8a',
    iconColor: '#60a5fa',
    query: 'Explain how phishing detection algorithms analyze suspicious URLs in simple terms'
  },
  {
    id: 'ideas',
    title: 'Get ideas',
    desc: 'for anything',
    icon: Lightbulb,
    iconBg: '#4c1d95',
    iconColor: '#c084fc',
    query: 'Give me best security practices and ideas to protect personal accounts from social engineering'
  },
  {
    id: 'code',
    title: 'Write code',
    desc: 'or debug',
    icon: Code2,
    iconBg: '#064e3b',
    iconColor: '#34d399',
    query: 'Show Python ML code for URL feature extraction and Random Forest phishing classification'
  },
  {
    id: 'content',
    title: 'Write content',
    desc: 'emails, blogs & more',
    icon: PenTool,
    iconBg: '#78350f',
    iconColor: '#fbbf24',
    query: 'Write an email security awareness guide warning employees about spear phishing'
  }
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AiChatbot({ t, language = 'English', currentUser, onMenuToggle }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('instant');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [thinkActive, setThinkActive] = useState(false);
  const [searchActive, setSearchActive] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const hasMessages = messages.length > 0;
  const canSend = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;

  // Derive User Display Name (e.g. "Ahmad")
  const getUserName = () => {
    if (currentUser?.name) {
      const first = currentUser.name.split(' ')[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    if (currentUser?.username) {
      const u = currentUser.username;
      return u.charAt(0).toUpperCase() + u.slice(1);
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
    const minH = 36;
    const maxH = window.innerWidth <= 768 ? 180 : 200;
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
        text: '⚠️ Connection issue. Please try again.',
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

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INLINE FLOATING INPUT CARD (EXACT MATCH TO SCREENSHOT)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const InputCardJSX = (
    <div className="app-ai-input-dock">
      <div className="app-ai-input-card">
        {/* File preview tag if attached */}
        {attachedFile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            marginBottom: '6px',
            background: 'rgba(59, 130, 246, 0.18)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: '#60a5fa',
            fontWeight: 600
          }}>
            <FileText size={13} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {attachedFile.name}
            </span>
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => setAttachedFile(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', padding: 0 }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Stable Textarea Input — NEVER remounted */}
        <textarea
          ref={textareaRef}
          className="app-ai-textarea"
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

        {/* Bottom Control Row */}
        <div className="app-ai-action-row">
          {/* Left Chips: Think & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setThinkActive(!thinkActive)}
              className={`app-ai-chip ${thinkActive ? 'active' : ''}`}
            >
              <Atom size={13} />
              <span>Think</span>
            </button>

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => setSearchActive(!searchActive)}
              className={`app-ai-chip ${searchActive ? 'active' : ''}`}
            >
              <Globe size={13} />
              <span>Search</span>
            </button>
          </div>

          {/* Right Controls: Plus & Soundwaves / Send button */}
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
              onMouseDown={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'none',
                border: 'none',
                color: attachedFile ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
              title="Add attachment"
            >
              <PlusCircle size={20} />
            </button>

            {/* Circular Purple Soundwaves or Send Arrow */}
            {inputText.trim().length > 0 || attachedFile ? (
              <button
                type="button"
                className="app-ai-btn-purple-circle"
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
                className="app-ai-btn-purple-circle"
                onMouseDown={e => e.preventDefault()}
                onClick={toggleVoiceInput}
                title={isListening ? 'Listening...' : 'Voice message'}
                aria-label="Voice message"
              >
                <SoundwavesIcon size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{SCREENSHOT_CSS}</style>
      <div className="app-ai-canvas">

        {/* ── Top Bar: Rounded Hamburger Left, Purple Plus Circle Right ── */}
        <div className="app-ai-topbar">
          <button
            className="app-ai-icon-square"
            title="Menu"
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
              if (onMenuToggle) onMenuToggle();
              else {
                const menuBtn = document.querySelector('.hamburger-btn');
                if (menuBtn) menuBtn.click();
              }
            }}
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>

          <button
            className="app-ai-icon-circle"
            title="New Chat"
            onMouseDown={e => e.preventDefault()}
            onClick={handleNewChat}
          >
            <Plus size={22} strokeWidth={2.4} />
          </button>
        </div>

        {/* ── Scrollable Body Area ── */}
        <div className="app-ai-scroll">
          {!hasMessages ? (
            /* ── Welcome Stage (Exact 1:1 Match to Reference Screenshot) ── */
            <div className="app-ai-welcome">
              {/* Glowing Orb with Star & Twinkles */}
              <div className="app-ai-orb-wrap">
                <span className="app-ai-twinkle" style={{ top: '8%', left: '12%', fontSize: '10px' }}>✦</span>
                <span className="app-ai-twinkle" style={{ top: '15%', right: '10%', fontSize: '12px', animationDelay: '0.8s' }}>✦</span>
                <span className="app-ai-twinkle" style={{ bottom: '10%', left: '16%', fontSize: '11px', animationDelay: '1.4s' }}>✦</span>
                <span className="app-ai-twinkle" style={{ bottom: '15%', right: '14%', fontSize: '9px', animationDelay: '1.9s' }}>✦</span>

                <div className="app-ai-orb">
                  <GlowingStar size={42} />
                </div>
              </div>

              {/* Greeting & Headline */}
              <h1 className="app-ai-greeting">
                Hi, <span className="app-ai-name">{getUserName()}!</span> 👋
              </h1>
              <h2 className="app-ai-question">
                How can I help you today?
              </h2>
              <p className="app-ai-subtext">
                Your AI assistant for instant answers, creative ideas, and everyday tasks.
              </p>

              {/* Mode Selector Pill Bar */}
              <div className="app-ai-mode-container">
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setActiveMode('instant')}
                  className={`app-ai-mode-btn ${activeMode === 'instant' ? 'active' : ''}`}
                >
                  <Zap size={14} strokeWidth={2.5} />
                  <span>Instant</span>
                </button>
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setActiveMode('expert')}
                  className={`app-ai-mode-btn ${activeMode === 'expert' ? 'active' : ''}`}
                >
                  <Gem size={14} strokeWidth={2} />
                  <span>Expert</span>
                </button>
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setActiveMode('vision')}
                  className={`app-ai-mode-btn ${activeMode === 'vision' ? 'active' : ''}`}
                >
                  <ImageIcon size={14} strokeWidth={2} />
                  <span>Vision</span>
                </button>
              </div>

              <div className="app-ai-mode-caption">
                {activeMode === 'instant' && 'Instant responses for daily conversations'}
                {activeMode === 'expert' && 'Deep reasoning & advanced analysis'}
                {activeMode === 'vision' && 'Visual scanning & document inspection'}
              </div>

              {/* 2x2 Action Cards */}
              <div className="app-ai-grid-2x2">
                {ACTION_CARDS.map(card => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="app-ai-action-card"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => handleSend(card.query)}
                    >
                      <div className="app-ai-card-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                        <Icon size={18} strokeWidth={2.2} />
                      </div>
                      <div className="app-ai-card-content">
                        <div className="app-ai-card-title">{card.title}</div>
                        <div className="app-ai-card-desc">{card.desc}</div>
                      </div>
                      <div className="app-ai-card-arrow">
                        <ArrowRight size={12} strokeWidth={2.5} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Active Chat Messages Stream ── */
            <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column' }}>
              {messages.map(msg => (
                <div key={msg.id} className="app-ai-msg-item">
                  <div className={`app-ai-bubble ${msg.sender === 'user' ? 'app-ai-bubble-user' : 'app-ai-bubble-bot'}`}>
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
                <div className="app-ai-msg-item">
                  <div className="app-ai-bubble app-ai-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GlowingStar size={16} />
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Floating Input Dock at Bottom ── */}
        {InputCardJSX}

      </div>
    </>
  );
}
