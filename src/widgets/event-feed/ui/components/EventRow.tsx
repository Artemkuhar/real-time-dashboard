import { memo, useMemo } from "react";
import type { ListChildComponentProps } from "react-window";
import { TYPE_COLORS } from "@/entities/event/constants";
import type { Event, EventType } from "@/entities/event/types";
import { formatRelative } from "date-fns";

export type RowData = {
  items: Event[];
  onSelect: (id: string | null) => void;
  initialized: boolean;
};

export const EventRow = memo(
  ({ index, style, data }: ListChildComponentProps<RowData>) => {
    const event = data.items[index];
    const color = TYPE_COLORS[event.type as EventType];
    const isNew = data.initialized && Boolean(event.isNew);

    const relativeTime = formatRelative(event.timestamp, Date.now());

    return (
      <div style={style} className="px-3">
        <button
          data-testid="event-row"
          onClick={() => data.onSelect(event.id)}
          className={`w-full text-left border rounded-md p-2 flex items-start gap-3 ${color}`}
        >
          <div className="w-2 h-2 mt-2 rounded-full bg-current" />
          <div className="flex-1">
            <div className="text-sm font-medium flex items-center gap-2">
              <span className="capitalize">{event.type}</span>
              <span className="text-xs text-gray-500">{event.source}</span>
              {isNew && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                  new
                </span>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {relativeTime}
              </span>
            </div>
            <div className="text-sm">{event.message}</div>
          </div>
        </button>
      </div>
    );
  },
);
