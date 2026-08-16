import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import loginArt from '../assets/login_art.png';
import registerArt from '../assets/register_art.png';
import { usersService } from './../firebase/services';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isRegister) {
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
        
        setSuccessMsg('Registration successful! Logging you in...');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
          onClose();
        }, 1500);

      } else {
        const user = await usersService.login({
          email: email,
          password: password,
        });
        
        setSuccessMsg('Login successful!');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
          onClose();
        }, 1000);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Authentication failed. Please try again.');
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

  // Custom Input Component for consistent beautiful UI
  const AuthInput = ({ icon: Icon, type, placeholder, value, onChange, isPassword, showPwState, togglePw }) => (
    <div className="auth-input-container" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '14px 18px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }}>
      <Icon size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
      <input
        type={isPassword ? (showPwState ? 'text' : 'password') : type}
        required
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
          paddingRight: isPassword ? '36px' : '0',
          fontWeight: '500'
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
          title={showPwState ? "Hide password" : "Show password"}
        >
          {showPwState ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      <style>{`
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
      `}</style>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      animation: 'authFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* ── CARD CONTAINER ── */}
      <div style={{
        width: '100%',
        maxWidth: isRegister ? '900px' : '860px',
        background: '#ffffff',
        borderRadius: '28px',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(226, 232, 240, 0.6)',
        overflow: 'hidden',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: 'translateY(0)',
        opacity: 1
      }} className="auth-modal-card">

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            zIndex: 30,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.color = '#64748b';
          }}
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {/* ── LEFT COLUMN: FORM SECTION ── */}
        <div style={{
          padding: isRegister ? '40px 48px' : '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff',
          position: 'relative'
        }}>

          {/* Messages */}
          <div style={{ position: 'absolute', top: '24px', left: '48px', right: '48px' }}>
            {errorMsg && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideDown 0.3s ease' }}>
                <AlertCircle size={18} />
                <span style={{ fontWeight: 500 }}>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideDown 0.3s ease' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontWeight: 500 }}>{successMsg}</span>
              </div>
            )}
          </div>

          {!isRegister ? (
            /* ========================================================
               LOGIN SCREEN
            ======================================================== */
            <div style={{ marginTop: (errorMsg || successMsg) ? '40px' : '0', transition: 'margin 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}>
                  <Lock size={16} />
                </div>
                <span style={{
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  color: '#2563eb',
                  textTransform: 'uppercase'
                }}>
                  Secure Login
                </span>
              </div>

              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '900',
                color: '#0f172a',
                letterSpacing: '-0.03em',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                Welcome Back
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '0.95rem',
                marginBottom: '32px',
                fontWeight: '500'
              }}>
                Enter your credentials to access your dashboard.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                <AuthInput
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <AuthInput
                  icon={Lock}
                  isPassword
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPwState={showPw}
                  togglePw={() => setShowPw(!showPw)}
                />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px',
                  marginBottom: '8px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
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
                    style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                  >
                    Forgot Password?
                  </a>
                </div>

                 <button
                   type="submit"
                   disabled={isLoading || successMsg}
                   style={{
                     background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
                     color: '#ffffff',
                     border: 'none',
                     borderRadius: '16px',
                     padding: '16px',
                     fontWeight: '700',
                     fontSize: '1.05rem',
                     cursor: (isLoading || successMsg) ? 'not-allowed' : 'pointer',
                     opacity: (isLoading || successMsg) ? 0.8 : 1,
                     boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                     transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     gap: '10px'
                   }}
                   onMouseEnter={(e) => {
                     if(!isLoading && !successMsg) e.currentTarget.style.transform = 'translateY(-2px)';
                   }}
                   onMouseLeave={(e) => {
                     if(!isLoading && !successMsg) e.currentTarget.style.transform = 'translateY(0)';
                   }}
                 >
                   {isLoading ? <Loader2 size={22} className="animate-spin" /> : 'Sign In'}
                 </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
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
                  Create one now
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================
               REGISTER SCREEN
            ======================================================== */
            <div style={{ marginTop: (errorMsg || successMsg) ? '40px' : '0', transition: 'margin 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  <User size={16} />
                </div>
                <span style={{
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  color: '#6366f1',
                  textTransform: 'uppercase'
                }}>
                  Join APDS
                </span>
              </div>

              <h2 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#0f172a',
                letterSpacing: '-0.03em',
                marginBottom: '6px',
                lineHeight: '1.2'
              }}>
                Create Account
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '0.9rem',
                marginBottom: '24px',
                fontWeight: '500'
              }}>
                Sign up to start scanning and protecting your digital assets.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <AuthInput
                  icon={User}
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <AuthInput
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <AuthInput
                    icon={Lock}
                    isPassword
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPwState={showPw}
                    togglePw={() => setShowPw(!showPw)}
                  />

                  <AuthInput
                    icon={Lock}
                    isPassword
                    placeholder="Confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    showPwState={showConfirmPw}
                    togglePw={() => setShowConfirmPw(!showConfirmPw)}
                  />
                </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#475569',
                  marginTop: '6px',
                  marginBottom: '6px',
                  fontWeight: '500'
                }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    style={{ cursor: 'pointer', accentColor: '#6366f1', width: '18px', height: '18px', borderRadius: '6px' }}
                  />
                  <span>
                    I agree to the <a href="#" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms of Service</a> & <a href="#" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacy Policy</a>
                  </span>
                </label>

                 <button
                   type="submit"
                   disabled={isLoading || successMsg}
                   style={{
                     background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
                     color: '#ffffff',
                     border: 'none',
                     borderRadius: '16px',
                     padding: '16px',
                     fontWeight: '700',
                     fontSize: '1.05rem',
                     cursor: (isLoading || successMsg) ? 'not-allowed' : 'pointer',
                     opacity: (isLoading || successMsg) ? 0.8 : 1,
                     boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                     transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     gap: '10px'
                   }}
                   onMouseEnter={(e) => {
                     if(!isLoading && !successMsg) e.currentTarget.style.transform = 'translateY(-2px)';
                   }}
                   onMouseLeave={(e) => {
                     if(!isLoading && !successMsg) e.currentTarget.style.transform = 'translateY(0)';
                   }}
                 >
                   {isLoading ? <Loader2 size={22} className="animate-spin" /> : 'Create Account'}
                 </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>
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
                  Log in
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN: ARTWORK ── */}
        <div style={{
          background: isRegister ? 'linear-gradient(135deg, #eef2ff, #f5f3ff)' : 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '20px'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>
          <img
            src={isRegister ? registerArt : loginArt}
            alt="Authentication Art"
            style={{
              width: '90%',
              height: 'auto',
              maxHeight: '90%',
              objectFit: 'contain',
              display: 'block',
              position: 'relative',
              zIndex: 10,
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isRegister ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        </div>

      </div>

      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .auth-modal-card {
            grid-template-columns: 1fr !important;
            max-width: 450px !important;
          }
          .auth-modal-card > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
