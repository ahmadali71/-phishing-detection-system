const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim();
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function getOpenRouterResponse(messages, options = {}) {
  const rawKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  console.log('[OpenRouter] Raw env value:', rawKey);
  console.log('[OpenRouter] Trimmed key present:', !!OPENROUTER_API_KEY, 'key prefix:', OPENROUTER_API_KEY ? OPENROUTER_API_KEY.slice(0, 12) + '...' : 'none');
  console.log('[OpenRouter] All env keys starting with VITE_', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === '' || OPENROUTER_API_KEY.includes('YOUR_OPENROUTER_API_KEY')) {
    console.error('[OpenRouter] API key missing or placeholder detected. Check .env file for VITE_OPENROUTER_API_KEY and restart the dev server after any .env change.');
    return {
      text: 'AI service is not configured. Add your OpenRouter API key to the .env file as VITE_OPENROUTER_API_KEY, then restart the dev server.',
      suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
    };
  }

  const systemPrompt = options.systemPrompt || `You are APDS AI Cyber Defense Assistant, a cybersecurity expert. You help users with phishing detection, email security, URL analysis, and cybersecurity best practices. Be concise, professional, and use markdown formatting. If users share URLs or email content, suggest they use the scanner tools.`;

  try {
    const requestBody = {
      model: options.model || 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      ],
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 0.9
    };

    console.log('[OpenRouter] Sending request to:', OPENROUTER_API_URL, 'with model:', requestBody.model);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'APDS Cyber Defense Assistant'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('[OpenRouter] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[OpenRouter] API error:', response.status, errorData);
      const errorMessage = errorData?.error?.message || errorData?.message || 'Unknown error';
      return {
        text: `AI service error (${response.status}): ${errorMessage}. Please try again later or use the built-in scanners.`,
        suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
      };
    }

    const data = await response.json();
    console.log('[OpenRouter] Response data:', data);
    const aiMessage = data.choices?.[0]?.message?.content?.trim();

    if (!aiMessage) {
      console.warn('[OpenRouter] Empty response from AI');
      return {
        text: 'AI returned an empty response. Please try again.',
        suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
      };
    }

    return {
      text: aiMessage,
      suggestions: ['Scan a URL', 'Scan an email', 'Explain phishing']
    };
  } catch (error) {
    console.error('[OpenRouter] Request failed:', error);
    return {
      text: 'Could not connect to AI service. Please check your internet connection and try again. Error: ' + error.message,
      suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
    };
  }
}
