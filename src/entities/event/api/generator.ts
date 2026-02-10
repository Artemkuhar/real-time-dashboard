import { EVENT_SOURCES } from "@/entities/event/constants";
import type { Event, EventType } from "@/entities/event/types";

export function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function randomMessage(type: EventType): string {
  switch (type) {
    case "info":
      return "Operation completed";
    case "warning":
      return "Latency exceeded threshold";
    case "error":
      return "Service failure detected";
    default:
      return "Event";
  }
}

export function randomType(): EventType {
  const r = Math.random();
  if (r < 0.65) return "info";
  if (r < 0.9) return "warning";
  return "error";
}

export function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function generateRandomEvent(): Event {
  const type = randomType();
  return {
    id: randomId(),
    type,
    message: randomMessage(type),
    timestamp: Date.now(),
    source: randomChoice(EVENT_SOURCES),
    isNew: true,
  };
}
