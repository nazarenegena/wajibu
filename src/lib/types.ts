export type Language = 'en' | 'sw';

export type Bilingual = Record<Language, string>;

export interface KeyDetails {
  tender_number: string;
  deadline: Bilingual;
  deadline_iso?: string;
  cancelled?: boolean;
  eligibility: Bilingual;
  estimated_value: string;
  contact: Bilingual;
}

export interface JargonTerm {
  term: Bilingual;
  plain_meaning: Bilingual;
}

export interface RedFlag {
  flag: Bilingual;
  why_it_matters: Bilingual;
  source_quote: string;
}

export interface WajibuResult {
  title: Bilingual;
  summary: Bilingual;
  key_details: KeyDetails;
  who_can_apply: Bilingual;
  jargon: JargonTerm[];
  red_flags: RedFlag[];
  next_steps: Bilingual[];
  source_citations: string[];
}

export interface MonolingualKeyDetails {
  tender_number: string;
  deadline: string;
  deadline_iso?: string;
  cancelled?: boolean;
  eligibility: string;
  estimated_value: string;
  contact: string;
}

export interface MonolingualResult {
  title: string;
  summary: string;
  key_details: MonolingualKeyDetails;
  who_can_apply: string;
  jargon: { term: string; plain_meaning: string }[];
  red_flags: { flag: string; why_it_matters: string; source_quote: string }[];
  next_steps: string[];
  source_citations: string[];
}