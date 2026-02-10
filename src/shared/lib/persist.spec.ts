import { describe, it, expect, beforeEach, vi } from "vitest";
import { persistGet, persistSet } from "./persist";

describe("persist", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("persistGet", () => {
    it("returns fallback when key does not exist", () => {
      const fallback = { foo: "bar" };
      const result = persistGet("nonexistent", fallback);
      expect(result).toEqual(fallback);
    });

    it("returns parsed value when key exists", () => {
      const value = { foo: "bar", count: 42 };
      localStorage.setItem("test-key", JSON.stringify(value));

      const result = persistGet("test-key", {});
      expect(result).toEqual(value);
    });

    it("returns fallback when JSON parse fails", () => {
      localStorage.setItem("invalid-key", "not json");
      const fallback = { default: true };

      const result = persistGet("invalid-key", fallback);
      expect(result).toEqual(fallback);
    });

    it("handles null value in localStorage", () => {
      const fallback = { default: true };
      const result = persistGet("null-key", fallback);
      expect(result).toEqual(fallback);
    });
  });

  describe("persistSet", () => {
    it("stores value in localStorage as JSON", () => {
      const value = { foo: "bar", count: 42 };
      persistSet("test-key", value);

      const stored = localStorage.getItem("test-key");
      expect(stored).toBe(JSON.stringify(value));
    });

    it("handles localStorage errors gracefully", () => {
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage quota exceeded");
        });

      expect(() => persistSet("test-key", { foo: "bar" })).not.toThrow();

      setItemSpy.mockRestore();
    });

    it("stores different types correctly", () => {
      persistSet("string-key", "test");
      expect(localStorage.getItem("string-key")).toBe('"test"');

      persistSet("number-key", 42);
      expect(localStorage.getItem("number-key")).toBe("42");

      persistSet("array-key", [1, 2, 3]);
      expect(localStorage.getItem("array-key")).toBe("[1,2,3]");
    });
  });
});
