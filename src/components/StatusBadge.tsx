import { Ban, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import { cn } from 'cn';
import { useLanguage } from '../context/LanguageContext';
import { buildStatusLabel, deriveStatus, type StatusInput } from '../lib/status';

interface StatusBadgeProps {
  keyDetails: StatusInput;
  className?: string;
}

export function StatusBadge({ keyDetails, className }: StatusBadgeProps) {
  const { lang, t } = useLanguage();
  const info = deriveStatus(keyDetails);

  const styles: Record<
    typeof info.status,
    { className: string; icon: typeof CheckCircle2 }
  > = {
    open: { className: 'bg-success/10 text-success', icon: CheckCircle2 },
    closed: { className: 'bg-muted text-muted-foreground', icon: Clock },
    cancelled: { className: 'bg-warning/10 text-warning', icon: Ban },
    unknown: { className: 'bg-muted text-muted-foreground', icon: HelpCircle },
  };

  const { className: toneClass, icon: Icon } = styles[info.status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClass,
        className
      )}
    >
      <Icon className="size-3.5" />
      {buildStatusLabel(info, t, lang)}
    </span>
  );
}