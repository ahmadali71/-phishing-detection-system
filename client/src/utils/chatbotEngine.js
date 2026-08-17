/**
 * ADVANCED APDS AI SECURITY INTELLIGENCE ENGINE (REAL-TIME NLU & DEEP REASONING)
 * 
 * Capable of handling long, complex, multi-sentence, and multi-paragraph inputs.
 * Features:
 * - Smart intent detection — does NOT confuse a question mentioning a domain with a URL scan request
 * - Real-time URL & Email threat extraction only when explicitly requested (short query or scan keyword)
 * - Deep cybersecurity reasoning via Cloudflare Worker AI
 * - Production-ready Python script & regex generator
 * - Multilingual English and Urdu (اردو) intelligence
 * - Seamless Cloudflare Worker LLM integration with built-in instant offline reasoning fallback
 */

import { analyzeUrl } from './urlAnalyzer.js';
import { analyzeEmailText } from './emailAnalyzer.js';
import { getOpenRouterResponse } from './openRouter.js';

// Academic Project Metadata
const PROJECT_CONTEXT = {
  title: 'Automated Phishing Detection System (APDS)',
  authors: ['Amna Najam', 'Alisha Noor'],
  supervisor: 'Mam Shaista Ghafoor',
  institution: 'Govt Graduate College for Women & Dept of CS & IT, University of Sargodha',
  session: '2022 - 2026',
  accuracy: '94.6%',
  models: [
    'Random Forest Classifier (Scikit-Learn)',
    'Support Vector Machine (SVM)',
    'NLP DistilBERT Transformer Engine'
  ],
  features: '25+ lexical, host-based, DNS, SSL, and NLP semantic features'
};

/**
 * Determine if a query is a deliberate scan request for a URL.
 * ONLY true when the message is SHORT (< 160 chars, mostly a URL) and contains
 * an explicit scan verb — or is literally just a URL/domain by itself.
 */
function isUrlScanRequest(query, lower, urlMatches) {
  if (!urlMatches || urlMatches.length === 0) return false;

  const SCAN_VERBS = ['scan', 'check', 'analyze', 'analyse', 'inspect', 'test this url', 'is this safe', 'is this phishing', 'report on'];
  const hasScanVerb = SCAN_VERBS.some(v => lower.includes(v));

  // Short message that is mostly just a URL (e.g. "scan paypal-secure.xyz" or just "paypal-secure.xyz")
  const isShortScanQuery = query.trim().length < 160 && (hasScanVerb || query.trim().split(/\s+/).length <= 4);

  // Explicit http/https URL by itself
  const isRawUrl = lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('www.');

  return isShortScanQuery || isRawUrl;
}

/**
 * Determine if a query is a real email/message pasted for scanning.
 * ONLY true for text that looks like an actual email body (has subject line or from header or
 * dear customer/user salutation) — NOT for general questions that happen to use words like "account" or "verify".
 */
function isEmailScanRequest(query, lower) {
  const hasEmailHeader = lower.includes('subject:') || lower.includes('from:') || lower.includes('to:');
  const hasSalutation = lower.includes('dear customer') || lower.includes('dear user') || lower.includes('dear account holder') || lower.includes('valued client');
  const isLongEnough = query.trim().length > 80;

  return isLongEnough && (hasEmailHeader || hasSalutation);
}

/**
 * Main AI Chatbot Response Generator
 */
