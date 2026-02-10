import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/pages/dashboard/ui/DashboardPage", () => ({
  DashboardPage: () => <div data-testid="dashboard-page" />,
}));

vi.mock("./ui/components/AppHeader", () => ({
  AppHeader: () => <header data-testid="app-header" />,
}));

import { App } from "./App";

describe("App", () => {
  it("renders layout with header and main dashboard", () => {
    render(<App />);

    expect(screen.getByTestId("app-header")).toBeInTheDocument();

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });
});
