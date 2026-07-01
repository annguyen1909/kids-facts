"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AnimalCard } from "@/components/animals/animal-card";
import { SearchEmptyState } from "@/components/animals/search-empty-state";
import { filterAnimalsBySearchQuery } from "@/lib/animal-search";
import type { AnimalRecord } from "@/lib/types";

type AnimalCategoryBrowserProps = {
  animals: AnimalRecord[];
  categoryTitle: string;
};

export function AnimalCategoryBrowser({ animals, categoryTitle }: AnimalCategoryBrowserProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isFiltering = query !== deferredQuery;

  const filteredAnimals = useMemo(
    () => filterAnimalsBySearchQuery(animals, deferredQuery),
    [animals, deferredQuery],
  );

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  return (
    <div className="animal-category-browser">
      <div className="animal-search-toolbar">
        <Search className="animal-search-toolbar__icon" aria-hidden />
        <label htmlFor="category-animal-search" className="sr-only">
          Search {categoryTitle.toLowerCase()}
        </label>
        <input
          id="category-animal-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${categoryTitle.toLowerCase()}…`}
          className="animal-search-toolbar__input"
          autoComplete="off"
          spellCheck={false}
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="animal-search-toolbar__clear"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div
        className="border-b border-[var(--line)] pb-3 mb-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {hasQuery ? (
          <p className="font-serif text-2xl text-[var(--forest-deep)]">
            <span className={isFiltering ? "opacity-50 transition-opacity" : ""}>
              {filteredAnimals.length} result{filteredAnimals.length === 1 ? "" : "s"}
            </span>
            {" for "}
            <span className="italic">&ldquo;{trimmedQuery}&rdquo;</span>
          </p>
        ) : (
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            {animals.length} animal{animals.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      <div
        className={
          isFiltering
            ? "animal-category-browser__grid animal-category-browser__grid--pending"
            : "animal-category-browser__grid"
        }
      >
        {filteredAnimals.map((animal) => (
          <AnimalCard key={animal.core.slug} animal={animal} variant="compact" />
        ))}
      </div>

      {hasQuery && filteredAnimals.length === 0 && !isFiltering ? (
        <SearchEmptyState
          query={trimmedQuery}
          context={categoryTitle.toLowerCase()}
          onClear={() => setQuery("")}
        />
      ) : null}

      {animals.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          More {categoryTitle.toLowerCase()} pages are on the way.
        </p>
      ) : null}
    </div>
  );
}
