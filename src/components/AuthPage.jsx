import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import loginArt from '../assets/login_art.png';
import registerArt from '../assets/register_art.png';

export default function AuthPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = isRegister
      ? {
          name: fullName || 'Amna Najam',
          email: regEmail || 'amnanajam2003@gmail.com',
          username: username || 'amna_najam',
          role: 'Premium User'
        }
      : {
          name: emailOrUser.includes('@') ? emailOrUser.split('@')[0] : (emailOrUser || 'Amna Najam'),
          email: emailOrUser.includes('@') ? emailOrUser : 'amnanajam2003@gmail.com',
          username: emailOrUser || 'amna_najam',
          role: 'Premium User'
        };
    if (onLoginSuccess) onLoginSuccess(user);
  };

  const handleBypassDemo = () => {
    if (onLoginSuccess) {
      onLoginSuccess({
        name: 'Amna Najam',
        email: 'amnanajam2003@gmail.com',
        username: 'amna_najam',
        role: 'Premium User'
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0b1a42 0%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* ── CARD CONTAINER (Exact 1:1 Match to User Documentation Page 60) ── */}
      <div style={{
        width: '100%',
        maxWidth: isRegister ? '880px' : '820px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 65px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        overflow: 'hidden',
        position: 'relative',
        display: 'grid',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }} className="auth-modal-card">

        {/* ── LEFT COLUMN: FORM SECTION ── */}
        <div style={{
          padding: isRegister ? '36px 40px' : '44px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff'
        }}>

          {!isRegister ? (
            /* ========================================================
               SCREEN 2: LOGIN SCREEN (Exact Match to User Screenshot)
            ======================================================== */
            <div>
              {/* Badge: [2] LOGIN SCREEN */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '20px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '0.92rem',
                  boxShadow: '0 3px 8px rgba(37, 99, 235, 0.4)'
                }}>
                  2
                </div>
                <span style={{
                  fontWeight: '900',
                  fontSize: '0.86rem',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase'
                }}>
                  LOGIN SCREEN
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#0f172a',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.03em',
                marginBottom: '4px',
                lineHeight: '1.2'
              }}>
                Welcome Back!
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '0.94rem',
                marginBottom: '28px',
                fontWeight: '500'
              }}>
                Login to your account
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Input 1: Email or Username */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  padding: '13px 16px'
                }}>
                  <Mail size={19} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="Email or Username"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#0f172a',
                      fontSize: '0.95rem',

                      padding: 0,
                      fontWeight: '500'
                    }}
                  />
                </div>

                {/* Input 2: Password with Eye Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  padding: '13px 16px',
                  position: 'relative'
                }}>
                  <Lock size={19} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#0f172a',
                      fontSize: '0.95rem',

                      padding: 0,
                      paddingRight: '32px',
                      fontWeight: '500'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.86rem',
                  marginTop: '2px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569', fontWeight: '500' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      style={{ cursor: 'pointer', accentColor: '#2563eb', width: '16px', height: '16px' }}
                    />
                    Remember me
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      color: '#2563eb',
                      fontWeight: '700',
                      textDecoration: 'none',
                      fontSize: '0.86rem'
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 60%, #06b6d4 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '14px',
                    fontWeight: '800',
                    fontSize: '1.02rem',
 
                    cursor: 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 8px 24px -4px rgba(2, 132, 199, 0.45)',
                    transition: 'transform 0.15s, box-shadow 0.15s'
                  }}
                >
                  Login
                </button>

                {/* Quick Guest Demo Access */}
                <button
                  type="button"
                  onClick={handleBypassDemo}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '10px',
                    fontWeight: '700',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    marginTop: '2px'
                  }}
                >
                  ⚡ Direct Demo Access (Guest Login)
                </button>
              </form>

              {/* Bottom Switch to Register */}
              <div style={{
                textAlign: 'center',
                marginTop: '22px',
                fontSize: '0.9rem',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: 0
                  }}
                >
                  Register here
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================
               SCREEN 3: REGISTER SCREEN (Exact Match to User Screenshot)
            ======================================================== */
            <div>
              {/* Badge: [3] REGISTER SCREEN */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '0.92rem',
                  boxShadow: '0 3px 8px rgba(99, 102, 241, 0.4)'
                }}>
                  3
                </div>
                <span style={{
                  fontWeight: '900',
                  fontSize: '0.86rem',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase'
                }}>
                  REGISTER SCREEN
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 style={{
                fontSize: '1.85rem',
                fontWeight: '900',
                color: '#0f172a',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.03em',
                marginBottom: '4px',
                lineHeight: '1.2'
              }}>
                Create Your Account
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '0.9rem',
                marginBottom: '18px',
                fontWeight: '500'
              }}>
                Join APDS and stay protected
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {/* Input 1: Full Name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '11px 14px'
                }}>
                  <User size={18} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#0f172a',
                      fontSize: '0.9rem',

                      padding: 0,
                      fontWeight: '500'
                    }}
                  />
                </div>

                {/* Input 2: Email Address */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '11px 14px'
                }}>
                  <Mail size={18} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#0f172a',
                      fontSize: '0.9rem',

                      padding: 0,
                      fontWeight: '500'
                    }}
                  />
                </div>

                {/* Input 3: Username */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '11px 14px'
                }}>
                  <User size={18} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#0f172a',
                      fontSize: '0.9rem',

                      padding: 0,
                      fontWeight: '500'
                    }}
                  />
                </div>

                {/* Input 4: Password */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '11px 14px',
                  position: 'relative'
                }}>
                  <User size={18} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#0f172a',
                      fontSize: '0.9rem',

                      padding: 0,
                      paddingRight: '30px',
                      fontWeight: '500'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Input 5: Confirm Password */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '11px 14px',
                  position: 'relative'
                }}>
                  <User size={18} color="#64748b" style={{ flexShrink: 0 }} />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      color: '#0f172a',
                      fontSize: '0.9rem',

                      padding: 0,
                      paddingRight: '30px',
                      fontWeight: '500'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showConfirmPw ? "Hide password" : "Show password"}
                  >
                    {showConfirmPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Terms & Conditions Checkbox */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  color: '#475569',
                  marginTop: '2px',
                  fontWeight: '500'
                }}>
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    style={{ cursor: 'pointer', accentColor: '#6366f1', width: '16px', height: '16px', borderRadius: '4px' }}
                  />
                  <span>
                    I agree to the{' '}
                    <strong style={{ color: '#4f46e5' }}>Terms & Conditions</strong>
                  </span>
                </label>

                {/* Create Account Button */}
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(90deg, #7c3aed 0%, #2563eb 55%, #06b6d4 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '13px',
                    fontWeight: '800',
                    fontSize: '1rem',
 
                    cursor: 'pointer',
                    marginTop: '4px',
                    boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.4)',
                    transition: 'transform 0.15s, box-shadow 0.15s'
                  }}
                >
                  Create Account
                </button>
              </form>

              {/* Bottom Switch to Login */}
              <div style={{
                textAlign: 'center',
                marginTop: '18px',
                fontSize: '0.88rem',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#4f46e5',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    padding: 0
                  }}
                >
                  Login here
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN: EXACT ARTWORK FROM DOCUMENTATION ── */}
        <div style={{
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          borderInlineStart: '1px solid #f1f5f9'
        }} className="auth-modal-banner">
          <img
            src={isRegister ? registerArt : loginArt}
            alt="APDS Storyboard Graphic"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>

      </div>
    </div>
  );
}
