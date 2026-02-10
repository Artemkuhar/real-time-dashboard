import { FiltersPanel } from "@/features/filters/ui/FiltersPanel";
import { EventFeed } from "@/widgets/event-feed/ui/EventFeed";
import { EventDetailsPanel } from "@/widgets/event-details/ui/components/EventDetailsPanel";

export const DashboardPage = () => {
  return (
    <>
      <main className="max-w-7xl mx-auto p-4 h-full min-h-0">
        <section className="flex flex-col h-full min-h-0" aria-label="Events">
          <FiltersPanel />
          <div className="border rounded-md bg-white shadow-sm flex-1 min-h-0 overflow-hidden">
            <EventFeed />
          </div>
        </section>
      </main>
      <EventDetailsPanel />
    </>
  );
};
