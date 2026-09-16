import type { Language, MonolingualResult, WajibuResult } from './types';

export function toMonolingual(
  result: WajibuResult,
  lang: Language
): MonolingualResult {
  const pick = (value: { en: string; sw: string }): string => value[lang] || value.en || value.sw;

  return {
    title: pick(result.title),
    summary: pick(result.summary),
    key_details: {
      tender_number: result.key_details.tender_number,
      deadline: pick(result.key_details.deadline),
      deadline_iso: result.key_details.deadline_iso,
      cancelled: result.key_details.cancelled,
      eligibility: pick(result.key_details.eligibility),
      estimated_value: result.key_details.estimated_value,
      contact: pick(result.key_details.contact),
    },
    who_can_apply: pick(result.who_can_apply),
    jargon: result.jargon.map((item) => ({
      term: pick(item.term),
      plain_meaning: pick(item.plain_meaning),
    })),
    red_flags: result.red_flags.map((item) => ({
      flag: pick(item.flag),
      why_it_matters: pick(item.why_it_matters),
      source_quote: item.source_quote,
    })),
    next_steps: result.next_steps.map(pick),
    source_citations: result.source_citations,
  };
}