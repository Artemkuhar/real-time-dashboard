type EventDetailsHeaderProps = {
  onCopy: () => void;
};

export const EventDetailsHeader = ({ onCopy }: EventDetailsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-medium">Event Details</h2>
      <div className="flex items-center gap-2">
        <button
          data-testid="copy-json-button"
          type="button"
          onClick={onCopy}
          className="px-3 py-1 border rounded-md text-sm"
        >
          Copy JSON
        </button>
      </div>
    </div>
  );
};
