import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import loginArt from '../assets/login_art.png';
import registerArt from '../assets/register_art.png';
import { usersService } from './../firebase/services';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI states
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Password strength calculation
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isRegister) {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (!agreeTerms) {
          setErrorMsg('Please accept the Terms & Conditions');
          setIsLoading(false);
          return;
        }

        const user = await usersService.register({
          name: fullName,
          email: regEmail,
          password: password,
        });

        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
          onClose();
        }, 1000);

      } else {
        const user = await usersService.login({
          email: email,
          password: password,
        });

        setSuccessMsg('Login successful!');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
          onClose();
        }, 800);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Floating Close Button */}
        <button className="modal-close-btn" onClick={onClose} title="Close modal">
          <X size={18} />
        </button>

        {/* ── LEFT FORM SECTION ── */}
        <div className="modal-form-pane">
          
          {/* Brand Row */}
          <div className="modal-brand-row">
            <div className="modal-brand-icon">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L40 9.8V23.4C40 33.2 33.2 41.8 24 44C14.8 41.8 8 33.2 8 23.4V9.8L24 4Z" fill="#ffffff" fillOpacity="0.95" />
                <path d="M24 14V26C24 28.2 22.2 30 20 30C17.8 30 16 28.2 16 26" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="24" cy="14" r="2.5" fill="#2563eb" />
              </svg>
            </div>
            <div>
              <h3 className="modal-brand-title">APDS CyberShield</h3>
              <p className="modal-brand-sub">Phishing Defense Console</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="modal-welcome">
            <h2 className="modal-welcome-title">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="modal-welcome-sub">
              {isRegister
                ? 'Join APDS to protect against phishing attacks'
                : 'Sign in to your APDS dashboard'}
            </p>
          </div>

          {/* Segmented Switcher Tabs */}
          <div className="modal-tabs-wrapper">
            <button
              type="button"
              className={`modal-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => switchMode(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`modal-tab ${isRegister ? 'active' : ''}`}
              onClick={() => switchMode(true)}
            >
              Sign Up
            </button>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="modal-alert-box error">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="modal-alert-box success">
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="modal-form">
            {!isRegister ? (
              /* LOGIN */
              <>
                <div className="m-input-group">
                  <label className="m-input-label">Email address</label>
                  <div className="m-input-box">
                    <div className="m-icon-slot">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="m-input-field"
                    />
                  </div>
                </div>

                <div className="m-input-group">
                  <div className="m-label-row">
                    <label className="m-input-label">Password</label>
                    <a href="#forgot" onClick={(e) => e.preventDefault()} className="m-forgot-link">
                      Forgot password?
                    </a>
                  </div>
                  <div className="m-input-box">
                    <div className="m-icon-slot">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="m-input-field"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="m-pw-btn"
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="m-remember-row">
                  <label className="m-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="m-checkbox"
                    />
                    <span>Remember me for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !!successMsg}
                  className="m-submit-btn primary"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Sign in to Dashboard</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Demo Quick Fill */}
                <div className="m-demo-row">
                  <button type="button" className="m-demo-pill" onClick={() => { setEmail('admin@apds.edu'); setPassword('Admin@12345'); }}>
                    🛡 Admin Demo
                  </button>
                  <button type="button" className="m-demo-pill" onClick={() => { setEmail('amna.student@uos.edu.pk'); setPassword('User@12345'); }}>
                    👤 User Demo
                  </button>
                </div>
              </>
            ) : (
              /* REGISTER */
              <>
                <div className="m-input-group">
                  <label className="m-input-label">Full name</label>
                  <div className="m-input-box">
                    <div className="m-icon-slot">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="m-input-field"
                    />
                  </div>
                </div>

                <div className="m-input-group">
                  <label className="m-input-label">Email address</label>
                  <div className="m-input-box">
                    <div className="m-icon-slot">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="m-input-field"
                    />
                  </div>
                </div>

                <div className="m-grid-two">
                  <div className="m-input-group">
                    <label className="m-input-label">Password</label>
                    <div className="m-input-box">
                      <div className="m-icon-slot">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPw ? 'text' : 'password'}
                        required
                        placeholder="Min 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="m-input-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="m-pw-btn"
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="m-input-group">
                    <label className="m-input-label">Confirm</label>
                    <div className="m-input-box">
                      <div className="m-icon-slot">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        required
                        placeholder="Repeat"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="m-input-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="m-pw-btn"
                      >
                        {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {password && (
                  <div className="m-pw-strength-bar">
                    <div className="m-pw-segments">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="m-pw-seg"
                          style={{
                            background: step <= pwStrength.score ? pwStrength.color : '#e2e8f0'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.73rem', fontWeight: 700, color: pwStrength.color }}>
                      {pwStrength.label}
                    </span>
                  </div>
                )}

                <div className="m-remember-row">
                  <label className="m-checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className="m-checkbox"
                    />
                    <span style={{ fontSize: '0.79rem' }}>
                      I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: '#2563eb', fontWeight: 700 }}>Terms</a> &amp; <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: '#2563eb', fontWeight: 700 }}>Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !!successMsg}
                  className="m-submit-btn register"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </>
            )}
          </form>

          {/* Footer Prompt */}
          <div className="m-footer-prompt">
            <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              onClick={() => switchMode(!isRegister)}
              className="m-switch-btn"
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </div>

        </div>

        {/* ── RIGHT ARTWORK SECTION ── */}
        <div className={`modal-art-pane ${isRegister ? 'reg-art' : 'log-art'}`}>
          {/* Decorative top-right orb */}
          <div className="art-orb art-orb-1" />
          <div className="art-orb art-orb-2" />

          {/* Brand watermark */}
          <div className="art-brand-badge">
            <Shield size={16} color="#ffffff" />
            <span>APDS Security</span>
          </div>

          <img
            src={isRegister ? registerArt : loginArt}
            alt="Security Artwork"
            className="modal-art-img"
          />

          {/* Stats strip */}
          <div className="art-stats-strip">
            <div className="art-stat">
              <span className="art-stat-num">99.8%</span>
              <span className="art-stat-lbl">Detection Rate</span>
            </div>
            <div className="art-stat-sep" />
            <div className="art-stat">
              <span className="art-stat-num">50M+</span>
              <span className="art-stat-lbl">URLs Scanned</span>
            </div>
            <div className="art-stat-sep" />
            <div className="art-stat">
              <span className="art-stat-num">Real-Time</span>
              <span className="art-stat-lbl">Analysis</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .modal-backdrop-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalFade 0.25s ease;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }

        .modal-content-card {
          width: 100%;
          max-width: 860px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow:
            0 32px 80px -12px rgba(0,0,0,0.25),
            0 0 0 1px rgba(226,232,240,0.6);
          overflow: hidden;
          position: relative;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 92vh;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          z-index: 30;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        .modal-close-btn:hover {
          background: #ffffff;
          color: #0f172a;
          transform: scale(1.07);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        /* ── LEFT FORM PANE ── */
        .modal-form-pane {
          padding: 36px 38px 32px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          overflow-y: auto;
        }

        .modal-brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .modal-brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }
        .modal-brand-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .modal-brand-sub {
          font-size: 0.7rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .modal-welcome {
          margin-bottom: 20px;
        }
        .modal-welcome-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 0 0 4px;
        }
        .modal-welcome-sub {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .modal-tabs-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 12px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }
        .modal-tab {
          border: none;
          background: transparent;
          padding: 8px 12px;
          font-size: 0.84rem;
          font-weight: 700;
          color: #64748b;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .modal-tab.active {
          background: #ffffff;
          color: #1e40af;
          box-shadow: 0 2px 8px rgba(15,23,42,0.08);
        }

        .modal-alert-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 11px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .modal-alert-box.error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }
        .modal-alert-box.success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .m-input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .m-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .m-input-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #374151;
        }
        .m-forgot-link {
          font-size: 0.76rem;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
        }
        .m-forgot-link:hover { text-decoration: underline; }

        .m-input-box {
          display: flex;
          align-items: center;
          background: #f8faff;
          border: 1.5px solid #dde5f0;
          border-radius: 12px;
          padding: 0 12px;
          height: 44px;
          transition: all 0.2s ease;
        }
        .m-input-box:hover { border-color: #93c5fd; }
        .m-input-box:focus-within {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1) !important;
          background: #ffffff;
        }
        .m-icon-slot {
          color: #94a3b8;
          margin-right: 9px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .m-input-box:focus-within .m-icon-slot { color: #2563eb; }
        .m-input-field {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          height: 100%;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
          padding: 0;
          font-family: inherit;
        }
        .m-input-field::placeholder { color: #94a3b8; }
        .m-pw-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .m-pw-btn:hover { color: #2563eb; }

        .m-grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .m-pw-strength-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -6px;
        }
        .m-pw-segments {
          display: flex;
          gap: 4px;
          flex: 1;
          max-width: 130px;
        }
        .m-pw-seg {
          height: 3px;
          flex: 1;
          border-radius: 99px;
          transition: background 0.3s ease;
        }

        .m-remember-row {
          display: flex;
          align-items: center;
          margin: 0;
        }
        .m-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          color: #4b5563;
          line-height: 1.3;
        }
        .m-checkbox {
          width: 15px;
          height: 15px;
          accent-color: #2563eb;
          cursor: pointer;
          flex-shrink: 0;
        }

        .m-submit-btn {
          height: 46px;
          border-radius: 12px;
          border: none;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 4px;
          font-family: inherit;
        }
        .m-submit-btn.primary {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
          box-shadow: 0 4px 16px rgba(37,99,235,0.38);
        }
        .m-submit-btn.register {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
          box-shadow: 0 4px 16px rgba(99,102,241,0.38);
        }
        .m-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.45);
        }
        .m-submit-btn.register:hover:not(:disabled) {
          box-shadow: 0 8px 24px rgba(99,102,241,0.45);
        }
        .m-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .m-demo-row {
          display: flex;
          gap: 8px;
          margin-top: -4px;
        }
        .m-demo-pill {
          flex: 1;
          padding: 7px;
          border-radius: 9px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .m-demo-pill:hover {
          background: #e8f0fe;
          border-color: #bfdbfe;
          color: #1d4ed8;
        }

        .m-footer-prompt {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 18px;
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 500;
        }
        .m-switch-btn {
          background: transparent;
          border: none;
          color: #2563eb;
          font-weight: 800;
          cursor: pointer;
          padding: 0;
          font-size: 0.82rem;
          text-decoration: underline;
          font-family: inherit;
        }
        .m-switch-btn:hover { color: #1d4ed8; }

        /* ── RIGHT ARTWORK PANE ── */
        .modal-art-pane {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px 20px;
          overflow: hidden;
          gap: 16px;
        }
        .modal-art-pane.log-art {
          background: linear-gradient(145deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%);
        }
        .modal-art-pane.reg-art {
          background: linear-gradient(145deg, #ede9fe 0%, #f5f3ff 40%, #ddd6fe 100%);
        }

        .art-orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.4;
          pointer-events: none;
        }
        .art-orb-1 {
          width: 180px;
          height: 180px;
          top: -60px;
          right: -60px;
          background: radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 70%);
        }
        .modal-art-pane.reg-art .art-orb-1 {
          background: radial-gradient(circle, rgba(196,181,253,0.5) 0%, transparent 70%);
        }
        .art-orb-2 {
          width: 120px;
          height: 120px;
          bottom: -30px;
          left: -30px;
          background: radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%);
        }
        .modal-art-pane.reg-art .art-orb-2 {
          background: radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%);
        }

        .art-brand-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(37,99,235,0.88);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          z-index: 1;
          box-shadow: 0 4px 12px rgba(37,99,235,0.35);
        }
        .modal-art-pane.reg-art .art-brand-badge {
          background: rgba(109,40,217,0.88);
          box-shadow: 0 4px 12px rgba(109,40,217,0.35);
        }

        .modal-art-img {
          width: 88%;
          max-width: 220px;
          height: auto;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 20px;
          box-shadow:
            0 16px 40px rgba(15,23,42,0.18),
            0 4px 12px rgba(15,23,42,0.1);
          z-index: 1;
          transition: transform 0.3s ease;
        }
        .modal-art-img:hover { transform: scale(1.02); }

        .art-stats-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 14px;
          padding: 10px 14px;
          backdrop-filter: blur(8px);
          z-index: 1;
          width: 100%;
          justify-content: center;
        }
        .art-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .art-stat-num {
          font-size: 0.82rem;
          font-weight: 900;
          color: #1e40af;
          line-height: 1;
        }
        .modal-art-pane.reg-art .art-stat-num { color: #6d28d9; }
        .art-stat-lbl {
          font-size: 0.62rem;
          font-weight: 600;
          color: #64748b;
          text-align: center;
        }
        .art-stat-sep {
          width: 1px;
          height: 28px;
          background: #e2e8f0;
          flex-shrink: 0;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes modalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 768px) {
          .modal-content-card {
            grid-template-columns: 1fr !important;
            max-width: 440px !important;
            max-height: 92vh !important;
            overflow-y: auto !important;
          }
          .modal-art-pane {
            flex-direction: row !important;
            height: 110px !important;
            padding: 10px 16px !important;
            gap: 12px !important;
          }
          .modal-art-img {
            width: 80px !important;
            max-width: 80px !important;
            height: 80px !important;
            border-radius: 14px !important;
          }
          .art-stats-strip {
            flex-direction: column !important;
            gap: 4px !important;
            padding: 6px 10px !important;
          }
          .art-stat-sep { width: 30px; height: 1px; }
          .m-grid-two {
            grid-template-columns: 1fr !important;
          }
          .modal-form-pane {
            padding: 24px 20px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
