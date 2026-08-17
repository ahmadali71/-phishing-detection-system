import sys, pathlib

css_path = pathlib.Path(r'C:\Users\Computer House\.gemini\antigravity\scratch\phishing-detection-system\client\src\index.css')

with open(css_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

base_lines = lines[:1190]
email_lines = lines[2071:]

new_responsive_css = r"""
/* ================================================================
   14. HEADER — NEW MOBILE-FIRST REDESIGN
================================================================ */
/* The header now has a flex row with left/right groups */
.app-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 200;
  gap: 12px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* Hamburger — hidden on desktop, shown on mobile */
.hamburger-btn {
  display: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}
.hamburger-btn:hover { background: var(--bg-card-hover); }

/* Brand group */
.header-brand-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.header-brand-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(37,99,235,0.4);
}

.header-brand-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  min-width: 0;
}

.header-brand-title {
  font-weight: 900;
  font-size: 1rem;
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  color: var(--text-primary);
  white-space: nowrap;
}

.header-brand-page {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--accent-blue);
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

/* Icon buttons in header */
.hdr-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}
.hdr-btn:hover { background: var(--bg-card-hover); color: var(--text-primary); }

.hdr-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ef4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(239,68,68,0.7);
}

/* Notifications dropdown panel */
.hdr-notif-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-width: calc(100vw - 24px);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  z-index: 300;
  overflow: hidden;
  animation: panelFadeIn 0.18s ease;
}

@keyframes panelFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hdr-notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;
  font-weight: 800;
  font-size: 0.88rem;
  border-bottom: 1px solid var(--border-color);
}

.hdr-notif-clear {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}
.hdr-notif-clear:hover { color: #ef4444; }

.hdr-notif-empty {
  padding: 24px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.84rem;
}

.hdr-notif-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  border-left: 3px solid transparent;
  transition: background 0.15s;
}
.hdr-notif-item:last-child { border-bottom: none; }
.hdr-notif-item:hover { background: var(--bg-card-hover); }
.hdr-notif-item.read { opacity: 0.6; }
.hdr-notif-item.threat { border-left-color: #ef4444; }
.hdr-notif-item:not(.threat) { border-left-color: var(--accent-blue); }

.hdr-notif-item-title {
  font-weight: 800;
  font-size: 0.82rem;
  color: var(--text-primary);
}
.hdr-notif-item-msg {
  font-size: 0.74rem;
  color: var(--text-secondary);
  margin-top: 2px;
  line-height: 1.4;
}
.hdr-notif-item-time {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* Search bar — slide down below the header row */
.hdr-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: var(--bg-input);
  border-top: 1px solid var(--border-color);
  width: 100%;
  order: 10;
  animation: slideDown 0.18s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hdr-search-input {
  flex: 1;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  color: var(--text-primary) !important;
  font-size: 0.9rem !important;
  padding: 4px 0 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  font-family: var(--font-sans) !important;
}

.hdr-search-clear {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
}

/* User info in header (desktop) */
.hdr-user {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
  margin-left: 4px;
}

.hdr-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 900;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(37,99,235,0.4);
}

.hdr-user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.hdr-user-name {
  font-weight: 800;
  font-size: 0.84rem;
  color: var(--text-primary);
  white-space: nowrap;
}

.hdr-user-role {
  font-size: 0.68rem;
  color: var(--accent-blue);
  font-weight: 700;
  white-space: nowrap;
}

.hdr-signin-btn {
  padding: 8px 18px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.84rem;
  cursor: pointer;
  font-family: var(--font-display);
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(37,99,235,0.35);
  transition: opacity 0.2s;
}
.hdr-signin-btn:hover { opacity: 0.88; }

/* ================================================================
   15. SIDEBAR — NEW DESIGN
================================================================ */
.app-sidebar {
  width: 270px;
  min-width: 270px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  padding: 16px 12px;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}

.sidebar-backdrop { display: none; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(37,99,235,0.4);
}

.sidebar-logo-text {
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  font-family: var(--font-display);
  color: var(--text-primary);
}

.sidebar-close-btn {
  display: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.sidebar-close-btn:hover { background: var(--bg-card-hover); color: var(--text-primary); }

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 13px;
  border-radius: 11px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  font-family: var(--font-display);
  cursor: pointer;
  text-align: start;
  width: 100%;
  position: relative;
  transition: all 0.15s ease;
}
.sidebar-item:hover:not(.active) {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}
.sidebar-item.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 4px 14px rgba(37,99,235,0.35);
}

.sidebar-item-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.sidebar-item.active .sidebar-item-icon,
.sidebar-item:hover .sidebar-item-icon { opacity: 1; }

.sidebar-item-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-item-pip {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.75);
  flex-shrink: 0;
}

.sidebar-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-logout { color: var(--color-danger) !important; }
.sidebar-logout:hover { background: var(--color-danger-bg) !important; }

.sidebar-signin { color: var(--accent-blue) !important; font-weight: 700 !important; }

.sidebar-academic {
  margin-top: 10px;
  padding: 12px 13px;
  border-radius: 12px;
  background: rgba(245,158,11,0.06);
  border: 1px solid rgba(245,158,11,0.18);
}

.sidebar-academic-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  font-size: 0.71rem;
  color: #f59e0b;
  font-family: var(--font-display);
  margin-bottom: 7px;
}

.sidebar-academic-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 0.71rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.sidebar-academic-year {
  color: #60a5fa;
  font-weight: 700;
  font-style: italic;
}

/* ================================================================
   16. BOTTOM NAV — MOBILE DOCK
================================================================ */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 220;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -4px 24px rgba(0,0,0,0.25);
  flex-direction: row;
  align-items: stretch;
  justify-content: space-around;
  padding: 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.bottom-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  min-height: 54px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px 4px;
  position: relative;
  transition: color 0.18s, background 0.18s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.bottom-nav-btn:active { transform: scale(0.93); transition: transform 0.1s; }

.bottom-nav-btn.active {
  color: var(--accent-blue);
}

/* Active indicator bar at top */
.bottom-nav-btn.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 2.5px;
  border-radius: 0 0 4px 4px;
  background: var(--accent-blue);
  box-shadow: 0 0 8px var(--accent-blue);
}

.bnb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s;
}
.bottom-nav-btn.active .bnb-icon { transform: translateY(-1px); }

.bnb-label {
  font-size: 0.6rem;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.02em;
  line-height: 1;
  white-space: nowrap;
}

.bnb-pip { display: none; }

/* ================================================================
   17. APP LAYOUT
================================================================ */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.app-main {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-width: 0;
}

/* ================================================================
   18. RESPONSIVE GRIDS
================================================================ */
.responsive-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.responsive-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.responsive-grid-2-1 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}
.responsive-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.responsive-profile-grid,
.profile-layout {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  gap: 20px;
  align-items: start;
}
.responsive-grid-3-col {
  display: grid;
  grid-template-columns: 210px 1fr 280px;
  gap: 20px;
  align-items: start;
}
.profile-tabs-sidebar,
.profile-tabs-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ================================================================
   19. LAPTOP — max-width: 1024px
================================================================ */
@media (max-width: 1024px) {
  .hamburger-btn  { display: flex; }
  .bottom-nav     { display: flex; }
  .hdr-user       { display: none; }
  .hdr-signin-btn { display: none; }

  /* Slide-in sidebar drawer */
  .app-sidebar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
    height: 100dvh !important;
    width: 280px !important;
    max-width: 88vw !important;
    z-index: 340 !important;
    transform: translateX(-100%) !important;
    box-shadow: 12px 0 48px rgba(0,0,0,0.55);
    padding: 20px 14px !important;
    border-right: 1px solid var(--border-color) !important;
    overflow-y: auto !important;
  }
  .app-sidebar.sidebar-open { transform: translateX(0) !important; }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 330;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .sidebar-close-btn { display: flex !important; }
  .app-header { height: auto; min-height: 60px; }

  .app-main {
    padding: 22px 20px 96px 20px;
  }

  /* Grid collapses */
  .responsive-grid-4        { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .responsive-grid-3        { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .responsive-grid-2-1      { grid-template-columns: 1fr; gap: 16px; }
  .responsive-grid-2        { grid-template-columns: 1fr; gap: 14px; }
  .responsive-profile-grid,
  .profile-layout,
  .responsive-grid-3-col    { grid-template-columns: 1fr !important; gap: 16px; }
  .profile-tabs-sidebar,
  .profile-tabs-col {
    flex-direction: row !important;
    overflow-x: auto !important;
    gap: 8px !important;
    padding-bottom: 6px !important;
    -webkit-overflow-scrolling: touch;
  }
  .profile-tab-btn {
    flex: 0 0 auto !important;
    white-space: nowrap !important;
    padding: 9px 14px !important;
    font-size: 0.8rem !important;
  }

  /* Auth modal */
  .auth-modal-card  { grid-template-columns: 1fr !important; max-width: 460px !important; }
  .auth-modal-banner { display: none !important; }

  /* Hide elements that are duplicated in bottom nav or sidebar */
  .dashboard-desktop-table  { display: none !important; }
  .dashboard-mobile-cards   { display: flex !important; }
  .scan-history-desktop-table { display: none !important; }
  .scan-history-mobile-cards  { display: flex !important; }
}

/* ================================================================
   20. TABLET — max-width: 768px
================================================================ */
@media (max-width: 768px) {
  .app-header { padding: 0 14px; }
  .app-main   { padding: 16px 14px 96px 14px; }

  .responsive-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .responsive-grid-3 { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .responsive-grid-2 { grid-template-columns: 1fr; gap: 12px; }

  .history-filter-bar    { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
  .history-date-row      { flex-wrap: wrap !important; }
  .history-filter-pills  { flex-wrap: wrap !important; }

  .email-result-top   { grid-template-columns: 1fr !important; }
  .email-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; }
  .email-metric-wide  { grid-column: span 2 !important; }
}

/* ================================================================
   21. MOBILE — max-width: 480px
================================================================ */
@media (max-width: 480px) {
  .app-header       { padding: 0 12px; height: 56px; min-height: 56px; }
  .app-main         { padding: 14px 12px 92px 12px; }
  .header-brand-page { display: none; }

  .responsive-grid-4    { grid-template-columns: repeat(2, 1fr) !important; gap: 8px; }
  .responsive-grid-3    { grid-template-columns: 1fr 1fr !important; gap: 8px; }
  .responsive-grid-2-1  { grid-template-columns: 1fr !important; gap: 12px; }
  .responsive-grid-2    { grid-template-columns: 1fr !important; gap: 10px; }

  /* Stat card tighter on small screen */
  .glass-panel { padding: 14px 16px !important; }

  /* Buttons */
  .dashboard-actions {
    flex-direction: column !important;
    width: 100% !important;
  }
  .dashboard-actions .btn-primary,
  .dashboard-actions .btn-secondary {
    width: 100% !important;
    justify-content: center !important;
  }

  /* Typography */
  h2 { font-size: clamp(1.15rem, 5vw, 1.5rem) !important; }
  h3 { font-size: 0.96rem !important; }

  /* Tables */
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table          { min-width: 480px; }

  /* Prevent iOS form zoom */
  input, select, textarea { font-size: 16px !important; }

  /* Bottom nav */
  .bottom-nav-btn { min-height: 50px; padding: 6px 2px; }
  .bnb-label      { font-size: 0.56rem; }

  /* Auth modal full width */
  .auth-page        { padding: 16px; align-items: flex-start; padding-top: 20px; }
  .auth-modal-card  { max-width: 100% !important; border-radius: 20px !important; }

  /* Profile */
  .profile-tabs-sidebar,
  .profile-tabs-col {
    flex-direction: row !important;
    overflow-x: auto !important;
    gap: 6px !important;
  }
  .profile-tab-btn {
    flex: 0 0 auto !important;
    padding: 7px 12px !important;
    font-size: 0.74rem !important;
  }

  /* Email metrics 2 cols */
  .email-metrics-grid { grid-template-columns: 1fr 1fr !important; gap: 8px; }
  .email-metric-wide  { grid-column: span 2 !important; }

  /* Sidebar full-width */
  .app-sidebar { max-width: calc(100vw - 56px) !important; }
}

/* ================================================================
   22. VERY SMALL — max-width: 360px
================================================================ */
@media (max-width: 360px) {
  .app-header    { padding: 0 10px; height: 52px; min-height: 52px; }
  .app-main      { padding: 12px 10px 86px 10px; }
  .responsive-grid-4 { grid-template-columns: 1fr 1fr !important; gap: 6px; }
  .glass-panel   { padding: 12px 13px !important; }
  .bnb-label     { display: none; }
  .bottom-nav-btn { min-height: 46px; }
}

"""

with open(r'C:\Users\Computer House\.gemini\antigravity\scratch\phishing-detection-system\client\src\index.css', 'w', encoding='utf-8') as f:
    f.write(''.join(base_lines))
    f.write(new_responsive_css)
    f.write(''.join(email_lines))

with open(r'C:\Users\Computer House\.gemini\antigravity\scratch\phishing-detection-system\client\src\index.css', 'r', encoding='utf-8') as f:
    final = f.readlines()
print(f'Final CSS: {len(final)} lines')
