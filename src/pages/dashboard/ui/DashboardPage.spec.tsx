import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/features/filters/ui/FiltersPanel", () => ({
  FiltersPanel: () => <div data-testid="filters-panel" />,
}));

vi.mock("@/widgets/event-feed/ui/EventFeed", () => ({
  EventFeed: () => <div data-testid="event-feed" />,
}));

vi.mock("@/widgets/event-details/ui/components/EventDetailsPanel", () => ({
  EventDetailsPanel: () => <div data-testid="event-details-panel" />,
}));

import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders main layout blocks", () => {
    render(<DashboardPage />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    const section = screen.getByRole("region", { name: "Events" });
    expect(section).toBeInTheDocument();
  });

  it("renders FiltersPanel, EventFeed, and EventDetailsPanel", () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("filters-panel")).toBeInTheDocument();
    expect(screen.getByTestId("event-feed")).toBeInTheDocument();
    expect(screen.getByTestId("event-details-panel")).toBeInTheDocument();
  });
});
