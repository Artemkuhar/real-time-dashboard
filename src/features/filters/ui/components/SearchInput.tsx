import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { debounce } from "@/shared/lib/utils";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

export const SearchInput = ({ value, onChange, onReset }: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedOnChange = useMemo(() => debounce(onChange, 500), [onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInputValue(next);
    debouncedOnChange(next);
  };

  const handleReset = () => {
    setInputValue("");
    onReset();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        data-testid="search-input"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search by message"
        className="flex-1 border rounded-md px-3 py-2"
      />
      <button
        data-testid="reset-filters-button"
        type="button"
        onClick={handleReset}
        className="px-3 py-2 border rounded-md"
      >
        Reset
      </button>
    </div>
  );
};
