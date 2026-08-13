import React, { useState } from 'react';
import { Shield, Bell, Moon, Sun, Search, GraduationCap, X, Trash2, Menu } from 'lucide-react';

export default function Header({
  theme, setTheme, currentUser, onOpenAuth, onLogout,
  notifications, onMarkNotificationRead, onClearNotifications,
  searchQuery, setSearchQuery, onSelectSearchResult,
  onMenuToggle, t
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="app-header">
      {/* Left: Hamburger + Brand */}
      <div className="header-brand">
        {/* Mobile hamburger */}
        <button onClick={onMenuToggle} className="hamburger-btn" title="Menu" aria-label="Toggle menu">
          <Menu size={22} />
        </button>

        <div className="header-brand-logo">
          <Shield size={20} />
        </div>

        <div className="header-brand-text">
          <h1>
            APDS
            <span className="header-brand-tag"> | {t.projectTitle}</span>
          </h1>
          <div className="header-brand-subtitle">
            <GraduationCap size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            {t.deptTitle}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-controls">
        {/* Mobile search toggle — hidden on desktop via CSS */}
        <button
          onClick={() => setShowSearch(v => !v)}
          className="btn-icon header-search-toggle"
          title="Search"
          aria-label="Toggle search"
        >
          <Search size={17} />
        </button>

        {/* Search — desktop inline, mobile toggled */}
        <div className={`header-search-bar${showSearch ? ' mobile-visible' : ''}`} style={{ position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-input)', padding: '7px 13px',
            borderRadius: 20, border: '1px solid var(--border-color)', width: 210
          }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(e.target.value.trim().length > 0); }}
              placeholder="Search scans..."
              style={{
                background: 'transparent !important', border: 'none !important',
                outline: 'none', color: 'var(--text-primary)', fontSize: '0.83rem', width: '100%', padding: '0 !important'
              }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearch(false); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <X size={13} />
              </button>
            )}
          </div>
          {showSearch && (
            <div className="glass-panel" style={{
              position: 'absolute', top: 42, left: 0, width: 280,
              background: 'var(--bg-secondary)', borderRadius: 12, padding: 12, zIndex: 200
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: 8 }}>
                SEARCH: "{searchQuery}"
              </div>
              <button onClick={() => { onSelectSearchResult(searchQuery); setShowSearch(false); }}
                className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem' }}>
                Filter Scan History for "{searchQuery}"
              </button>
            </div>
          )}
        </div>

        {/* Theme */}
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-icon" title="Toggle Theme" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#3b82f6" />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifications(v => !v)} className="btn-icon" title="Notifications" aria-label="Notifications" style={{ position: 'relative' }}>
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 1, right: 1,
                width: 8, height: 8, borderRadius: '50%',
                background: '#ef4444', boxShadow: '0 0 5px #ef4444'
              }} />
            )}
          </button>
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute', top: 46, right: 0, width: 320,
              background: 'var(--bg-secondary)', borderRadius: 14,
              padding: 14, zIndex: 200, border: '1px solid var(--border-color)',
              maxHeight: '80vh', overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                  Notifications
                  {unreadCount > 0 && <span className="badge badge-danger" style={{ fontSize: '0.62rem' }}>{unreadCount} New</span>}
                </div>
                <button onClick={onClearNotifications}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Trash2 size={11} /> Clear
                </button>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.83rem' }}>No notifications.</div>
              ) : notifications.map(n => (
                <div key={n.id} onClick={() => onMarkNotificationRead(n.id)}
                  style={{
                    padding: '9px 11px', borderRadius: 9, cursor: 'pointer', marginBottom: 6,
                    background: n.read ? 'var(--bg-input)' : 'rgba(59,130,246,0.1)',
                    borderLeft: `3px solid ${n.type === 'THREAT' ? '#ef4444' : '#3b82f6'}`
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700 }}>
                    <span style={{ color: n.type === 'THREAT' ? '#ef4444' : 'var(--text-primary)' }}>{n.title}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: 6 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        {currentUser ? (
          <div className="header-user-info">
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div className="header-user-name">{currentUser.name}</div>
              <div className="header-user-role">{currentUser.role}</div>
            </div>
            <button onClick={onLogout} className="btn-secondary" style={{ fontSize: '0.72rem', padding: '5px 9px' }}>
              {t.logout}
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn-primary" style={{ fontSize: '0.83rem' }}>
            {t.loginRegister}
          </button>
        )}
      </div>
    </header>
  );
}
