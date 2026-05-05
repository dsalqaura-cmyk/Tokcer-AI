export const callAiEngine = async (systemPrompt, userMessage, customApiKey = null, maxTokens = 2048, temperature = 0.8) => {
  const apiKey = customApiKey || import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    throw new Error('API Key Intelligence belum dikonfigurasi. Silakan hubungi Admin sistem.');
  }

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${apiKey}` 
    },
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: temperature,
      max_tokens: maxTokens,
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Request gagal dengan status ${res.status}`);
  }

  const data = await res.json();
  return {
    text: data.choices?.[0]?.message?.content || 'AI tidak memberikan respons.',
    usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
  };
};
