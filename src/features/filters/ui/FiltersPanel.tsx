import { useMemo } from "react";
import { useFiltersStore } from "@/features/filters/model/store";
import { EVENT_SOURCES, EVENT_TYPES } from "@/entities/event/constants";
import type { EventType } from "@/entities/event/types";
import { FilterButtonGroup } from "./components/FilterButtonGroup";
import { SearchInput } from "./components/SearchInput";

export const FiltersPanel = () => {
  const { types, sources, query, setTypes, setSources, setQuery, reset } =
    useFiltersStore();

  const onToggleType = (type: EventType) => {
    const next = new Set<EventType>(types);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    setTypes(next);
  };

  const onToggleSource = (source: string) => {
    const next = new Set<string>(sources);
    if (next.has(source)) next.delete(source);
    else next.add(source);
    setSources(next);
  };

  const counters = useMemo(
    () => ({ typesCount: types.size, sourcesCount: sources.size }),
    [types, sources],
  );

  return (
    <div className="border rounded-md bg-white p-3 shadow-sm">
      <SearchInput value={query} onChange={setQuery} onReset={reset} />

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <FilterButtonGroup
          title="Types"
          count={counters.typesCount}
          options={EVENT_TYPES}
          selected={types}
          onToggle={onToggleType}
        />
        <FilterButtonGroup
          title="Sources"
          count={counters.sourcesCount}
          options={EVENT_SOURCES}
          selected={sources}
          onToggle={onToggleSource}
        />
      </div>
    </div>
  );
};
