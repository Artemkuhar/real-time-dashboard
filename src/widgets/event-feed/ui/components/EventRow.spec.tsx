import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ListChildComponentProps } from "react-window";
import { EventRow, type RowData } from "./EventRow";
import type { Event } from "@/entities/event/types";

const baseEvent: Event = {
  id: "1",
  type: "info",
  message: "Test message",
  timestamp: new Date(2024, 0, 1).getTime(),
  source: "system",
  isNew: true,
};

const mockOnSelect = vi.fn();

const createRowProps = (
  event: Event,
  initialized = true,
): ListChildComponentProps<RowData> => ({
  index: 0,
  style: {},
  data: {
    items: [event],
    onSelect: mockOnSelect,
    initialized,
  },
  isScrolling: false,
});

describe("EventRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders event information", () => {
    const props = createRowProps(baseEvent);
    render(<EventRow {...props} />);

    expect(screen.getByText(baseEvent.message)).toBeInTheDocument();
    expect(screen.getByText(baseEvent.type)).toBeInTheDocument();
    expect(screen.getByText(baseEvent.source)).toBeInTheDocument();
  });

  it("shows new badge when event is new and initialized", () => {
    const props = createRowProps(baseEvent, true);
    render(<EventRow {...props} />);

    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("does not show new badge when not initialized", () => {
    const props = createRowProps(baseEvent, false);
    render(<EventRow {...props} />);

    expect(screen.queryByText("new")).not.toBeInTheDocument();
  });

  it("does not show new badge when event is not new", () => {
    const eventWithoutNew = { ...baseEvent, isNew: false };
    const props = createRowProps(eventWithoutNew, true);
    render(<EventRow {...props} />);

    expect(screen.queryByText("new")).not.toBeInTheDocument();
  });

  it("calls onSelect with event id when clicked", async () => {
    const user = userEvent.setup();
    const props = createRowProps(baseEvent);
    render(<EventRow {...props} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(baseEvent.id);
  });

  it("applies correct color class for info type", () => {
    const props = createRowProps(baseEvent);
    const { container } = render(<EventRow {...props} />);

    const button = container.querySelector("button");
    expect(button?.className).toContain("bg-blue-50");
    expect(button?.className).toContain("text-blue-700");
  });

  it("applies correct color class for warning type", () => {
    const warningEvent: Event = { ...baseEvent, type: "warning" };
    const props = createRowProps(warningEvent);
    const { container } = render(<EventRow {...props} />);

    const button = container.querySelector("button");
    expect(button?.className).toContain("bg-yellow-50");
    expect(button?.className).toContain("text-yellow-700");
  });

  it("applies correct color class for error type", () => {
    const errorEvent: Event = { ...baseEvent, type: "error" };
    const props = createRowProps(errorEvent);
    const { container } = render(<EventRow {...props} />);

    const button = container.querySelector("button");
    expect(button?.className).toContain("bg-red-50");
    expect(button?.className).toContain("text-red-700");
  });

  it("renders relative time", () => {
    const recentEvent: Event = {
      ...baseEvent,
      timestamp: Date.now() - 1000 * 60 * 5,
    };
    const props = createRowProps(recentEvent);
    const { container } = render(<EventRow {...props} />);

    const timeElement = container.querySelector(
      ".text-xs.text-gray-500.ml-auto",
    );
    expect(timeElement).toBeInTheDocument();
    expect(timeElement?.textContent).toBeTruthy();
  });
});
