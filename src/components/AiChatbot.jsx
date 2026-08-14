import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, RefreshCw, Sparkles, Copy, Check, Terminal, Shield, Zap, HelpCircle } from 'lucide-react';
import { generateChatbotResponse } from '../utils/chatbotEngine';

export default function AiChatbot({ t, language = 'English' }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `👋 **Welcome to APDS AI Cyber Defense Assistant!**\n\nI am connected directly to our real-time ML detection pipeline. You can:\n• Paste **ANY URL link** or **Email text** for instant real-time security scanning.\n• Ask cybersecurity questions about attack vectors, MFA bypass, or SSL protocols.\n• Request Python ML code snippets for URL feature extraction!`,
      time: 'Just now',
    }
  ]);
  const [activeSuggestions, setActiveSuggestions] = useState([
    'Scan paypal-secure-login.com', 'What is typosquatting?', 'Show Python ML code', 'Project Authors & Supervisor'
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend = inputText) => {
    const query = typeof textToSend === 'string' ? textToSend.trim() : '';
    if (!query || isTyping) return;

    const userMsgId = Date.now();
    const userMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await generateChatbotResponse(query, [...messages, userMessage], language);
      setIsTyping(false);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (response.suggestions) {
        setActiveSuggestions(response.suggestions);
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ **Connection Error**\n\nCould not reach the AI service. Please check your internet connection and try again. You can still use the built-in URL and email scanners!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to render formatted markdown including code blocks and bolding
  const renderMessageContent = (content, msgId) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const languageName = lines[0].trim() || 'code';
        const codeContent = lines.slice(1).join('\n');

        return (
          <div key={index} style={{
            margin: '12px 0',
            background: '#070b14',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 14px',
              background: '#0f172a',
              borderBottom: '1px solid #1e293b',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
                <Terminal size={14} color="#3b82f6" /> {languageName}
              </span>
              <button
                onClick={() => handleCopyText(codeContent, `${msgId}-${index}`)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedId === `${msgId}-${index}` ? <><Check size={13} color="#10b981" /> Copied</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
            <pre style={{
              padding: '12px 14px',
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#38bdf8',
              overflowX: 'auto',
              lineHeight: '1.4'
            }}>
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Render regular markdown with bolding and bullet highlights
      return (
        <div key={index} style={{ whiteSpace: 'pre-line' }}>
          {part}
        </div>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '980px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">Module 03</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Real-Time NLU Security Engine</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: '800' }}>{t.chatbotTitle || 'AI Security Assistant & Live Scanner'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            {t.chatbotDesc || 'Interactive conversational AI. Ask cybersecurity questions or paste links and email text directly for instant security analysis.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleSendMessage('Scan paypal-secure-login.com')}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <Zap size={14} color="#f59e0b" /> Test Phishing Scan
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="glass-panel glass-panel-glow" style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px'
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-card-header)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
              flexShrink: 0
            }}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-primary)' }}>APDS Cyber Intelligence Assistant</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Real-Time Dynamic Neural Model Active
              </div>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.74rem' }}
            title="Reset Chat History"
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>

        {/* Message Stream */}
        <div className="chat-messages" style={{
          minHeight: '320px',
          maxHeight: 'clamp(320px, 55vh, 520px)',
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: 'var(--bg-primary)'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: msg.sender === 'bot' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
                alignSelf: 'flex-start',
                boxShadow: msg.sender === 'bot' ? '0 0 10px rgba(168, 85, 247, 0.3)' : '0 0 10px rgba(37, 99, 235, 0.3)'
              }}>
                {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
              </div>

              {/* Bubble Body */}
              <div style={{ maxWidth: '100%' }}>
                <div className={`chat-bubble ${msg.sender === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}`} style={{
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'user' ? 'var(--chat-bubble-user-bg)' : 'var(--bg-card)',
                  color: msg.sender === 'user' ? 'var(--chat-bubble-user-text)' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.55',
                  boxShadow: 'var(--shadow-card)',
                  border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
                }}>
                  {renderMessageContent(msg.text, msg.id)}
                </div>

                <div style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <span>{msg.time}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleCopyText(msg.text, msg.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.68rem'
                      }}
                    >
                      {copiedId === msg.id ? <><Check size={11} color="#10b981" /> Copied</> : <><Copy size={11} /> Copy</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* AI Thinking Animation Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', maxWidth: '85%' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Bot size={18} />
              </div>
              <div style={{
                padding: '12px 18px',
                borderRadius: '18px 18px 18px 4px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: '700' }}>
                  APDS AI Analyzing & Reasoning...
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 0.8s infinite alternate' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {activeSuggestions && activeSuggestions.length > 0 && (
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-card-header)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}>
            {activeSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
              >
                💡 {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div style={{
          padding: '14px 18px',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t.chatPlaceholder || "Type a question or paste a URL / email text to analyze live..."}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '12px 20px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputText.trim()}
            className="btn-primary"
            style={{ borderRadius: '20px', padding: '12px 24px', flexShrink: 0 }}
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
