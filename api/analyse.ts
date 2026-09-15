import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, lang = 'en' } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Document text too short or missing' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = lang === 'sw'
    ? `Wewe ni Wajibu. Chukua tangazo la zabuni au hati ya bajeti ya kaunti na uieleze kwa Kiswahili rahisi. Rudisha JSON pekee yenye: title, summary, key_details, who_can_apply, jargon (array ya {term, plain_meaning}), red_flags (array ya {flag, why_it_matters, source_quote}), next_steps, source_citations.`
    : `You are Wajibu. Take a Kenyan county tender or budget document and explain it in plain English. Return ONLY valid JSON with: title, summary, key_details, who_can_apply, jargon (array of {term, plain_meaning}), red_flags (array of {flag, why_it_matters, source_quote}), next_steps, source_citations.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nDocument:\n${text.slice(0, 30000)}`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini error:', error);
      return res.status(500).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return res.status(500).json({ error: 'Empty response from AI' });
    }

    // Parse the JSON string returned by Gemini
    const parsed = JSON.parse(content);
    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
