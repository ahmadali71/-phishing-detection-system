import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Menu, Plus, Mic, ArrowUp, Copy, Check, Terminal,
  RefreshCw, X, Paperclip, FileText, Sparkles, Volume2, VolumeX,
  Send, Bot, User, Wand2, Globe, Shield, Zap
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

/* ─────────────────────────────────────────────────────────────────
   MODERN AI CHAT INTERFACE CSS
   Sleek dark/light design with smooth animations
───────────────────────────────────────────────────────────────── */
const CHAT_CSS = `
  @keyframes chat-fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes chat-slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes chat-pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50%      { transform: scale(1.08); opacity: 1; }
  }
  @keyframes chat-dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-6px); opacity: 1; }
  }
  @keyframes chat-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes chat-float {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }

  /* ── Root Container ── */
  .chat-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: calc(100vh - 145px);
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
    position: relative;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Outfit', Roboto, sans-serif;
  }
  .dark-theme .chat-root,
  body:not(.light-theme) .chat-root {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  }

  /* ── Animated Background Orbs ── */
  .chat-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }
  .chat-bg-orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%);
    top: -100px;
    right: -100px;
    animation: chat-float 8s ease-in-out infinite;
  }
  .chat-bg-orb-2 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%);
    bottom: -80px;
    left: -80px;
    animation: chat-float 10s ease-in-out infinite reverse;
  }

  /* ── Top Navigation Bar ── */
  .chat-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 8px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
    z-index: 20;
    position: relative;
  }
  .dark-theme .chat-top-bar,
  body:not(.light-theme) .chat-top-bar {
    background: rgba(15, 23, 42, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .chat-top-bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .chat-top-bar-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.01em;
  }
  .dark-theme .chat-top-bar-title,
  body:not(.light-theme) .chat-top-bar-title {
    color: #f1f5f9;
  }
  .chat-top-bar-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .chat-top-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 12px;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .chat-top-btn:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #0f172a;
  }
  .dark-theme .chat-top-btn,
  body:not(.light-theme) .chat-top-btn {
    color: #94a3b8;
  }
  .dark-theme .chat-top-btn:hover,
  body:not(.light-theme) .chat-top-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f1f5f9;
  }

  /* ── Messages Area ── */
  .chat-messages {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    position: relative;
    z-index: 1;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Welcome Screen ── */
  .chat-welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    text-align: center;
    animation: chat-fade-in 0.6s ease-out;
  }
  .chat-welcome-icon {
    position: relative;
    margin-bottom: 24px;
    animation: chat-pulse 3s ease-in-out infinite;
  }
  .chat-welcome-icon::before {
    content: '';
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent 70%);
    border-radius: 50%;
    animation: chat-pulse 3s ease-in-out infinite;
  }
  .chat-welcome-title {
    font-size: clamp(1.8rem, 6vw, 2.4rem);
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 8px;
    letter-spacing: -0.03em;
  }
  .chat-welcome-subtitle {
    font-size: 1rem;
    color: #64748b;
    margin: 0 0 32px;
    font-weight: 500;
  }
  .dark-theme .chat-welcome-subtitle,
  body:not(.light-theme) .chat-welcome-subtitle {
    color: #94a3b8;
  }

  /* ── Suggested Prompts ── */
  .chat-suggestions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 600px;
    animation: chat-slide-up 0.6s ease-out 0.2s both;
  }
  .chat-suggestion {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-size: 0.88rem;
    color: #334155;
    font-weight: 500;
    line-height: 1.4;
  }
  .chat-suggestion:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
  }
  .dark-theme .chat-suggestion,
  body:not(.light-theme) .chat-suggestion {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #cbd5e1;
  }
  .dark-theme .chat-suggestion:hover,
  body:not(.light-theme) .chat-suggestion:hover {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(99, 102, 241, 0.4);
  }
  .chat-suggestion-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .chat-suggestion-icon.purple { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; }
  .chat-suggestion-icon.blue   { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
  .chat-suggestion-icon.green  { background: linear-gradient(135deg, #10b981, #059669); color: white; }
  .chat-suggestion-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }

  /* ── Message Bubbles ── */
  .chat-msg-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    padding: 0 20px;
    animation: chat-fade-in 0.3s ease-out;
  }
  .chat-msg-row.user  { align-items: flex-end; }
  .chat-msg-row.bot   { align-items: flex-start; }

  .chat-bubble {
    max-width: 85%;
    padding: 14px 18px;
    border-radius: 20px;
    font-size: 0.95rem;
    line-height: 1.6;
    word-break: break-word;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  .chat-bubble-user {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-bottom-right-radius: 6px;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  }
  .chat-bubble-bot {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    color: #1f2937;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-bottom-left-radius: 6px;
  }
  .dark-theme .chat-bubble-bot,
  body:not(.light-theme) .chat-bubble-bot {
    background: rgba(30, 41, 59, 0.9);
    color: #f1f5f9;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .chat-msg-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    padding: 0 4px;
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 500;
  }
  .chat-msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.75rem;
    font-weight: 700;
  }
  .chat-msg-avatar.user-avatar {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
  }
  .chat-msg-avatar.bot-avatar {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
  }

  /* ── Typing Indicator ── */
  .chat-typing {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    margin-bottom: 20px;
    animation: chat-fade-in 0.3s ease-out;
  }
  .chat-typing-dots {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    border-bottom-left-radius: 6px;
  }
  .dark-theme .chat-typing-dots,
  body:not(.light-theme) .chat-typing-dots {
    background: rgba(30, 41, 59, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .chat-typing-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6366f1;
    animation: chat-dot-bounce 1.4s ease-in-out infinite;
  }
  .chat-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .chat-typing-dot:nth-child(3) { animation-delay: 0.4s; }

  /* ── Input Area ── */
  .chat-input-area {
    padding: 12px 20px calc(env(safe-area-inset-bottom, 0px) + 16px);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
    position: relative;
    z-index: 20;
  }
  .dark-theme .chat-input-area,
  body:not(.light-theme) .chat-input-area {
    background: rgba(15, 23, 42, 0.8);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .chat-input-card {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: white;
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: 8px 8px 8px 18px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.2s;
  }
  .chat-input-card:focus-within {
    border-color: #6366f1;
    box-shadow: 0 6px 28px rgba(99, 102, 241, 0.15), 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .dark-theme .chat-input-card,
  body:not(.light-theme) .chat-input-card {
    background: #1e293b;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }
  .chat-input-textarea {
    flex: 1 1 0;
    min-width: 0;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: #0f172a;
    font-size: 0.95rem;
    line-height: 1.5;
    font-family: inherit;
    padding: 8px 0;
    max-height: 140px;
    min-height: 24px;
  }
  .dark-theme .chat-input-textarea,
  body:not(.light-theme) .chat-input-textarea {
    color: #f1f5f9;
  }
  .chat-input-textarea::placeholder {
    color: #94a3b8;
    font-size: 0.95rem;
  }
  .chat-input-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .chat-input-btn.attach {
    background: transparent;
    color: #64748b;
  }
  .chat-input-btn.attach:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #0f172a;
  }
  .dark-theme .chat-input-btn.attach,
  body:not(.light-theme) .chat-input-btn.attach {
    color: #94a3b8;
  }
  .dark-theme .chat-input-btn.attach:hover,
  body:not(.light-theme) .chat-input-btn.attach:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #f1f5f9;
  }
  .chat-input-btn.send {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.35);
  }
  .chat-input-btn.send:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
  }
  .chat-input-btn.send:active {
    transform: scale(0.95);
  }
  .chat-input-btn.send:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
  .chat-input-btn.mic.listening {
    background: #ef4444;
    color: white;
    animation: chat-pulse 1.5s ease-in-out infinite;
  }

  /* ── File Preview ── */
  .chat-file-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    margin: 0 20px 8px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 16px;
    font-size: 0.82rem;
    color: #6366f1;
    font-weight: 600;
  }

  /* ── Mobile Responsive ── */
  @media (max-width: 768px) {
    .chat-root {
      min-height: calc(100dvh - 65px - env(safe-area-inset-bottom, 0px));
    }
    .chat-top-bar {
      padding: 12px 16px 6px;
    }
    .chat-welcome {
      padding: 30px 16px;
    }
    .chat-welcome-title {
      font-size: 1.6rem;
    }
    .chat-suggestions {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 0 4px;
    }
    .chat-bubble {
      max-width: 90%;
      padding: 12px 14px;
      font-size: 0.9rem;
    }
    .chat-input-area {
      padding: 10px 12px calc(env(safe-area-inset-bottom, 0px) + 12px);
    }
    .chat-input-card {
      padding: 6px 6px 6px 14px;
      border-radius: 20px;
    }
    .chat-input-textarea {
      font-size: 16px;
    }
  }
`;

