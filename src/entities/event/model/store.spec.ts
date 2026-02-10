import { describe, it, expect } from "vitest";
import { useEventStore } from "./store";

describe("event store", () => {
  it("adds events and respects window size", () => {
    useEventStore.setState((state) => ({
      ...state,
      events: [],
      windowSize: 3,
    }));

    const add = useEventStore.getState().add;
    add({ id: "1", type: "info", message: "a", timestamp: 1, source: "s" });
    add({ id: "2", type: "warning", message: "b", timestamp: 2, source: "s" });
    add({ id: "3", type: "error", message: "c", timestamp: 3, source: "s" });
    add({ id: "4", type: "info", message: "d", timestamp: 4, source: "s" });
    const events = useEventStore.getState().events;
    expect(events.map((e) => e.id)).toEqual(["4", "3", "2"]);
  });
});
