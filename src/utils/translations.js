/**
 * Internationalization (i18n) Translation Dictionary
 * Full support for English and Urdu (اردو) across APDS
 */

export const TRANSLATIONS = {
  English: {
    // Nav
    dashboard: 'Dashboard',
    urlDetection: 'URL Detection',
    emailDetection: 'Email Detection',
    aiAssistant: 'AI Assistant',
    scanHistory: 'Scan History',
    adminPanel: 'Admin Panel',
    profileSettings: 'Profile & Settings',
    logout: 'Logout',
    loginRegister: 'Login / Register',

    // Academic Branding
    projectTitle: 'Automated Phishing Detection System',
    deptTitle: 'Govt Graduate College for Women & Dept of CS & IT, University of Sargodha',
    authors: 'Authors: Amna Najam & Alisha Noor',
    supervisor: 'Supervisor: Mam Shaista Ghafoor',

    // Dashboard
    realtimeDashboard: 'Real-Time Security Dashboard',
    heroTitle: 'Automated Phishing Threat Monitoring',
    heroSubtitle: 'Multi-layered ML & NLP analysis pipeline protecting web users against domain typosquatting, email social engineering, and fraudulent links.',
    scanUrlNow: 'Scan URL Now',
    analyzeEmail: 'Analyze Email',

    // Stats
    totalScans: 'Total Scans',
    phishingDetected: 'Phishing Detected',
    safeItems: 'Safe Items',
    modelAccuracy: 'Model Accuracy',
    weeklyThreats: 'Threats Detected (This Week)',
    threatCategories: 'Threat Categories',
    recentActivity: 'Recent Activity',

    // Scanner
    urlScannerTitle: 'URL Phishing Detection',
    urlScannerDesc: 'Analyze any website link in real time to detect typosquatting, raw IP hosting, SSL anomalies, and blacklisted domains.',
    enterUrlPlaceholder: 'e.g. https://paypal-secure-login.com or https://google.com',
    analyzeBtn: 'Analyze',
    scanningBtn: 'Scanning...',

    emailScannerTitle: 'Email Phishing Detection',
    emailScannerDesc: 'Scans email content for manufactured urgency, deceptive links, financial harvesting phrasing, and malicious attachments.',
    pasteTab: 'Paste Email Content',
    uploadTab: 'Upload .eml File',
    emailPlaceholder: 'Paste suspicious email text, headers, or message body here...',
    analyzeEmailBtn: 'Analyze Email Text',

    // Chatbot
    chatbotTitle: 'AI Security Assistant & Live Scanner',
    chatbotDesc: 'Interactive conversational AI. Ask cybersecurity questions or paste links and email text directly for instant security analysis.',
    chatPlaceholder: 'Type a question or paste a URL / email text to analyze live...',

    // History
    historyTitle: 'Scan History & Security Reports',
    exportPdf: 'Export PDF Report',
    searchPlaceholder: 'Search by URL domain or email title...',
    testPresets: 'Test Presets:',

    // URL Scanner
    urlScannerTitle: 'URL Phishing Detection',
    urlScannerDesc: 'Analyze any website link in real time to detect typosquatting, raw IP hosting, SSL anomalies, and blacklisted domains.',
    urlScanError: 'Please enter or paste a valid URL to analyze.',
    urlAnalysisTitle: 'URL Analysis Details',
    urlPhishingMsg: 'This URL is malicious and may harm your device or steal your information.',
    urlSafeMsg: 'This URL passed security validation checks and appears clean.',
    urlRecommendation: 'Do not visit this URL. Report to your administrator.',

    // Email Scanner
    emailScannerTitle: 'Email Phishing Detection',
    emailScannerDesc: 'Scans email content for manufactured urgency, deceptive links, financial harvesting phrasing, and malicious attachments.',
    emailScanError: 'Please enter email content to analyze.',
    fileScanError: 'Please upload a valid .eml file to analyze.',
    emailAnalysisTitle: 'Email Analysis',
    emailResultDesc: 'This email contains suspicious patterns and links.',
    emailRecommendation: 'Be cautious. Do not click on links or download attachments.',
    result: 'Result',
    // URL Scanner detail labels
    domainAge: 'ڈومین کی عمر',
    ipAddress: 'آی پی ایڈریس',
    sslCertificate: 'ایس ایس ایل سرٹیفکیٹ',
    redirectCount: 'ری ڈائریکٹ کاؤنٹ',
    blacklistStatus: 'بلیک لسٹ کی حیثیت',
    hostingRisk: 'ہوسٹنگ کا خطرہ',
    highRisk: 'high risk',
    mediumRisk: 'medium risk',
    lowRisk: 'low risk',

    // Settings
    settingsTitle: 'Profile & Security Settings',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    emailAddr: 'Email Address',
    roleTitle: 'Role / Title',
    securityControls: 'Security & Authentication Controls',
    changePassword: 'Change Password',
    changePasswordDesc: 'Update your account password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    updatePassword: 'Update Password',
    twoFactor: 'Two-Factor Authentication (2FA)',
    twoFactorDesc: 'Add an extra layer of security',
    loginAlerts: 'Suspicious Login Alerts',
    loginAlertsDesc: 'Get notified about new sign-ins',
    systemPrefs: 'System Preferences',
    darkTheme: 'Dark Theme',
    darkThemeLabel: 'Dark',
    lightTheme: 'Light',
    oceanTheme: 'Ocean',
    purpleTheme: 'Purple',
    emeraldTheme: 'Emerald',
    royalTheme: 'Royal Blue',
    languageLabel: 'System Language',
    saveChanges: 'Save Changes',
    editProfile: 'Edit Profile',
    savedMessage: 'Profile settings updated successfully!',
    accountStatus: 'Account Status',
    accountSecure: 'Your account is secure',
    emailNotifications: 'Email Notifications',
    profileTab: 'Profile',
    changePasswordTab: 'Change Password',
    twoFactorTab: 'Two Factor Auth',
    notificationsTab: 'Notifications',
    privacyTab: 'Privacy Settings',
    themeTab: 'Theme Settings'
  },

  Urdu: {
    // Nav
    dashboard: 'ڈیش بورڈ',
    urlDetection: 'یو آر ایل جانچ',
    emailDetection: 'ای میل جانچ',
    aiAssistant: 'مصنوعی ذہانت اسسٹنٹ',
    scanHistory: 'اسکین ہسٹری',
    adminPanel: 'ایڈمن پینل',
    profileSettings: 'پروفائل ترتیبات',
    logout: 'لاگ آؤٹ',
    loginRegister: 'لاگ ان / اکاؤنٹ بنائیں',

    // Academic Branding
    projectTitle: 'خودکار فِشنگ کی نشاندہی کا نظام',
    deptTitle: 'گورنمنٹ گریجویٹ کالج برائے خواتین و شعبہ کمپیوٹر سائنس، یونیورسٹی آف سرگودھا',
    authors: 'مصنفین: آمنہ نجم اور علیشہ نور',
    supervisor: 'نگران: میڈم شائستہ غفور',

    // Dashboard
    realtimeDashboard: 'ریئل ٹائم سیکیورٹی ڈیش بورڈ',
    heroTitle: 'خودکار فِشنگ خطرات کی نگرانی',
    heroSubtitle: 'مشین لرننگ اور این ایل پی سیکیورٹی سسٹم جو صارفین کو آن لائن دھوکہ دہی، نقلی ویب سائٹس اور مشکوک ای میلز سے محفوظ رکھتا ہے۔',
    scanUrlNow: 'لنک کی جانچ کریں',
    analyzeEmail: 'ای میل کا تجزیہ کریں',

    // Stats
    totalScans: 'کل اسکینز',
    phishingDetected: 'شناخت شدہ فِشنگ',
    safeItems: 'محفوظ لنکس',
    modelAccuracy: 'ماڈل کی درستگی',
    weeklyThreats: 'اس ہفتے کے خطرات',
    threatCategories: 'خطرات کی قسمیں',
    recentActivity: 'حالیہ سرگرمی',

    // Scanner
    urlScannerTitle: 'یو آر ایل فِشنگ کی نشاندہی',
    urlScannerDesc: 'کسی بھی ویب سائٹ کے لنک کی ریئل ٹائم جانچ کریں تاکہ نقلی ڈومینز اور بلیک لسٹ لنکس کا پتہ لگایا جا سکے۔',
    enterUrlPlaceholder: 'مثال: https://paypal-secure-login.com یا https://google.com',
    analyzeBtn: 'تجزیہ کریں',
    scanningBtn: 'جانچ جاری ہے...',

    emailScannerTitle: 'ای میل فِشنگ کی نشاندہی',
    emailScannerDesc: 'ای میل کے متن، جعلی پیغامات اور مشکوک فائل اٹیچمنٹس کی این ایل پی کے ذریعے جانچ کریں۔',
    pasteTab: 'ای میل کا متن پیسٹ کریں',
    uploadTab: 'ای میل فائل اپ لوڈ کریں',
    emailPlaceholder: 'مشکوک ای میل کا متن یہاں درج کریں...',
    analyzeEmailBtn: 'ای میل کا تجزیہ کریں',

    // Chatbot
    chatbotTitle: 'سیکیورٹی اسسٹنٹ اور لائیو اسکینر',
    chatbotDesc: 'مصنوعی ذہانت اسسٹنٹ سے سیکیورٹی سوالات پوچھیں یا براہ راست لنک پیسٹ کر کے اسکین کریں۔',
    chatPlaceholder: 'سوال پوچھیں یا تجزیہ کے لیے لنک پیسٹ کریں...',

    // History
    historyTitle: 'اسکین ہسٹری اور سیکیورٹی رپورٹس',
    exportPdf: 'پی ڈی ایف رپورٹ ایکسپورٹ کریں',
    searchPlaceholder: 'یو آر ایل یا ای میل تلاش کریں...',
    testPresets: 'ٹیسٹ پری سیٹ:',

    // URL Scanner
    urlScannerTitle: 'یو آر ایل فِشنگ کی نشاندہی',
    urlScannerDesc: 'کسی بھی ویب سائٹ کے لنک کی ریئل ٹائم جانچ کریں تاکہ نقلی ڈومینز اور بلیک لسٹ لنکس کا پتہ لگایا جا سکے۔',
    urlScanError: 'براہ کرم جانچ کے لیے درست یو آر ایل درج کریں۔',
    urlAnalysisTitle: 'یو آر ایل تجزیہ کی تفصیلات',
    urlPhishingMsg: 'یہ یو آر ایل مضر ہے اور آپ کے ڈیوائس کو نقصان پہنچا سکتا ہے یا آپ کی معلومات چر سکتا ہے۔',
    urlSafeMsg: 'یہ یو آر ایل سیکیورٹی تصدیق کے معیار پر پورا اترتا ہے اور صاف لگتا ہے۔',
    urlRecommendation: 'اس یو آر ایل پر نہ جائیں۔ اپنے منتظم کی رپورٹ کریں۔',

    // Email Scanner
    emailScannerTitle: 'ای میل فِشنگ کی نشاندہی',
    emailScannerDesc: 'ای میل کے متن، جعلی پیغامات اور مشکوک فائل اٹیچمنٹس کی این ایل پی کے ذریعے جانچ کریں۔',
    emailScanError: 'براہ کرم تجزیہ کے لیے ای میل کا مواد درج کریں۔',
    fileScanError: 'براہ کرم درست .eml فائل اپ لوڈ کریں۔',
    emailAnalysisTitle: 'ای میل کا تجزیہ',
    emailResultDesc: 'اس ای میل میں مشکوک پیٹرن اور لنکس ہیں۔',
    emailRecommendation: 'احتیاط کریں۔ لنکس پر کلک نہ کریں یا اٹیچمنٹس ڈاؤنلوڈ نہ کریں۔',
    result: 'نتیجہ',
    recommendation: 'توصیہ',

    // URL Scanner detail labels
    domainAge: 'ڈومین کی عمر',
    ipAddress: 'آی پی ایڈریس',
    sslCertificate: 'ایس ایس ایل سرٹیفکیٹ',
    redirectCount: 'ری ڈائریکٹ کاؤنٹ',
    blacklistStatus: 'بلیک لسٹ کی حیثیت',
    hostingRisk: 'ہوسٹنگ کا خطرہ',

    // Settings
    settingsTitle: 'پروفائل اور سیکیورٹی ترتیبات',
    personalInfo: 'ذاتی معلومات',
    fullName: 'پورا نام',
    emailAddr: 'ای میل ایڈریس',
    roleTitle: 'عہدہ / کردار',
    securityControls: 'سیکیورٹی اور تصدیق ترتیبات',
    changePassword: 'پاس ورڈ تبدیل کریں',
    changePasswordDesc: 'اپنا اکاؤنٹ پاس ورڈ اپڈیٹ کریں',
    currentPassword: 'موجودہ پاس ورڈ',
    newPassword: 'نیا پاس ورڈ',
    updatePassword: 'پاس ورڈ اپڈیٹ کریں',
    twoFactor: 'ٹو فیکٹر تصدیق (2FA)',
    twoFactorDesc: 'سیکیورٹی کے لیے ایک extra لےئر',
    loginAlerts: 'لاگ ان الرٹس',
    loginAlertsDesc: 'نئے سائن ان کے بارے میں مطلع کریں',
    systemPrefs: 'سسٹم کی ترتیبات',
    darkTheme: 'ڈارک تھیم',
    darkThemeLabel: 'ڈارک',
    lightTheme: 'لائٹ',
    oceanTheme: 'اوشیان',
    purpleTheme: 'پیرپل',
    emeraldTheme: 'ایمرلڈ',
    royalTheme: 'رویل بلیو',
    languageLabel: 'سسٹم کی زبان',
    saveChanges: 'تبدیلیاں محفوظ کریں',
    editProfile: 'پروفائل میں ترمیم',
    savedMessage: 'پروفائل کی ترتیبات کامیابی سے اپڈیٹ ہو گئیں!',
    accountStatus: 'اکاؤنٹ کی حالت',
    accountSecure: 'آپ کا اکاؤنٹ محفوظ ہے',
    emailNotifications: 'ای میل اطلاعات',
    profileTab: 'پروفائل',
    changePasswordTab: 'پاس ورڈ تبدیل',
    twoFactorTab: 'ٹو فیکٹر',
    notificationsTab: 'اطلاعات',
    privacyTab: 'رازداری ترتیبات',
    themeTab: 'تھیم ترتیبات'
  }
};
