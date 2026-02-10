import type { EventType } from "@/entities/event/types";

export const EVENT_TYPES: EventType[] = ["info", "warning", "error"];
export const EVENT_SOURCES = ["service-a", "service-b", "service-c"] as const;
export type EventSource = (typeof EVENT_SOURCES)[number];

export const TYPE_COLORS: Record<EventType, string> = {
  info: "bg-blue-50 text-blue-700",
  warning: "bg-yellow-50 text-yellow-700",
  error: "bg-red-50 text-red-700",
};