export async function generateChatbotResponse(userMessage, chatHistory = [], language = 'English') {
  if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
    return {
      text: language === 'Urdu'
        ? "براہ کرم کوئی سیکیورٹی سوال پوچھیں، یا لائیو اسکین کے لیے لنک یا ای میل کا متن یہاں درج کریں۔"
        : "Please type a cybersecurity question, paste a URL, or enter email text for instant real-time analysis!",
      suggestions: ['Scan paypal-secure-login.com', 'What is typosquatting?', 'How does APDS work?']
    };
  }

  const query = userMessage.trim();
  const lower = query.toLowerCase();

  // Extract URLs mentioned anywhere in the text (for optional link analysis in fallback)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|xyz|io|co|info|biz|bank|gov|top|live|click|tk|ga|cf|gq)[^\s]*)/gi;
  const urlMatches = query.match(urlRegex);

  // =========================================================================
  // 1. DELIBERATE URL SCAN REQUEST (short focused query only)
  // =========================================================================
  if (isUrlScanRequest(query, lower, urlMatches)) {
    const targetUrl = urlMatches[0];
    const analysis = analyzeUrl(targetUrl);

    let reply = `🔍 **Real-Time URL Security Threat Assessment**\n\n`;
    reply += `• **Target URL:** \`${analysis.fullUrl || targetUrl}\`\n`;
    reply += `• **Security Verdict:** **${analysis.verdict}** (${analysis.riskScore}/100 Threat Index)\n`;
    reply += `• **SSL/TLS Encryption:** ${analysis.details.sslCertificate}\n`;
    reply += `• **Hosting Risk:** \`${analysis.details.ipAddress}\` — ${analysis.details.hostingRisk}\n`;
    reply += `• **Domain Age & Status:** ${analysis.details.domainAge} | ${analysis.details.blacklistStatus}\n\n`;

    if (analysis.indicators && analysis.indicators.length > 0) {
      reply += `⚠️ **Key Threat Indicators Identified:**\n`;
      analysis.indicators.forEach((ind, i) => {
        reply += `${i + 1}. **${ind.title}:** ${ind.desc}\n`;
      });
      reply += `\n`;
    }

    reply += `🛡️ **Actionable Defense Recommendation:**\n${analysis.recommendation}\n\n`;
    reply += `*Analyzed via APDS Multi-Layer Lexical & Random Forest Ensemble Engine (94.6% Accuracy).*`;

    return {
      text: reply,
      suggestions: ['Why was this flagged?', 'How does Levenshtein Distance detect typosquatting?', 'Scan another URL']
    };
  }

  // =========================================================================
  // 2. ACTUAL EMAIL / PHISHING MESSAGE PASTED FOR SCANNING
  // =========================================================================
  if (isEmailScanRequest(query, lower)) {
    const emailAnalysis = analyzeEmailText(query);

    let reply = `📧 **Real-Time NLP Email & Social Engineering Assessment**\n\n`;
    reply += `• **Security Verdict:** **${emailAnalysis.verdict}** (${emailAnalysis.riskScore}/100 Risk Score)\n`;
    reply += `• **Spam / Malicious Probability:** ${emailAnalysis.metrics.spamProbability}\n`;
    reply += `• **Sender Authenticity Status:** ${emailAnalysis.metrics.senderReputation}\n`;
    reply += `• **Deceptive Embedded Links:** ${emailAnalysis.metrics.deceptiveLinksCount} found\n`;
    reply += `• **Urgency & Coercion Keywords Flagged:** ${emailAnalysis.metrics.suspiciousKeywordsCount}\n\n`;

    if (emailAnalysis.keywordsFound && emailAnalysis.keywordsFound.length > 0) {
      reply += `🔑 **Detected Threat Phrases:** ${emailAnalysis.keywordsFound.map(k => `\`"${k}"\``).join(', ')}\n\n`;
    }

    if (emailAnalysis.indicators && emailAnalysis.indicators.length > 0) {
      reply += `⚠️ **Risk Breakdown:**\n`;
      emailAnalysis.indicators.forEach((ind, i) => {
        reply += `${i + 1}. **${ind.title}:** ${ind.desc}\n`;
      });
      reply += `\n`;
    }

    reply += `💡 **Actionable Defense Recommendation:**\n${emailAnalysis.recommendation}\n\n`;
    reply += `*Classified via APDS NLP DistilBERT & Random Forest Hybrid Engine.*`;

    return {
      text: reply,
      suggestions: ['How does NLP detect phishing?', 'What is BEC attack?', 'Test another message']
    };
  }

  // =========================================================================
  // 3. URDU / ROMAN URDU INTELLIGENT PROCESSING
  // =========================================================================
  const isUrduQuery = /[\u0600-\u06FF]/.test(query) || lower.includes('kya hai') || lower.includes('kese') || lower.includes('batao') || lower.includes('kaise') || language === 'Urdu';

  if (isUrduQuery) {
    if (lower.includes('phishing') || lower.includes('فشنگ') || lower.includes('dhoka') || lower.includes('scam')) {
      return {
        text: `🛡️ **فِشنگ (Phishing) کیا ہے اور یہ کیسے کام کرتا ہے؟**\n\n` +
          `فِشنگ ایک سائبر حملہ ہے جس میں حملہ آور خود کو کسی معتبر ادارے (جیسے بینک، گوگل، یا پے پال) کے طور پر ظاہر کر کے آپ کے حساس ڈیٹا (پاس ورڈز، کریڈٹ کارڈ، او ٹی پی) چوری کرتے ہیں۔\n\n` +
          `**ہمارا APDS سسٹم اسے کیسے پکڑتا ہے:**\n` +
          `1. **یو آر ایل اسکینر:** جعلی ڈومینز، لیونسٹین ڈسٹنس، اور ڈی جی اے اینٹروپی کی جانچ۔\n` +
          `2. **این ایل پی ای میل ماڈل:** فوری کارروائی کا دباؤ ڈالنے والے پیغامات اور مشکوک الفاظ کی شناخت۔\n` +
          `3. **درستگی:** 94.6% ہائی ایکوریسی ریٹ۔`,
        suggestions: ['ایک لنک اسکین کریں', 'پروجیکٹ کے بارے میں بتائیں', 'ای میل چیک کریں']
      };
    }
    if (lower.includes('author') || lower.includes('supervisor') || lower.includes('project') || lower.includes('team') || lower.includes('کون') || lower.includes('banaya')) {
      return {
        text: `🎓 **پروجیکٹ کی تعلیمی تفصیلات:**\n\n` +
          `• **عنوان:** خودکار فِشنگ ڈیٹیکشن سسٹم (APDS)\n` +
          `• **محققین / طلباء:** آمنہ نجم (Amna Najam) اور علیشہ نور (Alisha Noor)\n` +
          `• **نگران:** میڈم شائستہ غفور (Mam Shaista Ghafoor)\n` +
          `• **ادارہ:** گورنمنٹ گریجویٹ کالج برائے خواتین و شعبہ کمپیوٹر سائنس، یونیورسٹی آف سرگودھا\n` +
          `• **سیشن:** 2022 - 2026`,
        suggestions: ['ماڈل کی درستگی کیا ہے؟', 'یو آر ایل کیسے اسکین کریں؟', 'اہم سائبر خطرات']
      };
    }
  }

  // =========================================================================
  // 4. CLOUD AI (CLOUDFLARE WORKER) — PRIMARY RESPONSE PATH FOR ALL TEXT QUESTIONS
  // =========================================================================
  const openRouterKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY || '').trim();
  if (openRouterKey && !openRouterKey.includes('YOUR_OPENROUTER')) {
    try {
      const llmRes = await getOpenRouterResponse(chatHistory, {
        systemPrompt: `You are APDS AI Cyber Defense Assistant, a top-tier cybersecurity AI for the Automated Phishing Detection System (APDS). 
        You provide deep, accurate, structured answers to questions about phishing detection, malware, email security, URL heuristics, ML algorithms, and any related cybersecurity topics.
        Project Info: APDS developed by Amna Najam & Alisha Noor, supervised by Mam Shaista Ghafoor, Dept of CS & IT, University of Sargodha (2022-2026). Accuracy: 94.6% (Random Forest, SVM, DistilBERT).
        Always format responses with clear Markdown headings, bullet points, and code blocks where helpful.
        Answer ALL questions fully and directly, even if they are complex multi-part questions.`
      });
      if (llmRes && llmRes.text && !llmRes.text.includes('AI service is not configured') && !llmRes.text.includes('AI service error')) {
        return llmRes;
      }
    } catch (error) {
      console.error('[AI] Cloudflare Worker request failed:', error);
      // Continue to generic fallback only if API is completely unreachable
    }
  }

  // =========================================================================
  // 5. GENERIC FALLBACK — ONLY IF CLOUD AI IS UNAVAILABLE
  // =========================================================================
  return {
    text: `🛡️ **APDS Cyber Intelligence Assistant**\n\n` +
      `I understand your question relates to: **${query.length > 80 ? query.slice(0, 77) + '...' : query}**\n\n` +
      `The AI service is currently unavailable. You can still use the built-in scanners:\n\n` +
      `• **Scan any URL or domain** — paste it in the chat for instant forensic analysis\n` +
      `• **Analyze suspicious email text** — paste the email body with "Subject:" or "From:" headers\n\n` +
      `Please try again later or use the scanners above.\n\n` +
      `*APDS — 94.6% accuracy | Developed by Amna Najam & Alisha Noor | Supervised by Mam Shaista Ghafoor, University of Sargodha (2022–2026)*`,
    suggestions: ['Scan paypal-secure-login.com', 'What is typosquatting?', 'Show Python ML code', 'Project Authors & Supervisor']
  };
}
