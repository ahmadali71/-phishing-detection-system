import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  ChevronRight,
  Smartphone,
  Check,
  Shield,
  Palette,
  Edit2
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
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12px',
          background: checked ? '#10b981' : '#334155',
          transition: 'background 0.25s'
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
          transition: 'insetInlineStart 0.25s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
        }}
      />
    </label>
  );
}

export default function ProfileSettings({ currentUser, onUpdateProfile, theme, setTheme, language, onLanguageChange, t }) {
  const [activeTab, setActiveTab] = useState('Profile');
  const [fullName, setFullName] = useState(currentUser?.name ?? 'Amna Najam');
  const [email, setEmail] = useState(currentUser?.email ?? 'amnanajam2003@gmail.com');
  const [role, setRole] = useState(currentUser?.role ?? 'Premium User');
  const [twoFA, setTwoFA] = useState(currentUser?.twoFactorAuth !== false);
  const [loginAlerts, setLoginAlerts] = useState(currentUser?.loginAlerts !== false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [showPwChange, setShowPwChange] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (onUpdateProfile) onUpdateProfile({ name: fullName, email, role, twoFactorAuth: twoFA, loginAlerts });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'Profile', label: t.profileTab || 'Profile', icon: User },
    { id: 'Change Password', label: t.changePasswordTab || 'Change Password', icon: Lock },
    { id: 'Two Factor Auth', label: t.twoFactorTab || 'Two Factor Auth', icon: Smartphone },
    { id: 'Notifications', label: t.notificationsTab || 'Notifications', icon: Bell },
    { id: 'Privacy Settings', label: t.privacyTab || 'Privacy Settings', icon: Shield },
    { id: 'Theme Settings', label: t.themeTab || 'Theme Settings', icon: Palette },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* ── Top Badge (Exact Match to PDF Page 64 Screen 9) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          color: 'var(--accent-blue)'
        }}>
          {t.profileSettings || 'PROFILE & SETTINGS'}
        </span>
      </div>

      {saved && (
        <div style={{ padding: '10px 18px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '12px', color: '#10b981', fontSize: '0.88rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {t.savedMessage || 'Profile settings updated successfully!'}
        </div>
      )}

      {/* ── 3-Column Layout (Exact Match to PDF Page 64 Screen 9) ── */}
      <div style={{
        display: 'grid',
        gap: '20px',
        alignItems: 'start'
      }} className="responsive-grid-3-col">

        {/* ── COLUMN 1: LEFT TAB NAVIGATION (Page 64) ── */}
        <div className="glass-panel profile-tabs-sidebar" style={{ padding: '14px', display: 'flex' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: active ? '#2563eb' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: active ? '800' : '600',
                    fontSize: '0.86rem',
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    textAlign: 'start',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                <Icon size={16} color={active ? '#ffffff' : 'var(--text-muted)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── COLUMN 2: CENTER PROFILE & SECURITY SETTINGS (Page 64) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Profile Information */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '18px' }}>{t.personalInfo || 'Profile Information'}</h3>

            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.7rem',
                fontWeight: '900',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                flexShrink: 0
              }}>
                {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
              </div>

              <div style={{ flex: 1, minWidth: '160px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t.fullName || 'Full Name'} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailAddr || 'Email Address'} />
                    <button onClick={save} className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.82rem', width: 'fit-content' }}>{t.saveChanges || 'Save'}</button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>{fullName}</div>
                    <div style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: '700', marginTop: '2px' }}>{role}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{email}</div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                      style={{ marginTop: '12px', padding: '7px 18px', fontSize: '0.82rem', borderRadius: '10px' }}
                    >
                      <Edit2 size={13} /> {t.editProfile || 'Edit Profile'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Security Settings */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{t.securityControls || 'Security Settings'}</h3>

            {/* Item 1: Change Password */}
            <div
              onClick={() => setShowPwChange(!showPwChange)}
              style={{
                padding: '14px 16px',
                background: 'var(--bg-input)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Lock size={18} color="#3b82f6" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.changePassword || 'Change Password'}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.changePasswordDesc || 'Update your account password'}</div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ transform: showPwChange ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {showPwChange && (
              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="password" placeholder={t.currentPassword || 'Current Password'} value={oldPw} onChange={e => setOldPw(e.target.value)} />
                <input type="password" placeholder={t.newPassword || 'New Password'} value={newPw} onChange={e => setNewPw(e.target.value)} />
                <button onClick={save} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem', width: 'fit-content' }}>{t.updatePassword || 'Update Password'}</button>
              </div>
            )}

            {/* Item 2: Two Factor Authentication */}
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
                <Smartphone size={18} color="#a855f7" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.twoFactor || 'Two Factor Authentication'}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.twoFactorDesc || 'Add an extra layer of security'}</div>
                </div>
              </div>
              <Toggle checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
            </div>

            {/* Item 3: Login Alerts */}
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
                <Bell size={18} color="#f59e0b" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{t.loginAlerts || 'Login Alerts'}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{t.loginAlertsDesc || 'Get notified about new sign-ins'}</div>
                </div>
              </div>
              <Toggle checked={loginAlerts} onChange={() => setLoginAlerts(!loginAlerts)} />
            </div>
          </div>
        </div>

        {/* ── COLUMN 3: RIGHT PREFERENCES & ACCOUNT STATUS (Page 64) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Preferences */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>{t.systemPrefs || 'Preferences'}</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700' }}>{t.emailNotifications || 'Email Notifications'}</span>
              <Toggle checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700' }}>{t.darkTheme || 'Dark Mode'}</span>
              <Toggle checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', letterSpacing: '0.06em' }}>
                {t.languageLabel ? t.languageLabel.replace('LANGUAGE', 'THEME') : 'THEME'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'light', label: t.lightTheme || 'Light', color: '#f8fafc', border: '#e2e8f0', dot: '#3b82f6' },
                  { id: 'dark', label: t.darkThemeLabel || 'Dark', color: '#0f172a', border: '#334155', dot: '#f8fafc' },
                  { id: 'ocean', label: t.oceanTheme || 'Ocean', color: '#0f2140', border: '#38bdf8', dot: '#38bdf8' },
                  { id: 'purple', label: t.purpleTheme || 'Purple', color: '#1a102d', border: '#a78bfa', dot: '#c084fc' },
                  { id: 'emerald', label: t.emeraldTheme || 'Emerald', color: '#0a1f12', border: '#34d399', dot: '#6ee7b7' },
                  { id: 'royal', label: t.royalTheme || 'Royal Blue', color: '#0f1530', border: '#6366f1', dot: '#818cf8' },
                ].map(opt => {
                  const active = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '12px',
                        border: active ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                        background: opt.color,
                        color: opt.dot,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                        boxShadow: active ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none'
                      }}
                    >
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: opt.dot,
                        boxShadow: `0 0 8px ${opt.dot}44`
                      }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', letterSpacing: '0.06em' }}>
                {t.languageLabel || 'LANGUAGE'}
              </label>
              <select value={language || 'English'} onChange={e => onLanguageChange?.(e.target.value)}>
                <option value="English">English</option>
                <option value="Urdu">Urdu (اردو)</option>
              </select>
            </div>
          </div>

          {/* Card 2: Account Status (Green Shield Checkmark) */}
          <div className="glass-panel" style={{ padding: '28px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.06em' }}>
              {t.accountStatus || 'Account Status'}
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 12px auto',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Check size={32} />
            </div>

            <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#10b981' }}>
              {t.accountSecure || 'Your account is secure'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
