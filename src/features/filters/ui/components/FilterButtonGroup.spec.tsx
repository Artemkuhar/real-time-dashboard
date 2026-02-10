import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterButtonGroup } from "./FilterButtonGroup";

describe("FilterButtonGroup", () => {
  const options = ["one", "two", "three"] as const;
  let selected: Set<(typeof options)[number]>;
  const onToggle = vi.fn((value: (typeof options)[number]) => {
    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }
  });

  beforeEach(() => {
    selected = new Set();
    onToggle.mockClear();
  });

  it("renders title, count and all options", () => {
    render(
      <FilterButtonGroup
        title="Test group"
        count={0}
        options={options}
        selected={selected}
        onToggle={onToggle}
      />,
    );

    expect(screen.getByText("Test group (0)")).toBeInTheDocument();
    options.forEach((opt) => {
      expect(screen.getByRole("button", { name: opt })).toBeInTheDocument();
    });
  });

  it("marks selected options as active", () => {
    selected = new Set(["one", "three"]);

    const { getByRole } = render(
      <FilterButtonGroup
        title="Test group"
        count={selected.size}
        options={options}
        selected={selected}
        onToggle={onToggle}
      />,
    );

    expect(getByRole("button", { name: "one" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(getByRole("button", { name: "three" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(getByRole("button", { name: "two" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onToggle when option is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FilterButtonGroup
        title="Test group"
        count={0}
        options={options}
        selected={selected}
        onToggle={onToggle}
      />,
    );

    const button = screen.getByRole("button", { name: "two" });
    await user.click(button);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith("two");
  });
});
