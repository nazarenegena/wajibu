export type Language = 'en' | 'sw';

export interface KeyDetails {
  tender_number: string;
  deadline: string;
  deadline_iso?: string;
  cancelled?: boolean;
  eligibility: string;
  estimated_value: string;
  contact: string;
}

export interface JargonTerm {
  term: string;
  plain_meaning: string;
}

export interface RedFlag {
  flag: string;
  why_it_matters: string;
  source_quote: string;
}

export interface WajibuResult {
  title: string;
  summary: string;
  key_details: KeyDetails;
  who_can_apply: string;
  jargon: JargonTerm[];
  red_flags: RedFlag[];
  next_steps: string[];
  source_citations: string[];
}
