/// <reference types="cypress" />

describe("Filters", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForEvents();
  });

  describe("Type Filters", () => {
    it("should filter events by type - info", () => {
      cy.filterByType("info");

      // Wait for filter to apply
      cy.wait(500);

      // All visible events should be info type
      cy.getEventRows().each(($row) => {
        cy.wrap($row).should("contain.text", "info");
      });
    });

    it("should filter events by type - warning", () => {
      cy.filterByType("warning");
      cy.wait(500);

      cy.getEventRows().each(($row) => {
        cy.wrap($row).should("contain.text", "warning");
      });
    });

    it("should filter events by type - error", () => {
      cy.filterByType("error");
      cy.wait(500);

      cy.getEventRows().each(($row) => {
        cy.wrap($row).should("contain.text", "error");
      });
    });

    it("should allow multiple type filters", () => {
      cy.filterByType("info");
      cy.filterByType("warning");
      cy.wait(500);

      // Events should be either info or warning
      cy.getEventRows().each(($row) => {
        const text = $row.text().toLowerCase();
        expect(text.includes("info") || text.includes("warning")).to.be.true;
      });
    });

    it("should toggle type filter off", () => {
      cy.filterByType("info");
      cy.wait(500);

      // Toggle off
      cy.filterByType("info");
      cy.wait(500);

      // Should show all types again
      cy.getEventRows().should("have.length.at.least", 1);
    });
  });

  describe("Source Filters", () => {
    it("should filter events by source - service-a", () => {
      cy.filterBySource("service-a");
      cy.wait(500);

      cy.getEventRows().each(($row) => {
        cy.wrap($row).should("contain.text", "service-a");
      });
    });

    it("should filter events by source - service-b", () => {
      cy.filterBySource("service-b");
      cy.wait(500);

      cy.getEventRows().each(($row) => {
        cy.wrap($row).should("contain.text", "service-b");
      });
    });

    it("should filter events by source - service-c", () => {
      cy.filterBySource("service-c");
      cy.wait(500);

      cy.getEventRows().each(($row) => {
        cy.wrap($row).should("contain.text", "service-c");
      });
    });

    it("should allow multiple source filters", () => {
      cy.filterBySource("service-a");
      cy.filterBySource("service-b");
      cy.wait(500);

      cy.getEventRows().each(($row) => {
        const text = $row.text().toLowerCase();
        expect(text.includes("service-a") || text.includes("service-b")).to.be
          .true;
      });
    });
  });

  describe("Combined Filters", () => {
    it("should apply both type and source filters", () => {
      cy.filterByType("info");
      cy.filterBySource("service-a");
      cy.wait(500);

      cy.getEventRows().each(($row) => {
        const text = $row.text().toLowerCase();
        expect(text.includes("info")).to.be.true;
        expect(text.includes("service-a")).to.be.true;
      });
    });

    it("should show filter counts", () => {
      cy.filterByType("info");
      cy.filterByType("warning");

      // Check that filter counts are displayed
      cy.contains("Types").parent().should("contain.text", "2");
    });
  });

  describe("Reset Filters", () => {
    it("should reset all filters when reset button is clicked", () => {
      // Apply some filters
      cy.filterByType("info");
      cy.filterBySource("service-a");
      cy.searchEvents("test");
      cy.wait(500);

      // Reset filters
      cy.get('[data-testid="reset-filters-button"]').click();
      cy.wait(500);

      // Should show all events again
      cy.getEventRows().should("have.length.at.least", 1);
    });
  });
});
