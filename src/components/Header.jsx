import React, { useState, useEffect, useRef } from 'react';
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
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSearch, setShowNotifications]);

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
          <div style={{ fontWeight: '900', fontSize: '0.88rem', letterSpacing: '0.08em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {badge.text}
          </div>
        </div>
      </div>

      {/* Search & Notifications — kept outside .header-controls so panels stay visible on mobile */}
      <div className="header-actions">
        {/* Search */}
        <div ref={searchRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowSearch(v => !v)}
            className="btn-icon"
            title="Search"
            aria-label="Search"
            style={{ position: 'relative' }}
          >
            <Search size={17} />
          </button>
          {showSearch && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 280,
              background: 'var(--bg-secondary)',
              borderRadius: 14,
              padding: 12,
              zIndex: 200,
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                <Search size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); }}
                  placeholder={t.searchPlaceholder || 'Search scans...'}
                  autoFocus
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: 'var(--text-primary)', fontSize: '0.84rem', width: '100%', padding: 0
                  }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                    <X size={13} />
                  </button>
                )}
              </div>
              {searchQuery && (
                <button
                  onClick={() => { onSelectSearchResult(searchQuery); setShowSearch(false); }}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem', marginTop: 8 }}
                >
                  Filter Scan History for &quot;{searchQuery}&quot;
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
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
          {showNotifications && (
            <div className="glass-panel" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 320,
              background: 'var(--bg-secondary)',
              borderRadius: 14,
              padding: 14,
              zIndex: 200,
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                  Notifications
                  {unreadCount > 0 && <span className="badge badge-danger" style={{ fontSize: '0.62rem' }}>{unreadCount} New</span>}
                </div>
                <button onClick={onClearNotifications} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Trash2 size={11} /> Clear
                </button>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.83rem' }}>No notifications.</div>
              ) : notifications.map(n => (
                <div key={n.id} onClick={() => onMarkNotificationRead(n.id)} style={{
                  padding: '10px 12px', borderRadius: 9, cursor: 'pointer', marginBottom: 6,
                  background: n.read ? 'var(--bg-input)' : 'rgba(59,130,246,0.1)',
                  borderInlineStart: `3px solid ${n.type === 'THREAT' ? '#ef4444' : '#3b82f6'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700 }}>
                    <span style={{ color: n.type === 'THREAT' ? '#ef4444' : 'var(--text-primary)' }}>{n.title}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0, marginInlineStart: 6 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-controls">
        {/* Theme Toggle */}
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-icon" title="Toggle Theme" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#3b82f6" />}
        </button>

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
