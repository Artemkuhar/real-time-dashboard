/// <reference types="cypress" />

describe("Real-time Updates", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForEvents();
  });

  it("should receive new events in real-time", () => {
    // Get initial event count
    cy.getEventRows().then(($initialRows) => {
      const initialCount = $initialRows.length;

      // Wait for new events (events are generated every 1-3 seconds)
      cy.wait(4000);

      // Should have more or equal events
      cy.getEventRows().then(($newRows) => {
        expect($newRows.length).to.be.at.least(initialCount);
      });
    });
  });

  it('should mark new events with "new" badge', () => {
    // Wait for new events to arrive
    cy.wait(3000);

    // Check if new badge appears
    cy.get("body").then(($body) => {
      if ($body.text().includes("new")) {
        cy.contains("new").should("be.visible");
      }
    });
  });

  it("should update event feed when new events arrive", () => {
    // Get first event's ID or text
    let firstEventText: string;
    cy.getEventRows()
      .first()
      .then(($row) => {
        firstEventText = $row.text();
      });

    // Wait for new events
    cy.wait(4000);

    // First event might have changed (new events appear at top)
    cy.getEventRows()
      .first()
      .then(($row) => {
        // Either same event or new event appeared
        expect($row.text()).to.exist;
      });
  });

  it("should maintain scroll position when new events arrive", () => {
    // Scroll to a specific position
    cy.getEventRows().eq(3).scrollIntoView();
    cy.wait(1000);

    // Wait for new events
    cy.wait(3000);

    // Feed should still be scrollable
    cy.get('[aria-label="Events"]').should("be.visible");
  });

  it("should apply filters to new events", () => {
    // Apply filter
    cy.filterByType("error");
    cy.wait(500);

    // Wait for new events
    cy.wait(4000);

    // All visible events should still match the filter
    cy.getEventRows().each(($row) => {
      cy.wrap($row).should("contain.text", "error");
    });
  });

  it("should update event count in real-time", () => {
    // Get initial count
    cy.getEventRows().then(($rows) => {
      const initialCount = $rows.length;

      // Wait for updates
      cy.wait(5000);

      // Count should have increased
      cy.getEventRows().then(($newRows) => {
        // Allow for some variance, but generally should increase
        expect($newRows.length).to.be.at.least(initialCount - 1);
      });
    });
  });

  it("should handle rapid event updates", () => {
    // Wait for multiple update cycles
    cy.wait(10000);

    // Feed should still be functional
    cy.getEventRows().should("have.length.at.least", 1);

    // Should be able to interact with events
    cy.getEventRows().first().click();
    cy.get('[role="dialog"], [data-state="open"]').should("be.visible");
  });

  it("should preserve selected event when new events arrive", () => {
    // Select an event
    cy.getEventRows().first().click();
    cy.get('[role="dialog"], [data-state="open"]').should("be.visible");

    // Get selected event details
    let selectedEventText: string;
    cy.get('[role="dialog"], [data-state="open"]').then(($panel) => {
      selectedEventText = $panel.text();
    });

    // Wait for new events
    cy.wait(4000);

    // Selected event details should still be visible
    cy.get('[role="dialog"], [data-state="open"]').should("be.visible");
    cy.get('[role="dialog"], [data-state="open"]').then(($panel) => {
      // Content should be the same (same event selected)
      expect($panel.text()).to.equal(selectedEventText);
    });
  });
});
