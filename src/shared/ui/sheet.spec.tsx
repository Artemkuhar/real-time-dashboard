import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./sheet";

vi.mock("@radix-ui/react-dialog", () => {
  const Root = ({ children, open, onOpenChange }: any) => {
    const handleClick = () => {
      if (onOpenChange) onOpenChange(!open);
    };
    return (
      <div data-testid="sheet-root" data-open={open} onClick={handleClick}>
        {children}
      </div>
    );
  };

  const Trigger = ({ children, onClick }: any) => (
    <button onClick={onClick} data-testid="sheet-trigger">
      {children}
    </button>
  );

  const Portal = ({ children }: any) => (
    <div data-testid="sheet-portal">{children}</div>
  );

  const Overlay = ({ className }: any) => (
    <div data-testid="sheet-overlay" className={className} />
  );

  const Content = React.forwardRef(
    ({ children, className, side = "right" }: any, ref: any) => (
      <div
        data-testid="sheet-content"
        className={className}
        data-side={side}
        ref={ref}
      >
        {children}
      </div>
    ),
  );

  const Close = ({ children, className }: any) => (
    <button data-testid="sheet-close" className={className}>
      {children}
    </button>
  );

  const Title = ({ children, className }: any) => (
    <h2 data-testid="sheet-title" className={className}>
      {children}
    </h2>
  );

  const Description = ({ children, className }: any) => (
    <p data-testid="sheet-description" className={className}>
      {children}
    </p>
  );

  return {
    Root,
    Trigger,
    Portal,
    Overlay,
    Content,
    Close,
    Title,
    Description,
  };
});

describe("Sheet", () => {
  it("renders Sheet with content", () => {
    render(
      <Sheet open>
        <SheetContent>
          <div>Test content</div>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByTestId("sheet-root")).toHaveAttribute(
      "data-open",
      "true",
    );
    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders SheetContent with side prop", () => {
    render(
      <Sheet open>
        <SheetContent side="left">Content</SheetContent>
      </Sheet>,
    );

    const content = screen.getByTestId("sheet-content");
    expect(content).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders SheetHeader and SheetFooter", () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetHeader>
          <div>Body</div>
          <SheetFooter>Footer</SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByTestId("sheet-title")).toHaveTextContent("Title");
    expect(screen.getByTestId("sheet-description")).toHaveTextContent(
      "Description",
    );
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders SheetTrigger", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Sheet open={false} onOpenChange={onOpenChange}>
        <SheetTrigger onClick={() => onOpenChange(true)}>Open</SheetTrigger>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );

    const trigger = screen.getByTestId("sheet-trigger");
    expect(trigger).toHaveTextContent("Open");

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders close button in SheetContent", () => {
    render(
      <Sheet open>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );

    expect(screen.getByTestId("sheet-close")).toBeInTheDocument();
  });
});
