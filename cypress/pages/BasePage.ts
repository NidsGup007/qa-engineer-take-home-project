export abstract class BasePage {
  protected getByTestId(testId: string) {
    return cy.getByTestId(testId);
  }

  visit(path = '/') {
    cy.visit(path);
    return this;
  }

  reload() {
    cy.reload();
    return this;
  }
}
