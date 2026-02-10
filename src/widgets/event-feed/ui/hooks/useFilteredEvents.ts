import { useMemo } from "react";
import { useFiltersStore } from "@/features/filters/model/store";
import type { Event } from "@/entities/event/types";

export function useFilteredEvents(events: Event[]) {
  const { types, sources, query } = useFiltersStore();
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (types.size && !types.has(e.type)) return false;
      if (sources.size && !sources.has(e.source)) return false;
      if (q && !e.message.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [events, types, sources, query]);
}
