import { describe, it, expect, beforeEach, vi } from "vitest";
import { useFiltersStore, type Filters } from "./store";

vi.mock("@/shared/lib/persist", () => {
  let stored: Record<string, unknown> = {};

  return {
    persistGet: <T>(key: string, fallback: T): T => {
      if (key in stored) {
        return stored[key] as T;
      }
      return fallback;
    },
    persistSet: <T>(key: string, value: T) => {
      stored[key] = value;
    },
    __mocks: {
      getStored: () => stored,
      resetStored: () => {
        stored = {};
      },
    },
  };
});

import { __mocks as persistMocks } from "@/shared/lib/persist";

describe("filters store", () => {
  beforeEach(() => {
    useFiltersStore.setState({
      types: new Set(),
      sources: new Set(),
      query: "",
      setTypes: useFiltersStore.getState().setTypes,
      setSources: useFiltersStore.getState().setSources,
      setQuery: useFiltersStore.getState().setQuery,
      reset: useFiltersStore.getState().reset,
    });
    persistMocks.resetStored();
  });

  it("updates types and persists filters", () => {
    const type = "info";
    const setTypes = useFiltersStore.getState().setTypes;

    const nextTypes = new Set<
      Filters["types"] extends Set<infer T> ? T : string
    >([type as never]);
    setTypes(nextTypes);

    const state = useFiltersStore.getState();
    expect(state.types.has(type as never)).toBe(true);

    const stored = persistMocks.getStored();
    expect(stored["dashboard-filters"]).toBeDefined();
    const serialized = stored["dashboard-filters"] as {
      types: string[];
      sources: string[];
      query: string;
    };
    expect(serialized.types).toContain(type);
  });

  it("updates sources and persists filters", () => {
    const source = "service-a";
    const setSources = useFiltersStore.getState().setSources;

    const nextSources = new Set<string>([source]);
    setSources(nextSources);

    const state = useFiltersStore.getState();
    expect(state.sources.has(source)).toBe(true);

    const stored = persistMocks.getStored();
    const serialized = stored["dashboard-filters"] as {
      types: string[];
      sources: string[];
      query: string;
    };
    expect(serialized.sources).toContain(source);
  });

  it("updates query and persists filters", () => {
    const setQuery = useFiltersStore.getState().setQuery;
    setQuery("test");

    const state = useFiltersStore.getState();
    expect(state.query).toBe("test");

    const stored = persistMocks.getStored();
    const serialized = stored["dashboard-filters"] as {
      types: string[];
      sources: string[];
      query: string;
    };
    expect(serialized.query).toBe("test");
  });

  it("resets filters and clears persisted values", () => {
    useFiltersStore.getState().setTypes(new Set(["info"] as never[]));
    useFiltersStore.getState().setSources(new Set(["service-a"]));
    useFiltersStore.getState().setQuery("test");

    useFiltersStore.getState().reset();

    const state = useFiltersStore.getState();
    expect(state.types.size).toBe(0);
    expect(state.sources.size).toBe(0);
    expect(state.query).toBe("");
  });
});
