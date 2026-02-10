import { useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useEventStore } from "@/entities/event/model/store";
import { globalEventStream } from "@/entities/event/api/stream";
import { EventRow, type RowData } from "./components/EventRow";
import { useFilteredEvents } from "./hooks/useFilteredEvents";

export const EventFeed = () => {
  const { events, add, select, init, loading, initialized, markSeen } =
    useEventStore((s) => ({
      events: s.events,
      add: s.add,
      select: s.select,
      init: s.init,
      loading: s.loading,
      initialized: s.initialized,
      markSeen: s.markSeen,
    }));

  // Initial mock load on first visit
  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    globalEventStream.start();
    const off = globalEventStream.on(add);
    return () => {
      off();
    };
  }, [add]);

  const filtered = useFilteredEvents(events);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(600);
  const itemData = useMemo(
    () =>
      ({
        items: filtered,
        onSelect: (id: string | null) => {
          if (id) {
            markSeen(id);
          }
          select(id);
        },
        initialized,
      }) satisfies RowData,
    [filtered, select, markSeen, initialized],
  );

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (loading && events.length === 0) {
    return (
      <div
        ref={containerRef}
        data-testid="events-loading"
        className="h-full flex items-center justify-center"
      >
        <div className="flex items-center gap-2 text-gray-500">
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full">
      <List
        height={height}
        itemCount={filtered.length}
        itemSize={72}
        width={"100%"}
        itemData={itemData}
      >
        {EventRow}
      </List>
    </div>
  );
};
