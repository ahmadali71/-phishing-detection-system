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
import ReportModal from './components/ReportModal';

import { TRANSLATIONS } from './utils/translations';

function AppInner() {
  const {
    scans, logs, users, stats, mlModels,
    addScan, addLog, addUser,
    updateUserRole, addModel, toggleModelStatus, deleteModel
  } = useAppData();

  const [theme, setTheme] = useState('dark');
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
  const [currentUser, setCurrentUser] = useState({
    name: 'Amna Najam',
    username: 'amna_najam',
    email: 'amnanajam2003@gmail.com',
    role: 'BS IT Student / Security Analyst',
    twoFactorAuth: true,
    loginAlerts: true,
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
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

  return (
    <div className="app-layout">
      <Header
        theme={theme} setTheme={setTheme}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
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
            />
          )}
          {activeTab === 'admin-panel' && (
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
        onSearchToggle={() => setShowSearch(v => !v)}
        onNotificationToggle={() => setShowNotifications(v => !v)}
        unreadCount={notifications.filter(n => !n.read).length}
        t={t}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          addSystemLog('INFO', 'Auth', `${user.name} logged in.`);
          addUser(user);
          addNotification('Welcome Back!', `Logged in as ${user.name}.`, 'INFO');
        }}
      />

      <ReportModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onExportPdf={() => window.print()}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <AppInner />
    </AppDataProvider>
  );
}
