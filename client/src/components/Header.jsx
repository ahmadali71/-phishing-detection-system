import React, { useState, useRef, useEffect } from 'react';
import { Shield, Bell, Moon, Sun, Search, X, Trash2, Menu } from 'lucide-react';

export default function Header({
  activeTab,
  theme, setTheme,
  currentUser, onOpenAuth, onLogout,
  notifications, onMarkNotificationRead, onClearNotifications,
  searchQuery, setSearchQuery, onSelectSearchResult,
  onMenuToggle,
  showSearch, setShowSearch,
  showNotifications, setShowNotifications,
  t
}) {
  const unreadCount = (notifications || []).filter(n => !n.read).length;
  const notifRef = useRef(null);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':      return 'Dashboard';
      case 'url-detection':  return 'URL Detection';
      case 'email-detection':return 'Email Detection';
      case 'scan-history':   return 'Scan History';
      case 'profile-settings':return 'Settings';
      case 'ai-assistant':   return 'AI Assistant';
      case 'admin-panel':    return 'Reports';
      default:               return 'APDS';
    }
  };

  const getPageNum = () => {
    const map = { 'dashboard':'4','url-detection':'5','email-detection':'6','scan-history':'8','profile-settings':'9','ai-assistant':'AI','admin-panel':'R' };
    return map[activeTab] || '4';
  };

  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [setShowNotifications]);

  return (
    <header className="app-header">
      {/* ── LEFT: Hamburger + Brand ── */}
      <div className="header-left">
        <button
          onClick={onMenuToggle}
          className="hamburger-btn"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-brand-wrap">
          <div className="header-brand-icon">
            <Shield size={16} color="#fff" />
          </div>
          <div className="header-brand-info">
            <span className="header-brand-title">APDS</span>
            <span className="header-brand-page">{getPageTitle()}</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Actions ── */}
      <div className="header-right">
        {/* Search toggle (mobile only icon, expands) */}
        <button
          onClick={() => setShowSearch(v => !v)}
          className="hdr-btn"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="hdr-btn hdr-btn-notif"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="hdr-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="hdr-notif-panel">
              <div className="hdr-notif-header">
                <span>Notifications</span>
                <button onClick={onClearNotifications} className="hdr-notif-clear">
                  <Trash2 size={13} /> Clear all
                </button>
              </div>
              {(notifications || []).length === 0 ? (
                <div className="hdr-notif-empty">No new notifications</div>
              ) : (notifications || []).map(n => (
                <div
                  key={n.id}
                  onClick={() => onMarkNotificationRead(n.id)}
                  className={`hdr-notif-item${n.read ? ' read' : ''}${n.type === 'THREAT' ? ' threat' : ''}`}
                >
                  <div className="hdr-notif-item-title">{n.title}</div>
                  <div className="hdr-notif-item-msg">{n.message}</div>
                  <div className="hdr-notif-item-time">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hdr-btn"
          aria-label="Toggle theme"
        >
          {theme === 'dark'
            ? <Sun size={18} color="#f59e0b" />
            : <Moon size={18} color="#3b82f6" />}
        </button>

        {/* User avatar (desktop) */}
        {currentUser ? (
          <div className="hdr-user">
            <div className="hdr-avatar">
              {(currentUser.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="hdr-user-info">
              <span className="hdr-user-name">{currentUser.name}</span>
              <span className="hdr-user-role">{currentUser.role || 'Premium User'}</span>
            </div>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="hdr-signin-btn">
            Sign In
          </button>
        )}
      </div>

      {/* ── Search overlay bar (expands below header on mobile) ── */}
      {showSearch && (
        <div className="hdr-search-bar">
          <Search size={15} color="var(--text-muted)" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scans, URLs…"
            className="hdr-search-input"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="hdr-search-clear">
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
