const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim();
const OPENROUTER_API_URL = (import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions').trim();
const OPENROUTER_MODEL = (import.meta.env.VITE_OPENROUTER_MODEL || '').trim();
const OPENROUTER_AUTH_HEADER = (import.meta.env.VITE_OPENROUTER_AUTH_HEADER || 'bearer').trim().toLowerCase();

const FALLBACK_MODELS = [
  'meta-llama/llama-3.1-8b-instruct',
  'google/gemini-2.0-flash-exp:free',
  'mistralai/mistral-7b-instruct',
  'huggingfaceh4/zephyr-7b-beta'
];

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

  const modelsToTry = [];
  if (OPENROUTER_MODEL) {
    modelsToTry.push(OPENROUTER_MODEL);
  }
  if (options.model && !modelsToTry.includes(options.model)) {
    modelsToTry.push(options.model);
  }
  modelsToTry.push(...FALLBACK_MODELS.filter(m => !modelsToTry.includes(m)));

  for (const selectedModel of modelsToTry) {
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

      console.log('[AI] Trying model:', selectedModel, 'at:', OPENROUTER_API_URL);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: buildAuthHeaders(OPENROUTER_API_KEY),
        body: JSON.stringify(requestBody)
      });

      console.log('[AI] Response status for', selectedModel, ':', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error?.message || errorData?.message || errorMessage;
        } catch {
          // keep default errorMessage
        }
        console.error('[AI] Model', selectedModel, 'failed:', response.status, errorMessage);

        if (response.status === 404 || response.status === 429 || response.status === 401) {
          continue;
        }

        return {
          text: `AI service error (${response.status}): ${errorMessage}. You can still use the built-in URL and email scanners.`,
          suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
        };
      }

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content?.trim();

      if (!aiMessage) {
        console.warn('[AI] Empty response from AI for model:', selectedModel);
        continue;
      }

      return {
        text: aiMessage,
        suggestions: ['Scan a URL', 'Scan an email', 'Explain phishing']
      };
    } catch (error) {
      console.error('[AI] Request failed for model', selectedModel, ':', error);
      continue;
    }
  }

  return {
    text: 'All AI models are temporarily unavailable. Please try again later or use the built-in URL and email scanners.',
    suggestions: ['Scan a URL', 'Scan an email', 'What is phishing?']
  };
}
