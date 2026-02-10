import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventDetailsHeader } from "./EventDetailsHeader";

describe("EventDetailsHeader", () => {
  it("renders title and copy button", () => {
    const onCopy = vi.fn();
    render(<EventDetailsHeader onCopy={onCopy} />);

    expect(screen.getByText("Event Details")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy JSON" }),
    ).toBeInTheDocument();
  });

  it("calls onCopy when button is clicked", async () => {
    const onCopy = vi.fn();
    render(<EventDetailsHeader onCopy={onCopy} />);

    await screen.getByRole("button", { name: "Copy JSON" }).click();

    expect(onCopy).toHaveBeenCalledTimes(1);
  });
});
