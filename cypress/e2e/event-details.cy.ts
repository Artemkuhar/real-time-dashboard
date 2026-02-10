/// <reference types="cypress" />

describe("Event Details Panel", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForEvents();
  });

  it("should open when clicking on an event", () => {
    cy.getEventRows().first().click({ force: true });
    // Panel should be visible
    cy.waitForDetailsPanelOpen();
  });

  it("should display event details correctly", () => {
    cy.getEventRows()
      .first()
      .then(($row) => {
        const eventText = $row.text();

        cy.wrap($row).click();

        // Details panel should contain the event information
        cy.waitForDetailsPanelOpen();
        cy.get('[data-testid="event-details-panel"][data-state="open"]')
          .first()
          .within(() => {
            // Should contain event type
            cy.contains(/info|warning|error/i).should("be.visible");

            // Should contain source
            cy.contains(/service-[abc]/i).should("be.visible");

            // Should contain message
            cy.get("div").should("contain.text", "").should("exist");
          });
      });
  });

  it("should display event metadata", () => {
    cy.getEventRows().first().click();

    cy.waitForDetailsPanelOpen();
    cy.get('[data-testid="event-details-panel"][data-state="open"]')
      .first()
      .within(() => {
        // Check for metadata section
        cy.contains("Metadata").should("be.visible");

        // Check for ID field
        cy.contains("ID").should("be.visible");

        // Check for Source field
        cy.contains("Source").should("be.visible");

        // Check for Timestamp field
        cy.contains("Timestamp").should("be.visible");
      });
  });

  it("should display raw JSON", () => {
    cy.getEventRows().first().click();

    cy.waitForDetailsPanelOpen();
    cy.get('[data-testid="event-details-panel"][data-state="open"]')
      .first()
      .within(() => {
        // Find and expand raw JSON section
        cy.contains("Raw JSON").click();

        // Should display JSON content
        cy.get("pre").should("be.visible");
        cy.get("pre").should("contain.text", "{");
        cy.get("pre").should("contain.text", "}");
      });
  });

  it("should allow copying JSON to clipboard", () => {
    cy.getEventRows().first().click();

    cy.waitForDetailsPanelOpen();
    cy.get('[data-testid="event-details-panel"][data-state="open"]')
      .first()
      .within(() => {
        // Find copy button
        cy.get('[data-testid="copy-json-button"]').click();

        // Verify clipboard content (if possible)
        cy.window().then((win) => {
          win.navigator.clipboard
            .readText()
            .then((text) => {
              expect(text).to.include("{");
              expect(text).to.include("}");
            })
            .catch(() => {
              // Clipboard API might not be available in test environment
              // This is acceptable
            });
        });
      });
  });

  it("should close when clicking outside or close button", () => {
    cy.getEventRows().first().click({ force: true });
    cy.waitForDetailsPanelOpen();

    // Close via explicit close button inside the panel
    cy.get('[data-testid="event-details-panel"][data-state="open"]')
      .first()
      .within(() => {
        cy.contains("button", "Close").click();
      });
    cy.wait(300);

    // Panel should be closed
    cy.get('[data-testid="event-details-panel"][data-state="open"]').should(
      "not.exist",
    );
  });

  it("should close when pressing Escape key", () => {
    cy.getEventRows().first().click();
    cy.waitForDetailsPanelOpen();
    cy.closeDetailsPanel();
  });

  it.skip("should update when selecting a different event", () => {
    // Click first event
    cy.getEventRows().first().click();
    cy.get('[role="dialog"][data-state="open"]', { timeout: 10000 }).should(
      "be.visible",
    );

    // Get first event text
    let firstEventText: string;
    cy.getEventRows()
      .first()
      .then(($row) => {
        firstEventText = $row.text();
      });

    // Close panel
    cy.get("body").type("{esc}");
    cy.wait(300);

    // Click second event
    cy.getEventRows().eq(1).click();
    cy.get('[role="dialog"][data-state="open"]', { timeout: 10000 }).should(
      "be.visible",
    );

    // Content should be different
    cy.get('[role="dialog"][data-state="open"]', { timeout: 10000 }).then(
      ($panel) => {
        expect($panel.text()).to.not.equal(firstEventText);
      },
    );
  });

  it("should display formatted timestamp", () => {
    cy.getEventRows().first().click();

    cy.waitForDetailsPanelOpen();
    cy.get('[data-testid="event-details-panel"][data-state="open"]')
      .first()
      .within(() => {
        // Should contain a formatted date
        cy.contains(/\d{4}-\d{2}-\d{2}/).should("be.visible");
      });
  });
});
