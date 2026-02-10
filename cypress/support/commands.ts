/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for events to load in the feed
       */
      waitForEvents(): Chainable<void>;

      /**
       * Wait for a specific number of events in the feed
       */
      waitForEventCount(count: number): Chainable<void>;

      /**
       * Get event rows from the feed
       */
      getEventRows(): Chainable<JQuery<HTMLElement>>;

      /**
       * Click on an event row by index
       */
      clickEventRow(index: number): Chainable<void>;

      /**
       * Filter by event type
       */
      filterByType(type: "info" | "warning" | "error"): Chainable<void>;

      /**
       * Filter by event source
       */
      filterBySource(source: string): Chainable<void>;

      /**
       * Search events by query
       */
      searchEvents(query: string): Chainable<void>;

      /**
       * Clear all filters
       */
      clearFilters(): Chainable<void>;

      /**
       * Wait for the event details panel to open
       */
      waitForDetailsPanelOpen(): Chainable<void>;

      /**
       * Close the event details panel
       */
      closeDetailsPanel(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("waitForEvents", () => {
  cy.get('[aria-label="Events"]', { timeout: 10000 }).should("be.visible");
  cy.get('[data-testid="event-row"]', { timeout: 5000 }).should("exist");
});

Cypress.Commands.add("waitForEventCount", (count: number) => {
  cy.get('[data-testid="event-row"]').should("have.length.at.least", count);
});

Cypress.Commands.add("getEventRows", () => {
  return cy.get('[data-testid="event-row"]');
});

Cypress.Commands.add("clickEventRow", (index: number) => {
  cy.getEventRows().eq(index).click();
});

Cypress.Commands.add("filterByType", (type: "info" | "warning" | "error") => {
  cy.get(`[data-testid="filter-types-${type}"]`).click();
});

Cypress.Commands.add("filterBySource", (source: string) => {
  cy.get(`[data-testid="filter-sources-${source}"]`).click();
});

Cypress.Commands.add("searchEvents", (query: string) => {
  cy.get('[data-testid="search-input"]').clear().type(query);
});

Cypress.Commands.add("clearFilters", () => {
  cy.get('[data-testid="reset-filters-button"]').click();
});

Cypress.Commands.add("waitForDetailsPanelOpen", () => {
  cy.get('[data-testid="event-details-panel"][data-state="open"]', {
    timeout: 10000,
  }).should("be.visible");
  cy.get('[data-testid="event-details"]', { timeout: 10000 }).should(
    "be.visible",
  );
});

Cypress.Commands.add("closeDetailsPanel", () => {
  // Send Escape to close and verify it's gone
  cy.get("body").type("{esc}");
  cy.get('[data-testid="event-details-panel"][data-state="open"]').should(
    "not.exist",
  );
});

export {};
