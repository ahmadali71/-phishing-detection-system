import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
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
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!fullName || !email || !username || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setError('Please agree to the Terms & Conditions');
        return;
      }
    } else {
      if (!emailOrUser || !password) {
        setError('Please enter email/username and password');
        return;
      }
    }

    if (onLoginSuccess) {
      onLoginSuccess({
        name: isRegister && fullName ? fullName : (emailOrUser ? emailOrUser.split('@')[0] : 'Amna Najam'),
        email: isRegister && email ? email : (emailOrUser.includes('@') ? emailOrUser : 'amnanajam2003@gmail.com'),
        role: 'BS IT Student / Security Analyst',
        username: isRegister && username ? username : (emailOrUser ? emailOrUser : 'amna_najam')
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-gradient-orb auth-orb-1" />
        <div className="auth-gradient-orb auth-orb-2" />
        <div className="auth-gradient-orb auth-orb-3" />
      </div>

      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Shield size={32} color="white" />
          </div>
          <h1 className="auth-logo-text">APDS</h1>
          <p className="auth-logo-subtitle">Automated Phishing Detection System</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-badge">
              {isRegister ? 'CREATE ACCOUNT' : 'SECURE LOGIN'}
            </div>
            <h2 className="auth-title">
              {isRegister ? 'Join APDS' : 'Welcome Back'}
            </h2>
            <p className="auth-subtitle">
              {isRegister ? 'Create your account to get started' : 'Login to access the security dashboard'}
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister ? (
              <>
                <div className="auth-input-group">
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-wrap">
                    <User size={16} color="var(--text-muted)" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrap">
                    <Mail size={16} color="var(--text-muted)" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-label">Username</label>
                  <div className="auth-input-wrap">
                    <User size={16} color="var(--text-muted)" />
                    <input
                      type="text"
                      required
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-input-group">
                <label className="auth-label">Email or Username</label>
                <div className="auth-input-wrap">
                  <Mail size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your email or username"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isRegister ? 'Create a password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="auth-input-group">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} color="var(--text-muted)" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-password-toggle"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {!isRegister && (
              <div className="auth-options">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="auth-link">
                  Forgot Password?
                </a>
              </div>
            )}

            {isRegister && (
              <label className="auth-checkbox auth-terms">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <span>I agree to the Terms & Conditions</span>
              </label>
            )}

            <button type="submit" className="auth-submit">
              {isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setIsRegister(false)} className="auth-toggle">
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsRegister(true)} className="auth-toggle">
                  Register here
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="auth-copyright">
          © 2026 APDS — BS IT Final Year Project
        </p>
      </div>
    </div>
  );
}
