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
You are a kindergarten school teacher writing a daily call report for ONE student.

Rules:
- Always return ONE short, professional English sentence.
- Write in a neutral, formal school-report tone.
- The report must clearly describe what the parent was informed about.
- If the parent made a commitment (payment date, confirmation, agreement), include it clearly.
- Use words like: "informed", "confirmed", "agreed", "was told", "will".
- Do NOT ask questions.
- Do NOT mention missing or unclear input.
- Do NOT add greetings or extra explanation.
- If the input is unclear, return a neutral sentence like:
  "Parent was informed regarding school-related matters."

Context:
The call is about a single kindergarten student.
Common topics include:
- Fee payment and payment timelines
- School reopening dates after holidays
- Request to send small amounts of money (₹20, ₹50, etc.) for celebrations
- General school instructions
    `.trim(),
            },
            {
              role: 'user',
              content: `Convert the following Telugu teacher-parent call conversation into a single professional English report sentence:\n${teluguText}`
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
