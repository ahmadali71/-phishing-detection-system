import React, { useState, useEffect, useRef } from 'react';
import {
  Mail, Lock, User, Eye, EyeOff, Shield, Loader2, CheckCircle2,
  AlertCircle, ArrowRight, ArrowLeft, UserPlus, LogIn,
  Link2, Globe, MessageSquare, Image, Bot, ShieldCheck
} from 'lucide-react';
import { usersService } from '../firebase/services';

// Animated particle canvas for the hero side
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      // Draw connecting lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setSize);
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

export default function AuthPage({ onLoginSuccess, onNavigateHome, initialMode = 'login' }) {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [animating, setAnimating] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#334155' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
    return { score: 4, label: 'Strong', color: '#10b981' };
  };

  const pwStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); setErrorMsg(''); setSuccessMsg('');
    try {
      if (isRegister) {
        if (password.length < 6) { setErrorMsg('Password must be at least 6 characters'); setIsLoading(false); return; }
        if (password !== confirmPassword) { setErrorMsg('Passwords do not match'); setIsLoading(false); return; }
        if (!agreeTerms) { setErrorMsg('Please accept Terms & Conditions'); setIsLoading(false); return; }
        const user = await usersService.register({ name: fullName, email, password });
        setSuccessMsg('Account created! Signing you in...');
        setTimeout(() => { if (onLoginSuccess) onLoginSuccess(user); }, 1000);
      } else {
        const user = await usersService.login({ email, password });
        setSuccessMsg('Welcome back!');
        setTimeout(() => { if (onLoginSuccess) onLoginSuccess(user); }, 800);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally { setIsLoading(false); }
  };

  const switchMode = (toRegister) => {
    setAnimating(true);
    setTimeout(() => {
      setIsRegister(toRegister);
      setErrorMsg(''); setSuccessMsg(''); setPassword(''); setConfirmPassword('');
      setAnimating(false);
    }, 200);
  };

  const features = [
    { icon: <Globe size={18} />, title: 'URL Detection', desc: 'Real-time phishing link analysis' },
    { icon: <Mail size={18} />, title: 'Email Scanner', desc: 'BEC & spoofing detection' },
    { icon: <Image size={18} />, title: 'Image Analysis', desc: 'Visual phishing via OCR' },
    { icon: <MessageSquare size={18} />, title: 'SMS Scanner', desc: 'Smishing threat detection' },
    { icon: <Bot size={18} />, title: 'AI Assistant', desc: 'Cyber threat intelligence' },
    { icon: <ShieldCheck size={18} />, title: 'Scan History', desc: 'Full audit trail & reports' },
  ];

  return (
    <div className="auth-root">
      {/* ── LEFT HERO PANEL ── */}
      <div className="auth-hero">
        <ParticleCanvas />
        <div className="auth-hero-content">
          {/* Back button */}
          {onNavigateHome && (
            <button onClick={onNavigateHome} className="auth-back-btn" type="button">
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
          )}

          {/* Brand */}
          <div className="auth-hero-brand">
            <div className="auth-hero-shield">
              <Shield size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="auth-hero-title">APDS</h1>
              <p className="auth-hero-subtitle">Automated Phishing Detection System</p>
            </div>
          </div>

          {/* Headline */}
          <div className="auth-hero-headline">
            <h2>Defend Against<br /><span className="auth-hero-accent">Cyber Threats</span></h2>
            <p>AI-powered phishing detection across URLs, emails, images, and SMS messages — all in one platform.</p>
          </div>

          {/* Feature grid */}
          <div className="auth-features-grid">
            {features.map((f, i) => (
              <div key={i} className="auth-feature-item">
                <div className="auth-feature-icon">{f.icon}</div>
                <div>
                  <div className="auth-feature-title">{f.title}</div>
                  <div className="auth-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="auth-stats-bar">
            <div className="auth-stat">
              <span className="auth-stat-num">99.2%</span>
              <span className="auth-stat-lbl">Detection Rate</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-num">&lt;0.1s</span>
              <span className="auth-stat-lbl">Scan Speed</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-num">4 Types</span>
              <span className="auth-stat-lbl">Threat Coverage</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="auth-form-panel">
        <div className={`auth-card ${animating ? 'auth-card-fade' : ''}`}>

          {/* Card Header */}
          <div className="auth-card-header">
            <div className="auth-card-icon">
              {isRegister ? <UserPlus size={22} /> : <LogIn size={22} />}
            </div>
            <div>
              <h2 className="auth-card-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="auth-card-sub">{isRegister ? 'Join the APDS security platform' : 'Sign in to your APDS account'}</p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              className={`auth-mode-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => switchMode(false)}
            >
              <LogIn size={14} /> Sign In
            </button>
            <button
              type="button"
              className={`auth-mode-tab ${isRegister ? 'active' : ''}`}
              onClick={() => switchMode(true)}
            >
              <UserPlus size={14} /> Register
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="auth-msg error">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="auth-msg success">
              <CheckCircle2 size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrap">
                  <User size={15} className="auth-input-icon" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="auth-input"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">{isRegister ? 'Email Address' : 'Email or Username'}</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-input-icon" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder={isRegister ? 'name@company.com' : 'Enter your email'}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                {!isRegister && (
                  <button type="button" className="auth-forgot">Forgot password?</button>
                )}
              </div>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder={isRegister ? 'Minimum 6 characters' : 'Your password'}
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button type="button" className="auth-pw-eye" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {isRegister && password && (
                <div className="auth-strength-row">
                  <div className="auth-strength-track">
                    {[1, 2, 3, 4].map(n => (
                      <div
                        key={n}
                        className="auth-strength-seg"
                        style={{ background: n <= pwStrength.score ? pwStrength.color : undefined }}
                      />
                    ))}
                  </div>
                  <span className="auth-strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                </div>
              )}
            </div>

            {isRegister && (
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock size={15} className="auth-input-icon" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    placeholder="Repeat your password"
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-pw-eye" onClick={() => setShowConfirmPw(p => !p)} tabIndex={-1}>
                    {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {!isRegister && (
              <label className="auth-checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>Remember me for 30 days</span>
              </label>
            )}

            {isRegister && (
              <label className="auth-checkbox-row">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>I agree to the <span className="auth-terms-link">Terms & Conditions</span></span>
              </label>
            )}

            <button
              type="submit"
              className={`auth-submit-btn ${isRegister ? 'register' : 'login'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 size={16} className="auth-spin" /><span>Authenticating…</span></>
              ) : isRegister ? (
                <><span>Create Account</span><ArrowRight size={16} /></>
              ) : (
                <><span>Sign In</span><ArrowRight size={16} /></>
              )}
            </button>

            {/* Quick demo access */}
            <div className="auth-demo-row">
              <button
                type="button"
                className="auth-demo-btn admin"
                onClick={() => { setEmail('admin@apds.edu'); setPassword('Admin@12345'); }}
              >
                🛡️ Admin Demo
              </button>
              <button
                type="button"
                className="auth-demo-btn user"
                onClick={() => { setEmail('amna.student@uos.edu.pk'); setPassword('User@12345'); }}
              >
                👤 User Demo
              </button>
            </div>
          </form>

          {/* Switch mode */}
          <div className="auth-switch-row">
            <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => switchMode(!isRegister)}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          {/* Footer */}
          <div className="auth-card-footer">
            <Shield size={11} />
            <span>256-bit encrypted · SSL secured · APDS 2025</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          font-family: 'Inter', -apple-system, sans-serif;
          overflow: hidden;
        }

        /* ─── LEFT HERO ─── */
        .auth-hero {
          position: relative;
          flex: 1 1 55%;
          background: linear-gradient(135deg, #0a0f2e 0%, #0d1a4a 30%, #0c2154 60%, #071340 100%);
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }
        .auth-hero::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 70%;
          height: 70%;
          background: radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 65%);
          pointer-events: none;
        }
        .auth-hero::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 65%);
          pointer-events: none;
        }

        .auth-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
          padding: 48px 52px;
          width: 100%;
        }

        /* Back button */
        .auth-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          align-self: flex-start;
        }
        .auth-back-btn:hover {
          background: rgba(255,255,255,0.14);
          color: #fff;
          transform: translateX(-2px);
        }

        /* Brand */
        .auth-hero-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .auth-hero-shield {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.2);
          flex-shrink: 0;
        }
        .auth-hero-title {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .auth-hero-subtitle {
          font-size: 0.78rem;
          color: rgba(147,197,253,0.85);
          font-weight: 500;
          margin-top: 3px;
          letter-spacing: 0.02em;
        }

        /* Headline */
        .auth-hero-headline h2 {
          font-size: 2.4rem;
          font-weight: 900;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .auth-hero-accent {
          background: linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-hero-headline p {
          margin-top: 12px;
          font-size: 0.92rem;
          color: rgba(203,213,225,0.8);
          line-height: 1.6;
          max-width: 400px;
        }

        /* Feature grid */
        .auth-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .auth-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s ease;
        }
        .auth-feature-item:hover {
          background: rgba(59,130,246,0.12);
          border-color: rgba(59,130,246,0.3);
          transform: translateY(-1px);
        }
        .auth-feature-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(59,130,246,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #93c5fd;
          flex-shrink: 0;
        }
        .auth-feature-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
        }
        .auth-feature-desc {
          font-size: 0.7rem;
          color: rgba(148,163,184,0.8);
          margin-top: 2px;
          line-height: 1.3;
        }

        /* Stats bar */
        .auth-stats-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          backdrop-filter: blur(10px);
        }
        .auth-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          align-items: center;
        }
        .auth-stat-num {
          font-size: 1.2rem;
          font-weight: 900;
          color: #60a5fa;
        }
        .auth-stat-lbl {
          font-size: 0.67rem;
          color: rgba(148,163,184,0.8);
          font-weight: 500;
          text-align: center;
        }
        .auth-stat-divider {
          width: 1px;
          height: 34px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }

        /* ─── RIGHT FORM PANEL ─── */
        .auth-form-panel {
          flex: 0 0 420px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
          overflow-y: auto;
        }
        .auth-form-panel::-webkit-scrollbar { width: 0; }

        .auth-card {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .auth-card-fade { opacity: 0; transform: translateY(6px); }

        /* Card header */
        .auth-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 4px;
        }
        .auth-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 6px 20px rgba(37,99,235,0.35);
          flex-shrink: 0;
        }
        .auth-card-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .auth-card-sub {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 500;
          margin-top: 2px;
        }

        /* Mode tabs */
        .auth-mode-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding: 4px;
          background: #f1f5f9;
          border-radius: 12px;
        }
        .auth-mode-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 8px;
          border-radius: 9px;
          border: none;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          color: #64748b;
          background: transparent;
        }
        .auth-mode-tab.active {
          background: #fff;
          color: #1d4ed8;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .auth-mode-tab:hover:not(.active) {
          color: #0f172a;
        }

        /* Alerts */
        .auth-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .auth-msg.error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #dc2626;
        }
        .auth-msg.success {
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.25);
          color: #059669;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .auth-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #374151;
        }
        .auth-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .auth-forgot {
          background: none;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          color: #2563eb;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }
        .auth-forgot:hover { text-decoration: underline; }

        .auth-input-wrap {
          position: relative;
        }
        .auth-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }
        .auth-input {
          width: 100%;
          padding: 11px 38px 11px 40px;
          border-radius: 11px;
          border: 1.5px solid #e2e8f0;
          background: #f8faff;
          font-size: 0.87rem;
          font-family: inherit;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }
        .auth-input:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .auth-input::placeholder { color: #9ca3af; }

        .auth-pw-eye {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 2px;
          transition: color 0.2s;
        }
        .auth-pw-eye:hover { color: #3b82f6; }

        /* Password strength */
        .auth-strength-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }
        .auth-strength-track {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .auth-strength-seg {
          flex: 1;
          height: 3px;
          border-radius: 99px;
          background: #e2e8f0;
          transition: background 0.3s ease;
        }
        .auth-strength-label {
          font-size: 0.68rem;
          font-weight: 800;
        }

        /* Checkbox */
        .auth-checkbox-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          color: #4b5563;
          user-select: none;
        }
        .auth-checkbox {
          width: 15px;
          height: 15px;
          accent-color: #2563eb;
          cursor: pointer;
          flex-shrink: 0;
        }
        .auth-terms-link {
          color: #2563eb;
          font-weight: 700;
        }

        /* Submit button */
        .auth-submit-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: 12px;
          border: none;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s ease;
          margin-top: 2px;
          letter-spacing: 0.01em;
        }
        .auth-submit-btn.login {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
          box-shadow: 0 4px 18px rgba(37,99,235,0.45);
        }
        .auth-submit-btn.login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(37,99,235,0.55);
        }
        .auth-submit-btn.register {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
          box-shadow: 0 4px 18px rgba(99,102,241,0.45);
        }
        .auth-submit-btn.register:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(99,102,241,0.55);
        }
        .auth-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-spin { animation: authspin 1s linear infinite; }
        @keyframes authspin { to { transform: rotate(360deg); } }

        /* Demo buttons */
        .auth-demo-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .auth-demo-btn {
          padding: 8px;
          border-radius: 9px;
          font-size: 0.73rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .auth-demo-btn.admin {
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.22);
          color: #4f46e5;
        }
        .auth-demo-btn.admin:hover {
          background: rgba(99,102,241,0.15);
        }
        .auth-demo-btn.user {
          background: rgba(37,99,235,0.07);
          border: 1px solid rgba(37,99,235,0.2);
          color: #1d4ed8;
        }
        .auth-demo-btn.user:hover {
          background: rgba(37,99,235,0.13);
        }

        /* Switch mode */
        .auth-switch-row {
          text-align: center;
          font-size: 0.8rem;
          color: #64748b;
          padding-top: 4px;
        }
        .auth-switch-btn {
          background: none;
          border: none;
          font-weight: 800;
          color: #2563eb;
          font-size: 0.8rem;
          margin-left: 4px;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }
        .auth-switch-btn:hover { text-decoration: underline; }

        /* Card footer */
        .auth-card-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 600;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
          letter-spacing: 0.02em;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .auth-hero { display: none; }
          .auth-form-panel {
            flex: 1;
            background: linear-gradient(135deg, #0a0f2e, #0d1a4a);
          }
          .auth-card {
            background: rgba(255,255,255,0.97);
            border-radius: 20px;
            padding: 28px 24px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.4);
          }
          .auth-card-title { font-size: 1.2rem; }
          .auth-input { font-size: 0.85rem; }
        }

        @media (max-width: 480px) {
          .auth-form-panel { padding: 20px 16px; }
          .auth-card { padding: 24px 20px; }
          .auth-card-title { font-size: 1.1rem; }
          .auth-hero-headline h2 { font-size: 1.9rem; }
        }
      `}</style>
    </div>
  );
}
