import { Check, HelpCircle, ShieldAlert } from 'lucide-react';
import type { UiStrings } from '../context/LanguageContext';

export type CategoryId = 'OPEN' | 'YOUTH' | 'WOMEN' | 'PLWD';
export type Verdict = 'eligible' | 'not-eligible' | 'unclear';

export const categoryOptions: { id: CategoryId; labelKey: keyof UiStrings }[] = [
  { id: 'OPEN', labelKey: 'result_category_open' },
  { id: 'YOUTH', labelKey: 'result_category_youth' },
  { id: 'WOMEN', labelKey: 'result_category_women' },
  { id: 'PLWD', labelKey: 'result_category_plwd' },
];

export const reservedKeywords: Record<Exclude<CategoryId, 'OPEN'>, string[]> = {
  YOUTH: ['youth', 'aged 18', '18-35', '18 – 35', 'young entrepreneur', 'youth group'],
  WOMEN: ['women', 'woman', 'women-led', 'women-owned', 'female'],
  PLWD: ['disab', 'persons with', 'people with', 'special group', 'pwds'],
};

export function getVerdict(hay: string, category: CategoryId): Verdict {
  if (category === 'OPEN') {
    if (/(reserved|restricted|exclusive|only for|only to)/.test(hay)) {
      return 'not-eligible';
    }
    if (/(open to all|open competition|any (registered|qualified|interested)|no restriction)/.test(hay)) {
      return 'eligible';
    }
    return 'unclear';
  }

  const keywords = reservedKeywords[category];
  if (keywords.some((word) => hay.includes(word))) return 'eligible';

  if (/(reserved|restricted|exclusive)/.test(hay)) return 'not-eligible';
  if (/(no (youth|women|disab)|excluding|not open to)/.test(hay)) return 'not-eligible';

  return 'unclear';
}

export const verdictMeta: Record<
  Verdict,
  {
    labelKey: 'result_eligible' | 'result_not_eligible' | 'result_unclear';
    className: string;
    icon: typeof Check;
  }
> = {
  eligible: {
    labelKey: 'result_eligible',
    className: 'text-success',
    icon: Check,
  },
  'not-eligible': {
    labelKey: 'result_not_eligible',
    className: 'text-warning',
    icon: ShieldAlert,
  },
  unclear: {
    labelKey: 'result_unclear',
    className: 'text-muted-foreground',
    icon: HelpCircle,
  },
};