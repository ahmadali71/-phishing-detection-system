import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shield, Plus, ArrowUp, Copy, Check, X, FileText
} from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

const CSS = `
  @keyframes ai-breathe {
    0%,100% { box-shadow:0 0 28px rgba(59,130,246,0.5),0 0 55px rgba(99,102,241,0.25);transform:scale(1); }
    50%     { box-shadow:0 0 44px rgba(59,130,246,0.75),0 0 80px rgba(168,85,247,0.45);transform:scale(1.04); }
  }
  @keyframes ai-orbit {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes ai-fadein {
    from { opacity:0;transform:translateY(8px); }
    to   { opacity:1;transform:translateY(0); }
  }

  .ai-canvas {
    display:flex;flex-direction:column;height:100%;width:100%;
    background:var(--bg-primary,#080c16);color:var(--text-primary,#f8fafc);
    font-family:var(--font-sans,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif);
    box-sizing:border-box;overflow:hidden;flex:1 1 0;min-height:0;position:relative;
  }

  /* ── Scroll area ── */
  .ai-scroll {
    flex:1 1 0;min-height:0;overflow-y:auto;
    display:flex;flex-direction:column;
    -webkit-overflow-scrolling:touch;
  }

  /* ── Welcome Hero (in scroll, above input) ── */
  .ai-hero {
    flex:1 1 auto;display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:32px 20px 20px 20px;text-align:center;
    animation:ai-fadein 0.35s ease-out both;
  }
  .ai-logo-wrap {
    position:relative;width:88px;height:88px;
    display:flex;align-items:center;justify-content:center;
    margin-bottom:16px;flex-shrink:0;
  }
  .ai-logo-ring {
    position:absolute;inset:-8px;border-radius:50%;
    border:1.5px dashed rgba(99,102,241,0.45);
    animation:ai-orbit 14s linear infinite;
  }
  .ai-logo-core {
    width:72px;height:72px;border-radius:22px;
    background:linear-gradient(135deg,#2563eb 0%,#4f46e5 55%,#7c3aed 100%);
    display:flex;align-items:center;justify-content:center;color:#fff;
    animation:ai-breathe 4s ease-in-out infinite;
  }
  .ai-brand-name {
    font-size:1.1rem;font-weight:800;
    font-family:var(--font-display,'Outfit',sans-serif);
    background:linear-gradient(135deg,#60a5fa 0%,#a78bfa 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    margin:0 0 5px;letter-spacing:-0.01em;
  }
  .ai-online-badge {
    display:inline-flex;align-items:center;gap:6px;
    padding:3px 12px;border-radius:9999px;
    background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.28);
    font-size:0.72rem;font-weight:700;color:#10b981;margin-bottom:18px;
  }
  .ai-badge-dot {
    width:6px;height:6px;border-radius:50%;
    background:#10b981;box-shadow:0 0 6px #10b981;
  }
  .ai-greeting {
    font-size:clamp(1.4rem,5.5vw,1.9rem);font-weight:800;
    font-family:var(--font-display,'Outfit',sans-serif);
    color:var(--text-primary,#f8fafc);
    letter-spacing:-0.02em;margin:0 0 5px;line-height:1.25;
  }
  .ai-greeting span {
    background:linear-gradient(135deg,#60a5fa,#a78bfa);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .ai-greeting-sub {
    font-size:0.88rem;color:var(--text-muted,#8493a8);margin:0;
  }

  /* ── Chat stream ── */
  .ai-chat-stream {
    padding:12px 0;display:flex;flex-direction:column;
  }
  .ai-msg-row {
    display:flex;flex-direction:column;width:100%;
    margin-bottom:12px;padding:0 16px;box-sizing:border-box;
    animation:ai-fadein 0.2s ease-out both;
  }
  .ai-bubble {
    max-width:88%;padding:12px 16px;
    font-size:0.95rem;line-height:1.6;
    border-radius:20px;word-break:break-word;
  }
  .ai-bubble-user {
    align-self:flex-end;
    background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);
    color:#fff;border-bottom-right-radius:4px;
    box-shadow:0 4px 14px rgba(37,99,235,0.3);
  }
  .ai-bubble-bot {
    align-self:flex-start;
    background:var(--bg-card,#141f36);color:var(--text-primary,#f8fafc);
    border:1px solid var(--border-color,rgba(255,255,255,0.08));
    border-bottom-left-radius:4px;box-shadow:0 4px 14px rgba(0,0,0,0.15);
  }
  .ai-msg-time {
    font-size:0.68rem;color:var(--text-muted,#8493a8);margin-top:3px;padding:0 4px;
  }
  .ai-copy-btn {
    background:none;border:none;cursor:pointer;color:var(--text-muted,#8493a8);
    font-size:0.74rem;display:flex;align-items:center;gap:4px;margin-top:6px;
  }
  .ai-new-chat-btn {
    background:var(--bg-card,#141f36);
    border:1px solid var(--border-color,rgba(255,255,255,0.12));
    border-radius:9999px;color:var(--text-muted,#8493a8);
    padding:4px 14px;font-size:0.74rem;font-weight:700;
    cursor:pointer;font-family:inherit;
    transition:border-color 0.15s,color 0.15s;
  }
  .ai-new-chat-btn:hover { border-color:#3b82f6;color:#3b82f6; }

  /* ── THE ONE INPUT BOX — always same style, always at bottom ── */
  .ai-input-dock {
    flex-shrink:0;
    padding:10px 16px calc(env(safe-area-inset-bottom,0px) + 12px) 16px;
    width:100%;max-width:600px;margin:0 auto;box-sizing:border-box;
  }
  .ai-input-box {
    width:100%;
    background:var(--bg-card,#141f36);
    border:1.5px solid var(--border-color,rgba(255,255,255,0.12));
    border-radius:18px;
    padding:14px 14px 10px 16px;
    box-sizing:border-box;
    display:flex;flex-direction:column;gap:10px;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    transition:border-color 0.2s,box-shadow 0.2s;
  }
  .ai-input-box:focus-within {
    border-color:#3b82f6;
    box-shadow:0 0 28px rgba(59,130,246,0.3),0 8px 32px rgba(0,0,0,0.35);
  }
  .ai-input-textarea {
    width:100%;min-height:52px;max-height:180px;
    border:none;outline:none;resize:none;
    background:transparent;color:var(--text-primary,#f8fafc);
    font-size:1rem;line-height:1.55;font-family:inherit;
    box-sizing:border-box;overflow-y:auto;
    -webkit-tap-highlight-color:transparent;
  }
  .ai-input-textarea::placeholder { color:var(--text-muted,#8493a8);font-size:0.96rem; }
  .ai-input-footer {
    display:flex;align-items:center;justify-content:space-between;gap:8px;
  }
  .ai-attach-btn {
    width:32px;height:32px;border-radius:8px;
    border:1px solid var(--border-color,rgba(255,255,255,0.1));
    background:var(--bg-input,rgba(255,255,255,0.04));
    color:var(--text-muted,#8493a8);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all 0.15s ease;
    -webkit-tap-highlight-color:transparent;flex-shrink:0;
  }
  .ai-attach-btn:hover { color:#3b82f6;border-color:#3b82f6; }
  .ai-send-btn {
    height:36px;padding:0 18px;border-radius:9px;border:none;
    background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);
    color:#fff;font-size:0.84rem;font-weight:700;font-family:inherit;
    display:flex;align-items:center;gap:6px;cursor:pointer;
    box-shadow:0 4px 14px rgba(37,99,235,0.4);
    transition:transform 0.18s,box-shadow 0.18s;flex-shrink:0;
    -webkit-tap-highlight-color:transparent;
  }
  .ai-send-btn:hover { transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,99,235,0.55); }
  .ai-send-btn:active { transform:scale(0.95); }
  .ai-send-btn:disabled { opacity:0.4;cursor:not-allowed;transform:none; }

  /* file badge */
  .ai-file-badge {
    display:flex;align-items:center;gap:6px;padding:4px 12px;
    border-radius:9999px;background:rgba(59,130,246,0.15);
    border:1px solid rgba(59,130,246,0.3);
    font-size:0.76rem;color:#60a5fa;font-weight:600;
    width:100%;box-sizing:border-box;margin-bottom:4px;
  }
  .ai-file-badge span { flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .ai-file-badge button {
    background:none;border:none;cursor:pointer;color:#60a5fa;padding:0;
    display:flex;align-items:center;
  }

  @media (max-width:768px) {
    .ai-canvas { height:100%;border-radius:0;border:none; }
    .ai-hero { padding:20px 14px 12px 14px; }
    .ai-greeting { font-size:1.45rem; }
    .ai-input-dock { padding:8px 12px calc(env(safe-area-inset-bottom,0px) + 8px) 12px; }
    .ai-input-textarea { font-size:16px;min-height:44px; }
  }
`;

