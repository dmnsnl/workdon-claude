"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface AutocompleteResult {
  id: string;
  name: string;
  type: "Project" | "Business" | "Person";
  href: string;
  subtitle: string | null;
}

const TYPE_STYLES: Record<string, string> = {
  Project: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Business: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Person: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function SearchAutocomplete({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Fetch autocomplete results
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(
      `/api/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results);
        setIsOpen(data.results.length > 0);
        setActiveIndex(-1);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setResults([]);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToResult = useCallback(
    (result: AutocompleteResult) => {
      setIsOpen(false);
      setQuery("");
      router.push(result.href);
    },
    [router]
  );

  const navigateToSearch = useCallback(() => {
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }, [query, router]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) {
      if (e.key === "Enter") {
        e.preventDefault();
        navigateToSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          navigateToResult(results[activeIndex]);
        } else {
          navigateToSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="h-8 w-full pl-8 pr-8 text-sm"
          aria-label="Search projects, companies, and people"
          aria-expanded={isOpen}
          aria-controls="search-autocomplete-list"
          aria-activedescendant={
            activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
          }
          role="combobox"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          id="search-autocomplete-list"
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover p-1 shadow-md"
        >
          {results.map((result, index) => (
            <button
              key={result.id}
              id={`search-result-${index}`}
              role="option"
              type="button"
              aria-selected={activeIndex === index}
              onClick={() => navigateToResult(result)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                activeIndex === index && "bg-accent text-accent-foreground"
              )}
            >
              <div className="flex-1 min-w-0 text-left">
                <div className="truncate font-medium">{result.name}</div>
                {result.subtitle && (
                  <div className="truncate text-xs text-muted-foreground">
                    {result.subtitle}
                  </div>
                )}
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] shrink-0 px-1.5 py-0",
                  TYPE_STYLES[result.type]
                )}
              >
                {result.type}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
