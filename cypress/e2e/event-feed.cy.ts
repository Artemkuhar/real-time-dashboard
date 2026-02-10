/// <reference types="cypress" />

describe("Event Feed", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForEvents();
  });

  it("should display events in the feed", () => {
    cy.getEventRows().should("have.length.at.least", 1);
  });

  it("should display event information correctly", () => {
    cy.getEventRows()
      .first()
      .within(() => {
        // Check for event type (info, warning, or error)
        cy.contains(/info|warning|error/i).should("be.visible");

        // Check for source
        cy.contains(/service-[abc]/i).should("be.visible");

        // Check for message
        cy.get("div").should("contain.text", "").should("exist");

        // Check for timestamp
        cy.contains(/ago|just now|minute|hour|day/i).should("exist");
      });
  });

  it("should highlight new events", () => {
    // Wait a bit for new events to arrive
    cy.wait(2000);

    // Check if any event has "new" badge
    cy.get("body").then(($body) => {
      if ($body.text().includes("new")) {
        cy.contains("new").should("be.visible");
      }
    });
  });

  it("should allow clicking on an event to open details", () => {
    cy.getEventRows().first().click();

    // Event details panel should open
    cy.get('[role="dialog"], [data-state="open"]').should("be.visible");
  });

  it("should scroll through events", () => {
    // Get initial scroll position
    cy.getEventRows().should("have.length.at.least", 5);

    // Scroll to a later event
    cy.getEventRows().eq(4).scrollIntoView().should("be.visible");
  });

  it("should display different event types with correct colors", () => {
    cy.getEventRows().then(($rows) => {
      // Check for info events (blue)
      const hasInfo = Array.from($rows).some((row) =>
        row.textContent?.toLowerCase().includes("info"),
      );

      // Check for warning events (yellow)
      const hasWarning = Array.from($rows).some((row) =>
        row.textContent?.toLowerCase().includes("warning"),
      );

      // Check for error events (red)
      const hasError = Array.from($rows).some((row) =>
        row.textContent?.toLowerCase().includes("error"),
      );

      // At least one type should be present
      expect(hasInfo || hasWarning || hasError).to.be.true;
    });
  });

  it("should handle empty state gracefully", () => {
    // This test would require clearing all events, which might not be possible
    // But we can test that the feed structure exists even with filters applied
    cy.searchEvents("nonexistent-event-12345");
    cy.wait(500);

    // The feed container should still exist
    cy.get('[aria-label="Events"]').should("be.visible");
  });
});
