const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim();
const OPENROUTER_API_URL = (import.meta.env.VITE_OPENROUTER_API_URL || 'https://cybersecuritychatbot-api.ahmadmohid3358.workers.dev/chat').trim();
const OPENROUTER_MODEL = (import.meta.env.VITE_OPENROUTER_MODEL || '').trim();
const OPENROUTER_AUTH_HEADER = (import.meta.env.VITE_OPENROUTER_AUTH_HEADER || 'bearer').trim().toLowerCase();

function buildAuthHeaders(apiKey) {
  const headers = {
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'APDS Cyber Defense Assistant'
  };

  if (OPENROUTER_AUTH_HEADER === 'x-api-key') {
    headers['X-API-Key'] = apiKey;
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  return headers;
}

export async function getOpenRouterResponse(messages, options = {}) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === '' || OPENROUTER_API_KEY.includes('YOUR_OPENROUTER_API_KEY')) {
    console.error('[AI] API key missing. Check .env for VITE_OPENROUTER_API_KEY and restart the dev server.');
    return {
      text: 'AI service is not configured. Add your API key to .env as VITE_OPENROUTER_API_KEY, then restart the dev server.',
      suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
    };
  }

  const systemPrompt = options.systemPrompt || `You are APDS AI Cyber Defense Assistant, a cybersecurity expert. You help users with phishing detection, email security, URL analysis, and cybersecurity best practices. Be concise, professional, and use markdown formatting. If users share URLs or email content, suggest they use the scanner tools.`;

  const requestBody = {
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ]
  };

  if (OPENROUTER_MODEL) {
    requestBody.model = OPENROUTER_MODEL;
  }
  if (options.model) {
    requestBody.model = options.model;
  }

  console.log('[AI] Sending request to:', OPENROUTER_API_URL);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: buildAuthHeaders(OPENROUTER_API_KEY),
      body: JSON.stringify(requestBody)
    });

    console.log('[AI] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.error?.message || errorData?.message || errorMessage;
      } catch {
        // keep default errorMessage
      }
      console.error('[AI] Request failed:', response.status, errorMessage);

      return {
        text: `AI service error (${response.status}): ${errorMessage}. You can still use the built-in URL and email scanners.`,
        suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
      };
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content?.trim() || data.response?.trim();

    if (!aiMessage) {
      console.warn('[AI] Empty response from AI');
      return {
        text: 'AI service returned an empty response. Please try again or use the built-in scanners.',
        suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
      };
    }

    return {
      text: aiMessage,
      suggestions: ['Scan a URL', 'Scan an email', 'Explain phishing']
    };
  } catch (error) {
    console.error('[AI] Request failed:', error);
    return {
      text: 'Could not reach the AI service. Please check your internet connection and try again. You can still use the built-in URL and email scanners!',
      suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
    };
  }
}
