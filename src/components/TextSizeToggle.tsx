import { SegmentedControl } from "./ui/segmented-control";
import { useFontSize, type FontSize } from "./FontSizeProvider";
import { useLanguage } from "../context/LanguageContext";
import type { UiStrings } from "../context/LanguageContext";

const options: {
  value: FontSize;
  label: string;
  ariaLabel: keyof UiStrings;
}[] = [
  { value: "standard", label: "A", ariaLabel: "text_size_standard" },
  { value: "large", label: "A+", ariaLabel: "text_size_large" },
  { value: "extra-large", label: "A++", ariaLabel: "text_size_extra" },
];

export function TextSizeToggle() {
  const { fontSize, setFontSize } = useFontSize();
  const { t } = useLanguage();

  return (
    <SegmentedControl
      value={fontSize}
      onChange={setFontSize}
      options={options.map((option) => ({
        ...option,
        ariaLabel: t(option.ariaLabel),
      }))}
      groupLabel={t("text_size")}
    />
  );
}