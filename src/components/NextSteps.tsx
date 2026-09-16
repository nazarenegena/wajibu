import { CornerDownRight } from "lucide-react";

interface NextStepsProps {
  steps: string[];
}

export function NextSteps({ steps }: NextStepsProps) {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No clear next steps were identified for this document.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <span className="flex-1 text-base leading-relaxed text-foreground">
            {step}
          </span>
          <CornerDownRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
        </li>
      ))}
    </ol>
  );
}