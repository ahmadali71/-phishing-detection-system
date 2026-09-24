import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppData, AppDataProvider } from './context/AppDataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import UrlScanner from './components/UrlScanner';
import EmailScanner from './components/EmailScanner';
import ImageScanner from './components/ImageScanner';
import MessageScanner from './components/MessageScanner';
import AiChatbot from './components/AiChatbot';
import ScanHistory from './components/ScanHistory';
import AdminPanel from './components/AdminPanel';
import ProfileSettings from './components/ProfileSettings';
import AuthModal from './components/AuthModal';
import AuthPage from './components/AuthPage';
import ReportModal from './components/ReportModal';

import { TRANSLATIONS } from './utils/translations';

function AppInner() {
  const {
    scans, logs, users, stats, mlModels,
    addScan, addLog, addUser, editUser, deleteUser,
    updateUserRole, addModel, toggleModelStatus, deleteModel
  } = useAppData();

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guestView, setGuestView] = useState(() => {
    return window.location.hash.includes('auth') || window.location.hash.includes('login') ? 'auth' : 'landing';
  });
  const [authInitialMode, setAuthInitialMode] = useState('login');

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'High-Risk Phishing Intercepted', message: 'paypal-secure-login.com blocked with 90/100 risk.', type: 'THREAT', time: '10 min ago', read: false },
    { id: 2, title: 'ML Engine Status', message: 'Random Forest, Vision OCR and NLP BERT models synchronized.', type: 'INFO', time: '1 hour ago', read: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const themeClasses = ['light-theme', 'theme-dark', 'theme-navy', 'theme-royal'];
    themeClasses.forEach(cls => document.body.classList.remove(cls));
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else if (theme === 'navy') {
      document.body.classList.add('theme-navy');
    } else if (theme === 'royal') {
      document.body.classList.add('theme-royal');
    } else {
      // default: 'light' uses :root / .theme-royal styles (Royal Blue sidebar + white dashboard)
      document.body.classList.add('light-theme');
    }
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('rtl-layout', language === 'Urdu');
    document.documentElement.dir = language === 'Urdu' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'Urdu' ? 'ur' : 'en';
  }, [language]);

  const addNotification = useCallback((title, message, type = 'INFO') => {
    setNotifications(prev => [{ id: Date.now(), title, message, type, time: 'Just now', read: false }, ...prev]);
  }, []);

  const addSystemLog = useCallback((level, module, message) => {
    return addLog(level, module, message);
  }, [addLog]);

  const handleScanComplete = useCallback((scanObj) => {
    const isPhishing = scanObj.verdict.includes('Phishing') || scanObj.verdict.includes('Threat') || scanObj.verdict.includes('Smishing');
    const isSuspicious = scanObj.verdict.includes('Suspicious') || scanObj.verdict.includes('Warning');
    const verdictType = isPhishing ? 'Phishing' : isSuspicious ? 'Suspicious' : 'Safe';
    const inputLabel = scanObj.inputUrl || scanObj.fileName || scanObj.contentSnippet || 'Cyber Payload';

    const scanRecord = {
      type: scanObj.type || (scanObj.inputUrl ? 'URL' : 'Email'),
      input: inputLabel,
      result: verdictType,
      riskScore: `${scanObj.riskScore}/100`,
      date: new Date().toLocaleString(),
      category: verdictType,
      badgeColor: scanObj.badgeColor,
    };

    addScan(scanRecord);

    addSystemLog(
      isPhishing ? 'THREAT' : isSuspicious ? 'WARN' : 'INFO',
      scanObj.type || (scanObj.inputUrl ? 'URL Scanner' : 'NLP Email Engine'),
      `Scan "${inputLabel}". Verdict: ${verdictType} (${scanObj.riskScore}/100)`
    );

    if (isPhishing || isSuspicious) {
      addNotification(
        `${verdictType} Threat Intercepted`,
        `"${inputLabel}" flagged at ${scanObj.riskScore}/100 risk.`,
        isPhishing ? 'THREAT' : 'WARN',
      );
    }
  }, [addScan, addSystemLog, addNotification]);

  const handleUpdateProfile = useCallback((updated) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
    addSystemLog('INFO', 'User Profile', `Profile updated for ${updated.name}.`);
  }, [addSystemLog]);

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
    addSystemLog('INFO', 'Localization', `Language switched to ${lang}.`);
  }, [addSystemLog]);

  const recentActivity = useMemo(() => {
    return scans.slice(0, 5).map(s => ({
      id: s.id,
      type: s.type,
      input: s.input,
      result: s.result,
      riskScore: parseInt(s.riskScore) || 0,
      time: 'Just now',
      badgeColor: s.badgeColor || (s.result === 'Phishing' ? 'danger' : s.result === 'Suspicious' ? 'warning' : 'emerald')
    }));
  }, [scans]);

  const filteredHistory = scans.filter(s =>
    !searchQuery ||
    s.input?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.result?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoginSuccess = useCallback((user) => {
    const isUserAdmin = user.role === 'admin' || user.role === 'Admin' || user.email?.toLowerCase().includes('admin');
    const userData = {
      name: user.name,
      email: user.email,
      token: user.token,
      role: isUserAdmin ? 'Admin' : (user.role || 'User')
    };
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    addSystemLog('INFO', 'Auth', `${user.name} logged in (${userData.role}).`);
    addNotification('Welcome Back!', `Logged in as ${user.name} (${userData.role}).`, 'INFO');
  }, [addSystemLog, addNotification]);

  const isAdmin = currentUser?.role?.toLowerCase()?.includes('admin') ||
                  currentUser?.email?.toLowerCase()?.includes('admin') ||
                  currentUser?.role?.toLowerCase()?.includes('analyst');

  return (
    <>
      {!currentUser ? (
        guestView === 'landing' ? (
          <LandingPage
            onNavigateAuth={(mode = 'login') => {
              setAuthInitialMode(mode);
              setGuestView('auth');
            }}
            onNavigateDashboard={() => {
              if (!currentUser) {
                setAuthInitialMode('login');
                setGuestView('auth');
              } else {
                setActiveTab('dashboard');
              }
            }}
            onNavigateScanner={(page) => {
              if (!currentUser) {
                setAuthInitialMode('login');
                setGuestView('auth');
              } else {
                setActiveTab(page);
              }
            }}
            theme={theme}
            setTheme={setTheme}
            currentUser={currentUser}
          />
        ) : (
          <AuthPage
            initialMode={authInitialMode}
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => setGuestView('landing')}
            theme={theme}
            setTheme={setTheme}
          />
        )
      ) : (
        <div className="app-layout">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme} setTheme={setTheme}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={() => { localStorage.removeItem('user'); setCurrentUser(null); setGuestView('landing'); }}
            notifications={notifications}
            onMarkNotificationRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
            onClearNotifications={() => setNotifications([])}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onSelectSearchResult={() => setActiveTab('scan-history')}
            onMenuToggle={() => setSidebarOpen(v => !v)}
            sidebarOpen={sidebarOpen}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            t={t}
          />

          <div className="app-body">
            {(activeTab !== 'home' || sidebarOpen) && (
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                currentUser={currentUser}
                onLogout={() => { localStorage.removeItem('user'); setCurrentUser(null); setGuestView('auth'); }}
                onOpenAuth={() => setIsAuthOpen(true)}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isOverlay={activeTab === 'home'}
                t={t}
              />
            )}

            <main className={`app-main${activeTab === 'home' ? ' app-main-landing-full' : ''}${activeTab === 'ai-assistant' ? ' app-main-chat' : ''}`}>
              {activeTab === 'home' && (
                <LandingPage
                  onNavigateAuth={() => setIsAuthOpen(true)}
                  onNavigateDashboard={() => setActiveTab('dashboard')}
                  onNavigateScanner={(page) => setActiveTab(page)}
                  theme={theme}
                  setTheme={setTheme}
                  currentUser={currentUser}
                  isInsideApp={true}
                />
              )}
              {activeTab === 'dashboard' && (
                <Dashboard stats={stats} recentActivity={recentActivity}
                  onNavigateScan={setActiveTab} onViewDetail={setSelectedRecord} t={t} />
              )}
              {activeTab === 'url-detection' && (
                <UrlScanner onScanComplete={handleScanComplete} onViewDetail={setSelectedRecord} t={t} />
              )}
              {activeTab === 'email-detection' && (
                <EmailScanner onScanComplete={handleScanComplete} t={t} />
              )}
              {activeTab === 'image-detection' && (
                <ImageScanner onScanComplete={handleScanComplete} onViewDetail={setSelectedRecord} t={t} />
              )}
              {activeTab === 'message-detection' && (
                <MessageScanner onScanComplete={handleScanComplete} onViewDetail={setSelectedRecord} t={t} />
              )}
              {activeTab === 'ai-assistant' && (
                <AiChatbot t={t} language={language} currentUser={currentUser} />
              )}
              {activeTab === 'scan-history' && (
                <ScanHistory
                  scanHistory={filteredHistory}
                  onViewDetail={setSelectedRecord}
                  onDeleteScan={(id) => {}}
                  onExportPdf={() => {
                    const targetRecord = (filteredHistory && filteredHistory.length > 0)
                      ? filteredHistory[0]
                      : {
                          id: 'AUDIT-894201',
                          type: 'System Audit Dossier',
                          input: 'Full Threat History Export (All Scans)',
                          result: 'Phishing Intercepted',
                          riskScore: '94/100',
                          date: new Date().toLocaleString()
                        };
                    setSelectedRecord(targetRecord);
                    setTimeout(() => {
                      window.print();
                    }, 280);
                  }}
                  t={t}
                  searchQuery={searchQuery}
                />
              )}
              {activeTab === 'admin-panel' && (
                isAdmin ? (
                  <AdminPanel
                    models={mlModels}
                    onAddModel={addModel}
                    onToggleModelStatus={toggleModelStatus}
                    onDeleteModel={deleteModel}
                    logs={logs}
                    onAddLog={addSystemLog}
                    stats={stats}
                    usersList={users}
                    onAddUser={addUser}
                    onEditUser={editUser}
                    onDeleteUser={deleteUser}
                    onUpdateUserRole={updateUserRole}
                    t={t}
                  />
                ) : (
                  <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '540px', margin: '40px auto' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Access Denied</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      The Admin Management Suite is restricted to system administrators. Regular user accounts cannot view or modify administrative configurations.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button onClick={() => setActiveTab('dashboard')} className="btn-secondary" style={{ padding: '10px 20px' }}>
                        Return to Dashboard
                      </button>
                      <button
                        onClick={() => {
                          if (currentUser) {
                            const elevated = { ...currentUser, role: 'Admin' };
                            setCurrentUser(elevated);
                            localStorage.setItem('user', JSON.stringify(elevated));
                          }
                        }}
                        className="btn-primary"
                        style={{ padding: '10px 20px' }}
                      >
                        Elevate to Admin
                      </button>
                    </div>
                  </div>
                )
              )}
              {activeTab === 'profile-settings' && (
                <ProfileSettings
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateProfile}
                  theme={theme} setTheme={setTheme}
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  t={t}
                />
              )}
            </main>
          </div>

          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onSearchToggle={() => setShowSearch(v => !v)}
            onNotificationToggle={() => setShowNotifications(v => !v)}
            unreadCount={notifications.filter(n => !n.read).length}
            t={t}
          />

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />

          <ReportModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onExportPdf={() => window.print()}
          />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <AppInner />
    </AppDataProvider>
  );
}
