const API_URL = (import.meta.env.VITE_OPENROUTER_API_URL || 'https://cybersecuritychatbot-api.ahmadmohid3358.workers.dev/chat').trim();
const DEFAULT_MODEL = (import.meta.env.VITE_OPENROUTER_MODEL || '').trim();

export async function getOpenRouterResponse(messages, options = {}) {
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

  if (DEFAULT_MODEL) {
    requestBody.model = DEFAULT_MODEL;
  }
  if (options.model) {
    requestBody.model = options.model;
  }

  console.log('[AI] Sending request to:', API_URL);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('[AI] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.error || errorData?.message || errorMessage;
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
    const aiMessage = data.response?.trim() || data.choices?.[0]?.message?.content?.trim();

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
