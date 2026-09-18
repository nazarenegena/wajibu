import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "cn";

interface IndicatorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  groupLabel: string;
  slidingIndicator?: boolean;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  groupLabel,
  slidingIndicator = false,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  useEffect(() => {
    if (!slidingIndicator) return;
    const container = containerRef.current;
    const button = buttonRefs.current[value];
    if (!container || !button) return;

    const update = () => {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setIndicator({
        left: buttonRect.left - containerRect.left,
        top: buttonRect.top - containerRect.top,
        width: buttonRect.width,
        height: buttonRect.height,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [slidingIndicator, value]);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={groupLabel}
      className="relative inline-flex items-center rounded-full border border-border bg-muted p-1 text-sm"
    >
      {slidingIndicator && indicator ? (
        <span
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full border border-border bg-card shadow-sm transition-[left,top,width,height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          style={{
            left: indicator.left,
            top: indicator.top,
            width: indicator.width,
            height: indicator.height,
          }}
        />
      ) : null}
      {options.map((option) => {
        const active = value === option.value;
        return (
          <div
            key={option.value}
            className="flex"
            ref={(node) => {
              buttonRefs.current[option.value] = node;
            }}
          >
            <button
              type="button"
              aria-pressed={active}
              aria-label={option.ariaLabel}
              onClick={() => onChange(option.value)}
              className={cn(
                "relative cursor-pointer z-10 inline-flex h-7 shrink-0 items-center justify-center rounded-full px-2.5 text-xs font-medium transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50",
                slidingIndicator
                  ? active
                    ? "text-primary"
                    : " hover:text-foreground"
                  : active
                    ? "border border-border bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
