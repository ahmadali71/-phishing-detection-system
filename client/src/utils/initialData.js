/**
 * Initial dataset pre-populated to match screenshots and test requirements from the FYP Report.
 * - Amna Najam [22BSIT30439] & Alisha Noor [22BSIT30434]
 * - Supervisor: Mam Shaista Ghafoor
 * - Dept of CS & IT, Govt Graduate College for Women / Univ of Sargodha
 */

export const INITIAL_STATS = {
  totalScans: 2568,
  phishingDetected: 642,
  safeItems: 1926,
  accuracyRate: 94.6
};

export const INITIAL_RECENT_ACTIVITY = [
  { id: 1, type: 'URL', input: 'paypal-secure-login.com', result: 'Phishing', riskScore: 90, time: '2 min ago', badgeColor: 'danger' },
  { id: 2, type: 'Email', input: 'Verify your account.eml', result: 'Suspicious', riskScore: 65, time: '15 min ago', badgeColor: 'warning' },
  { id: 3, type: 'URL', input: 'microsoft.com', result: 'Safe', riskScore: 10, time: '1 hour ago', badgeColor: 'emerald' },
  { id: 4, type: 'URL', input: 'secure-login.bank.com', result: 'Phishing', riskScore: 95, time: '3 hours ago', badgeColor: 'danger' },
  { id: 5, type: 'Email', input: 'Meeting schedule.eml', result: 'Safe', riskScore: 15, time: '5 hours ago', badgeColor: 'emerald' }
];

export const INITIAL_SCAN_HISTORY = [
  { id: 1, type: 'URL', input: 'paypal-secure-login.com', result: 'Phishing', riskScore: '90/100', date: '2026-05-15 10:30 AM', category: 'Phishing' },
  { id: 2, type: 'Email', input: 'Verify your account.eml', result: 'Suspicious', riskScore: '65/100', date: '2026-05-15 10:15 AM', category: 'Suspicious' },
  { id: 3, type: 'URL', input: 'microsoft.com', result: 'Safe', riskScore: '10/100', date: '2026-05-15 09:45 AM', category: 'Safe' },
  { id: 4, type: 'Email', input: 'Meeting schedule.eml', result: 'Safe', riskScore: '15/100', date: '2026-05-14 04:20 PM', category: 'Safe' },
  { id: 5, type: 'URL', input: 'secure-login.bank.com', result: 'Phishing', riskScore: '95/100', date: '2026-05-14 03:10 PM', category: 'Phishing' },
  { id: 6, type: 'URL', input: 'apple-id-verify.org', result: 'Phishing', riskScore: '88/100', date: '2026-05-14 01:25 PM', category: 'Phishing' },
  { id: 7, type: 'Email', input: 'Urgent Tax Refund Claim.eml', result: 'Phishing', riskScore: '92/100', date: '2026-05-13 11:05 AM', category: 'Phishing' },
  { id: 8, type: 'URL', input: 'github.com', result: 'Safe', riskScore: '05/100', date: '2026-05-13 09:12 AM', category: 'Safe' }
];

export const INITIAL_ML_MODELS = [
  { id: 'M-01', name: 'Random Forest Phishing Classifier', type: 'Supervised ML', accuracy: '96.2%', status: 'Active', framework: 'Scikit-Learn', date: '2026-04-10' },
  { id: 'M-02', name: 'Support Vector Machine (SVM) URL Model', type: 'Classification', accuracy: '94.8%', status: 'Active', framework: 'Scikit-Learn', date: '2026-04-12' },
  { id: 'M-03', name: 'NLP DistilBERT Email Intent Analyzer', type: 'Deep Learning', accuracy: '97.5%', status: 'Active', framework: 'PyTorch / HuggingFace', date: '2026-05-01' },
  { id: 'M-04', name: 'Logistic Regression Baseline', type: 'Linear Model', accuracy: '89.1%', status: 'Standby', framework: 'Scikit-Learn', date: '2026-03-15' }
];

export const INITIAL_SYSTEM_LOGS = [
  { id: 101, timestamp: '2026-08-12 08:35:12', level: 'INFO', module: 'API Gateway', message: 'User amna_najam submitted URL scan request for paypal-secure-login.com' },
  { id: 102, timestamp: '2026-08-12 08:35:13', level: 'WARN', module: 'Feature Extractor', message: 'Raw IP and typosquatting pattern detected in host domain' },
  { id: 103, timestamp: '2026-08-12 08:35:13', level: 'THREAT', module: 'ML Classifier', message: 'Phishing verdict returned with score 90/100 (Model M-01)' },
  { id: 104, timestamp: '2026-08-12 08:32:00', level: 'INFO', module: 'NLP Engine', message: 'Processed email text snippet, 3 urgency keywords identified' },
  { id: 105, timestamp: '2026-08-12 08:20:44', level: 'INFO', module: 'Auth Service', message: 'User alisha_noor authenticated successfully via web interface' }
];

export const CHATBOT_KNOWLEDGE_BASE = [
  {
    keywords: ['why', 'flagged', 'paypal', 'bank'],
    answer: 'The system flags URLs or emails when they contain indicators such as fake subdomains, raw IP hostnames, missing SSL certificates, domain age under 60 days, or urgent financial phishing keywords.'
  },
  {
    keywords: ['accuracy', 'model', 'reliable'],
    answer: 'Our Automated Phishing Detection System achieves a 94.6% high detection accuracy rate by combining Random Forest, SVM lexical analysis, and NLP BERT deep learning models trained on PhishTank and Enron datasets.'
  },
  {
    keywords: ['typosquatting', 'spelling', 'spoofing'],
    answer: 'Typosquatting is a technique where attackers register misspelled domain names (e.g., paypa1.com or micros0ft.com) to deceive users. Our lexical extraction module automatically detects character substitution.'
  },
  {
    keywords: ['report', 'export', 'pdf'],
    answer: 'You can export scan reports in PDF format by clicking the "Export PDF" button on the Scan History screen or directly from any URL/Email analysis result panel.'
  },
  {
    keywords: ['help', 'hi', 'hello', 'features'],
    answer: 'Hello! I am your AI Phishing Awareness Assistant. I can explain why a link or email was flagged, describe phishing attack vectors, and guide you on cybersecurity best practices!'
  }
];
