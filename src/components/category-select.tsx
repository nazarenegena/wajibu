import { useLanguage } from "../context/LanguageContext";
import { categoryOptions, type CategoryId } from "../lib/eligibility";

interface CategorySelectProps {
  value: CategoryId | null;
  onChange: (category: CategoryId | null) => void;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  className,
}: CategorySelectProps) {
  const { t } = useLanguage();

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange((e.target.value as CategoryId) || null)}
      className={`h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30 ${className ?? ""}`}
    >
      <option value="">{t("result_category_prompt")}</option>
      {categoryOptions.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {t(opt.labelKey)}
        </option>
      ))}
    </select>
  );
}