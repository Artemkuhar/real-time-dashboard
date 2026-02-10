import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  randomChoice,
  randomMessage,
  randomType,
  randomId,
  generateRandomEvent,
} from "./generator";

vi.mock("@/entities/event/constants", () => ({
  EVENT_SOURCES: ["service-a", "service-b", "service-c"],
}));

describe("event generator utilities", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    vi.spyOn(Date, "now").mockReturnValue(1704106800000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("randomChoice returns an element from array", () => {
    const arr = [1, 2, 3];
    const result = randomChoice(arr);
    expect(arr).toContain(result);
  });

  it("randomMessage returns correct message for each type", () => {
    expect(randomMessage("info")).toBe("Operation completed");
    expect(randomMessage("warning")).toBe("Latency exceeded threshold");
    expect(randomMessage("error")).toBe("Service failure detected");
  });

  it("randomType maps Math.random ranges to types", () => {
    const randomSpy = vi.spyOn(Math, "random");

    randomSpy.mockReturnValueOnce(0.1);
    expect(randomType()).toBe("info");

    randomSpy.mockReturnValueOnce(0.8);
    expect(randomType()).toBe("warning");

    randomSpy.mockReturnValueOnce(0.95);
    expect(randomType()).toBe("error");
  });

  it("randomId returns non-empty string", () => {
    const id1 = randomId();

    expect(typeof id1).toBe("string");
    expect(id1.length).toBeGreaterThan(0);
  });

  it("generateRandomEvent returns event with expected structure", () => {
    const event = generateRandomEvent();

    expect(event.id).toBeTruthy();
    expect(["info", "warning", "error"]).toContain(event.type);
    expect(typeof event.message).toBe("string");
    expect(event.timestamp).toBe(1704106800000);
    expect(["service-a", "service-b", "service-c"]).toContain(event.source);
    expect(event.isNew).toBe(true);
  });
});
