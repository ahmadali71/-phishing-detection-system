import React from 'react';
import { Shield, Bell, Moon, Sun, Search, GraduationCap, X, Trash2, Menu } from 'lucide-react';

export default function Header({
  activeTab,
  theme, setTheme, currentUser, onOpenAuth, onLogout,
  notifications, onMarkNotificationRead, onClearNotifications,
  searchQuery, setSearchQuery, onSelectSearchResult,
  onMenuToggle, showSearch, setShowSearch, showNotifications, setShowNotifications,
  t
}) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getScreenBadge = () => {
    switch (activeTab) {
      case 'dashboard':
        return { num: '4', text: 'DASHBOARD', color: '#2563eb' };
      case 'url-detection':
        return { num: '5', text: 'URL DETECTION SCREEN', color: '#2563eb' };
      case 'email-detection':
        return { num: '6', text: 'EMAIL DETECTION SCREEN', color: '#6366f1' };
      case 'scan-history':
        return { num: '8', text: 'SCAN HISTORY & REPORTS', color: '#2563eb' };
      case 'profile-settings':
        return { num: '9', text: 'PROFILE & SETTINGS', color: '#7c3aed' };
      case 'ai-assistant':
        return { num: 'AI', text: 'AI DEFENSE ASSISTANT', color: '#06b6d4' };
      default:
        return { num: '4', text: 'DASHBOARD', color: '#2563eb' };
    }
  };

  const badge = getScreenBadge();

  return (
    <header className="app-header">
      {/* Left: Hamburger + Screen Badge matching PDF */}
      <div className="header-brand">
        {/* Mobile hamburger */}
        <button onClick={onMenuToggle} className="hamburger-btn" title="Menu" aria-label="Toggle menu">
          <Menu size={22} />
        </button>

        {/* Screen Badge matching PDF Chapter 6 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            background: `linear-gradient(135deg, ${badge.color}, #1d4ed8)`,
            color: '#ffffff',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '0.88rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
          }}>
            {badge.num}
          </div>
          <span style={{
            fontWeight: '900',
            fontSize: '0.88rem',
            letterSpacing: '0.08em',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase'
          }}>
            {badge.text}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-controls">
        {/* Search */}
        <div className={`header-search-bar${showSearch ? ' mobile-visible' : ''}`} style={{ position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-input)', padding: '7px 14px',
            borderRadius: 20, border: '1px solid var(--border-color)', width: 220
          }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(e.target.value.trim().length > 0); }}
              placeholder="Search scans..."
              style={{
                background: 'transparent !important', border: 'none !important',
                outline: 'none', color: 'var(--text-primary)', fontSize: '0.84rem', width: '100%', padding: '0 !important'
              }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-icon" title="Toggle Theme" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#3b82f6" />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifications(v => !v)} className="btn-icon" title="Notifications" aria-label="Notifications" style={{ position: 'relative' }}>
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                width: 8, height: 8, borderRadius: '50%',
                background: '#ef4444', boxShadow: '0 0 6px #ef4444'
              }} />
            )}
          </button>
        </div>

        {/* User Card matching PDF Page 61 Screen 4 (Ayesha Khan / Amna Najam + Premium User) */}
        {currentUser ? (
          <div className="header-user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontSize: '0.92rem', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
            }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div className="header-user-name" style={{ fontWeight: '800', fontSize: '0.88rem' }}>{currentUser.name}</div>
              <div className="header-user-role" style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '700' }}>{currentUser.role || 'Premium User'}</div>
            </div>
            <button onClick={onLogout} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '5px 10px' }}>
              {t.logout || 'Logout'}
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn-primary" style={{ fontSize: '0.86rem', padding: '8px 18px' }}>
            {t.loginRegister || 'Login / Register'}
          </button>
        )}
      </div>
    </header>
  );
}
