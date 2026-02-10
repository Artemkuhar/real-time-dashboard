/// <reference types="cypress" />

describe("Dashboard", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the dashboard successfully", () => {
    // Check that the main elements are present
    cy.get("header").should("be.visible");
    cy.get("main").should("be.visible");
    cy.get('[aria-label="Events"]').should("be.visible");
  });

  it("should display the app header with title", () => {
    cy.get("header").should("be.visible");
    cy.contains("Real-Time Dashboard", { matchCase: false }).should("exist");
  });

  it("should show loading state initially", () => {
    // The loading state might appear briefly, so we check for either loading or events
    cy.get('[data-testid="events-loading"]')
      .should("exist")
      .then(($el) => {
        if ($el.length > 0) {
          cy.contains("Loading events").should("be.visible");
        }
      });
  });

  it("should display events feed after loading", () => {
    cy.waitForEvents();

    // Check that event rows are visible
    cy.getEventRows().should("have.length.at.least", 1);
  });

  it("should display filters panel", () => {
    cy.get('[aria-label="Events"]').within(() => {
      // Search input should be visible
      cy.get('[data-testid="search-input"]').should("be.visible");

      // Filter groups should be visible
      cy.contains("Types").should("be.visible");
      cy.contains("Sources").should("be.visible");
    });
  });

  it("should have responsive layout", () => {
    cy.viewport(1280, 720);
    cy.get("main").should("be.visible");

    cy.viewport(768, 1024);
    cy.get("main").should("be.visible");

    cy.viewport(375, 667);
    cy.get("main").should("be.visible");
  });
});
