import React, { useState } from 'react';
import {
  Mail, Lock, User, Eye, EyeOff, Shield, Loader2, CheckCircle2,
  AlertCircle, ArrowRight, Sun, Moon, ArrowLeft, UserPlus, LogIn, Star,
  Link2, Globe, ChevronRight
} from 'lucide-react';
import loginLight from '../assets/login_light.png';
import loginDark from '../assets/login_dark.png';
import { usersService } from '../firebase/services';

export default function AuthPage({ onLoginSuccess, onNavigateHome, theme = 'light', setTheme, initialMode = 'login' }) {
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
    if (!pass) return { score: 0, label: '', color: '#e2e8f0' };
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
  const isDark = theme === 'dark';
  const isNavy = theme === 'navy';
  const isLight = !isDark && !isNavy;

  const toggleTheme = () => {
    if (setTheme) setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'navy';
      return 'light';
    });
  };

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
      setErrorMsg(error.response?.data?.message || 'Authentication failed.');
    } finally { setIsLoading(false); }
  };

  const switchMode = (toRegister) => {
    setAnimating(true);
    setTimeout(() => {
      setIsRegister(toRegister);
      setErrorMsg(''); setSuccessMsg(''); setPassword(''); setConfirmPassword('');
      setAnimating(false);
    }, 180);
  };

  const themeClass = isDark ? 'dark' : isNavy ? 'navy' : 'light';
  const activeBg = isLight ? loginLight : loginDark;

  return (
    <div className={`auth-page-root ${themeClass}`}>
      
      {/* Full-screen theme-aware background image */}
      <div className="auth-bg-wrapper">
        <img src={activeBg} alt="Phishing Detection Background" className="auth-bg-img" key={isLight ? 'light-bg' : 'dark-bg'} />
        <div className="auth-bg-overlay" />
      </div>

      {/* Top Navigation Bar */}
      <div className="auth-nav-bar">
        {onNavigateHome ? (
          <button onClick={onNavigateHome} className="auth-home-btn" type="button">
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </button>
        ) : <div />}

        <button onClick={toggleTheme} className="auth-theme-toggle" type="button" title="Switch theme">
          {isDark ? <Sun size={15} /> : isNavy ? <Star size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Bottom Left Feature Pills (matches design mockup) */}
      <div className="auth-left-features">
        <div className="auth-feature-pill">
          <div className="auth-feature-icon-box">
            <Mail size={16} />
          </div>
          <span>Scan Emails</span>
        </div>
        <div className="auth-feature-pill">
          <div className="auth-feature-icon-box">
            <Link2 size={16} />
          </div>
          <span>Detect Malicious Links</span>
        </div>
        <div className="auth-feature-pill">
          <div className="auth-feature-icon-box">
            <Globe size={16} />
          </div>
          <span>Check Domains</span>
        </div>
        <div className="auth-feature-pill">
          <div className="auth-feature-icon-box">
            <Shield size={16} />
          </div>
          <span>Keep You Safe</span>
        </div>
      </div>

      {/* Right-side Form Card */}
      <div className="auth-content-container">
        <div className={`auth-glass-card ${animating ? 'fade-out' : ''}`}>

          {/* Brand Header */}
          <div className="card-badge-header">
            <div className="shield-icon-glow">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L40 9.8V23.4C40 33.2 33.2 41.8 24 44C14.8 41.8 8 33.2 8 23.4V9.8L24 4Z" fill="white" fillOpacity="0.95"/>
                <path d="M24 14V26C24 28.2 22.2 30 20 30C17.8 30 16 28.2 16 26" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="24" cy="14" r="2.5" fill="#2563eb"/>
              </svg>
            </div>
            <h1 className="brand-main-title">
              <span className="brand-abbr">APDS</span> <span className="brand-highlight">Security System</span>
            </h1>
            <p className="brand-full-name">Automatic Phishing Detection System</p>
          </div>

          {/* Mode Tabs */}
          <div className="auth-tabs">
            <button type="button" className={`tab-btn ${!isRegister ? 'active' : ''}`} onClick={() => switchMode(false)}>
              <LogIn size={13} /><span>Sign In</span>
            </button>
            <button type="button" className={`tab-btn ${isRegister ? 'active' : ''}`} onClick={() => switchMode(true)}>
              <UserPlus size={13} /><span>Create Account</span>
            </button>
          </div>

          {/* Alerts */}
          {errorMsg   && <div className="auth-alert error"><AlertCircle size={13}/><span>{errorMsg}</span></div>}
          {successMsg && <div className="auth-alert success"><CheckCircle2 size={13}/><span>{successMsg}</span></div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-fields">
            {isRegister && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-icon-wrapper">
                  <User size={14} className="input-icon" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="auth-input" placeholder="Your full name" required autoComplete="name" />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">{isRegister ? 'Email Address' : 'Username or Email'}</label>
              <div className="input-icon-wrapper">
                <User size={14} className="input-icon" />
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                  className="auth-input" placeholder={isRegister ? 'name@company.com' : 'Username or Email'} required autoComplete="username" />
              </div>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label className="input-label">Password</label>
                {!isRegister && <button type="button" className="forgot-link">Forgot Password?</button>}
              </div>
              <div className="input-icon-wrapper">
                <Lock size={14} className="input-icon" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="auth-input" placeholder={isRegister ? 'Min. 6 characters' : 'Password'}
                  required autoComplete={isRegister ? 'new-password' : 'current-password'} />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {isRegister && password && (
                <div className="pw-strength-bar">
                  <div className="pw-track">
                    {[1,2,3,4].map(n => (
                      <div key={n} className="pw-step" style={{ background: n <= pwStrength.score ? pwStrength.color : undefined }} />
                    ))}
                  </div>
                  <span className="pw-label" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                </div>
              )}
            </div>

            {isRegister && (
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <Lock size={14} className="input-icon" />
                  <input type={showConfirmPw ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} className="auth-input"
                    placeholder="Repeat password" required autoComplete="new-password" />
                  <button type="button" className="pw-toggle" onClick={() => setShowConfirmPw(p => !p)} tabIndex={-1}>
                    {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {!isRegister && (
              <label className="checkbox-label">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="checkbox-input" />
                <span>Remember me</span>
              </label>
            )}

            {isRegister && (
              <label className="checkbox-label">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="checkbox-input" />
                <span>I agree to <span className="terms-link">Terms & Conditions</span></span>
              </label>
            )}

            <button type="submit" className={`submit-btn ${isRegister ? 'register-btn' : 'login-btn'}`} disabled={isLoading}>
              {isLoading ? (
                <><Loader2 size={15} className="spin-anim" /><span>Authenticating...</span></>
              ) : isRegister ? (
                <><span>Create Account</span><ChevronRight size={16} /></>
              ) : (
                <><span>Login</span><ChevronRight size={16} /></>
              )}
            </button>

            {/* Quick Demo Fill */}
            <div className="demo-row">
              <button type="button" className="demo-pill admin"
                onClick={() => { setEmail('admin@apds.edu'); setPassword('Admin@12345'); }}>
                🛡 Admin Fill
              </button>
              <button type="button" className="demo-pill user"
                onClick={() => { setEmail('amna.student@uos.edu.pk'); setPassword('User@12345'); }}>
                👤 User Fill
              </button>
            </div>
          </form>

          {/* Secure Access Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line"></span>
            <span className="auth-divider-text">SECURE ACCESS</span>
            <span className="auth-divider-line"></span>
          </div>

          {/* Switch Mode */}
          <div className="switch-mode-box">
            <span>{isRegister ? 'Already registered?' : "Don't have an account?"}</span>
            <button type="button" className="switch-mode-btn" onClick={() => switchMode(!isRegister)}>
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </div>

          {/* Footer */}
          <div className="card-footer">
            <Shield size={12} />
            <span>Better Detection | Safer Internet</span>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        /* ── BOTTOM LEFT FEATURES ── */
        .auth-left-features {
          position: absolute;
          bottom: 24px;
          left: 28px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 12px;
          pointer-events: auto;
        }
        .auth-feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 13px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: transform 0.2s ease;
        }
        .auth-page-root.light .auth-feature-pill {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(37, 99, 235, 0.2);
          color: #1e3a8a;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
        }
        .auth-page-root.dark .auth-feature-pill {
          background: rgba(15, 23, 42, 0.78);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: #f1f5f9;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }
        .auth-page-root.navy .auth-feature-pill {
          background: rgba(10, 20, 60, 0.78);
          border: 1px solid rgba(129, 140, 248, 0.3);
          color: #e0e7ff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }
        .auth-feature-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
        }
        .auth-page-root.navy .auth-feature-icon-box {
          color: #818cf8;
        }
        @media (max-width: 960px) {
          .auth-left-features {
            display: none !important;
          }
        }

        /* ── BACKGROUND ── */
        .auth-bg-wrapper {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }
        .auth-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 5% 50%;
          display: block;
          animation: authBgFade 0.4s ease-out;
        }
        @keyframes authBgFade {
          from { opacity: 0.4; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Overlays per theme */
        .auth-page-root.light .auth-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right,
            rgba(0,0,0,0.02) 0%,
            rgba(5,15,40,0.15) 60%,
            rgba(5,15,40,0.35) 100%);
          pointer-events: none;
        }
        .auth-page-root.dark .auth-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right,
            rgba(0,0,0,0.1) 30%,
            rgba(6,12,30,0.55) 65%,
            rgba(6,12,30,0.85) 100%);
          pointer-events: none;
        }
        .auth-page-root.navy .auth-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right,
            rgba(0,10,40,0.08) 30%,
            rgba(5,15,55,0.55) 65%,
            rgba(5,15,55,0.85) 100%);
          pointer-events: none;
        }

        /* ── NAV BAR ── */
        .auth-nav-bar {
          position: absolute;
          top: 16px; left: 22px; right: 22px;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .auth-home-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 999px;
          font-size: 0.78rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s ease; font-family: inherit;
          backdrop-filter: blur(12px);
        }
        .auth-page-root.light .auth-home-btn {
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(37,99,235,0.2);
          color: #1e40af;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .auth-page-root.dark .auth-home-btn,
        .auth-page-root.navy .auth-home-btn {
          background: rgba(15,23,42,0.65);
          border: 1px solid rgba(255,255,255,0.15);
          color: #f1f5f9;
        }
        .auth-home-btn:hover { transform: translateY(-1px); }

        .auth-theme-toggle {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
          backdrop-filter: blur(12px);
        }
        .auth-page-root.light .auth-theme-toggle {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(37,99,235,0.2);
          color: #2563eb;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .auth-page-root.dark .auth-theme-toggle,
        .auth-page-root.navy .auth-theme-toggle {
          background: rgba(15,23,42,0.65);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fbbf24;
        }
        .auth-page-root.navy .auth-theme-toggle { color: #a78bfa; }
        .auth-theme-toggle:hover { transform: scale(1.08); }

        /* ── CONTENT CONTAINER ── */
        .auth-content-container {
          position: relative;
          z-index: 5;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 20px 36px 20px 20px;
          box-sizing: border-box;
        }

        /* ── GLASS CARD ── */
        .auth-glass-card {
          width: 100%;
          max-width: 400px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          border-radius: 22px;
          padding: 22px 22px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: opacity 0.18s ease, transform 0.18s ease;
          box-sizing: border-box;
        }
        .auth-glass-card::-webkit-scrollbar { width: 3px; }
        .auth-glass-card::-webkit-scrollbar-thumb { background: rgba(100,100,200,0.25); border-radius: 3px; }
        .auth-glass-card.fade-out { opacity: 0; transform: translateY(5px); }

        /* Light card */
        .auth-page-root.light .auth-glass-card {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(210,228,255,0.8);
          box-shadow: 0 20px 60px rgba(37,99,235,0.13), 0 6px 20px rgba(0,0,0,0.07);
          color: #0f172a;
        }
        /* Dark card */
        .auth-page-root.dark .auth-glass-card {
          background: rgba(6,14,36,0.9);
          border: 1.5px solid rgba(56,189,248,0.25);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(37,99,235,0.2);
          backdrop-filter: blur(24px);
          color: #ffffff;
        }
        /* Navy card */
        .auth-page-root.navy .auth-glass-card {
          background: rgba(5,12,45,0.92);
          border: 1.5px solid rgba(99,102,241,0.35);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 35px rgba(79,70,229,0.25);
          backdrop-filter: blur(24px);
          color: #ffffff;
        }

        /* ── BRAND HEADER ── */
        .card-badge-header {
          display: flex; flex-direction: column; align-items: center; text-align: center; gap: 3px;
        }
        .shield-icon-glow {
          width: 46px; height: 46px; border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }
        .auth-page-root.light .shield-icon-glow {
          box-shadow: 0 6px 18px rgba(37,99,235,0.35);
        }
        .auth-page-root.dark .shield-icon-glow,
        .auth-page-root.navy .shield-icon-glow {
          box-shadow: 0 0 18px rgba(59,130,246,0.55), inset 0 0 10px rgba(255,255,255,0.1);
          border: 1px solid rgba(56,189,248,0.4);
        }
        .auth-page-root.navy .shield-icon-glow {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          box-shadow: 0 0 18px rgba(99,102,241,0.55);
          border-color: rgba(167,139,250,0.4);
        }

        .brand-main-title {
          font-size: 1.25rem; font-weight: 900; letter-spacing: -0.01em; line-height: 1.2;
          display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;
        }
        .brand-abbr {
          font-size: 1.3rem; font-weight: 900; letter-spacing: 0.04em;
        }
        .auth-page-root.light .brand-abbr { color: #0f172a; }
        .auth-page-root.dark .brand-abbr,
        .auth-page-root.navy .brand-abbr { color: #ffffff; }

        .brand-highlight {
          color: #2563eb;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .auth-page-root.navy .brand-highlight {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-full-name {
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.02em;
          color: #64748b;
        }
        .auth-page-root.dark .brand-full-name { color: #94a3b8; }
        .auth-page-root.navy .brand-full-name { color: #a5b4fc; }

        /* ── TABS ── */
        .auth-tabs {
          display: grid; grid-template-columns: 1fr 1fr; gap: 3px; padding: 3px; border-radius: 11px;
        }
        .auth-page-root.light .auth-tabs { background: #f1f5f9; border: 1px solid #e2e8f0; }
        .auth-page-root.dark .auth-tabs,
        .auth-page-root.navy .auth-tabs { background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.1); }

        .tab-btn {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          padding: 7px 6px; border-radius: 8px; border: none;
          font-size: 0.78rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s ease; font-family: inherit;
        }
        .auth-page-root.light .tab-btn { background: transparent; color: #64748b; }
        .auth-page-root.dark .tab-btn,
        .auth-page-root.navy .tab-btn { background: transparent; color: #94a3b8; }

        .auth-page-root.light .tab-btn.active {
          background: #fff; color: #1e40af;
          box-shadow: 0 2px 8px rgba(15,23,42,0.1);
        }
        .auth-page-root.dark .tab-btn.active {
          background: linear-gradient(135deg, rgba(37,99,235,0.9), rgba(59,130,246,0.9));
          color: #fff; box-shadow: 0 2px 10px rgba(37,99,235,0.35);
        }
        .auth-page-root.navy .tab-btn.active {
          background: linear-gradient(135deg, rgba(79,70,229,0.9), rgba(99,102,241,0.9));
          color: #fff; box-shadow: 0 2px 10px rgba(79,70,229,0.35);
        }

        /* ── ALERTS ── */
        .auth-alert {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 11px; border-radius: 9px;
          font-size: 0.77rem; font-weight: 600;
        }
        .auth-alert.error {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
        }
        .auth-page-root.light .auth-alert.error { color: #dc2626; }
        .auth-page-root.dark .auth-alert.error,
        .auth-page-root.navy .auth-alert.error { color: #fca5a5; }
        .auth-alert.success {
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
        }
        .auth-page-root.light .auth-alert.success { color: #059669; }
        .auth-page-root.dark .auth-alert.success,
        .auth-page-root.navy .auth-alert.success { color: #6ee7b7; }

        /* ── FORM ── */
        .auth-form-fields { display: flex; flex-direction: column; gap: 10px; }
        .input-group { display: flex; flex-direction: column; gap: 3px; }
        .input-label { font-size: 0.74rem; font-weight: 700; }
        .auth-page-root.light .input-label { color: #374151; }
        .auth-page-root.dark .input-label,
        .auth-page-root.navy .input-label { color: #cbd5e1; }

        .label-row { display: flex; align-items: center; justify-content: space-between; }
        .input-icon-wrapper { position: relative; }
        .input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none;
        }
        .auth-page-root.light .input-icon { color: #9ca3af; }
        .auth-page-root.dark .input-icon,
        .auth-page-root.navy .input-icon { color: #64748b; }

        .auth-input {
          width: 100%; padding: 10px 38px 10px 37px;
          border-radius: 11px; font-size: 0.85rem; font-family: inherit;
          outline: none; transition: all 0.2s ease;
        }
        .auth-page-root.light .auth-input {
          background: #f8faff; border: 1.5px solid #dde5f0; color: #0f172a;
        }
        .auth-page-root.light .auth-input:focus {
          border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background: #fff;
        }
        .auth-page-root.light .auth-input::placeholder { color: #9ca3af; }
        .auth-page-root.dark .auth-input,
        .auth-page-root.navy .auth-input {
          background: rgba(15,23,42,0.7); border: 1.5px solid rgba(255,255,255,0.1); color: #ffffff;
        }
        .auth-page-root.dark .auth-input:focus {
          border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56,189,248,0.15); background: rgba(15,23,42,0.9);
        }
        .auth-page-root.navy .auth-input:focus {
          border-color: #818cf8; box-shadow: 0 0 0 3px rgba(129,140,248,0.15); background: rgba(15,23,42,0.9);
        }
        .auth-page-root.dark .auth-input::placeholder,
        .auth-page-root.navy .auth-input::placeholder { color: #4b5563; }

        .pw-toggle {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 2px; transition: color 0.2s;
        }
        .auth-page-root.light .pw-toggle { color: #9ca3af; }
        .auth-page-root.light .pw-toggle:hover { color: #2563eb; }
        .auth-page-root.dark .pw-toggle,
        .auth-page-root.navy .pw-toggle { color: #64748b; }
        .auth-page-root.dark .pw-toggle:hover { color: #38bdf8; }
        .auth-page-root.navy .pw-toggle:hover { color: #a78bfa; }

        /* Password strength */
        .pw-strength-bar { display: flex; align-items: center; gap: 7px; margin-top: 2px; }
        .pw-track { display: flex; gap: 3px; flex: 1; }
        .pw-step { flex: 1; height: 3px; border-radius: 99px; transition: background 0.3s; }
        .auth-page-root.light .pw-step { background: #e2e8f0; }
        .auth-page-root.dark .pw-step,
        .auth-page-root.navy .pw-step { background: rgba(255,255,255,0.1); }
        .pw-label { font-size: 0.66rem; font-weight: 700; }

        /* Checkbox */
        .checkbox-label {
          display: inline-flex; align-items: center; gap: 6px;
          cursor: pointer; font-size: 0.77rem; font-weight: 500;
        }
        .auth-page-root.light .checkbox-label { color: #4b5563; }
        .auth-page-root.dark .checkbox-label,
        .auth-page-root.navy .checkbox-label { color: #94a3b8; }
        .checkbox-input { width: 14px; height: 14px; accent-color: #2563eb; cursor: pointer; flex-shrink: 0; }
        .terms-link { color: #2563eb; font-weight: 700; }
        .auth-page-root.navy .terms-link { color: #a78bfa; }

        .forgot-link {
          background: none; border: none; font-size: 0.73rem; font-weight: 700;
          cursor: pointer; font-family: inherit;
        }
        .auth-page-root.light .forgot-link { color: #2563eb; }
        .auth-page-root.dark .forgot-link { color: #38bdf8; }
        .auth-page-root.navy .forgot-link { color: #a78bfa; }
        .forgot-link:hover { text-decoration: underline; }

        /* Submit */
        .submit-btn {
          width: 100%; padding: 11px 20px; border-radius: 11px; border: none;
          color: #ffffff; font-size: 0.9rem; font-weight: 800;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
          font-family: inherit; transition: all 0.22s ease; margin-top: 2px;
        }
        .submit-btn.login-btn {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
          box-shadow: 0 4px 16px rgba(37,99,235,0.4);
        }
        .submit-btn.login-btn:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 8px 22px rgba(37,99,235,0.52);
        }
        .submit-btn.register-btn {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #7c3aed 100%);
          box-shadow: 0 4px 16px rgba(99,102,241,0.4);
        }
        .submit-btn.register-btn:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 8px 22px rgba(99,102,241,0.52);
        }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .spin-anim { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Demo fill */
        .demo-row { display: flex; gap: 6px; }
        .demo-pill {
          flex: 1; padding: 6px; border-radius: 8px;
          font-size: 0.7rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .auth-page-root.light .demo-pill.admin {
          background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.2); color: #4f46e5;
        }
        .auth-page-root.dark .demo-pill.admin,
        .auth-page-root.navy .demo-pill.admin {
          background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc;
        }
        .auth-page-root.light .demo-pill.user {
          background: rgba(37,99,235,0.06); border: 1px solid rgba(37,99,235,0.18); color: #2563eb;
        }
        .auth-page-root.dark .demo-pill.user,
        .auth-page-root.navy .demo-pill.user {
          background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); color: #7dd3fc;
        }
        .demo-pill:hover { opacity: 0.75; }

        /* Secure Access Divider */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 4px 0 2px;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(148, 163, 184, 0.25);
        }
        .auth-page-root.light .auth-divider-line {
          background: #e2e8f0;
        }
        .auth-page-root.dark .auth-divider-line {
          background: rgba(255, 255, 255, 0.1);
        }
        .auth-page-root.navy .auth-divider-line {
          background: rgba(129, 140, 248, 0.2);
        }
        .auth-divider-text {
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        /* Switch */
        .switch-mode-box { text-align: center; font-size: 0.77rem; }
        .auth-page-root.light .switch-mode-box { color: #64748b; }
        .auth-page-root.dark .switch-mode-box,
        .auth-page-root.navy .switch-mode-box { color: #94a3b8; }
        .switch-mode-btn {
          background: none; border: none; font-weight: 800; margin-left: 4px;
          cursor: pointer; font-size: 0.77rem; font-family: inherit;
        }
        .auth-page-root.light .switch-mode-btn { color: #2563eb; }
        .auth-page-root.dark .switch-mode-btn { color: #38bdf8; }
        .auth-page-root.navy .switch-mode-btn { color: #a78bfa; }
        .switch-mode-btn:hover { text-decoration: underline; }

        /* Footer */
        .card-footer {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          font-size: 0.67rem; font-weight: 700; padding-top: 6px; letter-spacing: 0.05em;
        }
        .auth-page-root.light .card-footer { border-top: 1px solid #e2e8f0; color: #2563eb; }
        .auth-page-root.dark .card-footer { border-top: 1px solid rgba(255,255,255,0.07); color: #38bdf8; }
        .auth-page-root.navy .card-footer { border-top: 1px solid rgba(255,255,255,0.07); color: #a78bfa; }

        /* ══════ MOBILE ══════ */
        @media (max-width: 820px) {
          .auth-page-root {
            justify-content: center;
            align-items: flex-end;
            padding-bottom: 0;
          }
          .auth-bg-img {
            object-fit: cover;
            object-position: center top;
            height: 45vh;
            position: absolute;
            top: 0;
            width: 100%;
          }
          .auth-page-root.light .auth-bg-overlay {
            background: linear-gradient(to bottom,
              rgba(255,255,255,0) 30%,
              rgba(255,255,255,0.9) 70%,
              rgba(255,255,255,1) 100%);
          }
          .auth-page-root.dark .auth-bg-overlay {
            background: linear-gradient(to bottom,
              rgba(0,0,0,0) 20%,
              rgba(6,12,30,0.8) 60%,
              rgba(6,12,30,1) 100%);
          }
          .auth-page-root.navy .auth-bg-overlay {
            background: linear-gradient(to bottom,
              rgba(0,10,40,0) 20%,
              rgba(5,15,55,0.8) 60%,
              rgba(5,15,55,1) 100%);
          }
          .auth-content-container {
            padding: 0;
            height: auto;
            justify-content: center;
            width: 100%;
            position: relative;
            z-index: 5;
          }
          .auth-glass-card {
            max-width: 100%;
            max-height: none;
            border-radius: 24px 24px 0 0;
            padding: 20px 18px 32px;
            border-bottom: none;
            box-shadow: 0 -8px 30px rgba(0,0,0,0.15) !important;
          }
          .auth-page-root.light .auth-glass-card {
            background: rgba(255,255,255,1) !important;
            border: 1px solid rgba(210,228,255,0.6);
            border-bottom: none;
          }
          .auth-page-root.dark .auth-glass-card {
            background: rgba(6,14,36,0.98) !important;
          }
          .auth-page-root.navy .auth-glass-card {
            background: rgba(5,12,45,0.98) !important;
          }
          .brand-abbr { font-size: 1.3rem; }
          .card-badge-header { gap: 2px; }
          .shield-icon-glow { width: 42px; height: 42px; }
          .auth-form-fields { gap: 9px; }
          .auth-nav-bar { top: 12px; left: 14px; right: 14px; }
        }
      `}</style>
    </div>
  );
}
