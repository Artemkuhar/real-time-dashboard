import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/features/filters/model/store", () => {
  const state = {
    types: new Set<string>(),
    sources: new Set<string>(),
    query: "",
    setTypes: vi.fn((next: Set<string>) => {
      state.types = next;
    }),
    setSources: vi.fn((next: Set<string>) => {
      state.sources = next;
    }),
    setQuery: vi.fn((value: string) => {
      state.query = value;
    }),
    reset: vi.fn(() => {
      state.types = new Set();
      state.sources = new Set();
      state.query = "";
    }),
  };

  const useFiltersStore = (selector?: (s: typeof state) => unknown) => {
    if (!selector) return state;
    return selector(state);
  };

  return {
    useFiltersStore,
    __mocks: state,
  };
});

vi.mock("@/entities/event/constants", () => ({
  EVENT_TYPES: ["info", "warning", "error"],
  EVENT_SOURCES: ["service-a", "service-b"],
}));

vi.mock("./components/FilterButtonGroup", () => ({
  FilterButtonGroup: ({
    title,
    count,
    options,
  }: {
    title: string;
    count: number;
    options: readonly string[];
  }) => (
    <div data-testid={`filter-group-${title.toLowerCase()}`}>
      <span>{title}</span>
      <span>{count}</span>
      <span>{options.join(",")}</span>
    </div>
  ),
}));

vi.mock("./components/SearchInput", () => ({
  SearchInput: ({
    value,
    onChange,
    onReset,
  }: {
    value: string;
    onChange: (value: string) => void;
    onReset: () => void;
  }) => (
    <div data-testid="search-input">
      <input
        aria-label="search"
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
      />
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  ),
}));

import { FiltersPanel } from "./FiltersPanel";
import { __mocks as storeMocks } from "@/features/filters/model/store";

describe("FiltersPanel", () => {
  beforeEach(() => {
    storeMocks.types = new Set();
    storeMocks.sources = new Set();
    storeMocks.query = "";
    storeMocks.setTypes.mockClear();
    storeMocks.setSources.mockClear();
    storeMocks.setQuery.mockClear();
    storeMocks.reset.mockClear();
  });

  it("renders search input and both filter groups", () => {
    render(<FiltersPanel />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("filter-group-types")).toBeInTheDocument();
    expect(screen.getByTestId("filter-group-sources")).toBeInTheDocument();
  });

  it("passes correct counts and options to filter groups", () => {
    storeMocks.types = new Set(["info", "warning"]);
    storeMocks.sources = new Set(["service-a"]);

    render(<FiltersPanel />);

    const typesGroup = screen.getByTestId("filter-group-types");
    const sourcesGroup = screen.getByTestId("filter-group-sources");

    expect(typesGroup).toHaveTextContent("Types");
    expect(typesGroup).toHaveTextContent("2");
    expect(typesGroup).toHaveTextContent("info,warning,error");

    expect(sourcesGroup).toHaveTextContent("Sources");
    expect(sourcesGroup).toHaveTextContent("1");
    expect(sourcesGroup).toHaveTextContent("service-a,service-b");
  });

  it("updates query via SearchInput", async () => {
    const user = userEvent.setup();
    render(<FiltersPanel />);

    const input = screen.getByLabelText("search");
    await user.type(input, "abc");

    expect(storeMocks.setQuery).toHaveBeenCalledTimes(3);
  });

  it("resets filters via SearchInput Reset button", async () => {
    const user = userEvent.setup();
    render(<FiltersPanel />);

    const resetButton = screen.getByRole("button", { name: "Reset" });
    await user.click(resetButton);

    expect(storeMocks.reset).toHaveBeenCalledTimes(1);
  });
});
