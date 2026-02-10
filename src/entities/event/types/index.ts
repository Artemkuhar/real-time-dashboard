export type EventType = "info" | "warning" | "error";

export type Event = {
  id: string;
  type: EventType;
  message: string;
  timestamp: number;
  source: string;
  isNew?: boolean;
};
