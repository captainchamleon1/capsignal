"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { industryCategories, industryOptions } from "@/lib/content/industries";
import { SelectableCard } from "@/components/onboarding/wizard-primitives";

type IndustryPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function IndustryPicker({ value, onChange }: IndustryPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return industryOptions;
    return industryOptions.filter(
      (i) =>
        i.value.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof industryOptions>();
    for (const cat of industryCategories) {
      map.set(cat, []);
    }
    for (const item of filtered) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return [...map.entries()].filter(([, items]) => items.length > 0);
  }, [filtered]);

  return (
    <div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search industries…"
          className="field-input touch-target pl-10"
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>
      <p className="mt-2 text-xs text-text-tertiary">
        {filtered.length} industries · pick the closest fit
      </p>

      <div className="mt-4 max-h-[min(420px,55vh)] space-y-5 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-tertiary">No industries match your search.</p>
        ) : (
          grouped.map(([category, items]) => (
            <div key={category}>
              <p className="sticky top-0 z-10 bg-surface-elevated py-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                {category}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {items.map((industry) => (
                  <SelectableCard
                    key={industry.value}
                    selected={value === industry.value}
                    onClick={() => onChange(industry.value)}
                    title={industry.value}
                    description={industry.description}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {value && (
        <p className="mt-3 text-xs text-text-secondary">
          Selected: <span className="font-medium text-brand">{value}</span>
        </p>
      )}
    </div>
  );
}
