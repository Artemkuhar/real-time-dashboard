import type { Event } from "@/entities/event/types";
import { generateRandomEvent } from "@/entities/event/api/generator";

export function generateInitialEvents(count: number): Event[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const base = generateRandomEvent();
    return {
      ...base,
      timestamp: now - index * 60_000,
      isNew: false,
    };
  });
}
