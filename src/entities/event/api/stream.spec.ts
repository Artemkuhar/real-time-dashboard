import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("eventemitter2", () => {
  const emitterMocks = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  };

  class EventEmitter2Mock {
    on = emitterMocks.on;
    off = emitterMocks.off;
    emit = emitterMocks.emit;
  }

  return { EventEmitter2: EventEmitter2Mock };
});

vi.mock("@/entities/event/api/generator", () => ({
  generateRandomEvent: vi.fn(() => ({
    id: "1",
    type: "info",
    message: "test",
    timestamp: 1704106800000,
    source: "service-a",
    isNew: true,
  })),
}));

import { EventStream } from "./stream";
import { generateRandomEvent } from "@/entities/event/api/generator";
import { EventEmitter2 } from "eventemitter2";

describe("EventStream", () => {
  let stream: EventStream;
  let emitterMocks: {
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
    emit: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    const emitterInstance = new (EventEmitter2 as unknown as {
      new (): {
        on: (...args: unknown[]) => unknown;
        off: (...args: unknown[]) => unknown;
        emit: (...args: unknown[]) => unknown;
      };
    })();
    emitterMocks = {
      on: emitterInstance.on as any,
      off: emitterInstance.off as any,
      emit: emitterInstance.emit as any,
    };
    vi.spyOn(window, "setTimeout").mockImplementation(((fn: TimerHandler) => {
      // Do not schedule further ticks during tests
      return 1 as unknown as number;
    }) as unknown as typeof setTimeout);
    vi.spyOn(window, "clearTimeout").mockImplementation(() => {});
    stream = new EventStream();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("emits event immediately on start and schedules next tick", () => {
    stream.start();

    expect(generateRandomEvent).toHaveBeenCalledTimes(1);
    expect(emitterMocks.emit).toHaveBeenCalledTimes(1);
    expect(emitterMocks.emit).toHaveBeenCalledWith("event", expect.any(Object));
    expect(window.setTimeout).toHaveBeenCalledTimes(1);
  });

  it("does not start twice if already running", () => {
    stream.start();
    (window.setTimeout as any).mockClear();

    stream.start();

    expect(window.setTimeout).not.toHaveBeenCalled();
  });

  it("clears timer on stop", () => {
    const clearSpy = window.clearTimeout as any;

    stream.start();
    stream.stop();

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it("registers and unregisters listeners", () => {
    const listener = vi.fn();
    const unsubscribe = stream.on(listener);

    expect(emitterMocks.on).toHaveBeenCalledWith("event", listener);

    unsubscribe();
    expect(emitterMocks.off).toHaveBeenCalledWith("event", listener);
  });
});
