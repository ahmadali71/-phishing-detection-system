import React from 'react';
import { LayoutDashboard, Globe, Mail, Bot, History, Settings, Shield } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, currentUser, t }) {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'Admin' || currentUser?.email?.toLowerCase().includes('admin');

  const navItems = [
    { id: 'dashboard',        label: 'Home',    icon: LayoutDashboard },
    { id: 'url-detection',    label: 'URL',     icon: Globe },
    { id: 'email-detection',  label: 'Email',   icon: Mail },
    { id: 'ai-assistant',     label: 'AI',      icon: Bot },
    { id: 'scan-history',     label: 'History', icon: History },
    ...(isAdmin
      ? [{ id: 'admin-panel', label: 'Admin', icon: Shield }]
      : [{ id: 'profile-settings', label: 'Profile', icon: Settings }]
    ),
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navItems.map(item => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`bottom-nav-btn${active ? ' active' : ''}`}
            onClick={() => {
              setActiveTab(item.id);
              try { window.navigator?.vibrate?.(10); } catch (_) {}
            }}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bnb-icon">
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            </span>
            <span className="bnb-label">
              {(t && (t[item.id] || t.dashboard)) || item.label}
            </span>
            {active && <span className="bnb-pip" />}
          </button>
        );
      })}
    </nav>
  );
}
