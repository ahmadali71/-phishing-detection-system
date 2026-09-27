import React from 'react';
import {
  Home, LayoutDashboard, Globe, Mail, Image, MessageSquare, Bot, History,
  FileText, Settings, LogOut, Shield, X
} from 'lucide-react';
import Logo from './Logo';

const NAV_ITEMS = [
  { id: 'home',             label: 'Home Page',          icon: Home },
  { id: 'dashboard',        label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'url-detection',    label: 'URL Detection',      icon: Globe },
  { id: 'email-detection',  label: 'Email Detection',    icon: Mail },
  { id: 'image-detection',  label: 'Screenshot / Image', icon: Image },
  { id: 'message-detection',label: 'SMS & Smishing',     icon: MessageSquare },
  { id: 'ai-assistant',     label: 'AI Assistant',       icon: Bot },
  { id: 'scan-history',     label: 'Scan History',       icon: History },
  { id: 'admin-panel',      label: 'Admin Panel',        icon: Shield, adminOnly: true },
  { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout, onOpenAuth, isOpen, onClose, isOverlay = false, t }) {
  const handleNav = id => { setActiveTab(id); onClose?.(); };

  const isAdmin = currentUser?.role?.toLowerCase()?.includes('admin') ||
                  currentUser?.email?.toLowerCase()?.includes('admin') ||
                  currentUser?.role?.toLowerCase()?.includes('analyst');

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

      <aside className={`app-sidebar${isOpen ? ' sidebar-open' : ''}${isOverlay ? ' sidebar-overlay-mode' : ''}`}>
        {/* ── Header ── */}
        <div className="sidebar-header">
          <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size="sm" showText={false} />
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Main Menu
            </span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>



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
        </div>
      </aside>
    </>
  );
}
