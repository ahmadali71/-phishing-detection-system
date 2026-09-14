import React, { useState } from 'react';
import {
  Mail, Lock, User, Eye, EyeOff, Shield, Loader2, CheckCircle2,
  AlertCircle, ArrowRight, Sun, Moon, ArrowLeft, UserPlus, LogIn,
  CheckCircle, ChevronRight
} from 'lucide-react';
import phishguardHero from '../assets/phishguard_hero.jpg';
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
  const toggleTheme = () => { if (setTheme) setTheme(prev => prev === 'light' ? 'dark' : 'light'); };

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

  return (
    <div className={`auth-page-root ${isDark ? 'dark' : 'light'}`}>
      
      {/* Full screen background image container */}
      <div className="auth-bg-wrapper">
        <img src={phishguardHero} alt="Cyber Defense Background" className="auth-bg-img" />
        <div className="auth-bg-overlay" />
      </div>

      {/* Navigation Top Bar */}
      <div className="auth-nav-bar">
        {onNavigateHome ? (
          <button onClick={onNavigateHome} className="auth-home-btn" type="button">
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </button>
        ) : <div />}

        <button onClick={toggleTheme} className="auth-theme-toggle" type="button" title="Toggle theme">
          {isDark ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#3b82f6" />}
        </button>
      </div>

      {/* Floating Right Form Container */}
      <div className="auth-content-container">
        <div className={`auth-glass-card ${animating ? 'fade-out' : ''}`}>

          {/* Shield Badge Header (Exact match to user screenshot) */}
          <div className="card-badge-header">
            <div className="shield-icon-glow">
              <Shield size={30} className="shield-svg" />
              <Lock size={14} className="lock-inner-svg" />
            </div>
            
            <h1 className="brand-main-title">
              Phishing <span className="blue-gradient-text">Detection System</span>
            </h1>
            <p className="brand-tagline">Stay Safe  •  Detect  •  Prevent</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`tab-btn ${!isRegister ? 'active' : ''}`}
              onClick={() => switchMode(false)}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${isRegister ? 'active' : ''}`}
              onClick={() => switchMode(true)}
            >
              <UserPlus size={14} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Alert notifications */}
          {errorMsg   && <div className="auth-alert error"><AlertCircle size={14}/><span>{errorMsg}</span></div>}
          {successMsg && <div className="auth-alert success"><CheckCircle2 size={14}/><span>{successMsg}</span></div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-fields">
            {isRegister && (
              <div className="input-group">
                <div className="input-icon-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="auth-input"
                    placeholder="Full Name"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <div className="input-icon-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="Username or Email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Password"
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPw(p => !p)}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {isRegister && password && (
                <div className="pw-strength-bar">
                  <div className="pw-indicator-track">
                    {[1,2,3,4].map(n => (
                      <div
                        key={n}
                        className="pw-indicator-step"
                        style={{ background: n <= pwStrength.score ? pwStrength.color : undefined }}
                      />
                    ))}
                  </div>
                  <span className="pw-strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                </div>
              )}
            </div>

            {isRegister && (
              <div className="input-group">
                <div className="input-icon-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    placeholder="Confirm Password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPw(p => !p)}
                    tabIndex={-1}
                  >
                    {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="remember-forgot-row">
                <label className="checkbox-label">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="checkbox-input" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="forgot-link">Forgot Password?</button>
              </div>
            )}

            {isRegister && (
              <label className="checkbox-label terms">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="checkbox-input" />
                <span>I agree to Terms &amp; Conditions</span>
              </label>
            )}

            {/* Submit Button (Matching screenshot > Login button) */}
            <button type="submit" className="submit-action-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="spin-anim" />
                  <span>Authenticating...</span>
                </>
              ) : isRegister ? (
                <>
                  <ChevronRight size={18} />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <ChevronRight size={18} />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Demo Quick Fill Row */}
            <div className="demo-credentials-row">
              <button
                type="button"
                className="demo-pill admin"
                onClick={() => { setEmail('admin@apds.edu'); setPassword('Admin@12345'); }}
              >
                🛡 Admin Fill
              </button>
              <button
                type="button"
                className="demo-pill user"
                onClick={() => { setEmail('amna.student@uos.edu.pk'); setPassword('User@12345'); }}
              >
                👤 User Fill
              </button>
            </div>
          </form>

          {/* Secure Access Divider (Exact match to screenshot) */}
          <div className="divider-row">
            <span className="divider-line" />
            <span className="divider-text">Secure Access</span>
            <span className="divider-line" />
          </div>

          {/* Switch Mode Footer */}
          <div className="switch-mode-box">
            <span>{isRegister ? 'Already registered?' : "Don't have an account?"}</span>
            <button type="button" className="switch-mode-btn" onClick={() => switchMode(!isRegister)}>
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </div>

          {/* Card Footer (Exact match to screenshot) */}
          <div className="card-bottom-footer">
            <Shield size={12} className="footer-shield-icon" />
            <span>Better Detection  |  Safer Internet</span>
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

        /* ══════ BACKGROUND IMAGE CONTAINER ══════ */
        .auth-bg-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .auth-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }
        .auth-bg-overlay {
          display: none;
        }

        /* ══════ TOP NAVIGATION BAR ══════ */
        .auth-nav-bar {
          position: absolute;
          top: 20px;
          left: 28px;
          right: 28px;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: auto;
        }
        .auth-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .auth-home-btn:hover {
          background: rgba(37, 99, 235, 0.8);
          border-color: #38bdf8;
          color: #ffffff;
          transform: translateY(-1px);
        }
        .auth-theme-toggle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
        }
        .auth-theme-toggle:hover {
          transform: scale(1.06);
          border-color: #38bdf8;
        }

        /* ══════ MAIN CONTENT CONTAINER ══════ */
        .auth-content-container {
          position: relative;
          z-index: 5;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 20px 48px 20px 20px;
          box-sizing: border-box;
        }

        /* ══════ GLASS CARD (EXACT TO SCREENSHOT & SCREEN FIT) ══════ */
        .auth-glass-card {
          width: 100%;
          max-width: 420px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          background: rgba(6, 16, 38, 0.85);
          border: 1.5px solid rgba(56, 189, 248, 0.35);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(37, 99, 235, 0.3);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 22px 24px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: opacity 0.2s ease, transform 0.2s ease;
          color: #ffffff;
          box-sizing: border-box;
        }
        .auth-glass-card::-webkit-scrollbar {
          width: 4px;
        }
        .auth-glass-card::-webkit-scrollbar-track {
          background: transparent;
        }
        .auth-glass-card::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.3);
          border-radius: 4px;
        }
        .auth-glass-card.fade-out {
          opacity: 0;
          transform: translateY(6px);
        }

        /* Shield Badge Icon */
        .card-badge-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
        }
        .shield-icon-glow {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: radial-gradient(circle at 30% 30%, #3b82f6 0%, #1d4ed8 100%);
          border: 1.5px solid rgba(56, 189, 248, 0.5);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.5), inset 0 0 12px rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .shield-svg {
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
        }
        .lock-inner-svg {
          position: absolute;
          color: #ffffff;
        }
        .brand-main-title {
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.2;
        }
        .blue-gradient-text {
          color: #38bdf8;
          text-shadow: 0 0 16px rgba(56, 189, 248, 0.6);
        }
        .brand-tagline {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Tabs */
        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          padding: 4px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          border-radius: 99px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 0.81rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(59, 130, 246, 0.9));
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(37, 99, 235, 0.4);
        }

        /* Alerts */
        .auth-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .auth-alert.error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #fca5a5;
        }
        .auth-alert.success {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #6ee7b7;
        }

        /* Form Inputs */
        .auth-form-fields {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .input-icon-wrapper {
          position: relative;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }
        .auth-input {
          width: 100%;
          padding: 11px 40px 11px 42px;
          background: rgba(15, 23, 42, 0.7);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.88rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }
        .auth-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18);
          background: rgba(15, 23, 42, 0.9);
        }
        .auth-input::placeholder {
          color: #64748b;
        }
        .password-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 2px;
          transition: color 0.2s ease;
        }
        .password-toggle-btn:hover {
          color: #38bdf8;
        }

        /* Password strength indicator */
        .pw-strength-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }
        .pw-indicator-track {
          display: flex;
          gap: 3px;
          flex: 1;
        }
        .pw-indicator-step {
          flex: 1;
          height: 3px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.1);
          transition: background 0.3s ease;
        }
        .pw-strength-label {
          font-size: 0.68rem;
          font-weight: 700;
        }

        /* Extras Row */
        .remember-forgot-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.79rem;
          color: #94a3b8;
        }
        .checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.79rem;
          color: #94a3b8;
        }
        .checkbox-label.terms {
          margin-top: 2px;
        }
        .checkbox-input {
          width: 14px;
          height: 14px;
          accent-color: #2563eb;
          cursor: pointer;
        }
        .forgot-link {
          background: none;
          border: none;
          color: #38bdf8;
          font-size: 0.79rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }

        /* Submit Button (Matching screenshot > Login button) */
        .submit-action-btn {
          width: 100%;
          padding: 12px 20px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          transition: all 0.22s ease;
          box-shadow: 0 4px 18px rgba(37, 99, 235, 0.45);
          margin-top: 4px;
        }
        .submit-action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.6);
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        }
        .submit-action-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Demo credentials */
        .demo-credentials-row {
          display: flex;
          gap: 6px;
          margin-top: 2px;
        }
        .demo-pill {
          flex: 1;
          padding: 6px;
          border-radius: 8px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .demo-pill.admin {
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
        }
        .demo-pill.admin:hover {
          background: rgba(99, 102, 241, 0.25);
        }
        .demo-pill.user {
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #7dd3fc;
        }
        .demo-pill.user:hover {
          background: rgba(56, 189, 248, 0.25);
        }

        /* Divider (Matching screenshot Secure Access) */
        .divider-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 2px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }
        .divider-text {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Switch Mode Footer */
        .switch-mode-box {
          text-align: center;
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .switch-mode-btn {
          background: none;
          border: none;
          color: #38bdf8;
          font-weight: 800;
          margin-left: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-family: inherit;
        }
        .switch-mode-btn:hover {
          text-decoration: underline;
        }

        /* Footer (Matching screenshot Better Detection | Safer Internet) */
        .card-bottom-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #38bdf8;
          font-weight: 600;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-shield-icon {
          color: #38bdf8;
        }

        /* ══════ MOBILE STYLES: "remove omage from mobile design ok" ══════ */
        @media (max-width: 800px) {
          .auth-page-root {
            justify-content: center;
            align-items: center;
            padding: 20px 16px;
            background: #060c1c !important;
          }
          .auth-bg-wrapper {
            display: none !important;
          }
          .auth-content-container {
            padding: 0;
            justify-content: center;
          }
          .auth-glass-card {
            max-width: 400px;
            padding: 26px 20px 20px;
            background: rgba(10, 18, 38, 0.95);
          }
          .brand-main-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