export default function AiChatbot({ t, language = 'English', currentUser }) {
  const [messages, setMessages]   = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [copiedId, setCopiedId]   = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);   // single stable ref — never remounts
  const fileInputRef   = useRef(null);

  const hasMessages = messages.length > 0;
  const canSend = (inputText.trim().length > 0 || !!attachedFile) && !isTyping;

  const getUserName = () => {
    const raw = currentUser?.name || currentUser?.username || '';
    if (raw && !raw.toLowerCase().includes('system') && !raw.toLowerCase().includes('admin')) {
      const first = raw.split(' ')[0];
      return first.charAt(0).toUpperCase() + first.slice(1);
    }
    return 'Ahmad';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxH = window.innerWidth <= 768 ? 140 : 180;
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  }, []);

  useEffect(() => { autoResize(); }, [inputText, autoResize]);

  const handleSend = async (override) => {
    const base = typeof override === 'string' ? override.trim() : inputText.trim();
    const fileNote = attachedFile ? `\n\n[Attached: ${attachedFile.name}]\n${attachedFile.content}` : '';
    const query = (base + fileNote).trim();
    if (!query || isTyping) return;

    const ts = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    const userMsg = { id: Date.now(), sender:'user', text:base, fileInfo:attachedFile?.name||null, time:ts };

    setMessages(p => [...p, userMsg]);
    setInputText('');
    setAttachedFile(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
      const res = await generateChatbotResponse(query, [...messages, userMsg], language);
      setIsTyping(false);
      const tb = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
      setMessages(p => [...p, { id:Date.now()+1, sender:'bot', text:res.text, time:tb }]);
    } catch {
      setIsTyping(false);
      const tb = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
      setMessages(p => [...p, { id:Date.now()+1, sender:'bot', text:'⚠️ Connection error. Please try again.', time:tb }]);
    }
  };

  const handleFileAttach = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAttachedFile({ name:file.name, content:ev.target.result?.toString().slice(0,4000)||'' });
    reader.readAsText(file); e.target.value = '';
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopiedId(id); setTimeout(()=>setCopiedId(null), 1800);
  };

  const handleNewChat = () => { setMessages([]); setInputText(''); setAttachedFile(null); };

  const handleKeyDown = e => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (e.key === 'Enter' && !e.shiftKey && !isTouch) { e.preventDefault(); handleSend(); }
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     THE ONE INPUT BOX — renders once, never changes
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const InputBoxJSX = (
    <div className="ai-input-dock">
      {attachedFile && (
        <div className="ai-file-badge">
          <FileText size={13}/>
          <span>{attachedFile.name}</span>
          <button onMouseDown={e=>e.preventDefault()} onClick={()=>setAttachedFile(null)}>
            <X size={13}/>
          </button>
        </div>
      )}

      <div className="ai-input-box">
        {/* SINGLE stable textarea — inline JSX, never a sub-component */}
        <textarea
          ref={textareaRef}
          className="ai-input-textarea"
          value={inputText}
          onInput={autoResize}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask APDS AI anything, or paste a suspicious URL..."
          rows={2}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={false}
        />

        <div className="ai-input-footer">
          <button
            type="button"
            className="ai-attach-btn"
            onMouseDown={e=>e.preventDefault()}
            onClick={()=>fileInputRef.current?.click()}
            title="Attach file"
          >
            <Plus size={17} strokeWidth={2.4}/>
          </button>

          <button
            type="button"
            className="ai-send-btn"
            onMouseDown={e=>e.preventDefault()}
            onClick={()=>handleSend()}
            disabled={!canSend}
          >
            <ArrowUp size={15} strokeWidth={2.8}/> Send
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.eml,.csv,.json,.py,.md,.log,.msg"
        onChange={handleFileAttach}
        style={{ display:'none' }}
      />

      <div className="ai-canvas">

        {/* ── Scroll area: hero OR chat stream ── */}
        <div className="ai-scroll">

          {!hasMessages ? (
            /* Welcome hero — logo + greeting only, no input here */
            <div className="ai-hero">
              <div className="ai-logo-wrap">
                <div className="ai-logo-ring"/>
                <div className="ai-logo-core">
                  <Shield size={36} strokeWidth={2.2}/>
                </div>
              </div>

              <div className="ai-brand-name">APDS Sentinel AI</div>
              <div className="ai-online-badge">
                <span className="ai-badge-dot"/>
                <span>Neural ML Online · 94.6% Accuracy</span>
              </div>

              <h1 className="ai-greeting">
                Hi, <span>{getUserName()}!</span> 👋
              </h1>
              <p className="ai-greeting-sub">How can I help protect your security today?</p>
            </div>
          ) : (
            /* Chat messages stream */
            <div className="ai-chat-stream">
              <div style={{ display:'flex', justifyContent:'flex-end', padding:'0 16px 8px 16px' }}>
                <button className="ai-new-chat-btn" onMouseDown={e=>e.preventDefault()} onClick={handleNewChat}>
                  + New Chat
                </button>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className="ai-msg-row">
                  <div className={`ai-bubble ${msg.sender==='user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
                    {msg.fileInfo && (
                      <div style={{ display:'flex',alignItems:'center',gap:5,marginBottom:6,fontSize:'0.78rem',fontWeight:700,opacity:0.9 }}>
                        <FileText size={13}/> {msg.fileInfo}
                      </div>
                    )}
                    <div style={{ whiteSpace:'pre-line' }}>{msg.text}</div>
                    {msg.sender==='bot' && (
                      <button className="ai-copy-btn" onMouseDown={e=>e.preventDefault()} onClick={()=>handleCopy(msg.text,msg.id)}>
                        {copiedId===msg.id ? <><Check size={12} color="#10b981"/> Copied</> : <><Copy size={12}/> Copy</>}
                      </button>
                    )}
                  </div>
                  <span className="ai-msg-time" style={{ alignSelf: msg.sender==='user'?'flex-end':'flex-start' }}>
                    {msg.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="ai-msg-row">
                  <div className="ai-bubble ai-bubble-bot" style={{ display:'flex',alignItems:'center',gap:8 }}>
                    <Shield size={14} color="#3b82f6"/>
                    <span style={{ fontSize:'0.84rem',color:'var(--text-muted,#8493a8)' }}>Analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}/>
            </div>
          )}
        </div>

        {/* ── THE ONE INPUT BOX — always at bottom, never changes ── */}
        {InputBoxJSX}

      </div>
    </>
  );
}
