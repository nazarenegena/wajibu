import { createContext, useContext, useEffect, useState } from 'react';
import type { Language } from '../lib/types';

const en = {
  nav_home: 'Home',
  nav_analyse: 'Analyse',
  nav_how_works: 'How it works',
  header_tagline: 'Public information, made useful.',
  cta_analyse_doc: 'Analyse a document',
  hero_tagline:
    'Understand Nyeri County tenders in plain Swahili or English',
  hero_problem:
    'Public tenders are technically public — but practically unreadable. They are written in dense legal and procurement English, with deadlines and eligibility rules buried deep in PDFs. If you cannot understand them, you cannot bid, and you cannot question how public money is spent.',
  cta_analyse: 'Analyse a document',
  cta_sample: 'See a sample',
  home_badge: 'Built for public participation',
  home_hero_prefix: 'Public tenders,',
  home_hero_highlight: 'made clear.',
  home_hero_body:
    'Understand Nyeri County tenders in plain Swahili or English. Wajibu turns complex public documents into useful, actionable information.',
  home_no_account: 'No account needed. Your documents stay yours.',
  home_mock_file: 'Tender notice.pdf',
  home_mock_uploaded: 'Uploaded just now',
  home_mock_analysed: 'Analysed',
  home_mock_plain_lang: 'In plain language',
  home_mock_blurb:
    'Nyeri County is looking for a registered business to supply medical equipment.',
  home_mock_deadline: '18 Oct 2024',
  home_mock_value: 'KES 12.5M',
  samples_eyebrow: 'Try a real example',
  samples_h2: 'Explore sample tenders',
  samples_desc:
    'See how Wajibu helps you move from confusing notice to confident next step.',
  type_open: 'Open tender',
  type_youth: 'Youth reserved',
  type_women: 'Women reserved',
  type_pwd: 'PWD reserved',
  type_agpo: 'AGPO',
  samples_title: 'Try a real Nyeri document',
  samples_hint: 'Pick one to load it into the analyser',
  how_title: 'How it works',
  how_sub: 'Three steps from document to decision.',
  how_1_title: 'Upload or paste',
  how_1_body: 'Bring in a tender or budget PDF and let Wajibu read it.',
  how_2_title: 'Wajibu explains it',
  how_2_body: 'Key details, jargon and red flags in plain language.',
  how_3_title: 'Decide and act',
  how_3_body: 'See if you may be eligible and what to do next.',
  analyse_title: 'Analyse a document',
  analyse_subtitle:
    'Upload a tender or budget PDF, or paste its text. Wajibu will explain it in plain language.',
  analyse_upload: 'Upload PDF',
  analyse_paste: 'Paste text',
  analyse_eyebrow: 'Start with a document',
  analyse_title_new: 'Make a tender easier to act on.',
  analyse_subtitle_new:
    'Upload a PDF or paste the text of a county tender notice. Wajibu will pull out the details that matter.',
  analyse_drop: 'Drop a PDF here, or browse',
  analyse_drop_hint: 'PDF · up to 10 MB',
  analyse_or: 'or',
  analyse_or_paste: 'or paste text',
  output_language: 'Output language',
  output_hint: 'You can switch later',
  analyse_action: 'Analyse document',
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
  result_red_flags_title: 'Red flags to notice',
  result_red_flags_hint:
    'Not blockers, but worth checking before you apply.',
  result_next_steps: 'Your next steps',
  result_plain_lang: 'In plain language',
  result_back: 'Back to samples',
  result_complete: 'Analysis complete',
  result_status: 'Status',
  status_open: 'Open',
  status_closed: 'Closed',
  status_cancelled: 'Cancelled',
  status_unknown: 'Status unknown',
  status_days_left: 'days left',
  status_closes_today: 'Closes today',
  status_on: 'on',
  result_share_hint: 'Help another local business find this opportunity.',
  result_copy_link: 'Copy link',
  result_link_copied: 'Link copied',
  result_copy_failed: 'Could not copy link',
  result_sources: 'Source citations',
  result_share: 'Share this summary',
  result_shared: 'Summary copied to clipboard',
  result_analyse_another: 'Analyse another document',
  result_no_result: 'No analysis found. Please analyse a document first.',
  footer_disclaimer:
    'A proof of concept. Not affiliated with Nyeri County Government.',
  footer_right:
    'Built for clearer civic participation in Kenya.',
  footer_built:
    'Built by Nazarene Gena for the 2026 civic tech invention sprint.',
  lang_label: 'Language',
};

type UiStrings = typeof en;

export type { UiStrings };

