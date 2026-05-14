import { CustomersPage } from '../../pages/CustomersPage';
import { buildCustomer } from '../../support/factories';
import type { Customer } from '../../support/types';

const page = new CustomersPage();

describe('UI · Remove Customer', () => {
  let seeded: Customer;

  beforeEach(() => {
    cy.apiCreateCustomer(buildCustomer()).then((created) => {
      seeded = created;
      page.navigate().waitForTable();
    });
  });

  afterEach(() => {
    // safety net in case a test failed before delete confirmation
    if (seeded?.id) cy.apiDeleteCustomer(seeded.id);
  });

  it('opens the confirm-delete modal when Delete is clicked', () => {
    page.clickDeleteById(seeded.id as number);
    cy.getByTestId('modal-header').should('have.text', 'Confirm Delete');
    cy.getByTestId('confirm-delete-yes-button').should('be.visible');
    cy.getByTestId('confirm-delete-no-button').should('be.visible');
  });

  it('cancels deletion via the No button and keeps the row', () => {
    page.clickDeleteById(seeded.id as number).cancel();

    cy.getByTestId('modal-container').should('not.exist');
    page.rowById(seeded.id as number).should('be.visible');
  });

  it('removes the customer when Yes is confirmed', () => {
    page.clickDeleteById(seeded.id as number).confirm();

    page.waitForTable();
    cy.getByTestId(`customer-row-${seeded.id}`).should('not.exist');

    // Confirm via API too
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/customers/${seeded.id}/details`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});
