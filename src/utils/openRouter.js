const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim();
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const FALLBACK_MODELS = [
  'mistralai/mistral-7b-instruct',
  'google/gemini-2.0-flash-exp:free',
  'meta-llama/llama-3.1-8b-instruct',
  'huggingfaceh4/zephyr-7b-beta'
];

export async function getOpenRouterResponse(messages, options = {}) {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === '' || OPENROUTER_API_KEY.includes('YOUR_OPENROUTER_API_KEY')) {
    console.error('[OpenRouter] API key missing. Check .env for VITE_OPENROUTER_API_KEY and restart the dev server.');
    return {
      text: 'AI service is not configured. Add your OpenRouter API key to .env as VITE_OPENROUTER_API_KEY, then restart the dev server.',
      suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
    };
  }

  const systemPrompt = options.systemPrompt || `You are APDS AI Cyber Defense Assistant, a cybersecurity expert. You help users with phishing detection, email security, URL analysis, and cybersecurity best practices. Be concise, professional, and use markdown formatting. If users share URLs or email content, suggest they use the scanner tools.`;

  const selectedModel = options.model || FALLBACK_MODELS[0];

  try {
    const requestBody = {
      model: selectedModel,
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

    console.log('[OpenRouter] Request model:', selectedModel);

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
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.error?.message || errorData?.message || errorMessage;
      } catch {
        // keep default errorMessage
      }
      console.error('[OpenRouter] API error:', response.status, errorMessage);
      return {
        text: `AI service error (${response.status}): ${errorMessage}. You can still use the built-in URL and email scanners.`,
        suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
      };
    }

    const data = await response.json();
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
      text: 'Could not connect to AI service. Please check your internet connection and try again.',
      suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
    };
  }
}
