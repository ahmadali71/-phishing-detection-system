import React from 'react';
import { LayoutDashboard, Link, Mail, Bot, Settings, Search, Bell } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onSearchToggle, onNotificationToggle, unreadCount, t }) {
  const navItems = [
    { id: 'dashboard',       label: 'Home',    icon: LayoutDashboard },
    { id: 'url-detection',   label: 'URL',     icon: Link },
    { id: 'email-detection', label: 'Email',   icon: Mail },
    { id: 'ai-assistant',    label: 'AI Chat', icon: Bot },
    { id: 'profile-settings', label: 'Profile', icon: Settings },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-item${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="mobile-nav-icon-wrap">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {isActive && <span className="mobile-nav-active-dot" />}
            </span>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}

      {onSearchToggle && (
        <button
          onClick={onSearchToggle}
          className="mobile-nav-item"
          aria-label="Search"
        >
          <span className="mobile-nav-icon-wrap">
            <Search size={22} strokeWidth={1.8} />
          </span>
          <span className="mobile-nav-label">Search</span>
        </button>
      )}

      {onNotificationToggle && (
        <button
          onClick={onNotificationToggle}
          className="mobile-nav-item"
          aria-label="Notifications"
        >
          <span className="mobile-nav-icon-wrap">
            <Bell size={22} strokeWidth={1.8} />
            {unreadCount > 0 && <span className="mobile-nav-badge">{unreadCount}</span>}
          </span>
          <span className="mobile-nav-label">Alerts</span>
        </button>
      )}
    </nav>
  );
}
