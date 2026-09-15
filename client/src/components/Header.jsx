import React, { useState, useRef, useEffect } from 'react';
import { Bell, Moon, Sun, Search, X, Trash2, Menu, Home, LayoutDashboard, Layers } from 'lucide-react';
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

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'navy' : 'light';
    setTheme(next);
  };

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
          style={{ cursor: 'pointer' }}
        >
          <Logo size="sm" useShort={true} showText={true} />
          <span className="hdr-brand-full pg-desktop-only">Automatic Phishing Detection System</span>
          {activeTab !== 'home' && (
            <div className="header-page-chip">
              {getPageTitle()}
            </div>
          )}
        </div>
      </div>

      {/* ── CENTER: Home Navigation Links on Desktop (retains Landing nav on Home) ── */}
      {activeTab === 'home' && (
        <nav className="hdr-center-nav-links pg-desktop-only">
          <a href="#features" className="hdr-nav-link">Features</a>
          <a href="#sandbox" className="hdr-nav-link">Live Sandbox</a>
          <a href="#capabilities" className="hdr-nav-link">Capabilities</a>
          <a href="#how-it-works" className="hdr-nav-link">How It Works</a>
          <a href="#faq" className="hdr-nav-link">FAQ</a>
        </nav>
      )}

      {/* ── RIGHT ── */}
      <div className="header-right">
        {/* Home / Dashboard quick link */}
        {activeTab !== 'home' ? (
          <button
            onClick={() => setActiveTab && setActiveTab('home')}
            className="hdr-pill-btn"
            title="Home"
          >
            <Home size={14} />
            <span className="hdr-pill-text">Home</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className="hdr-pill-btn"
            title="Dashboard"
          >
            <LayoutDashboard size={14} />
            <span className="hdr-pill-text">Dashboard</span>
          </button>
        )}

        {/* Search */}
        <button onClick={() => setShowSearch(v => !v)} className="hdr-btn" aria-label="Search">
          <Search size={17} />
        </button>

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

        {/* Theme toggle */}
        <button onClick={cycleTheme} className="hdr-btn" aria-label="Toggle theme"
          title={theme === 'dark' ? 'Dark Mode' : theme === 'navy' ? 'Navy Blue' : 'Light Mode'}>
          {theme === 'dark' ? (
            <Sun size={17} color="#f59e0b" />
          ) : theme === 'navy' ? (
            <Layers size={17} color="#818cf8" />
          ) : (
            <Moon size={17} color="#3b82f6" />
          )}
        </button>

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

      <style>{`
        .hdr-brand-full {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          white-space: nowrap;
          letter-spacing: -0.01em;
          margin-left: 2px;
        }

        .hdr-center-nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
          margin: 0 16px;
        }
        .hdr-nav-link {
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .hdr-nav-link:hover {
          color: var(--accent-blue, #2563eb);
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
          background: rgba(37,99,235,0.1);
          color: var(--accent-blue, #2563eb);
          border: 1px solid rgba(37,99,235,0.18);
          white-space: nowrap;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* User avatar */
        .hdr-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 8px;
          border-left: 1px solid var(--border-color);
        }
        .hdr-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37,99,235,0.35);
        }
        .hdr-user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .hdr-user-name {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-primary);
          white-space: nowrap;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hdr-user-role {
          font-size: 0.66rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        /* Sign-in button */
        .hdr-signin-btn {
          padding: 6px 14px;
          border-radius: 8px;
          background: var(--accent-blue, #2563eb);
          border: none;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
          white-space: nowrap;
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

        /* ── MOBILE FIXES ── */
        .app-header {
          flex-wrap: nowrap !important;
          overflow: visible !important;
        }
        @media (max-width: 768px) {
          .hamburger-btn {
            display: flex !important;
          }
          .hdr-user-info { display: none; }
          .hdr-pill-text { display: none; }
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
        }
        @media (max-width: 480px) {
          .header-page-chip { display: none !important; }
          .hdr-pill-btn { display: none; }
          .hdr-btn {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </header>
  );
}
