import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

vi.mock("@/entities/event/model/store", () => {
  const selectedEvent = {
    id: "1",
    type: "info",
    message: "Test event message",
    timestamp: new Date(2024, 0, 1, 12, 0, 0).getTime(),
    source: "service-a",
  };

  let currentSelected: typeof selectedEvent | null = selectedEvent;

  const selectors = {
    selected: () => currentSelected,
  };

  const useEventStore = (selector?: (state: unknown) => unknown) => {
    const state = {
      events: currentSelected ? [currentSelected] : [],
      selectedId: currentSelected?.id ?? null,
    };
    return selector ? selector(state) : state;
  };

  const setSelected = (value: typeof selectedEvent | null) => {
    currentSelected = value;
  };

  const resetSelected = () => {
    currentSelected = selectedEvent;
  };

  return {
    useEventStore,
    selectors,
    setSelected,
    resetSelected,
    __mocks: {
      selectedEvent,
    },
  };
});

vi.mock("./components/EventDetailsHeader", () => ({
  EventDetailsHeader: ({ onCopy }: { onCopy: () => void }) => (
    <div data-testid="event-details-header">
      <button type="button" onClick={onCopy}>
        Copy JSON
      </button>
    </div>
  ),
}));

import { EventDetails } from "./EventDetails";
import {
  setSelected,
  resetSelected,
  __mocks as storeMocks,
} from "@/entities/event/model/store";

describe("EventDetails", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    resetSelected();
  });

  it("returns null when there is no selected event", () => {
    setSelected(null);
    const { container } = render(<EventDetails />);

    expect(container.firstChild).toBeNull();
  });

  it("renders selected event details", () => {
    render(<EventDetails />);

    expect(screen.getByTestId("event-details-header")).toBeInTheDocument();
    expect(
      screen.getByText(storeMocks.selectedEvent.message),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(storeMocks.selectedEvent.source).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Metadata")).toBeInTheDocument();
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(screen.getByText("Timestamp")).toBeInTheDocument();
  });

  it("shows raw JSON of selected event", () => {
    render(<EventDetails />);

    expect(screen.getByText("Raw JSON")).toBeInTheDocument();
  });

  it("copies JSON to clipboard when copy is triggered", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<EventDetails />);

    const button = screen.getByText("Copy JSON");
    fireEvent.click(button);

    const json = JSON.stringify(storeMocks.selectedEvent, null, 2);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(json);
  });
});
