import React from 'react';
import { LayoutDashboard, Globe, Mail, Bot, Settings, History, Shield } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, t }) {
  const navItems = [
    { id: 'dashboard',        label: t?.dashboard || 'Home',      icon: LayoutDashboard },
    { id: 'url-detection',    label: t?.urlDetection || 'URL',    icon: Globe },
    { id: 'email-detection',  label: t?.emailDetection || 'Email',icon: Mail },
    { id: 'ai-assistant',     label: t?.aiAssistant || 'AI Chat', icon: Bot },
    { id: 'scan-history',     label: t?.scanHistory || 'History', icon: History },
    { id: 'profile-settings', label: t?.profile || 'Settings',   icon: Settings },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.navigator?.vibrate) {
                  try { window.navigator.vibrate(10); } catch (e) {}
                }
              }}
              className={`mobile-nav-item${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="mobile-nav-icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                {isActive && <span className="mobile-nav-active-dot" />}
              </span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
