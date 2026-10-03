import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bell, Search, X, Trash2, Menu, LogOut,
  Globe, Mail, Image, MessageSquare, ArrowRight, ShieldAlert, LayoutDashboard
} from 'lucide-react';
import Logo from './Logo';

export default function Header({
  activeTab,
  setActiveTab,
  theme, setTheme,
  currentUser, onOpenAuth, onLogout,
  notifications, onMarkNotificationRead, onClearNotifications,
  searchQuery, setSearchQuery, onSelectSearchResult,
  scans = [],
  onMenuToggle,
  sidebarOpen,
  showSearch, setShowSearch,
  showNotifications, setShowNotifications,
  t
}) {
  const unreadCount = (notifications || []).filter(n => !n.read).length;
  const notifRef = useRef(null);
  const searchRef = useRef(null);

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

  // Close notifications on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [setShowNotifications]);

  // Close search popover on outside click/tap
  useEffect(() => {
    function onClickOutsideSearch(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    }
    if (showSearch) {
      document.addEventListener('mousedown', onClickOutsideSearch);
      document.addEventListener('touchstart', onClickOutsideSearch, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutsideSearch);
      document.removeEventListener('touchstart', onClickOutsideSearch);
    };
  }, [showSearch, setShowSearch]);

  // Auto-close search on mobile viewports
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setShowSearch(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setShowSearch]);

  const q = (searchQuery || '').trim().toLowerCase();

  const QUICK_PAGES = useMemo(() => [
    { id: 'dashboard', title: 'Dashboard', desc: 'Real-time telemetry & posture' },
    { id: 'url-detection', title: 'URL Detection', desc: 'Heuristics & domain reputation scanner' },
    { id: 'email-detection', title: 'Email Detection', desc: 'Header analysis & NLP phishing detection' },
    { id: 'image-detection', title: 'Screenshot Analysis', desc: 'Visual brand impersonation scanner' },
    { id: 'message-detection', title: 'SMS & Smishing', desc: 'Smishing & social engineering detector' },
    { id: 'scan-history', title: 'Scan History', desc: 'Historical audit log & PDF reports' },
    { id: 'ai-assistant', title: 'AI Assistant', desc: 'Interactive LLM threat analysis' },
  ], []);

  const matchedPages = useMemo(() => {
    if (q.length < 2) return [];
    return QUICK_PAGES.filter(p =>
      p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [q, QUICK_PAGES]);

  const matchedScans = useMemo(() => {
    if (!q || q.length < 1) return [];
    return (scans || []).filter(s => {
      if (!s) return false;
      const inputStr = s.input != null ? String(s.input).toLowerCase() : (s.url != null ? String(s.url).toLowerCase() : '');
      const typeStr = s.type != null ? String(s.type).toLowerCase() : '';
      const resultStr = s.result != null ? String(s.result).toLowerCase() : (s.status != null ? String(s.status).toLowerCase() : '');
      const idStr = s.id != null ? String(s.id).toLowerCase() : '';
      return inputStr.includes(q) || typeStr.includes(q) || resultStr.includes(q) || idStr.includes(q);
    }).slice(0, 5);
  }, [q, scans]);

  const handleSelectScan = (scan) => {
    if (onSelectSearchResult) {
      onSelectSearchResult(scan);
    }
    setShowSearch(false);
  };

  const handleSelectPage = (pageId) => {
    setActiveTab(pageId);
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchedScans.length > 0) {
        handleSelectScan(matchedScans[0]);
      } else if (matchedPages.length > 0) {
        handleSelectPage(matchedPages[0].id);
      } else {
        setActiveTab('scan-history');
        setShowSearch(false);
      }
    } else if (e.key === 'Escape') {
      setShowSearch(false);
    }
  };



  return (
    <header className="app-header">
      {/* ── LEFT ── */}
      <div className="header-left">
        <button
          onClick={onMenuToggle}
          className={`hamburger-btn${sidebarOpen ? ' active' : ''}`}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
        >
          <Menu size={20} />
        </button>

        <div
          className="header-brand-wrap"
          onClick={() => setActiveTab && setActiveTab('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          title="Automated Phishing Detection System"
        >
          <Logo size="sm" useShort={false} showText={true} lightText={true} className="hdr-logo-full" />
        </div>
      </div>

      {/* ── CENTER: Navigation Links on Desktop (When activeTab is home) ── */}
      {activeTab === 'home' && (
        <nav className="hdr-center-nav-links pg-desktop-only">
          <button
            type="button"
            onClick={() => {
              setActiveTab && setActiveTab('home');
              const main = document.querySelector('.app-main');
              if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hdr-nav-link hdr-nav-btn active"
            title="Home"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className="hdr-nav-link hdr-nav-btn hdr-nav-dashboard-badge"
            title="Go to Dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(56, 189, 248, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              color: '#38bdf8',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.15)'
            }}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>
          <a
            href="#vectors"
            className="hdr-nav-link"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('vectors');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Features
          </a>
          <a
            href="#sandbox"
            className="hdr-nav-link"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('sandbox');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Live Scanner
          </a>
          <a
            href="#pipeline"
            className="hdr-nav-link"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('pipeline');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="hdr-nav-link"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('faq');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            FAQ
          </a>
        </nav>
      )}

      {/* ── RIGHT ── */}
      <div className="header-right">

        {/* Search button — desktop / tablet only */}
        <button
          onClick={() => setShowSearch(v => !v)}
          className={`hdr-btn hdr-btn-search${showSearch ? ' active' : ''}`}
          aria-label="Search"
          title="Search scans and URLs"
        >
          <Search size={17} />
        </button>

        {/* Theme switcher pills — strictly only showing after sign in */}
        {currentUser && setTheme && (
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
                aria-label={opt.title}
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
            <button
              onClick={onLogout}
              className="hdr-logout-quick-btn"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="hdr-signin-btn">Sign In</button>
        )}
      </div>

      {/* ── Search Bar & Interactive Live Results Dropdown ── */}
      {showSearch && (
        <div ref={searchRef} className="hdr-search-container">
          <div className="hdr-search-bar">
            <Search size={15} className="hdr-search-icon" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search scans, URLs, emails, pages… (Press Enter)"
              className="hdr-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hdr-search-clear"
                title="Clear query"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="hdr-search-close"
              title="Close search"
            >
              <X size={14} />
            </button>
          </div>

          {/* Live Search Dropdown */}
          {q.length > 0 && (
            <div className="hdr-search-dropdown">
              {matchedScans.length > 0 && (
                <div className="hdr-search-group">
                  <div className="hdr-search-group-header">
                    <span>Threat Scans &amp; Audits</span>
                    <span className="hdr-search-count-tag">{matchedScans.length} found</span>
                  </div>
                  {matchedScans.map((scan, idx) => {
                    const isPhishing = scan.result === 'Phishing' || (typeof scan.result === 'string' && scan.result.includes('Phishing'));
                    const isSuspicious = scan.result === 'Suspicious';
                    const verdictClass = isPhishing ? 'danger' : isSuspicious ? 'warning' : 'safe';
                    return (
                      <div
                        key={scan.id || idx}
                        onClick={() => handleSelectScan(scan)}
                        className="hdr-search-result-item"
                        role="button"
                        tabIndex={0}
                      >
                        <div className={`hdr-result-type-badge ${verdictClass}`}>
                          {scan.type || 'URL'}
                        </div>
                        <div className="hdr-result-info">
                          <div className="hdr-result-target">{scan.input || scan.url}</div>
                          <div className="hdr-result-meta">
                            <span className={`hdr-verdict-pill ${verdictClass}`}>{scan.result || 'Safe'}</span>
                            <span className="hdr-meta-sep">•</span>
                            <span>Risk {scan.riskScore || '0/100'}</span>
                            {scan.date && (
                              <>
                                <span className="hdr-meta-sep">•</span>
                                <span>{scan.date}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={13} className="hdr-result-arrow" />
                      </div>
                    );
                  })}
                </div>
              )}

              {matchedPages.length > 0 && (
                <div className="hdr-search-group">
                  <div className="hdr-search-group-header">
                    <span>Quick Navigation</span>
                  </div>
                  {matchedPages.map(page => (
                    <div
                      key={page.id}
                      onClick={() => handleSelectPage(page.id)}
                      className="hdr-search-result-item"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="hdr-result-type-badge page-badge">
                        PAGE
                      </div>
                      <div className="hdr-result-info">
                        <div className="hdr-result-target">{page.title}</div>
                        <div className="hdr-result-meta">{page.desc}</div>
                      </div>
                      <ArrowRight size={13} className="hdr-result-arrow" />
                    </div>
                  ))}
                </div>
              )}

              {matchedScans.length === 0 && matchedPages.length === 0 && (
                <div className="hdr-search-no-results">
                  <p>No scans or pages matched "<strong>{searchQuery}</strong>"</p>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('scan-history'); setShowSearch(false); }}
                    className="hdr-search-history-link"
                  >
                    Open Full Scan History
                  </button>
                </div>
              )}

              <div className="hdr-search-dropdown-footer">
                <button
                  type="button"
                  onClick={() => { setActiveTab('scan-history'); setShowSearch(false); }}
                  className="hdr-search-view-all-btn"
                >
                  View all in Scan History →
                </button>
              </div>
            </div>
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

        .hdr-logout-quick-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: 4px;
        }
        .hdr-logout-quick-btn:hover {
          background: #ef4444;
          color: #ffffff;
          border-color: transparent;
          transform: scale(1.05);
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

        /* Search Container & Bar */
        .hdr-search-container {
          position: absolute;
          top: calc(100% + 6px);
          right: 16px;
          width: min(440px, calc(100vw - 32px));
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: hdrSearchIn 0.18s ease;
        }
        @keyframes hdrSearchIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hdr-search-bar {
          width: 100%;
          background: var(--bg-card, #071e3d);
          border: 1px solid rgba(56, 189, 248, 0.4);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        .hdr-search-icon {
          color: #38bdf8;
          flex-shrink: 0;
        }

        .hdr-search-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-primary, #ffffff);
          font-size: 0.88rem;
          outline: none;
          font-family: inherit;
        }
        .hdr-search-input::placeholder {
          color: var(--text-muted, rgba(255, 255, 255, 0.5));
        }

        .hdr-search-clear,
        .hdr-search-close {
          background: none;
          border: none;
          color: var(--text-muted, rgba(255, 255, 255, 0.5));
          cursor: pointer;
          padding: 3px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .hdr-search-clear:hover,
        .hdr-search-close:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }

        .hdr-search-dropdown {
          background: var(--bg-card, #071e3d);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
          overflow: hidden;
          max-height: 380px;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(14px);
        }

        .hdr-search-group {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .hdr-search-group:last-of-type {
          border-bottom: none;
        }

        .hdr-search-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 14px 6px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #38bdf8;
        }
        .hdr-search-count-tag {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
        }

        .hdr-search-result-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .hdr-search-result-item:hover {
          background: rgba(56, 189, 248, 0.1);
        }

        .hdr-result-type-badge {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 5px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .hdr-result-type-badge.danger {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .hdr-result-type-badge.warning {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .hdr-result-type-badge.safe {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .hdr-result-type-badge.page-badge {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.4);
        }

        .hdr-result-info {
          flex: 1;
          min-width: 0;
        }
        .hdr-result-target {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hdr-result-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hdr-meta-sep {
          opacity: 0.4;
        }
        .hdr-verdict-pill {
          font-weight: 700;
        }
        .hdr-verdict-pill.danger { color: #f87171; }
        .hdr-verdict-pill.warning { color: #fbbf24; }
        .hdr-verdict-pill.safe { color: #34d399; }

        .hdr-result-arrow {
          color: rgba(255, 255, 255, 0.35);
          flex-shrink: 0;
          transition: transform 0.15s ease, color 0.15s ease;
        }
        .hdr-search-result-item:hover .hdr-result-arrow {
          color: #38bdf8;
          transform: translateX(2px);
        }

        .hdr-search-no-results {
          padding: 18px 14px;
          text-align: center;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.7);
        }
        .hdr-search-no-results p {
          margin: 0 0 10px;
        }
        .hdr-search-history-link {
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .hdr-search-dropdown-footer {
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: flex-end;
        }
        .hdr-search-view-all-btn {
          background: none;
          border: none;
          color: #38bdf8;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          padding: 2px 4px;
        }
        .hdr-search-view-all-btn:hover {
          text-decoration: underline;
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

        .hamburger-btn {
          display: flex !important;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 9px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-right: 6px;
        }
        .hamburger-btn:hover,
        .hamburger-btn.active {
          background: rgba(56, 189, 248, 0.25);
          border-color: #38bdf8;
          color: #ffffff;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
        }
        .hamburger-btn:active {
          transform: scale(0.94);
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
        @media (max-width: 1024px) {
          .hamburger-btn {
            display: flex !important;
          }
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
          .hdr-btn-search { display: none !important; }
          .hdr-search-container { display: none !important; }
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
          .hdr-btn-search { display: none !important; }
          .hdr-search-container { display: none !important; }
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
