import type { WajibuResult } from './types';

const NOT_STATED = 'Not stated in this document.';

const stringField = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value : fallback;

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

const objectArray = <T extends { [key: string]: unknown }>(
  value: unknown,
  pick: (source: unknown) => T | null
): T[] => {
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
    title: stringField(input.title, 'Tender or budget document'),
    summary: stringField(input.summary),
    key_details: {
      tender_number: stringField(key_details.tender_number, NOT_STATED),
      deadline: stringField(key_details.deadline, NOT_STATED),
      eligibility: stringField(key_details.eligibility, NOT_STATED),
      estimated_value: stringField(key_details.estimated_value, NOT_STATED),
      contact: stringField(key_details.contact, NOT_STATED),
    },
    who_can_apply: stringField(input.who_can_apply),
    jargon: objectArray(input.jargon, (source) => {
      const item = pickObject(source);
      if (!item) return null;
      return {
        term: stringField(item.term),
        plain_meaning: stringField(item.plain_meaning),
      };
    }),
    red_flags: objectArray(input.red_flags, (source) => {
      const item = pickObject(source);
      if (!item) return null;
      return {
        flag: stringField(item.flag),
        why_it_matters: stringField(item.why_it_matters),
        source_quote: stringField(item.source_quote),
      };
    }),
    next_steps: stringArray(input.next_steps),
    source_citations: stringArray(input.source_citations),
  };
}