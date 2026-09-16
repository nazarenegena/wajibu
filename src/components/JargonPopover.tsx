import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import type { JargonTerm } from "../lib/types";

interface JargonPopoverProps {
  terms: JargonTerm[];
}

export function JargonPopover({ terms }: JargonPopoverProps) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const toggle = (index: number, nextOpen: boolean) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (nextOpen) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  };

  if (terms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No technical terms to explain in this document.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {terms.map((term, index) => {
        const open = openIds.has(index);
        return (
          <Collapsible
            key={`${term.term}-${index}`}
            open={open}
            onOpenChange={(nextOpen) => toggle(index, nextOpen)}
          >
            <CollapsibleTrigger
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                open ? "bg-secondary text-secondary-foreground" : "bg-card text-foreground"
              )}
            >
              {term.term}
              <ChevronDown
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 w-full">
              <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
                {term.plain_meaning}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}