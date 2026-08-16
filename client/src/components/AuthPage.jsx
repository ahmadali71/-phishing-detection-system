import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Check } from 'lucide-react';
import loginArt from '../assets/login_art.png';
import registerArt from '../assets/register_art.png';
import { usersService } from './../firebase/services';

export default function AuthPage({ onLoginSuccess }) {
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
          setErrorMsg('Please accept the Terms & Conditions to proceed');
          setIsLoading(false);
          return;
        }

        const user = await usersService.register({
          name: fullName,
          email: regEmail,
          password: password,
        });

        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
        }, 1200);

      } else {
        const user = await usersService.login({
          email: email,
          password: password,
        });

        setSuccessMsg('Login successful! Welcome back.');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
        }, 800);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed. Please verify your details.';
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
    <div className="auth-fullscreen-root">
      {/* ── LEFT COLUMN: FORM PANEL ── */}
      <div className="auth-form-wrapper">
        <div className="auth-form-inner">
          
          {/* Header Brand */}
          <div className="auth-brand-row">
            <div className="auth-brand-icon">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="auth-brand-title">APDS CyberShield</h2>
              <p className="auth-brand-subtitle">AI-Powered Phishing Defense</p>
            </div>
          </div>

          {/* Segmented Switcher Tabs */}
          <div className="auth-tabs-container">
            <button
              type="button"
              className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
              onClick={() => switchMode(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
              onClick={() => switchMode(true)}
            >
              Create Account
            </button>
          </div>

          {/* Title & Intro */}
          <div className="auth-header-text">
            <h1 className="auth-main-heading">
              {isRegister ? 'Get started for free' : 'Welcome back'}
            </h1>
            <p className="auth-sub-heading">
              {isRegister 
                ? 'Join cybersecurity experts and protect against real-time phishing.' 
                : 'Enter your credentials to manage and monitor scans.'}
            </p>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="auth-alert error">
              <AlertCircle size={18} className="alert-icon" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="auth-alert success">
              <CheckCircle2 size={18} className="alert-icon" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-main-form">
            {!isRegister ? (
              /* ================= LOGIN FIELDS ================= */
              <>
                {/* Email Box */}
                <div className="input-group">
                  <label className="input-label">Email address</label>
                  <div className="input-box">
                    <div className="input-icon-slot">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-element"
                    />
                  </div>
                </div>

                {/* Password Box */}
                <div className="input-group">
                  <div className="input-label-row">
                    <label className="input-label">Password</label>
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      className="forgot-link"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-box">
                    <div className="input-icon-slot">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-element"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="pw-toggle-btn"
                      title={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="remember-row">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="custom-checkbox"
                    />
                    <span className="checkbox-label">Remember me for 30 days</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !!successMsg}
                  className="auth-submit-button primary"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span>Sign in to account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
            ) : (
              /* ================= REGISTER FIELDS ================= */
              <>
                {/* Full Name Box */}
                <div className="input-group">
                  <label className="input-label">Full name</label>
                  <div className="input-box">
                    <div className="input-icon-slot">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-element"
                    />
                  </div>
                </div>

                {/* Email Box */}
                <div className="input-group">
                  <label className="input-label">Work or personal email</label>
                  <div className="input-box">
                    <div className="input-icon-slot">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="input-element"
                    />
                  </div>
                </div>

                {/* Password & Confirm Grid */}
                <div className="grid-two-inputs">
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="input-box">
                      <div className="input-icon-slot">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPw ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-element"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="pw-toggle-btn"
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Confirm</label>
                    <div className="input-box">
                      <div className="input-icon-slot">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-element"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="pw-toggle-btn"
                      >
                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="pw-strength-container">
                    <div className="pw-strength-bars">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="pw-strength-segment"
                          style={{
                            background: step <= pwStrength.score ? pwStrength.color : '#e2e8f0'
                          }}
                        />
                      ))}
                    </div>
                    <span className="pw-strength-text" style={{ color: pwStrength.color }}>
                      {pwStrength.label} password
                    </span>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="terms-row">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className="custom-checkbox"
                    />
                    <span className="checkbox-label">
                      I agree to the{' '}
                      <a href="#terms" onClick={(e) => e.preventDefault()} className="inline-link">Terms</a>
                      {' '}and{' '}
                      <a href="#privacy" onClick={(e) => e.preventDefault()} className="inline-link">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                {/* Register Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !!successMsg}
                  className="auth-submit-button register"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span>Create free account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}
          </form>

          {/* Bottom Switcher Prompt */}
          <div className="auth-footer-prompt">
            <span>
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
            </span>
            <button
              type="button"
              onClick={() => switchMode(!isRegister)}
              className="switch-action-btn"
            >
              {isRegister ? 'Sign in here' : 'Create an account'}
            </button>
          </div>

        </div>
      </div>

      {/* ── RIGHT COLUMN: BRANDING & ARTWORK PANEL ── */}
      <div className={`auth-art-panel ${isRegister ? 'register-theme' : 'login-theme'}`}>
        
        {/* Floating Verified Badge */}
        <div className="floating-badge">
          <div className="badge-icon-wrap">
            <Sparkles size={16} color="#2563eb" />
          </div>
          <div>
            <div className="badge-title">AI Phishing Guard Active</div>
            <div className="badge-subtitle">Real-time heuristics & neural classification</div>
          </div>
        </div>

        {/* Art Image */}
        <div className="art-image-wrapper">
          <img
            src={isRegister ? registerArt : loginArt}
            alt="Security Graphic"
            className="art-image"
          />
        </div>

        {/* Feature Highlights Grid */}
        <div className="art-highlights-bar">
          <div className="highlight-pill">
            <Check size={14} className="text-emerald-500" />
            <span>Zero-day link scanning</span>
          </div>
          <div className="highlight-pill">
            <Check size={14} className="text-emerald-500" />
            <span>NLP email body inspection</span>
          </div>
          <div className="highlight-pill">
            <Check size={14} className="text-emerald-500" />
            <span>Enterprise threat logs</span>
          </div>
        </div>

      </div>

      {/* ── CSS STYLES FOR BOXES AND LAYOUT ── */}
      <style>{`
        .auth-fullscreen-root {
          min-height: 100vh;
          width: 100vw;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          background: #ffffff;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #0f172a;
          overflow-x: hidden;
        }

        /* Left Column Wrapper */
        .auth-form-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justifyContent: center;
          padding: clamp(24px, 4vw, 56px);
          background: #ffffff;
          box-sizing: border-box;
        }

        .auth-form-inner {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
        }

        /* Brand Row */
        .auth-brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .auth-brand-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justifyContent: center;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .auth-brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
          color: #0f172a;
        }

        .auth-brand-subtitle {
          font-size: 0.78rem;
          font-weight: 500;
          color: #64748b;
          margin: 0;
        }

        /* Segmented Tabs */
        .auth-tabs-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 14px;
          margin-bottom: 24px;
          border: 1px solid #e2e8f0;
        }

        .auth-tab-btn {
          border: none;
          background: transparent;
          padding: 10px 14px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748b;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .auth-tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        /* Header Text */
        .auth-header-text {
          margin-bottom: 24px;
        }

        .auth-main-heading {
          font-size: clamp(1.75rem, 2.5vw, 2.15rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          color: #0f172a;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        .auth-sub-heading {
          font-size: 0.92rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        /* Alert Banners */
        .auth-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 0.88rem;
          font-weight: 500;
          margin-bottom: 20px;
          animation: slideDown 0.3s ease;
        }

        .auth-alert.error {
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #b91c1c;
        }

        .auth-alert.success {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          color: #15803d;
        }

        .alert-icon {
          flex-shrink: 0;
        }

        /* Form & Input Groups */
        .auth-main-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label-row {
          display: flex;
          justifyContent: space-between;
          align-items: center;
        }

        .input-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
        }

        .forgot-link {
          font-size: 0.82rem;
          font-weight: 600;
          color: #2563eb;
          text-decoration: none;
          transition: color 0.15s;
        }

        .forgot-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        /* ================= HIGH QUALITY INPUT BOXES ================= */
        .input-box {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 14px;
          padding: 0 14px;
          height: 48px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .input-box:hover {
          border-color: #94a3b8;
        }

        .input-box:focus-within {
          border-color: #2563eb !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12), 0 1px 2px rgba(15, 23, 42, 0.05) !important;
        }

        .input-icon-slot {
          display: flex;
          align-items: center;
          justifyContent: center;
          color: #64748b;
          margin-right: 12px;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .input-box:focus-within .input-icon-slot {
          color: #2563eb;
        }

        .input-element {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          height: 100%;
          font-size: 0.94rem;
          font-weight: 500;
          color: #0f172a;
          padding: 0;
        }

        .input-element::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .pw-toggle-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 6px;
          transition: all 0.15s;
        }

        .pw-toggle-btn:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .grid-two-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Password Strength Bar */
        .pw-strength-container {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          margin-top: -6px;
          padding: 0 2px;
        }

        .pw-strength-bars {
          display: flex;
          gap: 6px;
          flex: 1;
          max-width: 180px;
        }

        .pw-strength-segment {
          height: 4px;
          flex: 1;
          border-radius: 99px;
          transition: background 0.3s ease;
        }

        .pw-strength-text {
          font-size: 0.78rem;
          font-weight: 600;
        }

        /* Remember & Terms Checkboxes */
        .remember-row, .terms-row {
          display: flex;
          align-items: center;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .custom-checkbox {
          width: 17px;
          height: 17px;
          border-radius: 5px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 0.86rem;
          font-weight: 500;
          color: #475569;
        }

        .inline-link {
          color: #2563eb;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Submit Buttons */
        .auth-submit-button {
          height: 48px;
          border-radius: 14px;
          border: none;
          color: #ffffff;
          font-size: 0.98rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.35);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 4px;
        }

        .auth-submit-button.primary {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
        }

        .auth-submit-button.register {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%);
          box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.35);
        }

        .auth-submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(37, 99, 235, 0.45);
        }

        .auth-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-submit-button:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        /* Footer Prompt */
        .auth-footer-prompt {
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 8px;
          margin-top: 28px;
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .switch-action-btn {
          background: transparent;
          border: none;
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-size: 0.9rem;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* Right Artwork Column */
        .auth-art-panel {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          padding: 48px;
          position: relative;
          box-sizing: border-box;
          border-left: 1px solid #f1f5f9;
        }

        .auth-art-panel.login-theme {
          background: linear-gradient(145deg, #f0f7ff 0%, #e0effe 45%, #f8faff 100%);
        }

        .auth-art-panel.register-theme {
          background: linear-gradient(145deg, #f5f3ff 0%, #ede9fe 45%, #faf5ff 100%);
        }

        .floating-badge {
          position: absolute;
          top: 36px;
          right: 36px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
          z-index: 10;
        }

        .badge-icon-wrap {
          width: 32px;
          height: 32px;
          background: #eff6ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justifyContent: center;
        }

        .badge-title {
          font-size: 0.86rem;
          font-weight: 700;
          color: #0f172a;
        }

        .badge-subtitle {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
        }

        .art-image-wrapper {
          width: 100%;
          max-width: 520px;
          display: flex;
          align-items: center;
          justifyContent: center;
          margin: auto 0;
        }

        .art-image {
          width: 90%;
          height: auto;
          max-height: 55vh;
          object-fit: contain;
          filter: drop-shadow(0 20px 35px rgba(15, 23, 42, 0.12));
          transition: transform 0.4s ease;
        }

        .art-highlights-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justifyContent: center;
          width: 100%;
          max-width: 520px;
          margin-top: auto;
        }

        .highlight-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 99px;
          padding: 6px 14px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #334155;
          backdrop-filter: blur(8px);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 960px) {
          .auth-fullscreen-root {
            grid-template-columns: 1fr !important;
          }
          .auth-art-panel {
            display: none !important;
          }
          .auth-form-wrapper {
            padding: 24px 16px;
          }
          .grid-two-inputs {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
