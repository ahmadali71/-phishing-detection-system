import React from 'react';
import {
  LayoutDashboard, Globe, Mail, Bot, History,
  FileText, Settings, LogOut, Shield, Award, X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',        label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'url-detection',    label: 'URL Detection',   icon: Globe },
  { id: 'email-detection',  label: 'Email Detection', icon: Mail },
  { id: 'ai-assistant',     label: 'AI Assistant',    icon: Bot },
  { id: 'scan-history',     label: 'Scan History',    icon: History },
  { id: 'admin-panel',      label: 'Reports',         icon: FileText },
  { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout, onOpenAuth, isOpen, onClose, t }) {
  const handleNav = id => { setActiveTab(id); onClose?.(); };

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

        {/* ── Navigation ── */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => {
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
