import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import type { MonolingualResult } from "../lib/types";

interface JargonPopoverProps {
  terms: MonolingualResult["jargon"];
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
    <div className="flex flex-col gap-2">
      {terms.map((term, index) => {
        const open = openIds.has(index);
        return (
          <Collapsible
            key={`${term.term}-${index}`}
            open={open}
            onOpenChange={(nextOpen) => toggle(index, nextOpen)}
          >
            <CollapsibleTrigger className="flex h-auto w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left font-medium transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
              <span>{term.term}</span>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-0">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {term.plain_meaning}
              </p>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}