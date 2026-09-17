import { Globe2, Type } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { TextSizeToggle } from "./TextSizeToggle";

export function LanguageBar() {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-5 py-2 lg:justify-end lg:px-8">
        <Globe2 className="size-3.5 text-muted-foreground" aria-hidden />
        <LanguageToggle />
        <Type className="ml-2 size-3.5 text-muted-foreground" aria-hidden />
        <TextSizeToggle />
      </div>
    </div>
  );
}