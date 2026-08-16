import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
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
              <Shield size={20} color="#ffffff" />
            </div>
            <div>
              <h3 className="modal-brand-title">APDS CyberShield</h3>
              <p className="modal-brand-sub">Phishing Defense Console</p>
            </div>
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
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="modal-alert-box success">
              <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
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
                      <Mail size={17} />
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
                      Forgot?
                    </a>
                  </div>
                  <div className="m-input-box">
                    <div className="m-icon-slot">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="m-input-field"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="m-pw-btn"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    <span>Remember me</span>
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
                      <span>Sign in</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </>
            ) : (
              /* REGISTER */
              <>
                <div className="m-input-group">
                  <label className="m-input-label">Full name</label>
                  <div className="m-input-box">
                    <div className="m-icon-slot">
                      <User size={17} />
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
                      <Mail size={17} />
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
                        <Lock size={17} />
                      </div>
                      <input
                        type={showPw ? 'text' : 'password'}
                        required
                        placeholder="Min 6"
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

                  <div className="m-input-group">
                    <label className="m-input-label">Confirm</label>
                    <div className="m-input-box">
                      <div className="m-icon-slot">
                        <Lock size={17} />
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
                        {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
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
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: pwStrength.color }}>
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
                    <span style={{ fontSize: '0.8rem' }}>
                      I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: '#2563eb', fontWeight: 600 }}>Terms</a> & <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: '#2563eb', fontWeight: 600 }}>Privacy</a>
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
          <img
            src={isRegister ? registerArt : loginArt}
            alt="Security Art"
            className="modal-art-img"
          />
        </div>

      </div>

      <style>{`
        .modal-backdrop-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-content-card {
          width: 100%;
          max-width: 820px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8);
          overflow: hidden;
          position: relative;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          z-index: 30;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: #ffffff;
          color: #0f172a;
          transform: scale(1.06);
        }

        .modal-form-pane {
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .modal-brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .modal-brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-brand-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .modal-brand-sub {
          font-size: 0.72rem;
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
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-tab.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
        }

        .modal-alert-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.84rem;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .modal-alert-box.error {
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #b91c1c;
        }

        .modal-alert-box.success {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
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
          font-size: 0.82rem;
          font-weight: 600;
          color: #334155;
        }

        .m-forgot-link {
          font-size: 0.78rem;
          font-weight: 600;
          color: #2563eb;
          text-decoration: none;
        }

        /* Input Boxes */
        .m-input-box {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          padding: 0 12px;
          height: 44px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }

        .m-input-box:hover {
          border-color: #94a3b8;
        }

        .m-input-box:focus-within {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;
        }

        .m-icon-slot {
          color: #64748b;
          margin-right: 10px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .m-input-box:focus-within .m-icon-slot {
          color: #2563eb;
        }

        .m-input-field {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          height: 100%;
          font-size: 0.9rem;
          font-weight: 500;
          color: #0f172a;
          padding: 0;
        }

        .m-pw-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .m-grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .m-pw-strength-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -4px;
        }

        .m-pw-segments {
          display: flex;
          gap: 4px;
          flex: 1;
          max-width: 120px;
        }

        .m-pw-seg {
          height: 3px;
          flex: 1;
          border-radius: 99px;
        }

        .m-remember-row {
          display: flex;
          align-items: center;
          margin: 2px 0;
        }

        .m-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 500;
          color: #475569;
        }

        .m-checkbox {
          width: 15px;
          height: 15px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .m-submit-btn {
          height: 44px;
          border-radius: 12px;
          border: none;
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 16px -2px rgba(37, 99, 235, 0.35);
          transition: all 0.2s ease;
          margin-top: 4px;
        }

        .m-submit-btn.primary {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
        }

        .m-submit-btn.register {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
        }

        .m-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .m-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .m-footer-prompt {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 0.84rem;
          color: #64748b;
          font-weight: 500;
        }

        .m-switch-btn {
          background: transparent;
          border: none;
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-size: 0.84rem;
          text-decoration: underline;
        }

        /* Right Artwork Pane */
        .modal-art-pane {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          border-left: 1px solid #f1f5f9;
        }

        .modal-art-pane.log-art {
          background: linear-gradient(145deg, #f0f7ff, #e0effe);
        }

        .modal-art-pane.reg-art {
          background: linear-gradient(145deg, #f5f3ff, #ede9fe);
        }

        .modal-art-img {
          width: 88%;
          height: auto;
          max-height: 380px;
          object-fit: contain;
          filter: drop-shadow(0 15px 25px rgba(15, 23, 42, 0.1));
        }

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
          }
          .modal-art-pane {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
