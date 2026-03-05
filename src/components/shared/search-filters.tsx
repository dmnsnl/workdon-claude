"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LOCATIONS,
  SECTORS,
  TRADES,
  BUDGET_BANDS,
  EXPERIENCE_RANGES,
} from "@/lib/search-constants";

interface SearchFiltersProps {
  activeType: string;
}

const FILTER_LABELS: Record<string, string> = {
  location: "Location",
  sector: "Sector",
  budget: "Budget",
  year: "Year",
  trade: "Trade",
  experience: "Experience",
};

export function SearchFilters({ activeType }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "__clear__") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    const type = searchParams.get("type");
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    router.push(`/search?${params.toString()}`);
  }, [router, searchParams]);

  const filterKeys = ["location", "sector", "budget", "year", "trade", "experience"];
  const activeFilters = filterKeys
    .map((key) => ({ key, value: searchParams.get(key) }))
    .filter((f) => f.value);
  const hasFilters = activeFilters.length > 0;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Location filter — all types */}
      <FilterSelect
        label="Location"
        value={searchParams.get("location") || ""}
        placeholder="Any location"
        options={LOCATIONS.map((loc) => ({ value: loc, label: loc }))}
        onChange={(v) => updateFilter("location", v || null)}
      />

      {/* Project-specific filters */}
      {activeType === "projects" && (
        <>
          <FilterSelect
            label="Sector"
            value={searchParams.get("sector") || ""}
            placeholder="Any sector"
            options={SECTORS.map((s) => ({ value: s, label: s }))}
            onChange={(v) => updateFilter("sector", v || null)}
          />
          <FilterSelect
            label="Budget"
            value={searchParams.get("budget") || ""}
            placeholder="Any budget"
            options={BUDGET_BANDS.map((b) => ({
              value: b.value,
              label: b.label,
            }))}
            onChange={(v) => updateFilter("budget", v || null)}
          />
          <FilterSelect
            label="Completion Year"
            value={searchParams.get("year") || ""}
            placeholder="Any year"
            options={years.map((yr) => ({
              value: String(yr),
              label: String(yr),
            }))}
            onChange={(v) => updateFilter("year", v || null)}
          />
        </>
      )}

      {/* Company-specific filters */}
      {activeType === "companies" && (
        <>
          <FilterSelect
            label="Trade"
            value={searchParams.get("trade") || ""}
            placeholder="Any trade"
            options={TRADES.map((t) => ({ value: t, label: t }))}
            onChange={(v) => updateFilter("trade", v || null)}
          />
          <FilterSelect
            label="Sector"
            value={searchParams.get("sector") || ""}
            placeholder="Any sector"
            options={SECTORS.map((s) => ({ value: s, label: s }))}
            onChange={(v) => updateFilter("sector", v || null)}
          />
        </>
      )}

      {/* People-specific filters */}
      {activeType === "people" && (
        <FilterSelect
          label="Experience"
          value={searchParams.get("experience") || ""}
          placeholder="Any experience"
          options={EXPERIENCE_RANGES.map((r) => ({
            value: r.value,
            label: r.label,
          }))}
          onChange={(v) => updateFilter("experience", v || null)}
        />
      )}

      {/* Active filter badges */}
      {hasFilters && (
        <div className="flex flex-wrap gap-1 pt-2 border-t">
          {activeFilters.map(({ key, value }) => {
            const displayValue =
              key === "budget"
                ? BUDGET_BANDS.find((b) => b.value === value)?.label || value
                : key === "experience"
                  ? EXPERIENCE_RANGES.find((r) => r.value === value)?.label ||
                    value
                  : value;
            return (
              <Badge
                key={key}
                variant="secondary"
                className="text-xs cursor-pointer gap-1"
                onClick={() => updateFilter(key, null)}
              >
                <span className="text-muted-foreground">
                  {FILTER_LABELS[key]}:
                </span>{" "}
                {displayValue} &times;
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Reusable filter select */
function FilterSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select
        value={value || undefined}
        onValueChange={(v) => onChange(v === "__clear__" ? null : v)}
      >
        <SelectTrigger className="mt-1 h-8 text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {value && (
            <SelectItem value="__clear__" className="text-muted-foreground">
              {placeholder}
            </SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
