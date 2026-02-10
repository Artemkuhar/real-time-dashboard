import type { Event } from "@/entities/event/types";
import { EventEmitter2 } from "eventemitter2";
import { generateRandomEvent } from "@/entities/event/api/generator";

export type EventListener = (event: Event) => void;

export class EventStream {
  #timer: number | null = null;
  #emitter = new EventEmitter2();

  start() {
    if (this.#timer) return;
    const tick = () => {
      const event: Event = generateRandomEvent();
      this.#emitter.emit("event", event);
      const base = Number(import.meta.env.VITE_EVENT_INTERVAL_MS) || 1000;
      const jitter = Number(import.meta.env.VITE_EVENT_JITTER_MS) || 2000;
      const next = base + Math.random() * jitter; // configurable interval
      this.#timer = window.setTimeout(tick, next);
    };
    tick();
  }

  stop() {
    if (this.#timer) {
      window.clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  on(listener: EventListener) {
    this.#emitter.on("event", listener);
    return () => {
      this.#emitter.off("event", listener);
    };
  }
}

export const globalEventStream = new EventStream();
