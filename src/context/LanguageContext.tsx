import { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '../lib/types';

const en = {
  nav_home: 'Home',
  nav_analyse: 'Analyse',
  hero_tagline:
    'Understand Nyeri County tenders in plain Swahili or English',
  hero_problem:
    'Public tenders are technically public — but practically unreadable. They are written in dense legal and procurement English, with deadlines and eligibility rules buried deep in PDFs. If you cannot understand them, you cannot bid, and you cannot question how public money is spent.',
  cta_analyse: 'Analyse a document',
  cta_sample: 'See a sample',
  samples_title: 'Try a real Nyeri document',
  samples_hint: 'Pick one to load it into the analyser',
  analyse_title: 'Analyse a document',
  analyse_subtitle:
    'Upload a tender or budget PDF, or paste its text. Wajibu will explain it in plain language.',
  analyse_upload: 'Upload PDF',
  analyse_paste: 'Paste text',
  analyse_drop: 'Drag & drop your PDF here, or click to browse',
  analyse_drop_hint: 'PDF only, up to 10 MB',
  analyse_or: 'or',
  analyse_textarea_placeholder:
    'Paste the tender notice or budget text here…',
  analyse_analyse: 'Analyse',
  analyse_invalid_file: 'Please choose a PDF file',
  analyse_sample_loaded: 'Sample PDF loaded — ready to analyse',
  analyse_document_label: 'Pasted document',
  analyse_clear: 'Clear',
  analyse_min_chars: 'Needs at least 50 characters',
  analyse_ready: 'Ready to analyse',
  loading_reading: 'Wajibu is reading the document…',
  loading_seconds: 'This can take a few seconds.',
  error_title: 'Something went wrong',
  error_message:
    'Wajibu could not finish analysing this document. Your connection may be down, or the AI service may be busy.',
  error_sample_not_found:
    'The sample PDF could not be loaded. Check that the file exists in public/samples/.',
  error_retry: 'Try again',
  error_back: 'Back',
  result_summary: 'Summary',
  result_key_details: 'Key details',
  result_tender_number: 'Tender number',
  result_deadline: 'Deadline',
  result_eligibility: 'Eligibility',
  result_value: 'Estimated value',
  result_contact: 'Contact',
  result_who_can_apply: 'Who can apply',
  result_category_prompt: 'I am:',
  result_category_open: 'Open to everyone',
  result_category_youth: 'A youth (18–35)',
  result_category_women: 'A women-led business',
  result_category_plwd: 'A person with disability',
  result_eligible: 'You may be eligible',
  result_not_eligible: 'You may not be eligible',
  result_unclear: 'Not clearly stated — check the summary',
  result_jargon: 'Jargon buster',
  result_jargon_hint: 'Tap a term to see it explained in plain language',
  result_red_flags: 'Things worth questioning',
  result_next_steps: 'Your next steps',
  result_sources: 'Source citations',
  result_share: 'Share this summary',
  result_shared: 'Summary copied to clipboard',
  result_analyse_another: 'Analyse another document',
  result_no_result: 'No analysis found. Please analyse a document first.',
  footer_disclaimer:
    'A proof of concept. Not affiliated with Nyeri County Government.',
  footer_built:
    'Built by Nazarene Gena for the 2026 civic tech invention sprint.',
  lang_label: 'Language',
};

type UiStrings = typeof en;

export type { UiStrings };

const sw: UiStrings = {
  nav_home: 'Nyumbani',
  nav_analyse: 'Chambua',
  hero_tagline:
    'Elewa zabuni za Kaunti ya Nyeri kwa Kiswahili rahisi au Kiingereza',
  hero_problem:
    'Zabuni za umma ziko wazi kisheria — lakini kivitendo hazisomeki. Zimeandikwa kwa Kiingereza kigumu cha sheria na ununuzi, huku tarehe za mwisho na sifa za kustahiki zikifichwa ndani ya PDF. Kama huzielewi, huwezi kuomba zabuni, wala huwezi kuhoji jinsi pesa za umma zinavyotumika.',
  cta_analyse: 'Chambua hati',
  cta_sample: 'Tazama mfano',
  samples_title: 'Jaribu hati halisi ya Nyeri',
  samples_hint: 'Chagua moja ili kuiingiza kwenye chombo cha uchambuzi',
  analyse_title: 'Chambua hati',
  analyse_subtitle:
    'Pakia PDF ya zabuni au bajeti, au bandika maandishi yake. Wajibu atayaeleza kwa lugha rahisi.',
  analyse_upload: 'Pakia PDF',
  analyse_paste: 'Bandika maandishi',
  analyse_drop: 'Buruta PDF hapa, au bofya kuchagua faili',
  analyse_drop_hint: 'PDF pekee, hadi MB 10',
  analyse_or: 'au',
  analyse_textarea_placeholder:
    'Bandika maandishi ya ilani ya zabuni au bajeti hapa…',
  analyse_analyse: 'Chambua',
  analyse_invalid_file: 'Tafadhali chagua faili ya PDF',
  analyse_sample_loaded: 'PDF ya mfano imepakiwa — tayari kuchambua',
  analyse_document_label: 'Hati iliyobandikwa',
  analyse_clear: 'Futa',
  analyse_min_chars: 'Inahitaji angalau herufi 50',
  analyse_ready: 'Tayari kuchambua',
  loading_reading: 'Wajibu anasoma hati…',
  loading_seconds: 'Hii inaweza kuchukua sekunde chache.',
  error_title: 'Hitilafu imetokea',
  error_message:
    'Wajibu hakuweza kumaliza kuchambua hati hii. Huenda mtandao uko chini, au huduma ya AI iko bize.',
  error_sample_not_found:
    'PDF ya mfano haikuweza kupakiwa. Angalia kwamba faili lipo kwenye public/samples/.',
  error_retry: 'Jaribu tena',
  error_back: 'Rudi',
  result_summary: 'Muhtasari',
  result_key_details: 'Maelezo muhimu',
  result_tender_number: 'Nambari ya zabuni',
  result_deadline: 'Tarehe ya mwisho',
  result_eligibility: 'Sifa za kustahiki',
  result_value: 'Makadirio ya thamani',
  result_contact: 'Mawasiliano',
  result_who_can_apply: 'Nani anaweza kuomba',
  result_category_prompt: 'Mimi ni:',
  result_category_open: 'Funguliwa kwa kila mtu',
  result_category_youth: 'Kijana (miaka 18–35)',
  result_category_women: 'Biashara inayoongozwa na mwanamke',
  result_category_plwd: 'Mtu mwenye ulemavu',
  result_eligible: 'Huenda unastahiki',
  result_not_eligible: 'Huenda huna sifa',
  result_unclear: 'Haijaainishwa wazi — angalia muhtasari',
  result_jargon: 'Kueleza maneno magumu',
  result_jargon_hint: 'Bofya neno litajwe kwa lugha rahisi',
  result_red_flags: 'Mambo yanayostahili kuhojiwa',
  result_next_steps: 'Hatua zako zijazo',
  result_sources: 'Vyanzo vya taarifa',
  result_share: 'Shiriki muhtasari huu',
  result_shared: 'Muhtasari umenakiliwa kwenye clipboard',
  result_analyse_another: 'Chambua hati nyingine',
  result_no_result: 'Hakuna uchambuzi. Tafadhali chambua hati kwanza.',
  footer_disclaimer:
    'Huu ni uthibitisho wa dhana. Hatuunganishwi na Serikali ya Kaunti ya Nyeri.',
  footer_built:
    'Imejengwa na Nazarene Gena kwa mashindano ya ubunifu wa teknolojia ya kiraia 2026.',
  lang_label: 'Lugha',
};

const strings: Record<Language, UiStrings> = { en, sw };

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof UiStrings) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'wajibu-language';

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'sw' || stored === 'en' ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);

  const t = (key: keyof UiStrings) => strings[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}