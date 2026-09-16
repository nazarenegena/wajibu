import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_TTL_SECONDS = Math.floor(CACHE_TTL_MS / 1000);
const CACHE_CAPACITY = 200;

const hasUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

interface CacheEntry {
  data: unknown;
  at: number;
}

const memoryCache = new Map<string, CacheEntry>();

function cacheKey(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

function memoryGet(key: string): unknown | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  memoryCache.delete(key);
  memoryCache.set(key, entry);
  return entry.data;
}

function memorySet(key: string, data: unknown): void {
  if (memoryCache.has(key)) memoryCache.delete(key);
  memoryCache.set(key, { data, at: Date.now() });
  while (memoryCache.size > CACHE_CAPACITY) {
    const oldest = memoryCache.keys().next().value;
    if (oldest === undefined) break;
    memoryCache.delete(oldest);
  }
}

async function upstashGet(key: string): Promise<unknown | null> {
  try {
    const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { result?: string | null };
    if (json.result === null || json.result === undefined) return null;
    return JSON.parse(json.result);
  } catch {
    return null;
  }
}

async function upstashSet(key: string, data: unknown): Promise<void> {
  try {
    await fetch(`${UPSTASH_URL}/set/${key}?EX=${CACHE_TTL_SECONDS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch {
    // non-fatal: fall through without caching
  }
}

async function cacheGet(key: string): Promise<unknown | null> {
  if (hasUpstash) {
    return upstashGet(key);
  }
  return memoryGet(key);
}

async function cacheSet(key: string, data: unknown): Promise<void> {
  if (hasUpstash) {
    await upstashSet(key, data);
    return;
  }
  memorySet(key, data);
}

const bilingualString = {
  type: 'OBJECT',
  properties: {
    en: { type: 'STRING' },
    sw: { type: 'STRING' },
  },
  required: ['en', 'sw'],
};

const responseSchema = {
  type: 'OBJECT',
  properties: {
    title: bilingualString,
    summary: bilingualString,
    key_details: {
      type: 'OBJECT',
      properties: {
        tender_number: { type: 'STRING' },
        deadline: bilingualString,
        deadline_iso: { type: 'STRING' },
        cancelled: { type: 'BOOLEAN' },
        eligibility: bilingualString,
        estimated_value: { type: 'STRING' },
        contact: bilingualString,
      },
      required: ['tender_number', 'deadline', 'deadline_iso', 'cancelled', 'eligibility', 'estimated_value', 'contact'],
    },
    who_can_apply: bilingualString,
    jargon: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          term: bilingualString,
          plain_meaning: bilingualString,
        },
        required: ['term', 'plain_meaning'],
      },
    },
    red_flags: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          flag: bilingualString,
          why_it_matters: bilingualString,
          source_quote: { type: 'STRING' },
        },
        required: ['flag', 'why_it_matters', 'source_quote'],
      },
    },
    next_steps: { type: 'ARRAY', items: bilingualString },
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

const systemPrompt = `You are Wajibu. Take a Kenyan county tender or budget document and explain it in plain language. Return ONLY valid JSON with exactly this shape: every text field (title, summary, key_details.deadline, key_details.eligibility, key_details.contact, who_can_apply, jargon.term, jargon.plain_meaning, red_flags.flag, red_flags.why_it_matters, next_steps) is an object {"en": string, "sw": string} containing the value in English and in Kiswahili. Language-neutral fields are plain strings or booleans: key_details.tender_number, key_details.deadline_iso, key_details.cancelled, key_details.estimated_value, red_flags.source_quote, source_citations. deadline_iso: extract the concrete closing date as an ISO 8601 string (e.g. 2024-10-18, or full datetime), or an empty string ("") if the document has no exact date. cancelled: set to true ONLY if the document explicitly states the tender was cancelled or withdrawn; otherwise false. For any field not stated in the document, use {"en": "Not stated in this document.", "sw": "Haijaelezwa kwenye hati hii"}. Do not invent facts.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body || {};

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: 'Document text too short or missing' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const key = cacheKey(text);

  const cached = await cacheGet(key);
  if (cached) {
    res.setHeader('x-wajibu-cache', 'hit');
    return res.status(200).json(cached);
  }

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
            maxOutputTokens: 8192,
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
    await cacheSet(key, parsed);
    res.setHeader('x-wajibu-cache', 'miss');
    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}