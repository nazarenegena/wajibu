import type { Language, WajibuResult } from './types';
import { normalizeResult } from './normalize';

export async function analyseDocument(
  text: string,
  lang: Language
): Promise<WajibuResult> {
  const response = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Failed to analyse document'
    );
  }

  const raw: unknown = await response.json();
  return normalizeResult(raw);
}