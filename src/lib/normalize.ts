import type { Bilingual, JargonTerm, RedFlag, WajibuResult } from './types';

const notStated: Bilingual = {
  en: 'Not stated in this document.',
  sw: 'Haijaelezwa kwenye hati hii',
};

const stringField = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value : fallback;

const bilingualField = (value: unknown, fallback?: Bilingual): Bilingual => {
  if (value && typeof value === 'object') {
    const source = value as { en?: unknown; sw?: unknown };
    const en = stringField(source.en);
    const sw = stringField(source.sw);
    if (en || sw) {
      return {
        en: en || sw,
        sw: sw || en,
      };
    }
  }
  const flat = stringField(value);
  if (flat) {
    return { en: flat, sw: flat };
  }
  return fallback ?? { en: '', sw: '' };
};

const stringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  if (typeof value === 'string') {
    return value
      .split(/\n+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).filter(
      (item): item is string => typeof item === 'string'
    );
  }
  return [];
};

const bilingualArray = (value: unknown): Bilingual[] => {
  if (!Array.isArray(value)) return [];
  const result: Bilingual[] = [];
  for (const item of value) {
    const bilingual = bilingualField(item);
    if (bilingual.en || bilingual.sw) result.push(bilingual);
  }
  return result;
};

const objectArray = <T,>(value: unknown, pick: (source: unknown) => T | null): T[] => {
  if (!Array.isArray(value)) return [];
  const result: T[] = [];
  for (const item of value) {
    const picked = pick(item);
    if (picked) result.push(picked);
  }
  return result;
};

interface GenericObject {
  [key: string]: unknown;
}

const pickObject = (source: unknown): GenericObject | null =>
  source && typeof source === 'object' ? (source as GenericObject) : null;

export function normalizeResult(raw: unknown): WajibuResult {
  const input = pickObject(raw) ?? {};

  const key_details = pickObject(input.key_details) ?? {};

  return {
    title: bilingualField(input.title),
    summary: bilingualField(input.summary),
    key_details: {
      tender_number: stringField(key_details.tender_number, 'Not stated in this document.'),
      deadline: bilingualField(key_details.deadline, notStated),
      deadline_iso: stringField(key_details.deadline_iso, '') || undefined,
      cancelled:
        typeof key_details.cancelled === 'boolean'
          ? key_details.cancelled
          : undefined,
      eligibility: bilingualField(key_details.eligibility, notStated),
      estimated_value: stringField(key_details.estimated_value, 'Not stated in this document.'),
      contact: bilingualField(key_details.contact, notStated),
    },
    who_can_apply: bilingualField(input.who_can_apply),
    jargon: objectArray<JargonTerm>(input.jargon, (source) => {
      const item = pickObject(source);
      if (!item) return null;
      return {
        term: bilingualField(item.term),
        plain_meaning: bilingualField(item.plain_meaning),
      };
    }),
    red_flags: objectArray<RedFlag>(input.red_flags, (source) => {
      const item = pickObject(source);
      if (!item) return null;
      return {
        flag: bilingualField(item.flag),
        why_it_matters: bilingualField(item.why_it_matters),
        source_quote: stringField(item.source_quote),
      };
    }),
    next_steps: bilingualArray(input.next_steps),
    source_citations: stringArray(input.source_citations),
  };
}