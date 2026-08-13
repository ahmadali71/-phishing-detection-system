import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Bell,
  ChevronRight,
  Smartphone,
  Save,
  Check,
  Eye,
  EyeOff,
  Key,
  Shield,
  Palette,
  Edit2
} from 'lucide-react';

export default function ProfileSettings({ currentUser, onUpdateProfile, theme, setTheme, language, onLanguageChange, t }) {
  const [activeProfileTab, setActiveProfileTab] = useState('Profile');
  const [fullName, setFullName] = useState(currentUser ? currentUser.name : 'Amna');
  const [email, setEmail] = useState(currentUser ? currentUser.email : 'amna.najam@email.com');
  const [role, setRole] = useState(currentUser ? currentUser.role : 'Premium User');
  const [username, setUsername] = useState(currentUser ? currentUser.username : 'amna_najam');

  const [twoFactorAuth, setTwoFactorAuth] = useState(currentUser ? currentUser.twoFactorAuth !== false : true);
  const [loginAlerts, setLoginAlerts] = useState(currentUser ? currentUser.loginAlerts !== false : true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const selectedLanguage = language || 'English';

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ name: fullName, email, role, username, twoFactorAuth, loginAlerts });
    }
    setIsEditing(false);
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const navTabs = [
    { id: 'Profile', label: 'Profile', icon: User },
    { id: 'Change Password', label: 'Change Password', icon: Lock },
    { id: 'Two Factor Auth', label: 'Two Factor Auth', icon: Smartphone },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Privacy Settings', label: 'Privacy Settings', icon: Shield },
    { id: 'Theme Settings', label: 'Theme Settings', icon: Palette }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>PROFILE & SETTINGS</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage and update your account details, security controls, and system preferences.
          </p>
        </div>
        {saveMsg && (
          <div style={{
            padding: '8px 16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: '10px',
            color: '#10b981',
            fontSize: '0.85rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Check size={16} /> Settings saved successfully!
          </div>
        )}
      </div>

      {/* Main 3-Column Layout (Exact Match to PDF Page 64 Screen 9) */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '20px' }}>
        {/* Column 1: Left Tab Navigation (Exact Match to PDF Page 64) */}
        <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', height: 'fit-content' }}>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeProfileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#3b82f6' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Column 2: Center Profile Information & Security Settings (Exact Match to PDF Page 64) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile Information Card */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px' }}>Profile Information</h3>

            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.6rem',
                fontWeight: '800',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.35)',
                flexShrink: 0
              }}>
                {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
              </div>

              <div style={{ flex: 1, lineHeight: '1.4' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" style={{ padding: '6px 10px', fontSize: '0.85rem' }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: '6px 10px', fontSize: '0.85rem' }} />
                    <button onClick={handleSaveProfile} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem', width: 'fit-content' }}>
                      Save Profile
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>{fullName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '700' }}>{role}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{email}</div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                      style={{ marginTop: '10px', padding: '6px 14px', fontSize: '0.78rem' }}
                    >
                      <Edit2 size={12} /> Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Security Settings</h3>

            {/* Change Password Item */}
            <div
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              style={{
                padding: '14px',
                background: 'var(--bg-input)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Lock size={18} color="#3b82f6" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>Change Password</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Update your account password</div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ transform: showPasswordChange ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {showPasswordChange && (
              <div style={{ padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="password" placeholder="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }} />
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }} />
                <button onClick={handleSaveProfile} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem', width: 'fit-content' }}>
                  Update Password
                </button>
              </div>
            )}

            {/* Two Factor Authentication Toggle */}
            <div style={{
              padding: '14px',
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
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>Two Factor Authentication</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add an extra layer of security</div>
                </div>
              </div>
              <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, background: twoFactorAuth ? '#10b981' : '#334155', borderRadius: '12px', transition: 'background 0.2s' }} />
                <span style={{ position: 'absolute', top: '2px', left: twoFactorAuth ? '22px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
              </label>
            </div>

            {/* Login Alerts Toggle */}
            <div style={{
              padding: '14px',
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
                  <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>Login Alerts</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Get notified about new sign-ins</div>
                </div>
              </div>
              <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input type="checkbox" checked={loginAlerts} onChange={() => setLoginAlerts(!loginAlerts)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, background: loginAlerts ? '#10b981' : '#334155', borderRadius: '12px', transition: 'background 0.2s' }} />
                <span style={{ position: 'absolute', top: '2px', left: loginAlerts ? '22px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
              </label>
            </div>
          </div>
        </div>

        {/* Column 3: Right Preferences & Account Status (Exact Match to PDF Page 64) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Preferences Card */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Preferences</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Email Notifications</div>
              <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(v => !v)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, background: emailNotifications ? '#10b981' : '#334155', borderRadius: '12px', transition: 'background 0.2s' }} />
                <span style={{ position: 'absolute', top: '2px', left: emailNotifications ? '22px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Dark Mode</div>
              <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                <input type="checkbox" checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, background: theme === 'dark' ? '#10b981' : '#334155', borderRadius: '12px', transition: 'background 0.2s' }} />
                <span style={{ position: 'absolute', top: '2px', left: theme === 'dark' ? '22px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
              </label>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>LANGUAGE</label>
              <select value={selectedLanguage} onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)} style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}>
                <option value="English">English</option>
                <option value="Urdu">Urdu (اردو)</option>
              </select>
            </div>
          </div>

          {/* Account Status Card (Exact Match to PDF Page 64) */}
          <div className="glass-panel" style={{
            padding: '24px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Account Status
            </div>

            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              margin: '0 auto 10px auto'
            }}>
              <Check size={32} />
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981' }}>
              Your account is secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
