import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/entities/event/model/store", () => {
  const mockSelect = vi.fn();

  const selectedEvent = {
    id: "1",
    type: "info",
    message: "Test event message",
    timestamp: Date.now(),
    source: "service-a",
  };

  let currentSelected: typeof selectedEvent | null = null;

  const selectors = {
    selected: () => currentSelected,
  };

  const useEventStore = (selector?: (state: any) => any) => {
    const state = {
      selectedId: currentSelected?.id ?? null,
      select: mockSelect,
    };
    return selector ? selector(state) : state;
  };

  const setSelected = (value: typeof selectedEvent | null) => {
    currentSelected = value;
  };

  const resetSelected = () => {
    currentSelected = null;
  };

  return {
    useEventStore,
    selectors,
    setSelected,
    resetSelected,
    mocks: {
      mockSelect,
      selectedEvent,
    },
  };
});

vi.mock("../EventDetails", () => ({
  EventDetails: () => <div data-testid="event-details" />,
}));

vi.mock("@/shared/ui/sheet", () => {
  const Sheet = ({
    open,
    onOpenChange,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="sheet"
      data-open={open}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );

  const SheetContent = ({
    children,
  }: {
    side: "right";
    className?: string;
    children: React.ReactNode;
  }) => <div data-testid="sheet-content">{children}</div>;

  return { Sheet, SheetContent };
});

import { EventDetailsPanel } from "./EventDetailsPanel";
import {
  setSelected,
  resetSelected,
  mocks as storeMocks,
} from "@/entities/event/model/store";

describe("EventDetailsPanel", () => {
  beforeEach(() => {
    resetSelected();
    vi.clearAllMocks();
  });

  it("is closed and does not render details when there is no selected event", () => {
    render(<EventDetailsPanel />);

    const sheet = screen.getByTestId("sheet");
    expect(sheet).toHaveAttribute("data-open", "false");
  });

  it("is open and renders details when an event is selected", () => {
    setSelected(storeMocks.selectedEvent);

    render(<EventDetailsPanel />);

    const sheet = screen.getByTestId("sheet");
    expect(sheet).toHaveAttribute("data-open", "true");
    expect(screen.getByTestId("event-details")).toBeInTheDocument();
  });

  it("calls select(null) when panel is closed", async () => {
    const user = userEvent.setup();
    setSelected(storeMocks.selectedEvent);

    render(<EventDetailsPanel />);

    const sheet = screen.getByTestId("sheet");
    await user.click(sheet);

    expect(storeMocks.mockSelect).toHaveBeenCalledTimes(1);
    expect(storeMocks.mockSelect).toHaveBeenCalledWith(null);
  });
});
