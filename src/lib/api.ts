import type { WajibuResult } from './types';
import { normalizeResult } from './normalize';
import {
  getCachedAnalysis,
  hashText,
  setCachedAnalysis,
} from './cache';

export interface AnalyseOptions {
  force?: boolean;
}

export async function analyseDocument(
  text: string,
  options: AnalyseOptions = {}
): Promise<WajibuResult> {
  const hash = await hashText(text);

  if (!options.force) {
    const cached = getCachedAnalysis(hash);
    if (cached) return cached;
  }

  const response = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      typeof err.error === 'string' ? err.error : 'Failed to analyse document'
    );
  }

  const raw: unknown = await response.json();
  const result = normalizeResult(raw);
  setCachedAnalysis(hash, result);
  return result;
}