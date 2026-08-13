import React from 'react';
import {
  LayoutDashboard,
  Link,
  Mail,
  Bot,
  History,
  ShieldAlert,
  Settings,
  Award,
  X,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentUser, isOpen, onClose, t }) {
  const mainNav = [
    { id: 'dashboard', label: t.dashboard || 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'url-detection', label: t.urlDetection || 'URL Detection', icon: Link, badge: 'Live ML' },
    { id: 'email-detection', label: t.emailDetection || 'Email Detection', icon: Mail, badge: 'NLP' },
    { id: 'ai-assistant', label: t.aiAssistant || 'AI Assistant', icon: Bot, badge: 'AI Brain' },
    { id: 'scan-history', label: t.scanHistory || 'Scan History', icon: History, badge: null },
  ];

  const adminNav = [
    { id: 'admin-panel', label: t.adminPanel || 'Admin Panel', icon: ShieldAlert, badge: 'Sys' },
    { id: 'profile-settings', label: t.profileSettings || 'Profile & Settings', icon: Settings, badge: null },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 290
          }}
        />
      )}

      <aside className={`app-sidebar${isOpen ? ' sidebar-open' : ''}`}>
        {/* Drawer Header */}
        <div className="sidebar-drawer-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Shield size={18} color="white" />
            </div>
            <span className="sidebar-brand-text">APDS</span>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              className="sidebar-close-btn"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Group 1: Core Protection Modules */}
        <div className="sidebar-nav-groups">
          <div className="sidebar-nav-group">
            <div className="sidebar-group-title">DETECTION MODULES</div>
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`sidebar-nav-item ${active ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-icon-wrap">
                    <Icon size={18} color={active ? '#60a5fa' : 'var(--text-muted)'} />
                    {active && <span className="sidebar-active-dot" />}
                  </div>
                  <span className="sidebar-nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`badge ${active ? 'badge-blue' : 'badge-warning'}`} style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Group 2: Administration & Preferences */}
          <div className="sidebar-nav-group">
            <div className="sidebar-group-title">ADMINISTRATION</div>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`sidebar-nav-item ${active ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-icon-wrap">
                    <Icon size={18} color={active ? '#60a5fa' : 'var(--text-muted)'} />
                    {active && <span className="sidebar-active-dot" />}
                  </div>
                  <span className="sidebar-nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Academic Project Credential Card */}
        <div className="sidebar-academic-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.78rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#f59e0b' }}>
              BS IT Final Year Project
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <div><strong>{t.authors || 'Authors: Amna Najam & Alisha Noor'}</strong></div>
            <div><strong>{t.supervisor || 'Supervisor: Mam Shaista Ghafoor'}</strong></div>
            <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#60a5fa', fontWeight: '700' }}>
              Session 2022 – 2026
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
