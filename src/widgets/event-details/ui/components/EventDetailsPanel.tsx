import { Sheet, SheetContent } from "@/shared/ui/sheet";
import { useEventStore, selectors } from "@/entities/event/model/store";
import { EventDetails } from "../EventDetails";

export const EventDetailsPanel = () => {
  const selected = useEventStore(selectors.selected);
  const select = useEventStore((s) => s.select);
  const isOpen = selected !== null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && select(null)}>
      <SheetContent side="right" className="w-[380px] p-0">
        <div className="p-4 h-full overflow-y-auto">
          <EventDetails />
        </div>
      </SheetContent>
    </Sheet>
  );
};
