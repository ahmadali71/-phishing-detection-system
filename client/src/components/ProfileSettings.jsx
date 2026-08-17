import React, { useState } from 'react';
import {
  User, Lock, Bell, ChevronRight, Smartphone, Check,
  Shield, Palette, Edit2, Key, Download, Trash2, Eye,
  EyeOff, QrCode, AlertCircle, RefreshCw, Sparkles, Settings
} from 'lucide-react';

function Toggle({ checked, onChange }) {
  return (
    <label
      className="toggle-wrap"
      style={{
        position: 'relative',
        width: '44px',
        height: '24px',
        display: 'inline-flex',
        cursor: 'pointer',
        flexShrink: 0,
        verticalAlign: 'middle'
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12px',
          background: checked ? '#10b981' : 'var(--border-color)',
          transition: 'background 0.25s',
          boxShadow: checked ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '2px',
          insetInlineStart: checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          background: '#ffffff',
          borderRadius: '50%',
          transition: 'insetInlineStart 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}
      />
    </label>
  );
}

export default function ProfileSettings({
  currentUser,
  onUpdateProfile,
  theme,
  setTheme,
  language,
  onLanguageChange,
  t
}) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('All');

  // Form states
  const [fullName, setFullName] = useState(currentUser?.name ?? 'Amna Najam');
  const [email, setEmail] = useState(currentUser?.email ?? 'amnanajam2003@gmail.com');
  const [role, setRole] = useState(currentUser?.role ?? 'User');
  const [department, setDepartment] = useState('Department of Information Technology');
  const [university, setUniversity] = useState('University of Sargodha');

  // Security states
  const [twoFA, setTwoFA] = useState(currentUser?.twoFactorAuth !== false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [twoFAVerified, setTwoFAVerified] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(currentUser?.loginAlerts !== false);

  // Password fields
  const [showPwSection, setShowPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPwText, setShowPwText] = useState(false);

  // Notification preferences
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifThreats, setNotifThreats] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifPush, setNotifPush] = useState(true);

  // Privacy preferences
  const [telemetry, setTelemetry] = useState(true);
  const [shareAnonymous, setShareAnonymous] = useState(false);

  // UI status states
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: 'success' });

  const showToast = (text, type = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg({ text: '', type: 'success' }), 4000);
  };

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name: fullName,
        email,
        role,
        twoFactorAuth: twoFA,
        loginAlerts
      });
    }
    setIsEditing(false);
    showToast('Profile information updated successfully!');
  };

  const handleChangePassword = () => {
    if (!currentPw) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPw.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setShowPwSection(false);
    showToast('Password updated securely!');
  };

  const handleVerify2FACode = () => {
    if (authCode.length === 6) {
      setTwoFAVerified(true);
      setTwoFA(true);
      setShow2FASetup(false);
      setAuthCode('');
      showToast('Two-Factor Authentication activated and verified!');
    } else {
      showToast('Please enter a valid 6-digit authenticator code.', 'error');
    }
  };

  const handleExportData = () => {
    const data = {
      user: { fullName, email, role, department, university },
      security: { twoFactorEnabled: twoFA, loginAlerts },
      preferences: { theme, language, notifEmail, notifThreats },
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apds_user_profile_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Profile and telemetry data exported as JSON.');
  };

  const handleClearCache = () => {
    showToast('Scan telemetry and cached session keys purged.', 'success');
  };

  const tabs = [
    { id: 'All', label: 'All Settings', icon: Settings },
    { id: 'Profile', label: t.profileTab || 'Profile', icon: User },
    { id: 'Change Password', label: t.changePasswordTab || 'Change Password', icon: Lock },
    { id: 'Two Factor Auth', label: t.twoFactorTab || 'Two Factor Auth', icon: Smartphone },
    { id: 'Notifications', label: t.notificationsTab || 'Notifications', icon: Bell },
    { id: 'Privacy Settings', label: t.privacyTab || 'Privacy Settings', icon: Shield },
    { id: 'Theme Settings', label: t.themeTab || 'Theme Settings', icon: Palette },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1120px', margin: '0 auto' }}>
      {/* ── Desktop Top Badge & Title (Exact Match to PDF Page 64 Screen 9) ── */}
      <div className="desktop-header-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
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
            9
          </div>
          <span style={{
            fontWeight: '900',
            fontSize: '0.9rem',
            letterSpacing: '0.08em',
            color: 'var(--accent-blue)',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase'
          }}>
            {t.profileSettings || 'PROFILE & SETTINGS'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.85rem)', fontWeight: '800' }}>Account Settings</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Manage your personal security credentials, authentication protocols, and system preferences.
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile Vibrant Hero Banner (ONLY ON MOBILE) ── */}
      <div className="mobile-vibrant-hero">
        <div className="mobile-vibrant-hero-content">
          <h2 className="mobile-vibrant-hero-title">Profile &amp; Security Settings</h2>
          <p className="mobile-vibrant-hero-desc">
            Manage your account credentials, multi-factor authentication, privacy controls, and security alert channels.
          </p>
          <div className="mobile-vibrant-chips">
            <div className="mobile-vibrant-chip-item">👤 Personal Profile</div>
            <div className="mobile-vibrant-chip-item">🔒 2FA Protection</div>
            <div className="mobile-vibrant-chip-item">🔔 Alert Channels</div>
            <div className="mobile-vibrant-chip-item">🎨 Theme Customizer</div>
          </div>
          <button
            onClick={() => {
              setActiveTab('Profile');
              setIsEditing(true);
            }}
            className="mobile-vibrant-hero-btn"
          >
            Edit Profile →
          </button>
        </div>
        <div className="mobile-vibrant-hero-circle">
          <Settings size={42} strokeWidth={2.2} />
        </div>
      </div>

      {/* ── Interactive Toast Message ── */}
      {feedbackMsg.text && (
        <div style={{
          padding: '12px 18px',
          background: feedbackMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${feedbackMsg.type === 'error' ? '#ef4444' : '#10b981'}`,
          borderRadius: '12px',
          color: feedbackMsg.type === 'error' ? '#ef4444' : '#10b981',
          fontSize: '0.88rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          {feedbackMsg.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* ── 3-Column / Tabbed Grid Layout ── */}
      <div className="responsive-grid-3-col" style={{ display: 'grid', gap: '20px', alignItems: 'start' }}>

        {/* ── COLUMN 1: LEFT TAB NAVIGATION (Interactive Filter) ── */}
        <div className="glass-panel profile-tabs-sidebar" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px', marginBottom: '2px' }}>
            Navigation Categories
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'Change Password') setShowPwSection(true);
                  if (tab.id === 'Two Factor Auth' && !twoFA) setShow2FASetup(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: active ? '1px solid rgba(99, 95, 236, 0.4)' : '1px solid transparent',
                  background: active ? 'linear-gradient(135deg, #635fec, #4f46e5)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: active ? '800' : '600',
                  fontSize: '0.86rem',
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  textAlign: 'start',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  boxShadow: active ? '0 4px 14px rgba(99, 95, 236, 0.35)' : 'none'
                }}
              >
                <Icon size={16} color={active ? '#ffffff' : 'var(--text-muted)'} />
                <span>{tab.label}</span>
                {tab.id === 'Two Factor Auth' && twoFA && (
                  <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── COLUMN 2: MAIN SETTINGS & SECURITY CARDS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Section 1: Profile Information */}
          {(activeTab === 'All' || activeTab === 'Profile') && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{t.personalInfo || 'Profile Information'}</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  <Edit2 size={13} /> {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #635fec, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.7rem',
                  fontWeight: '900',
                  boxShadow: '0 4px 16px rgba(99, 95, 236, 0.4)',
                  flexShrink: 0
                }}>
                  {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
                </div>

                <div style={{ flex: 1, minWidth: '180px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)' }}>Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="Full Name"
                          style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)' }}>Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Email Address"
                          style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)' }}>Department</label>
                        <input
                          type="text"
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                          placeholder="Department"
                          style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px' }}
                        />
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.84rem', marginTop: '6px', alignSelf: 'flex-start' }}
                      >
                        Save Profile Changes
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{fullName}</div>
                      <div style={{ fontSize: '0.84rem', color: '#635fec', fontWeight: '700', marginTop: '2px' }}>
                        {role === 'Admin' || role?.toLowerCase()?.includes('admin') ? '🛡️ System Administrator' : '👤 Verified Research Analyst'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{email}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>{department} • {university}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Security & Authentication Controls */}
          {(activeTab === 'All' || activeTab === 'Change Password' || activeTab === 'Two Factor Auth') && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{t.securityControls || 'Security & Authentication'}</h3>

              {/* Item 1: Change Password Interactive Card */}
              <div
                onClick={() => setShowPwSection(!showPwSection)}
                style={{
                  padding: '14px 16px',
                  background: 'var(--bg-input)',
                  borderRadius: '12px',
                  border: showPwSection ? '1px solid #635fec' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={18} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.changePassword || 'Change Password'}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.changePasswordDesc || 'Update and encrypt account credentials'}</div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" style={{ transform: showPwSection ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>

              {/* Expandable Password Change Form */}
              {showPwSection && (
                <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)' }}>Current Password</label>
                    <div style={{ position: 'relative', marginTop: '4px' }}>
                      <input
                        type={showPwText ? 'text' : 'password'}
                        placeholder="Enter current password"
                        value={currentPw}
                        onChange={e => setCurrentPw(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwText(!showPwText)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {showPwText ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)' }}>New Password (min 6 characters)</label>
                    <input
                      type={showPwText ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '10px 14px', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)' }}>Confirm New Password</label>
                    <input
                      type={showPwText ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '10px 14px', borderRadius: '8px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button onClick={handleChangePassword} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.84rem' }}>
                      Update Password
                    </button>
                    <button onClick={() => setShowPwSection(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.84rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Item 2: Two Factor Authentication (2FA) */}
              <div style={{
                padding: '14px 16px',
                background: 'var(--bg-input)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 95, 236, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={18} color="#635fec" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.twoFactor || 'Two-Factor Authentication (2FA)'}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {twoFA ? '● Active — Authenticator App & OTP Protected' : '○ Inactive — Enable for higher protection'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShow2FASetup(!show2FASetup)}
                    style={{
                      padding: '5px 10px',
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      color: '#635fec',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {show2FASetup ? 'Hide Setup' : 'Configure'}
                  </button>
                  <Toggle
                    checked={twoFA}
                    onChange={() => {
                      const next = !twoFA;
                      setTwoFA(next);
                      if (next) {
                        setShow2FASetup(true);
                        showToast('2FA Enabled! Complete authenticator app pairing below.');
                      } else {
                        setShow2FASetup(false);
                        showToast('Two-Factor Authentication disabled.', 'error');
                      }
                    }}
                  />
                </div>
              </div>

              {/* 2FA Setup Panel */}
              {show2FASetup && (
                <div style={{
                  padding: '18px',
                  background: 'rgba(99, 95, 236, 0.08)',
                  border: '1.5px solid rgba(99, 95, 236, 0.35)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <QrCode size={20} color="#635fec" />
                    <span style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      Authenticator App Setup (Google Authenticator / Authy)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      background: '#ffffff',
                      borderRadius: '10px',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ textAlign: 'center', color: '#1e293b' }}>
                        <QrCode size={80} color="#4338ca" />
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Scan QR code with your authenticator app, or manually enter the 16-digit secret key:
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        color: '#635fec',
                        display: 'inline-block'
                      }}>
                        JBSW-Y3DP-EHPK-3PXP
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      Enter 6-Digit Code from Authenticator App:
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <input
                        type="text"
                        maxLength={6}
                        value={authCode}
                        onChange={e => setAuthCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123456"
                        style={{
                          width: '160px',
                          padding: '8px 14px',
                          letterSpacing: '0.25em',
                          fontSize: '1rem',
                          fontWeight: '800',
                          textAlign: 'center',
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleVerify2FACode}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                      >
                        Verify &amp; Activate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Item 3: Suspicious Login Alerts */}
              <div style={{
                padding: '14px 16px',
                background: 'var(--bg-input)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={18} color="#f59e0b" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.loginAlerts || 'Suspicious Login Alerts'}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.loginAlertsDesc || 'Instant push alerts for unrecognized IP sign-ins'}</div>
                  </div>
                </div>
                <Toggle checked={loginAlerts} onChange={() => {
                  setLoginAlerts(!loginAlerts);
                  showToast(!loginAlerts ? 'Login Alerts enabled.' : 'Login Alerts disabled.');
                }} />
              </div>
            </div>
          )}

          {/* Section 3: Notification Channels */}
          {(activeTab === 'All' || activeTab === 'Notifications') && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Notification Channels &amp; Alerts</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700' }}>Critical Threat Email Dispatch</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Immediate dispatch when 80%+ phishing severity is intercepted</div>
                </div>
                <Toggle checked={notifThreats} onChange={() => { setNotifThreats(!notifThreats); showToast('Threat alert preference saved.'); }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700' }}>Weekly Security Digest (.pdf)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Automated Monday summary of scanned links &amp; intercepted emails</div>
                </div>
                <Toggle checked={notifWeekly} onChange={() => { setNotifWeekly(!notifWeekly); showToast('Weekly digest preference updated.'); }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700' }}>In-App Push Sound &amp; Banners</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tactile vibration &amp; top banner notification alerts</div>
                </div>
                <Toggle checked={notifPush} onChange={() => { setNotifPush(!notifPush); showToast('Push notifications updated.'); }} />
              </div>
            </div>
          )}

          {/* Section 4: Privacy Settings & Data Sovereignty */}
          {(activeTab === 'All' || activeTab === 'Privacy Settings') && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Privacy &amp; Data Sovereignty</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700' }}>Share Anonymized Threat Heuristics</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contribute malicious domain patterns to university research database</div>
                </div>
                <Toggle checked={shareAnonymous} onChange={() => { setShareAnonymous(!shareAnonymous); showToast('Research telemetry preference saved.'); }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={15} /> Export Account Data (.json)
                </button>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}
                >
                  <Trash2 size={15} /> Clear Local Cache
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── COLUMN 3: RIGHT PREFERENCES & ACCOUNT HEALTH ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Card 1: Theme & Interface Settings */}
          {(activeTab === 'All' || activeTab === 'Theme Settings') && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{t.systemPrefs || 'Theme & Language'}</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: '700' }}>{t.darkTheme || 'Dark Theme'}</span>
                <Toggle checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', letterSpacing: '0.06em' }}>
                  THEME COLOR PALETTE
                </label>
                <div className="theme-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'light', label: t.lightTheme || 'Light', color: '#f8fafc', dot: '#3b82f6' },
                    { id: 'dark', label: t.darkThemeLabel || 'Dark', color: '#0f172a', dot: '#f8fafc' },
                    { id: 'ocean', label: t.oceanTheme || 'Ocean', color: '#0f2140', dot: '#38bdf8' },
                    { id: 'purple', label: t.purpleTheme || 'Indigo', color: '#1a102d', dot: '#635fec' },
                    { id: 'emerald', label: t.emeraldTheme || 'Emerald', color: '#0a1f12', dot: '#34d399' },
                    { id: 'royal', label: t.royalTheme || 'Royal', color: '#0f1530', dot: '#818cf8' },
                  ].map(opt => {
                    const active = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setTheme(opt.id);
                          showToast(`Theme switched to ${opt.label}!`);
                        }}
                        style={{
                          padding: '10px 6px',
                          borderRadius: '10px',
                          border: active ? '2px solid #635fec' : '1px solid var(--border-color)',
                          background: opt.color,
                          color: opt.dot,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                          boxShadow: active ? '0 0 10px rgba(99, 95, 236, 0.4)' : 'none'
                        }}
                      >
                        <span style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: opt.dot,
                          boxShadow: `0 0 6px ${opt.dot}55`
                        }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', letterSpacing: '0.06em' }}>
                  {t.languageLabel || 'SYSTEM LANGUAGE'}
                </label>
                <select
                  value={language || 'English'}
                  onChange={e => {
                    onLanguageChange?.(e.target.value);
                    showToast(`Language switched to ${e.target.value}.`);
                  }}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                >
                  <option value="English">English (Default)</option>
                  <option value="Urdu">Urdu (اردو - Academic Mode)</option>
                </select>
              </div>
            </div>
          )}

          {/* Card 2: Account Security Health Status */}
          <div className="glass-panel" style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.06em' }}>
              {t.accountStatus || 'Security Health Audit'}
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 12px auto',
              background: twoFA ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `2px solid ${twoFA ? '#10b981' : '#f59e0b'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: twoFA ? '#10b981' : '#f59e0b',
              boxShadow: twoFA ? '0 0 16px rgba(16, 185, 129, 0.3)' : '0 0 16px rgba(245, 158, 11, 0.3)'
            }}>
              {twoFA ? <Check size={32} /> : <AlertCircle size={32} />}
            </div>

            <div style={{ fontSize: '1rem', fontWeight: '800', color: twoFA ? '#10b981' : '#f59e0b' }}>
              {twoFA ? (t.accountSecure || 'Account Fully Protected') : 'Two-Factor Auth Recommended'}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {twoFA ? '256-bit Token Encryption & 2FA Active' : 'Enable 2FA to achieve 100% security score'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
