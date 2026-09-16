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
    <ol className="mt-5 flex flex-col gap-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-3 text-sm leading-relaxed">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}