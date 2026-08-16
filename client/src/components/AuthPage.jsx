import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Shield, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import loginArt from '../assets/login_art.png';
import registerArt from '../assets/register_art.png';
import { usersService } from './../firebase/services';

export default function AuthPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Shared fields
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
          setErrorMsg('You must agree to the Terms & Conditions');
          setIsLoading(false);
          return;
        }

        const user = await usersService.register({
          name: fullName,
          email: regEmail,
          password: password,
        });

        setSuccessMsg('Account created successfully! Welcome aboard!');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
        }, 1200);

      } else {
        const user = await usersService.login({
          email: email,
          password: password,
        });

        setSuccessMsg('Login successful! Redirecting...');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
        }, 800);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed. Please check your credentials and try again.';
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

  // Reusable input component
  const AuthInput = ({ icon: Icon, type, placeholder, value, onChange, isPassword, showPwState, togglePw, autoFocus }) => (
    <div className="auth-input-container" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: '#f8fafc',
      border: '1.5px solid #e2e8f0',
      borderRadius: '16px',
      padding: '15px 18px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }}>
      <Icon size={20} color="#94a3b8" style={{ flexShrink: 0, transition: 'color 0.2s' }} />
      <input
        type={isPassword ? (showPwState ? 'text' : 'password') : type}
        required
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="auth-input-field"
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          width: '100%',
          color: '#0f172a',
          fontSize: '0.95rem',
          padding: 0,
          paddingRight: isPassword ? '40px' : '0',
          fontWeight: '500',
          letterSpacing: isPassword && !showPwState ? '0.1em' : 'normal'
        }}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePw}
          style={{
            position: 'absolute',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#475569'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          title={showPwState ? 'Hide password' : 'Show password'}
        >
          {showPwState ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.5
      }} />
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      {/* ── CARD CONTAINER ── */}
      <div style={{
        width: '100%',
        maxWidth: isRegister ? '920px' : '880px',
        background: '#ffffff',
        borderRadius: '32px',
        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 10,
        animation: 'authPageCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }} className="auth-modal-card">

        {/* ── LEFT COLUMN: FORM SECTION ── */}
        <div style={{
          padding: isRegister ? '44px 52px' : '52px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff',
          position: 'relative'
        }}>

          {/* Logo / Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: '#ffffff',
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '900',
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>APDS Security</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: '500' }}>
                Advanced Phishing Detection System
              </p>
            </div>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div style={{
              padding: '14px 18px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              borderRadius: '14px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              animation: 'slideDown 0.3s ease'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontWeight: 500 }}>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div style={{
              padding: '14px 18px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              borderRadius: '14px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              animation: 'slideDown 0.3s ease'
            }}>
              <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontWeight: 500 }}>{successMsg}</span>
            </div>
          )}

          {!isRegister ? (
            /* ========== LOGIN SCREEN ========== */
            <div>
              <h2 style={{
                fontSize: '2.4rem',
                fontWeight: '900',
                color: '#0f172a',
                letterSpacing: '-0.03em',
                marginBottom: '8px',
                lineHeight: '1.15'
              }}>
                Welcome Back
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                marginBottom: '36px',
                fontWeight: '500',
                lineHeight: '1.6'
              }}>
                Enter your credentials to access your security dashboard.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <AuthInput
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Password
                  </label>
                  <AuthInput
                    icon={Lock}
                    isPassword
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPwState={showPw}
                    togglePw={() => setShowPw(!showPw)}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '-4px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      style={{ cursor: 'pointer', accentColor: '#2563eb', width: '18px', height: '18px', borderRadius: '6px' }}
                    />
                    Remember me
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !!successMsg}
                  style={{
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '17px',
                    fontWeight: '700',
                    fontSize: '1.05rem',
                    cursor: (isLoading || successMsg) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || successMsg) ? 0.85 : 1,
                    boxShadow: '0 10px 30px -5px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && !successMsg) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 14px 35px -5px rgba(37, 99, 235, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(37, 99, 235, 0.4)';
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight size={20} /></>
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '36px', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    padding: 0,
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px'
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            /* ========== REGISTER SCREEN ========== */
            <div>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '900',
                color: '#0f172a',
                letterSpacing: '-0.03em',
                marginBottom: '8px',
                lineHeight: '1.15'
              }}>
                Create Account
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '0.95rem',
                marginBottom: '28px',
                fontWeight: '500',
                lineHeight: '1.6'
              }}>
                Join APDS to protect your digital assets from phishing threats.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <AuthInput
                    icon={User}
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <AuthInput
                    icon={Mail}
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                      Password
                    </label>
                    <AuthInput
                      icon={Lock}
                      isPassword
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showPwState={showPw}
                      togglePw={() => setShowPw(!showPw)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                      Confirm
                    </label>
                    <AuthInput
                      icon={Lock}
                      isPassword
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      showPwState={showConfirmPw}
                      togglePw={() => setShowConfirmPw(!showConfirmPw)}
                    />
                  </div>
                </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#475569',
                  marginTop: '4px',
                  fontWeight: '500'
                }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    style={{ cursor: 'pointer', accentColor: '#6366f1', width: '18px', height: '18px', borderRadius: '6px' }}
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Terms of Service</a>
                    {' '}&{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Privacy Policy</a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading || !!successMsg}
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '17px',
                    fontWeight: '700',
                    fontSize: '1.05rem',
                    cursor: (isLoading || successMsg) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || successMsg) ? 0.85 : 1,
                    boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.4)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && !successMsg) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 14px 35px -5px rgba(99, 102, 241, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(99, 102, 241, 0.4)';
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight size={20} /></>
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#4f46e5',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    padding: 0,
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px'
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN: ARTWORK ── */}
        <div style={{
          background: isRegister
            ? 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #f5f3ff 100%)'
            : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0f9ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '32px'
        }} className="auth-modal-banner">
          {/* Dot pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }} />

          {/* Floating shield badge */}
          <div style={{
            position: 'absolute',
            top: '32px',
            right: '32px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            zIndex: 20
          }}>
            <Shield size={20} color="#2563eb" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Protected</span>
          </div>

          <img
            src={isRegister ? registerArt : loginArt}
            alt="APDS Security Illustration"
            style={{
              width: '85%',
              height: 'auto',
              maxHeight: '85%',
              objectFit: 'contain',
              display: 'block',
              position: 'relative',
              zIndex: 10,
              filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.12))',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isRegister ? 'scale(1.03)' : 'scale(1)'
            }}
          />
        </div>

      </div>

      <style>{`
        @keyframes authPageCardIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .auth-input-container:focus-within {
          border-color: #3b82f6 !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }
        .auth-input-container:focus-within svg:first-child {
          color: #3b82f6 !important;
        }
        .auth-input-field::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .auth-modal-card {
            grid-template-columns: 1fr !important;
            max-width: 480px !important;
          }
          .auth-modal-banner {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
