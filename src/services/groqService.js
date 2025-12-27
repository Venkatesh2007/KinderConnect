const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const summarizeText = async (teluguText) => {
  if (!teluguText || teluguText.trim().length === 0) return '';

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `
You are a kindergarten school assistant.
Always return ONE short, professional English report sentence.
Do not ask questions.
Do not mention missing input.
If input is unclear, return a neutral school report sentence.
              `.trim(),
            },
            {
              role: 'user',
              content: `Convert this Telugu text into a short English summary:\n${teluguText}`
            }
          ],
          temperature: 0.3,
          max_tokens: 80
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq raw error:', errorText);
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';

  } catch (error) {
    console.error('Summarization failed:', error);
    return 'Summary could not be generated. You may edit manually.';
  }
};
