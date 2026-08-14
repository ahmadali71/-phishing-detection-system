import React from 'react';
import {
  LayoutDashboard,
  Link,
  Mail,
  Bot,
  History,
  FileText,
  Settings,
  LogOut,
  Award,
  X,
  Shield
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout, onOpenAuth, isOpen, onClose, t }) {
  const navItems = [
    { id: 'dashboard', label: t.dashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 'url-detection', label: t.urlDetection || 'URL Detection', icon: Link },
    { id: 'email-detection', label: t.emailDetection || 'Email Detection', icon: Mail },
    { id: 'ai-assistant', label: t.aiAssistant || 'AI Assistant', icon: Bot },
    { id: 'scan-history', label: t.scanHistory || 'Scan History', icon: History },
    { id: 'admin-panel', label: 'Reports', icon: FileText },
    { id: 'profile-settings', label: t.profileSettings || 'Profile & Settings', icon: Settings },
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

      {/* ── Left Sidebar (Exact Match to PDF Page 61 Screen 4) ── */}
      <aside className={`app-sidebar${isOpen ? ' sidebar-open' : ''}`}>
        <div>
          {/* Brand Logo & Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px 24px 8px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 12px rgba(37, 99, 235, 0.4)'
              }}>
                <Shield size={20} color="#ffffff" />
              </div>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: '900',
                letterSpacing: '0.04em',
                color: '#ffffff'
              }}>
                APDS
              </span>
            </div>

            {isOpen && (
              <button
                onClick={onClose}
                className="btn-icon"
                style={{ width: '32px', height: '32px' }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Items (Exact 8 items matching PDF Page 61) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`sidebar-nav-item ${active ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: active ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: active ? '800' : '600',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    textAlign: 'start',
                    transition: 'all 0.2s',
                    width: '100%',
                    boxShadow: active ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none'
                  }}
                >
                  <Icon size={19} color={active ? '#ffffff' : 'var(--text-muted)'} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                </button>
              );
            })}

            {/* Logout / Login button */}
            {currentUser ? (
              <button
                onClick={() => { onLogout(); if (onClose) onClose(); }}
                className="sidebar-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'start',
                  transition: 'all 0.2s',
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                <LogOut size={19} color="var(--text-muted)" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => { onOpenAuth(); if (onClose) onClose(); }}
                className="sidebar-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  color: '#3b82f6',
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'start',
                  transition: 'all 0.2s',
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                <Shield size={19} color="#3b82f6" />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>

        {/* Academic Project Credential Card (Bottom) */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '14px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b' }}>
              BS IT Final Year Project
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
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
