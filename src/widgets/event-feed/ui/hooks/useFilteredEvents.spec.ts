import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFilteredEvents } from "./useFilteredEvents";
import type { Event } from "@/entities/event/types";

const baseEvents: Event[] = [
  {
    id: "1",
    type: "info",
    message: "First message",
    timestamp: Date.now(),
    source: "service-a",
  },
  {
    id: "2",
    type: "warning",
    message: "Second message",
    timestamp: Date.now(),
    source: "service-b",
  },
  {
    id: "3",
    type: "error",
    message: "Third message",
    timestamp: Date.now(),
    source: "service-c",
  },
];

let mockState = {
  types: new Set<string>(),
  sources: new Set<string>(),
  query: "",
};

vi.mock("@/features/filters/model/store", () => {
  const useFiltersStore = vi.fn(() => mockState);

  return {
    useFiltersStore,
  };
});

describe("useFilteredEvents", () => {
  beforeEach(() => {
    mockState = {
      types: new Set<string>(),
      sources: new Set<string>(),
      query: "",
    };
  });

  it("returns all events when no filters are applied", () => {
    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(3);
    expect(result.current).toEqual(baseEvents);
  });

  it("filters by type when types filter is set", () => {
    mockState.types = new Set(["info", "warning"]);

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(2);
    expect(result.current.map((e) => e.id)).toEqual(["1", "2"]);
  });

  it("filters by source when sources filter is set", () => {
    mockState.sources = new Set(["service-a", "service-c"]);

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(2);
    expect(result.current.map((e) => e.id)).toEqual(["1", "3"]);
  });

  it("filters by query when query is set", () => {
    mockState.query = "Second";

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("2");
  });

  it("filters by query case insensitively", () => {
    mockState.query = "THIRD";

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("3");
  });

  it("ignores query whitespace", () => {
    mockState.query = "  Second  ";

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("2");
  });

  it("applies multiple filters together", () => {
    mockState.types = new Set(["info", "error"]);
    mockState.sources = new Set(["service-a", "service-c"]);
    mockState.query = "message";

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(2);
    expect(result.current.map((e) => e.id)).toEqual(["1", "3"]);
  });

  it("returns empty array when no events match filters", () => {
    mockState.types = new Set(["error"]);
    mockState.sources = new Set(["service-a"]);

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(0);
  });

  it("returns empty array when query does not match any event", () => {
    mockState.query = "nonexistent";

    const { result } = renderHook(() => useFilteredEvents(baseEvents));

    expect(result.current).toHaveLength(0);
  });

  it("handles empty events array", () => {
    const { result } = renderHook(() => useFilteredEvents([]));

    expect(result.current).toHaveLength(0);
  });
});
