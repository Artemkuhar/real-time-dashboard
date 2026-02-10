type FilterButtonGroupProps<T extends string> = {
  title: string;
  count: number;
  options: readonly T[];
  selected: Set<T>;
  onToggle: (value: T) => void;
};

export const FilterButtonGroup = <T extends string>({
  title,
  count,
  options,
  selected,
  onToggle,
}: FilterButtonGroupProps<T>) => {
  return (
    <div>
      <div className="text-sm font-medium mb-2">
        {title} ({count})
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected.has(option);

          return (
            <button
              key={option}
              data-testid={`filter-${title.toLowerCase()}-${option}`}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={isActive}
              className={`px-3 py-1 border rounded-md text-sm ${
                isActive ? "bg-gray-900 text-white" : "bg-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
