import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, Trash2, Menu } from 'lucide-react';
import Logo from './Logo';

export default function Header({
  activeTab,
  setActiveTab,
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
      case 'home':             return 'Home';
      case 'dashboard':        return 'Dashboard';
      case 'url-detection':    return 'URL Detection';
      case 'email-detection':  return 'Email Detection';
      case 'image-detection':  return 'Image Analysis';
      case 'message-detection':return 'SMS Analysis';
      case 'scan-history':     return 'Scan History';
      case 'profile-settings': return 'Settings';
      case 'ai-assistant':     return 'AI Assistant';
      case 'admin-panel':      return 'Admin';
      default:                 return 'APDS';
    }
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
      {/* ── LEFT ── */}
      <div className="header-left">
        {activeTab !== 'home' && (
          <button onClick={onMenuToggle} className="hamburger-btn" aria-label="Open menu">
            <Menu size={19} />
          </button>
        )}

        <div
          className="header-brand-wrap"
          onClick={() => setActiveTab && setActiveTab('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          title="Automated Phishing Detection System - Home"
        >
          <Logo size="sm" useShort={false} showText={true} lightText={true} className="hdr-logo-full" />


        </div>
      </div>

      {/* ── CENTER: Navigation Links on Desktop ── */}
      {activeTab === 'home' && (
        <nav className="hdr-center-nav-links pg-desktop-only">
          <button
            type="button"
            onClick={() => { setActiveTab && setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hdr-nav-link hdr-nav-btn"
          >Home</button>
          <button
            type="button"
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className="hdr-nav-link hdr-nav-btn"
          >Dashboard</button>
          <a href="#vectors" className="hdr-nav-link">Features</a>
          <a href="#sandbox" className="hdr-nav-link">Live Scanner</a>
          <a href="#pipeline" className="hdr-nav-link">How It Works</a>
          <a href="#faq" className="hdr-nav-link">FAQ</a>
        </nav>
      )}

      {/* ── RIGHT ── */}
      <div className="header-right">

        {/* Search */}
        <button onClick={() => setShowSearch(v => !v)} className="hdr-btn" aria-label="Search">
          <Search size={17} />
        </button>

        {/* Theme switcher pills — desktop only */}
        {setTheme && (
          <div className="hdr-theme-pills pg-desktop-only">
            {[
              { id: 'light',  label: '☀️', title: 'Light Mode' },
              { id: 'dark',   label: '🌙', title: 'Dark Mode' },
              { id: 'navy',   label: '🌊', title: 'Navy Blue' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`hdr-theme-pill${theme === opt.id ? ' hdr-theme-pill-active' : ''}`}
                title={opt.title}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Notifications (No number count per user request) */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="hdr-btn hdr-btn-notif"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="hdr-badge hdr-badge-dot" />}
          </button>

          {showNotifications && (
            <div className="hdr-notif-panel">
              <div className="hdr-notif-header">
                <span>Notifications</span>
                <button onClick={onClearNotifications} className="hdr-notif-clear">
                  <Trash2 size={12} /> Clear
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

        {/* User */}
        {currentUser ? (
          <div className="hdr-user">
            <div className="hdr-avatar">
              {(currentUser.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="hdr-user-info">
              <span className="hdr-user-name">{currentUser.name}</span>
              <span className="hdr-user-role">{currentUser.role || 'User'}</span>
            </div>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="hdr-signin-btn">Sign In</button>
        )}
      </div>

      {/* ── Search bar ── */}
      {showSearch && (
        <div className="hdr-search-bar">
          <Search size={14} color="var(--text-muted)" />
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
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {/* ── Header Styles ── */}
      <style>{`
        .header-brand-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .hdr-page-chip-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .hdr-slash-sep {
          color: rgba(255, 255, 255, 0.3);
          font-weight: 300;
          font-size: 1.1rem;
        }

        .logo-brand-text {
          font-size: 0.96rem;
          font-weight: 800;
          letter-spacing: -0.015em;
          white-space: nowrap;
        }

        /* Desktop chip shown next to logo on inner pages */
        .hdr-desktop-chip {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 6px;
          font-size: 0.67rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(56, 189, 248, 0.18);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.35);
          white-space: nowrap;
        }

        /* Theme switcher pills */
        .hdr-theme-pills {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 20px;
        }
        .hdr-theme-pill {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          background: transparent;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          line-height: 1;
        }
        .hdr-theme-pill:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
          transform: scale(1.15);
        }
        .hdr-theme-pill-active {
          background: rgba(56,189,248,0.22);
          border-color: #38bdf8;
          box-shadow: 0 0 8px rgba(56,189,248,0.5);
        }

        /* Responsive brand label behavior */
        @media (max-width: 1024px) {
          .logo-brand-text {
            font-size: 0.85rem;
          }
        }
        @media (max-width: 860px) {
          .hdr-desktop-chip { display: none !important; }
          .hdr-slash-sep { display: none !important; }
        }

        .hdr-center-nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 0 16px;
        }
        .hdr-nav-link {
          font-size: 0.86rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          transition: all 0.18s ease;
          padding: 4px 8px;
          border-radius: 6px;
        }
        .hdr-nav-link:hover {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
        }

        .hdr-nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
        }

        @media (max-width: 960px) {
          .hdr-center-nav-links { display: none !important; }
          .hdr-brand-full { display: none !important; }
        }


        /* ── PILL LINK BUTTON ── */
        .hdr-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(37,99,235,0.09);
          border: 1px solid rgba(37,99,235,0.22);
          color: var(--accent-blue, #2563eb);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .hdr-pill-btn:hover {
          background: var(--accent-blue, #2563eb);
          color: #ffffff;
          border-color: transparent;
        }

        /* Page chip — the current page label beside APDS */
        .header-page-chip {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 6px;
          font-size: 0.67rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(56, 189, 248, 0.18);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.35);
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* User avatar */
        .hdr-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 8px;
          border-left: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hdr-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #38bdf8, #0284c7);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(56, 189, 248, 0.4);
        }
        .hdr-user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .hdr-user-name {
          font-size: 0.8rem;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hdr-user-role {
          font-size: 0.66rem;
          color: #38bdf8;
          white-space: nowrap;
        }

        /* Sign-in button */
        .hdr-signin-btn {
          padding: 6px 16px;
          border-radius: 8px;
          background: #38bdf8;
          border: none;
          color: #042c53;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(56, 189, 248, 0.4);
        }
        .hdr-signin-btn:hover { opacity: 0.88; }

        /* Search bar */
        .hdr-search-bar {
          position: absolute;
          top: calc(100% + 4px);
          right: 16px;
          width: min(320px, calc(100vw - 32px));
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          z-index: 999;
          animation: hdrSearchIn 0.18s ease;
        }
        @keyframes hdrSearchIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-search-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.88rem;
          outline: none;
          font-family: inherit;
        }
        .hdr-search-input::placeholder { color: var(--text-muted); }
        .hdr-search-clear {
          background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px;
        }

        /* Red unread indicator dot without numbers */
        .hdr-badge-dot {
          width: 8px !important;
          height: 8px !important;
          min-width: 8px !important;
          border-radius: 50% !important;
          padding: 0 !important;
          top: 6px !important;
          right: 6px !important;
          background: #ef4444 !important;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.8) !important;
        }

        .pg-desktop-only {
          display: flex;
        }

        .logo-brand-desktop {
          display: inline-flex;
        }
        .logo-brand-mobile {
          display: none;
        }

        /* ── MOBILE FIXES ── */
        .app-header {
          height: 64px !important;
          min-height: 64px !important;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2) !important;
          flex-wrap: nowrap !important;
          overflow: visible !important;
          padding: 0 16px !important;
        }
        @media (max-width: 900px) {
          .pg-desktop-only {
            display: none !important;
          }
          .hdr-center-nav-links {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .hamburger-btn {
            display: flex !important;
          }
          .hdr-user-info { display: none !important; }
          .hdr-pill-text { display: none !important; }
          .hdr-pill-btn {
            padding: 6px 8px;
          }
          .header-page-chip {
            display: none !important;
          }
          .hdr-user {
            border-left: none;
            padding-left: 0;
          }
          .header-right {
            gap: 6px !important;
          }
        }
        @media (max-width: 640px) {
          .logo-brand-desktop { display: none !important; }
          .logo-brand-mobile { display: inline-flex !important; }
          .app-header { padding: 0 10px !important; }
        }
        @media (max-width: 480px) {
          .header-page-chip { display: none !important; }
          .hdr-pill-btn { display: none !important; }
          .hdr-btn {
            width: 34px !important;
            height: 34px !important;
          }
          .hdr-avatar {
            width: 32px !important;
            height: 32px !important;
          }
        }
      `}</style>
    </header>
  );
}
