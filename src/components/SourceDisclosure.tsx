import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export interface SourceDisclosureProps {
  label?: string;
  passages: string[];
  variant?: "default" | "on-primary";
  expanded?: boolean;
}

const labelClass = (variant: "default" | "on-primary") =>
  cn(
    "inline-flex items-center gap-1.5 text-sm",
    variant === "on-primary"
      ? "text-primary-foreground/70"
      : "text-muted-foreground"
  );

const boxClass = (variant: "default" | "on-primary") =>
  cn(
    "mt-3 space-y-2 rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
    variant === "on-primary"
      ? "bg-primary-foreground/95 text-primary ring-1 ring-ring/10"
      : "bg-muted text-muted-foreground"
  );

export function SourceDisclosure({
  label,
  passages,
  variant = "default",
  expanded = false,
}: SourceDisclosureProps) {
  const [open, setOpen] = useState(false);

  if (expanded) {
    return (
      <div className="flex flex-col">
        <span className={labelClass(variant)}>
          {label}
        </span>
        <div className={boxClass(variant)}>
          {passages.map((passage, index) => (
            <p key={index}>{passage}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "group cursor-pointer inline-flex items-center gap-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm",
          variant === "on-primary"
            ? "text-primary-foreground/70 hover:text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <FileText className="size-3.5" aria-hidden />
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none",
            variant === "on-primary"
              ? "text-primary-foreground/70 group-hover:text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
          aria-hidden
        />

      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        <div className={boxClass(variant)}>
          {passages.map((passage, index) => (
            <p key={index}>{passage}</p>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
