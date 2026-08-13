import React, { useState } from 'react';
import { X, Shield, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess({
        name: isRegister && fullName ? fullName : (emailOrUser ? emailOrUser.split('@')[0] : 'Amna Najam'),
        email: isRegister && email ? email : (emailOrUser.includes('@') ? emailOrUser : 'amnanajam2003@gmail.com'),
        role: 'BS IT Student / Security Analyst',
        username: isRegister && username ? username : (emailOrUser ? emailOrUser : 'amna_najam')
      });
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(5px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: isRegister ? '780px' : '720px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Left Column: Form Section (Exact Match to PDF Page 60 Screens 2 & 3) */}
        <div style={{ padding: '36px 32px' }}>
          {!isRegister ? (
            /* Screen 2: Login Form */
            <div>
              <div style={{ display: 'inline-flex', padding: '2px 8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800', marginBottom: '8px' }}>
                LOGIN SCREEN
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '4px' }}>Welcome Back!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
                Login to your account
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <Mail size={16} color="var(--text-muted)" />
                    <input
                      type="text"
                      required
                      placeholder="Email or Username"
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', padding: 0 }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <Lock size={16} color="var(--text-muted)" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', padding: 0, paddingRight: '28px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    Remember me
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}>
                  Login
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: '700', cursor: 'pointer' }}
                >
                  Register here
                </button>
              </div>
            </div>
          ) : (
            /* Screen 3: Register Form */
            <div>
              <div style={{ display: 'inline-flex', padding: '2px 8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800', marginBottom: '8px' }}>
                REGISTER SCREEN
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>Create Your Account</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Join APDS and stay protected
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <User size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', padding: 0 }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <Mail size={16} color="var(--text-muted)" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', padding: 0 }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <User size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', padding: 0 }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', padding: 0, paddingRight: '28px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', padding: 0, paddingRight: '28px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" required checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />
                  I agree to the Terms & Conditions
                </label>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: '4px' }}>
                  Create Account
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: '700', cursor: 'pointer' }}
                >
                  Login here
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Shield Graphic (Exact Match to PDF Page 60) */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #4338ca)',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
          }}>
            <Shield size={46} color="#ffffff" />
          </div>

          <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', color: 'white' }}>
            APDS Security Shield
          </h4>
          <p style={{ fontSize: '0.82rem', opacity: 0.9, lineHeight: '1.5', maxWidth: '220px' }}>
            Real-time phishing & social engineering defense system
          </p>
        </div>
      </div>
    </div>
  );
}
