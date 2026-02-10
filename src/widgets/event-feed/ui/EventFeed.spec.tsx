import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { ReactElement } from "react";
import type { ListChildComponentProps } from "react-window";

vi.mock("@/entities/event/model/store", () => {
  const mockInit = vi.fn();
  const mockAdd = vi.fn();
  const mockSelect = vi.fn();
  const mockMarkSeen = vi.fn();

  const baseEvent = {
    id: "1",
    type: "info",
    message: "Test message",
    timestamp: new Date(2024, 0, 1).getTime(),
    source: "system",
    isNew: true,
  };

  type EventStoreState = {
    events: (typeof baseEvent)[];
    add: typeof mockAdd;
    select: typeof mockSelect;
    init: typeof mockInit;
    loading: boolean;
    initialized: boolean;
    markSeen: typeof mockMarkSeen;
  };

  let currentState: EventStoreState = {
    events: [baseEvent],
    add: mockAdd,
    select: mockSelect,
    init: mockInit,
    loading: false,
    initialized: true,
    markSeen: mockMarkSeen,
  };

  const useEventStoreMock = vi.fn(
    (selector: (state: EventStoreState) => unknown) => selector(currentState),
  );

  const setMockState = (partial: Partial<EventStoreState>) => {
    currentState = { ...currentState, ...partial };
  };

  const resetMockState = () => {
    currentState = {
      events: [baseEvent],
      add: mockAdd,
      select: mockSelect,
      init: mockInit,
      loading: false,
      initialized: true,
      markSeen: mockMarkSeen,
    };
  };

  const mocks = {
    mockInit,
    mockAdd,
    mockSelect,
    mockMarkSeen,
    baseEvent,
  };

  return {
    useEventStore: useEventStoreMock,
    setMockState,
    resetMockState,
    mocks,
  };
});

vi.mock("@/entities/event/api/stream", () => {
  const mockStart = vi.fn();
  const mockOn = vi.fn();
  const mockOff = vi.fn();

  const mocks = {
    mockStart,
    mockOn,
    mockOff,
  };

  return {
    globalEventStream: {
      start: mockStart,
      on: mockOn.mockImplementation(() => mockOff),
    },
    mocks,
  };
});

vi.mock("./hooks/useFilteredEvents", () => ({
  useFilteredEvents: (events: unknown[]) => events,
}));

vi.mock("react-window", () => {
  const FixedSizeList = (): ReactElement => <div data-testid="event-list" />;

  return { FixedSizeList };
});

import { EventFeed } from "./EventFeed";
import type { RowData } from "./components/EventRow";
import {
  setMockState as setStoreMockState,
  resetMockState as resetStoreMockState,
  mocks as storeMocks,
} from "@/entities/event/model/store";
import { mocks as streamMocks } from "@/entities/event/api/stream";

describe("EventFeed", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    resetStoreMockState();
  });

  it("calls init on first render", () => {
    render(<EventFeed />);
    expect(storeMocks.mockInit).toHaveBeenCalledTimes(1);
  });

  it("subscribes to globalEventStream and cleans up on unmount", () => {
    const { unmount } = render(<EventFeed />);

    expect(streamMocks.mockStart).toHaveBeenCalledTimes(1);
    expect(streamMocks.mockOn).toHaveBeenCalledTimes(1);
    expect(streamMocks.mockOn).toHaveBeenCalledWith(storeMocks.mockAdd);

    unmount();
    expect(streamMocks.mockOff).toHaveBeenCalledTimes(1);
  });

  it("renders loading state when loading and no events", () => {
    setStoreMockState({
      events: [],
      loading: true,
      initialized: false,
    });

    render(<EventFeed />);

    expect(screen.getByText("Loading events...")).toBeInTheDocument();
  });

  it("renders events list when not loading", () => {
    render(<EventFeed />);

    expect(screen.getByTestId("event-list")).toBeInTheDocument();
  });
});
