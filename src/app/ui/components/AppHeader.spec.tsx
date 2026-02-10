import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders app title", () => {
    render(<AppHeader />);

    expect(screen.getByText("Real-Time Dashboard")).toBeInTheDocument();
  });
});
