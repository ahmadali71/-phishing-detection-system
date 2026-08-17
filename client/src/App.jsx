import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppData, AppDataProvider } from './context/AppDataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import UrlScanner from './components/UrlScanner';
import EmailScanner from './components/EmailScanner';
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
    addScan, addLog, addUser,
    updateUserRole, addModel, toggleModelStatus, deleteModel
  } = useAppData();

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'High-Risk Phishing Intercepted', message: 'paypal-secure-login.com blocked with 90/100 risk.', type: 'THREAT', time: '10 min ago', read: false },
    { id: 2, title: 'ML Engine Status', message: 'Random Forest and NLP BERT models synchronized.', type: 'INFO', time: '1 hour ago', read: false },
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
    const themeClasses = ['light-theme', 'theme-ocean', 'theme-purple', 'theme-emerald', 'theme-royal'];
    themeClasses.forEach(cls => document.body.classList.remove(cls));
    if (theme !== 'dark') {
      const map = { light: 'light-theme', ocean: 'theme-ocean', purple: 'theme-purple', emerald: 'theme-emerald', royal: 'theme-royal' };
      if (map[theme]) document.body.classList.add(map[theme]);
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
    const isPhishing = scanObj.verdict.includes('Phishing');
    const isSuspicious = scanObj.verdict.includes('Suspicious');
    const verdictType = isPhishing ? 'Phishing' : isSuspicious ? 'Suspicious' : 'Safe';
    const inputLabel = scanObj.inputUrl || scanObj.fileName || scanObj.contentSnippet || 'Email Text';

    const scanRecord = {
      type: scanObj.inputUrl ? 'URL' : 'Email',
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
      scanObj.inputUrl ? 'URL Scanner' : 'NLP Email Engine',
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

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.email?.toLowerCase().includes('admin');

  return (
    <>
      {!currentUser ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="app-layout">
          <Header
            activeTab={activeTab}
            theme={theme} setTheme={setTheme}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={() => { localStorage.removeItem('user'); setCurrentUser(null); }}
            notifications={notifications}
            onMarkNotificationRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
            onClearNotifications={() => setNotifications([])}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onSelectSearchResult={() => setActiveTab('scan-history')}
            onMenuToggle={() => setSidebarOpen(v => !v)}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            t={t}
          />

          <div className="app-body">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              onLogout={() => { localStorage.removeItem('user'); setCurrentUser(null); }}
              onOpenAuth={() => setIsAuthOpen(true)}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              t={t}
            />

            <main className="app-main">
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
              {activeTab === 'ai-assistant' && (
                <AiChatbot t={t} language={language} />
              )}
              {activeTab === 'scan-history' && (
                <ScanHistory
                  scanHistory={filteredHistory}
                  onViewDetail={setSelectedRecord}
                  onDeleteScan={(id) => {}}
                  onExportPdf={() => window.print()}
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
                    <button onClick={() => setActiveTab('dashboard')} className="btn-primary" style={{ padding: '10px 24px' }}>
                      Return to Dashboard
                    </button>
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