/* ── Modern Bot Avatar with Gradient ── */
function BotAvatar() {
  return (
    <div className="chat-msg-avatar bot-avatar" style={{
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Sparkles size={14} color="white" />
    </div>
  );
}

/* ── Modern User Avatar ── */
function UserAvatar({ name }) {
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  return (
    <div className="chat-msg-avatar user-avatar" style={{
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {initial}
    </div>
  );
}

/* ── Suggested Prompt Cards ── */
function SuggestedPrompts({ onSelect }) {
  const suggestions = [
    {
      icon: <Shield size={18} />,
      color: 'purple',
      title: 'Phishing Detection',
      text: 'How can I identify a phishing email?'
    },
    {
      icon: <Globe size={18} />,
      color: 'blue',
      title: 'URL Safety Check',
      text: 'Check if a website is safe to visit'
    },
    {
      icon: <Wand2 size={18} />,
      color: 'green',
      title: 'Security Tips',
      text: 'Best practices for online safety'
    },
    {
      icon: <Zap size={18} />,
      color: 'orange',
      title: 'Quick Scan',
      text: 'Analyze a suspicious link or message'
    }
  ];

  return (
    <div className="chat-suggestions">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="chat-suggestion"
          onClick={() => onSelect(s.text)}
          type="button"
        >
          <div className={`chat-suggestion-icon ${s.color}`}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '2px' }}>
              {s.title}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.8, lineHeight: '1.3' }}>
              {s.text}
            </div>
          </div>
        </button>
      ))}
    </div>
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

  const getUserName = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ')[0];
    }
    if (currentUser?.username) {
      return currentUser.username;
    }
    return 'there';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = 24;
    const maxH = window.innerWidth <= 768 ? 120 : 160;
    const targetH = Math.min(Math.max(el.scrollHeight, minH), maxH);
    el.style.height = `${targetH}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [inputText, autoResize]);

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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputText('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e) => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (e.key === 'Enter' && !e.shiftKey && !isTouch) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionSelect = (text) => {
    handleSend(text);
  };

  return (
    <>
      <style>{CHAT_CSS}</style>
      <div className="chat-root">
        {/* Background Orbs */}
        <div className="chat-bg-orb chat-bg-orb-1" />
        <div className="chat-bg-orb chat-bg-orb-2" />

        {/* Top Bar */}
        <div className="chat-top-bar">
          <div className="chat-top-bar-left">
            <button
              className="chat-top-btn"
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
            <div>
              <div className="chat-top-bar-title">APDS Assistant</div>
            </div>
            <div className="chat-top-bar-badge">
              <Sparkles size={12} />
              AI Powered
            </div>
          </div>
          {hasMessages && (
            <button
              className="chat-top-btn"
              title="New Chat"
              onClick={handleNewChat}
            >
              <Plus size={20} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {!hasMessages ? (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Sparkles size={40} color="white" strokeWidth={2} />
                </div>
              </div>
              <h1 className="chat-welcome-title">
                Hello, {getUserName()}!
              </h1>
              <p className="chat-welcome-subtitle">
                I'm your APDS security assistant. How can I help you today?
              </p>
              <SuggestedPrompts onSelect={handleSuggestionSelect} />
            </div>
          ) : (
            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`chat-msg-row ${msg.sender}`}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', maxWidth: '100%' }}>
                    {msg.sender === 'bot' && <BotAvatar />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                        {msg.fileInfo && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '8px',
                            padding: '6px 10px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 600
                          }}>
                            <FileText size={13} />
                            {msg.fileInfo}
                          </div>
                        )}
                        <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                        {msg.sender === 'bot' && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                            <button
                              onClick={() => handleCopy(msg.text, msg.id)}
                              style={{
                                background: 'rgba(0,0,0,0.1)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'inherit',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                fontSize: '0.74rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 600
                              }}
                            >
                              {copiedId === msg.id ? <><Check size={12} color="#10b981" /> Copied</> : <><Copy size={12} /> Copy</>}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="chat-msg-meta">
                        <span>{msg.time}</span>
                      </div>
                    </div>
                    {msg.sender === 'user' && <UserAvatar name={currentUser?.name} />}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-typing">
                  <BotAvatar />
                  <div className="chat-typing-dots">
                    <div className="chat-typing-dot" />
                    <div className="chat-typing-dot" />
                    <div className="chat-typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          {attachedFile && (
            <div className="chat-file-preview">
              <FileText size={14} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6366f1',
                  padding: 0,
                  display: 'flex'
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="chat-input-card">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.eml,.csv,.json,.py,.md,.log"
              onChange={handleFileAttach}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="chat-input-btn attach"
              onMouseDown={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
            >
              <Paperclip size={18} strokeWidth={2} />
            </button>
            <textarea
              ref={textareaRef}
              className="chat-input-textarea"
              value={inputText}
              onInput={autoResize}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask APDS Assistant..."
              rows={1}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck={false}
            />
            {inputText.trim().length > 0 || attachedFile ? (
              <button
                type="button"
                className="chat-input-btn send"
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSend()}
                disabled={!canSend}
                title="Send message"
                aria-label="Send message"
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                className={`chat-input-btn mic ${isListening ? 'listening' : ''}`}
                onMouseDown={e => e.preventDefault()}
                onClick={toggleVoiceInput}
                title={isListening ? 'Listening...' : 'Voice input'}
                aria-label="Voice input"
              >
                <Mic size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
