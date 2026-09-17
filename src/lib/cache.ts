import type { WajibuResult } from './types';

const PREFIX = 'wajibu-cache:v2:';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 50;

interface CacheEntry {
  at: number;
  data: WajibuResult;
}

const allKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) keys.push(key);
  }
  return keys;
};

export async function hashText(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function getCachedAnalysis(
  hash: string
): WajibuResult | null {
  const raw = localStorage.getItem(PREFIX + hash);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.at > TTL_MS) {
      localStorage.removeItem(PREFIX + hash);
      return null;
    }
    return entry.data;
  } catch {
    localStorage.removeItem(PREFIX + hash);
    return null;
  }
}

export function setCachedAnalysis(hash: string, data: WajibuResult): void {
  const keys = allKeys();

  const now = Date.now();
  const entries: { key: string; at: number }[] = [];
  for (const key of keys) {
    try {
      const entry = JSON.parse(localStorage.getItem(key) ?? '') as CacheEntry;
      if (now - entry.at > TTL_MS) {
        localStorage.removeItem(key);
      } else {
        entries.push({ key, at: entry.at });
      }
    } catch {
      localStorage.removeItem(key);
    }
  }

  entries.sort((a, b) => a.at - b.at);
  let overflow = entries.length + 1 - MAX_ENTRIES;
  for (const entry of entries) {
    if (overflow <= 0) break;
    localStorage.removeItem(entry.key);
    overflow--;
  }

  const payload: CacheEntry = { at: now, data };
  localStorage.setItem(PREFIX + hash, JSON.stringify(payload));
}