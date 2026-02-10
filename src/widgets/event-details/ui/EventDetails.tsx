import { format } from "date-fns";
import { TYPE_COLORS } from "@/entities/event/constants";
import { useEventStore, selectors } from "@/entities/event/model/store";
import { EventDetailsHeader } from "./components/EventDetailsHeader";

export const EventDetails = () => {
  const selected = useEventStore(selectors.selected);

  if (!selected) {
    return null;
  }

  const json = JSON.stringify(selected, null, 2);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // no-op
    }
  };

  const color = TYPE_COLORS[selected.type];
  const formattedTimestamp = format(selected.timestamp, "yyyy-MM-dd HH:mm:ss");

  return (
    <div className="h-full flex flex-col pt-12">
      <EventDetailsHeader onCopy={copy} />
      <div className="mt-4 space-y-4 text-sm flex-1 overflow-hidden">
        <div
          className={`border rounded-md p-3 flex items-start gap-3 ${color}`}
        >
          <div className="w-2 h-2 mt-2 rounded-full bg-current" />
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="capitalize font-semibold text-gray-900">
                {selected.type}
              </span>
              <span className="text-gray-500">{selected.source}</span>
              <span className="ml-auto text-gray-500">
                {formattedTimestamp}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-900">{selected.message}</div>
          </div>
        </div>

        <div className="border rounded-md bg-white p-3 shadow-sm text-xs">
          <div className="font-medium text-gray-700 mb-2">Metadata</div>
          <dl className="space-y-1">
            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">ID</dt>
              <dd className="font-mono text-gray-900 truncate">
                {selected.id}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">Source</dt>
              <dd className="text-gray-900">{selected.source}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">Timestamp</dt>
              <dd className="text-gray-900">{formattedTimestamp}</dd>
            </div>
          </dl>
        </div>

        <details className="border rounded-md bg-gray-50 p-3 text-xs flex-1 min-h-0">
          <summary className="cursor-pointer font-medium text-gray-700">
            Raw JSON
          </summary>
          <pre className="mt-2 overflow-auto max-h-64">{json}</pre>
        </details>
      </div>
    </div>
  );
};