const sw: UiStrings = {
  nav_home: 'Nyumbani',
  nav_analyse: 'Chambua',
  nav_how_works: 'Inavyofanya kazi',
  header_tagline: 'Taarifa za umma, zilizofanywa kuwa muhimu.',
  cta_analyse_doc: 'Chambua hati',
  hero_tagline:
    'Elewa zabuni za Kaunti ya Nyeri kwa Kiswahili rahisi au Kiingereza',
  hero_problem:
    'Zabuni za umma ziko wazi kisheria — lakini kivitendo hazisomeki. Zimeandikwa kwa Kiingereza kigumu cha sheria na ununuzi, huku tarehe za mwisho na sifa za kustahiki zikifichwa ndani ya PDF. Kama huzielewi, huwezi kuomba zabuni, wala huwezi kuhoji jinsi pesa za umma zinavyotumika.',
  cta_analyse: 'Chambua hati',
  cta_sample: 'Tazama mfano',
  home_badge: 'Imejengwa kwa ushiriki wa umma',
  home_hero_prefix: 'Zabuni za umma,',
  home_hero_highlight: 'zilizowazi.',
  home_hero_body:
    'Elewa zabuni za Kaunti ya Nyeri kwa Kiswahili rahisi au Kiingereza. Wajibu anageuza nyaraka ngumu za umma kuwa taarifa muhimu na zinazoweza kutekelezwa.',
  home_no_account: 'Hakuna akaunti inayohitajika. Hati zako zinabaki zako.',
  home_mock_file: 'Ilani ya zabuni.pdf',
  home_mock_uploaded: 'Imepakiwa muda mfupi uliopita',
  home_mock_analysed: 'Imechambuliwa',
  home_mock_plain_lang: 'Kwa lugha rahisi',
  home_mock_blurb:
    'Kaunti ya Nyeri inatafuta biashara iliyosajiliwa kusambaza vifaa vya matibabu.',
  home_mock_deadline: '18 Okt 2024',
  home_mock_value: 'KES 12.5M',
  samples_eyebrow: 'Jaribu mfano halisi',
  samples_h2: 'Chunguza zabuni za mfano',
  samples_desc:
    'Ona jinsi Wajibu anavyokusaidia kutoka ilani ngumu hadi hatua ya uhakika.',
  type_open: 'Zabuni ya wazi',
  type_youth: 'Imehifadhiwa kwa vijana',
  type_women: 'Imehifadhiwa kwa wanawake',
  type_pwd: 'Imehifadhiwa kwa wenye ulemavu',
  type_agpo: 'AGPO',
  samples_title: 'Jaribu hati halisi ya Nyeri',
  samples_hint: 'Chagua moja ili kuiingiza kwenye chombo cha uchambuzi',
  how_title: 'Inavyofanya kazi',
  how_sub: 'Hatua tatu kutoka hati hadi uamuzi.',
  how_1_title: 'Pakia au bandika',
  how_1_body: 'Ingiza PDF ya zabuni au bajeti na uruhusu Wajibu aisome.',
  how_2_title: 'Wajibu anaieleza',
  how_2_body: 'Maelezo muhimu, maneno magumu na mambo ya kuhojiwa kwa lugha rahisi.',
  how_3_title: 'Amua na uchukue hatua',
  how_3_body: 'Angalia kama unaweza kustahiki na nini cha kufanya baadaye.',
  analyse_title: 'Chambua hati',
  analyse_subtitle:
    'Pakia PDF ya zabuni au bajeti, au bandika maandishi yake. Wajibu atayaeleza kwa lugha rahisi.',
  analyse_upload: 'Pakia PDF',
  analyse_paste: 'Bandika maandishi',
  analyse_eyebrow: 'Anza na hati',
  analyse_title_new: 'Fanya zabuni iwe rahisi kuchukua hatua.',
  analyse_subtitle_new:
    'Pakia PDF au bandika maandishi ya ilani ya zabuni ya kaunti. Wajibu atatoa maelezo muhimu.',
  analyse_drop: 'Tupa PDF hapa, au tafuta',
  analyse_drop_hint: 'PDF · hadi MB 10',
  analyse_or: 'au',
  analyse_or_paste: 'au bandika maandishi',
  output_language: 'Lugha ya matokeo',
  output_hint: 'Unaweza kubadilisha baadaye',
  analyse_action: 'Chambua hati',
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
  result_red_flags_title: 'Mambo ya kuhojiwa',
  result_red_flags_hint: 'Si vizingiti, lakini thamani ya kuangalia kabla ya kuomba.',
  result_next_steps: 'Hatua zako zijazo',
  result_plain_lang: 'Kwa lugha rahisi',
  result_back: 'Rudi kwa mifano',
  result_complete: 'Uchambuzi umekamilika',
  result_status: 'Hali',
  status_open: 'Wazi',
  status_closed: 'Imefungwa',
  status_cancelled: 'Imeghairiwa',
  status_unknown: 'Hali haijulikani',
  status_days_left: 'siku zimebaki',
  status_closes_today: 'Inafunga leo',
  status_on: 'tarehe',
  result_share_hint: 'Saidia biashara nyingine ya ndani kupata fursa hii.',
  result_copy_link: 'Nakili kiungo',
  result_link_copied: 'Kiungo kimenakiliwa',
  result_copy_failed: 'Haikuweza kunakiliwa',
  result_sources: 'Vyanzo vya taarifa',
  result_share: 'Shiriki muhtasari huu',
  result_shared: 'Muhtasari umenakiliwa kwenye clipboard',
  result_analyse_another: 'Chambua hati nyingine',
  result_no_result: 'Hakuna uchambuzi. Tafadhali chambua hati kwanza.',
  footer_disclaimer:
    'Huu ni uthibitisho wa dhana. Hatuunganishwi na Serikali ya Kaunti ya Nyeri.',
  footer_right:
    'Imejengwa kwa ushiriki wazi wa umma nchini Kenya.',
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