/// <reference types="cypress" />
/// <reference types="../src/common/lib/types" />

declare namespace Cypress {
  interface Chainable {
    visitResourcePageAsUnauthenticatedUser(id: string): void;
    visitResourcePageAsAuthenticatedUser(id: string): void;
    createDatePeriod: ({
      name,
      startDate,
      endDate,
      resourceId,
      timeSpans,
    }: {
      name: string;
      startDate: Date;
      endDate: Date;
      resourceId: string;
      timeSpans?: Partial<TimeSpan>[];
    }) => Chainable;
  }
}
