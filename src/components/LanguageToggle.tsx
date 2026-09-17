import { SegmentedControl } from "./ui/segmented-control";
import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../lib/types";

const options: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <SegmentedControl
      value={lang}
      onChange={setLang}
      options={options}
      groupLabel="Document language"
      slidingIndicator
    />
  );
}