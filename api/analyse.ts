import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const responseSchema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    key_details: {
      type: 'OBJECT',
      properties: {
        tender_number: { type: 'STRING' },
        deadline: { type: 'STRING' },
        eligibility: { type: 'STRING' },
        estimated_value: { type: 'STRING' },
        contact: { type: 'STRING' },
      },
      required: ['tender_number', 'deadline', 'eligibility', 'estimated_value', 'contact'],
    },
    who_can_apply: { type: 'STRING' },
    jargon: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          term: { type: 'STRING' },
          plain_meaning: { type: 'STRING' },
        },
        required: ['term', 'plain_meaning'],
      },
    },
    red_flags: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          flag: { type: 'STRING' },
          why_it_matters: { type: 'STRING' },
          source_quote: { type: 'STRING' },
        },
        required: ['flag', 'why_it_matters', 'source_quote'],
      },
    },
    next_steps: { type: 'ARRAY', items: { type: 'STRING' } },
    source_citations: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: [
    'title',
    'summary',
    'key_details',
    'who_can_apply',
    'jargon',
    'red_flags',
    'next_steps',
    'source_citations',
  ],
};

function parseModelJson(content: string): unknown {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    const open = trimmed.indexOf('{');
    const close = trimmed.lastIndexOf('}');
    const candidate = fenced
      ? fenced[1]
      : open !== -1 && close > open
        ? trimmed.slice(open, close + 1)
        : trimmed;
    return JSON.parse(candidate);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, lang = 'en' } = req.body || {};

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Document text too short or missing' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = lang === 'sw'
    ? `Wewe ni Wajibu. Chukua tangazo la zabuni au hati ya bajeti ya kaunti na uieleze kwa Kiswahili rahisi. Rudisha JSON pekee. Hii ndiyo muundo sahihi: title (string), summary (string), key_details (object yenye: tender_number, deadline, eligibility, estimated_value, contact - zote string), who_can_apply (string), jargon (array ya {term, plain_meaning}), red_flags (array ya {flag, why_it_matters, source_quote}), next_steps (array ya string), source_citations (array ya string). Kwa kila sehemu isiyotajwa kwenye hati, tumia "Haijaelezwa kwenye hati hii" ikiwa halipo. Usibuni ukweli.`
    : `You are Wajibu. Take a Kenyan county tender or budget document and explain it in plain English. Return ONLY valid JSON with exactly this shape: title (string), summary (string), key_details (object with: tender_number, deadline, eligibility, estimated_value, contact - all strings), who_can_apply (string), jargon (array of {term, plain_meaning}), red_flags (array of {flag, why_it_matters, source_quote}), next_steps (array of strings), source_citations (array of strings). For any field not stated in the document, use "Not stated in this document." Do not invent facts.`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nDocument:\n${text.slice(0, 30000)}`
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
            responseSchema
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

    const parsed = parseModelJson(content);
    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}