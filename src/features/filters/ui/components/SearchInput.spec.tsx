import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/shared/lib/utils", () => {
  return {
    debounce: <T extends (...args: unknown[]) => void>(fn: T) => fn,
  };
});

import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  const onChange = vi.fn();
  const onReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with provided value and reset button", () => {
    render(
      <SearchInput value="initial" onChange={onChange} onReset={onReset} />,
    );

    const input = screen.getByPlaceholderText(
      "Search by message",
    ) as HTMLInputElement;
    expect(input.value).toBe("initial");
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    render(<SearchInput value="" onChange={onChange} onReset={onReset} />);

    const input = screen.getByPlaceholderText("Search by message");
    await user.type(input, "abc");

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith("abc");
  });

  it("syncs internal state when value prop changes", () => {
    const { rerender } = render(
      <SearchInput value="one" onChange={onChange} onReset={onReset} />,
    );

    const input = screen.getByPlaceholderText(
      "Search by message",
    ) as HTMLInputElement;
    expect(input.value).toBe("one");

    rerender(<SearchInput value="two" onChange={onChange} onReset={onReset} />);
    expect(input.value).toBe("two");
  });

  it("clears input and calls onReset when Reset button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <SearchInput value="some value" onChange={onChange} onReset={onReset} />,
    );

    const input = screen.getByPlaceholderText(
      "Search by message",
    ) as HTMLInputElement;
    expect(input.value).toBe("some value");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(input.value).toBe("");
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
