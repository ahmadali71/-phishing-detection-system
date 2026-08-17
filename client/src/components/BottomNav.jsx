import React from 'react';
import { LayoutDashboard, Globe, Mail, Bot, History, Settings } from 'lucide-react';

const NAV = [
  { id: 'dashboard',       label: 'Home',    icon: LayoutDashboard },
  { id: 'url-detection',   label: 'URL',     icon: Globe },
  { id: 'email-detection', label: 'Email',   icon: Mail },
  { id: 'ai-assistant',    label: 'AI',      icon: Bot },
  { id: 'scan-history',    label: 'History', icon: History },
  { id: 'profile-settings',label: 'Profile', icon: Settings },
];

export default function BottomNav({ activeTab, setActiveTab, t }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV.map(item => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`bottom-nav-btn${active ? ' active' : ''}`}
            onClick={() => {
              setActiveTab(item.id);
              try { window.navigator?.vibrate?.(8); } catch (_) {}
            }}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bnb-icon">
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
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
