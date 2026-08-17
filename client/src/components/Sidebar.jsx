import React from 'react';
import {
  LayoutDashboard, Globe, Mail, Bot, History,
  FileText, Settings, LogOut, Shield, Award, X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',        label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'url-detection',    label: 'URL Detection',      icon: Globe },
  { id: 'email-detection',  label: 'Email Detection',    icon: Mail },
  { id: 'ai-assistant',     label: 'AI Assistant',       icon: Bot },
  { id: 'scan-history',     label: 'Scan History',       icon: History },
  { id: 'admin-panel',      label: 'Admin Panel',        icon: Shield, adminOnly: true },
  { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout, onOpenAuth, isOpen, onClose, t }) {
  const handleNav = id => { setActiveTab(id); onClose?.(); };

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.email?.toLowerCase().includes('admin');

  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (item.adminOnly) {
      return isAdmin;
    }
    return true;
  });

  return (
    <>
      {/* Dimmed overlay when drawer open */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar${isOpen ? ' sidebar-open' : ''}`}>
        {/* ── Header ── */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Shield size={18} color="#fff" />
            </div>
            <span className="sidebar-logo-text">APDS</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* ── User Role Identity Card ── */}
        {currentUser && (
          <div style={{
            margin: '0 12px 14px',
            padding: '10px 14px',
            background: isAdmin ? 'rgba(99, 95, 236, 0.12)' : 'rgba(59, 130, 246, 0.08)',
            border: `1px solid ${isAdmin ? 'rgba(99, 95, 236, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isAdmin ? 'linear-gradient(135deg, #635fec, #4338ca)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {(currentUser.name || 'U')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name || 'User'}
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                color: isAdmin ? '#818cf8' : '#3b82f6',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {isAdmin ? '🛡️ Administrator' : '👤 Standard User'}
              </span>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="sidebar-nav">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-item${active ? ' active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="sidebar-item-icon">
                  <Icon size={18} />
                </span>
                <span className="sidebar-item-label">
                  {t?.[item.id] || item.label}
                </span>
                {item.adminOnly && (
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    background: '#635fec',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    marginLeft: 'auto'
                  }}>
                    ADMIN
                  </span>
                )}
                {active && <span className="sidebar-item-pip" />}
              </button>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="sidebar-footer">
          {currentUser ? (
            <button
              className="sidebar-item sidebar-logout"
              onClick={() => { onLogout?.(); onClose?.(); }}
            >
              <span className="sidebar-item-icon"><LogOut size={17} /></span>
              <span className="sidebar-item-label">Logout</span>
            </button>
          ) : (
            <button
              className="sidebar-item sidebar-signin"
              onClick={() => { onOpenAuth?.(); onClose?.(); }}
            >
              <span className="sidebar-item-icon"><Shield size={17} /></span>
              <span className="sidebar-item-label">Sign In / Register</span>
            </button>
          )}

          {/* Academic card */}
          <div className="sidebar-academic">
            <div className="sidebar-academic-header">
              <Award size={14} color="#f59e0b" />
              <span>BS IT Final Year Project</span>
            </div>
            <div className="sidebar-academic-body">
              <strong>Amna Najam &amp; Alisha Noor</strong>
              <span>Supervisor: Mam Shaista Ghafoor</span>
              <span className="sidebar-academic-year">Session 2022–2026</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
