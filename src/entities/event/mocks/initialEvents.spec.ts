import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateInitialEvents } from "./initialEvents";

vi.mock("@/entities/event/api/generator", () => ({
  generateRandomEvent: vi.fn(() => ({
    id: "base-id",
    type: "info",
    message: "base",
    timestamp: 0,
    source: "service-a",
    isNew: true,
  })),
}));

describe("generateInitialEvents", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1704106800000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates given number of events", () => {
    const events = generateInitialEvents(3);
    expect(events).toHaveLength(3);
  });

  it("marks all events as not new", () => {
    const events = generateInitialEvents(2);
    expect(events[0].isNew).toBe(false);
    expect(events[1].isNew).toBe(false);
  });

  it("assigns timestamps spaced by 1 minute in the past", () => {
    const events = generateInitialEvents(3);

    expect(events[0].timestamp).toBe(1704106800000);
    expect(events[1].timestamp).toBe(1704106800000 - 60_000);
    expect(events[2].timestamp).toBe(1704106800000 - 2 * 60_000);
  });
});
