import type { UiStrings } from '../context/LanguageContext';

export interface StatusInput {
  deadline_iso?: string;
  cancelled?: boolean;
}

export type TenderStatus = 'open' | 'closed' | 'cancelled' | 'unknown';

export interface TenderStatusInfo {
  status: TenderStatus;
  daysRemaining?: number;
  deadlineDate?: Date;
}

const DAY_MS = 86_400_000;

function parseDate(value: string | undefined): Date | null {
  if (!value || typeof value !== 'string') return null;
  const bareDate = /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
  if (bareDate) {
    const [year, month, day] = value.trim().split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfToday(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function deriveStatus(
  keyDetails: StatusInput,
  now: Date = new Date()
): TenderStatusInfo {
  if (keyDetails.cancelled === true) {
    return { status: 'cancelled' };
  }

  const deadlineDate = parseDate(keyDetails.deadline_iso);
  if (!deadlineDate) {
    return { status: 'unknown' };
  }

  const today = startOfToday(now).getTime();
  const deadline = deadlineDate.getTime();

  if (deadline >= today) {
    const daysRemaining = Math.ceil((deadline - today) / DAY_MS);
    return { status: 'open', daysRemaining, deadlineDate };
  }

  return { status: 'closed', daysRemaining: 0, deadlineDate };
}

export function formatDateView(date: Date, lang: 'en' | 'sw'): string {
  try {
    return new Intl.DateTimeFormat(lang === 'sw' ? 'sw' : 'en', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

export function buildStatusLabel(
  info: TenderStatusInfo,
  t: (key: keyof UiStrings) => string,
  lang: 'en' | 'sw',
): string {
  let label = t('status_unknown');

  if (info.status === 'open') {
    if (info.daysRemaining !== undefined && info.daysRemaining <= 0) {
      label = `${t('status_open')} · ${t('status_closes_today')}`;
    } else if (info.daysRemaining !== undefined) {
      label = `${t('status_open')} · ${info.daysRemaining} ${t('status_days_left')}`;
    } else {
      label = t('status_open');
    }
  } else if (info.status === 'closed') {
    label = info.deadlineDate
      ? `${t('status_closed')} · ${t('status_on')} ${formatDateView(info.deadlineDate, lang)}`
      : t('status_closed');
  } else if (info.status === 'cancelled') {
    label = t('status_cancelled');
  }

  return label;
}