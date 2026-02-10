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
      const next = 1000 + Math.random() * 2000; // 1–3 seconds
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
