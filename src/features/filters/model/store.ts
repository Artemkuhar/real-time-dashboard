import { create } from "zustand";
import type { EventType } from "@/entities/event/types";
import { persistGet, persistSet } from "@/shared/lib/persist";

export type Filters = {
  types: Set<EventType>;
  sources: Set<string>;
  query: string;
};

type FiltersState = Filters & {
  setTypes(types: Set<EventType>): void;
  setSources(sources: Set<string>): void;
  setQuery(query: string): void;
  reset(): void;
};

const FILTERS_STORAGE_KEY = "dashboard-filters";

type SerializedFilters = {
  types: string[];
  sources: string[];
  query: string;
};

function createEmptyFilters(): Filters {
  return {
    types: new Set<EventType>(),
    sources: new Set<string>(),
    query: "",
  };
}

function serializeFilters(filters: Filters): SerializedFilters {
  return {
    types: Array.from(filters.types),
    sources: Array.from(filters.sources),
    query: filters.query,
  };
}

function deserializeFilters(data: SerializedFilters): Filters {
  return {
    types: new Set<EventType>(data.types as EventType[]),
    sources: new Set<string>(data.sources),
    query: data.query || "",
  };
}

function loadFilters(): Filters {
  try {
    const saved = persistGet<SerializedFilters>(FILTERS_STORAGE_KEY, {
      types: [],
      sources: [],
      query: "",
    });
    return deserializeFilters(saved);
  } catch {
    return createEmptyFilters();
  }
}

function saveFilters(filters: Filters): void {
  persistSet(FILTERS_STORAGE_KEY, serializeFilters(filters));
}

export const useFiltersStore = create<FiltersState>((set, get) => {
  const initialState = loadFilters();

  const persistCurrentFilters = () => {
    const { types, sources, query } = get();
    saveFilters({ types, sources, query });
  };

  return {
    ...initialState,
    setTypes(types) {
      set({ types });
      persistCurrentFilters();
    },
    setSources(sources) {
      set({ sources });
      persistCurrentFilters();
    },
    setQuery(query) {
      set({ query });
      persistCurrentFilters();
    },
    reset() {
      const emptyFilters = createEmptyFilters();
      set(emptyFilters);
      saveFilters(emptyFilters);
    },
  };
});
