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
    <div className="profile-layout">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>PROFILE & SETTINGS</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Manage and update your account details, security controls, and system preferences.
          </p>
        </div>
        {saveMsg && (
          <div className="profile-save-msg">
            <Check size={16} /> Settings saved successfully!
          </div>
        )}
      </div>

      {/* Column 1: Left Tab Navigation */}
      <div className="glass-panel profile-tabs-sidebar" style={{ padding: '14px', height: 'fit-content' }}>
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeProfileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id)}
              className={`profile-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Column 2: Center Profile Information & Security Settings */}
      <div className="profile-content-area">
        {/* Profile Information Card */}
        <div className="glass-panel profile-card">
          <h3 className="profile-card-title">Profile Information</h3>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="profile-avatar">
              {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
            </div>

            <div style={{ flex: 1, minWidth: 0, lineHeight: '1.4' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="profile-password-input" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="profile-password-input" />
                  <button onClick={handleSaveProfile} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', width: 'fit-content' }}>
                    Save Profile
                  </button>
                </div>
              ) : (
                <>
                  <div className="profile-info-name">{fullName}</div>
                  <div className="profile-info-role">{role}</div>
                  <div className="profile-info-email">{email}</div>
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
        <div className="glass-panel profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 className="profile-card-title" style={{ marginBottom: 0 }}>Security Settings</h3>

          {/* Change Password Item */}
          <div
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="profile-security-item"
          >
            <div className="profile-security-item-left">
              <Lock size={18} color="#3b82f6" />
              <div>
                <div className="profile-security-item-title">Change Password</div>
                <div className="profile-security-item-desc">Update your account password</div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" style={{ transform: showPasswordChange ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
          </div>

          {showPasswordChange && (
            <div className="profile-password-fields">
              <input type="password" placeholder="Current Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="profile-password-input" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="profile-password-input" />
              <button onClick={handleSaveProfile} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem', width: 'fit-content' }}>
                Update Password
              </button>
            </div>
          )}

          {/* Two Factor Authentication Toggle */}
          <div className="profile-security-item">
            <div className="profile-security-item-left">
              <Smartphone size={18} color="#a855f7" />
              <div>
                <div className="profile-security-item-title">Two Factor Authentication</div>
                <div className="profile-security-item-desc">Add an extra layer of security</div>
              </div>
            </div>
            <label className="profile-toggle">
              <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
              <span className="profile-toggle-track" style={{ background: twoFactorAuth ? '#10b981' : '#334155' }} />
              <span className="profile-toggle-thumb" style={{ left: twoFactorAuth ? '22px' : '2px' }} />
            </label>
          </div>

          {/* Login Alerts Toggle */}
          <div className="profile-security-item">
            <div className="profile-security-item-left">
              <Bell size={18} color="#f59e0b" />
              <div>
                <div className="profile-security-item-title">Login Alerts</div>
                <div className="profile-security-item-desc">Get notified about new sign-ins</div>
              </div>
            </div>
            <label className="profile-toggle">
              <input type="checkbox" checked={loginAlerts} onChange={() => setLoginAlerts(!loginAlerts)} />
              <span className="profile-toggle-track" style={{ background: loginAlerts ? '#10b981' : '#334155' }} />
              <span className="profile-toggle-thumb" style={{ left: loginAlerts ? '22px' : '2px' }} />
            </label>
          </div>
        </div>
      </div>

      {/* Column 3: Right Preferences & Account Status */}
      <div className="profile-sidebar-area">
        {/* Preferences Card */}
        <div className="glass-panel profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 className="profile-card-title" style={{ marginBottom: 0 }}>Preferences</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Email Notifications</div>
            <label className="profile-toggle">
              <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(v => !v)} />
              <span className="profile-toggle-track" style={{ background: emailNotifications ? '#10b981' : '#334155' }} />
              <span className="profile-toggle-thumb" style={{ left: emailNotifications ? '22px' : '2px' }} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Dark Mode</div>
            <label className="profile-toggle">
              <input type="checkbox" checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
              <span className="profile-toggle-track" style={{ background: theme === 'dark' ? '#10b981' : '#334155' }} />
              <span className="profile-toggle-thumb" style={{ left: theme === 'dark' ? '22px' : '2px' }} />
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

        {/* Account Status Card */}
        <div className="profile-account-status">
          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Account Status
          </div>

          <div className="profile-account-status-icon">
            <Check size={28} />
          </div>

          <div className="profile-account-status-text">
            Your account is secure
          </div>
        </div>
      </div>
    </div>
  );
}
