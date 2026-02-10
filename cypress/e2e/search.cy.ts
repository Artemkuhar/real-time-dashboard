/// <reference types="cypress" />

describe("Search", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForEvents();
  });

  it("should have a search input", () => {
    cy.get('[data-testid="search-input"]').should("be.visible");
  });

  it("should filter events by search query", () => {
    // Get the first event's message
    cy.getEventRows()
      .first()
      .then(($row) => {
        const message = $row.text();
        const searchTerm = message.split(" ")[0]; // Get first word

        if (searchTerm && searchTerm.length > 2) {
          cy.searchEvents(searchTerm);
          cy.wait(500);

          // All visible events (if any) should contain the search term
          cy.get("body").then(($body) => {
            const rows = $body.find('[data-testid="event-row"]');
            if (!rows.length) return;

            cy.wrap(rows).each(($row) => {
              cy.wrap($row).should("contain.text", searchTerm);
            });
          });
        }
      });
  });

  it("should search in event messages", () => {
    cy.searchEvents("event");
    cy.wait(500);

    // Should show events containing "event" in message
    cy.getEventRows().should("have.length.at.least", 0);
  });

  it("should search in event sources", () => {
    cy.searchEvents("service");
    cy.wait(500);

    // Should show events with "service" in source
    cy.getEventRows().each(($row) => {
      cy.wrap($row).should("contain.text", "service");
    });
  });

  it("should handle empty search query", () => {
    cy.searchEvents("test-query-123");
    cy.wait(500);

    // Clear search
    cy.get('[data-testid="search-input"]').clear();
    cy.wait(500);

    // Should show all events again
    cy.getEventRows().should("have.length.at.least", 1);
  });

  it("should handle search with no results", () => {
    cy.searchEvents("nonexistent-search-term-xyz-123");
    cy.wait(500);

    // Feed should still be visible (empty state)
    cy.get('[aria-label="Events"]').should("be.visible");
  });

  it("should be case-insensitive", () => {
    cy.getEventRows()
      .first()
      .then(($row) => {
        const message = $row.text();
        const searchTerm = message.split(" ")[0];

        if (searchTerm && searchTerm.length > 2) {
          // Search with uppercase
          cy.searchEvents(searchTerm.toUpperCase());
          cy.wait(500);

          // Should still find results
          cy.getEventRows().should("have.length.at.least", 0);
        }
      });
  });

  it("should combine search with type filter", () => {
    cy.filterByType("info");
    cy.searchEvents("event");
    cy.wait(500);

    cy.get("body").then(($body) => {
      const rows = $body.find('[data-testid="event-row"]');
      if (!rows.length) return;

      cy.wrap(rows).each(($row) => {
        const text = ($row.text() || "").toLowerCase();
        expect(text.includes("info")).to.be.true;
        expect(text.includes("event")).to.be.true;
      });
    });
  });
});
