import { create } from "zustand";
import type { Event } from "@/entities/event/types";
import { generateInitialEvents } from "@/entities/event/mocks/initialEvents";

const MIN_WINDOW_SIZE = 100;
const DEFAULT_WINDOW_SIZE = 2000;
const INITIAL_EVENT_COUNT =
  Number(import.meta.env.VITE_INITIAL_EVENT_COUNT) || 150;
const INIT_LATENCY_MS = Number(import.meta.env.VITE_INIT_LATENCY_MS) || 1200;

type EventState = {
  events: Event[];
  windowSize: number;
  selectedId: string | null;
  loading: boolean;
  initialized: boolean;
  add(event: Event): void;
  setWindowSize(size: number): void;
  select(id: string | null): void;
  markSeen(id: string): void;
  init(): Promise<void>;
};

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  windowSize: DEFAULT_WINDOW_SIZE,
  selectedId: null,
  loading: false,
  initialized: false,
  add(event) {
    const { events, windowSize } = get();
    const next = [event, ...events];
    if (next.length > windowSize) next.length = windowSize;
    set({ events: next });
  },
  setWindowSize(size) {
    const nextSize = Math.max(MIN_WINDOW_SIZE, size);

    set((state) => {
      const events =
        state.events.length > nextSize
          ? state.events.slice(0, nextSize)
          : state.events;

      return {
        windowSize: nextSize,
        events,
      };
    });
  },
  select(id) {
    set({ selectedId: id });
  },
  markSeen(id) {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, isNew: false } : event,
      ),
    }));
  },
  async init() {
    const { initialized, loading, windowSize } = get();
    if (initialized || loading) return;

    set({ loading: true });

    try {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, INIT_LATENCY_MS));

      const count = Math.min(windowSize, INITIAL_EVENT_COUNT);
      const initialEvents: Event[] = generateInitialEvents(count);

      set({
        events: initialEvents,
        initialized: true,
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export const selectors = {
  all: (s: EventState) => s.events,
  selected: (s: EventState) =>
    s.events.find((e) => e.id === s.selectedId) || null,
};
