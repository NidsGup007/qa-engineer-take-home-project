import { CustomersPage } from '../../pages/CustomersPage';
import { buildCustomer } from '../../support/factories';
import type { Customer } from '../../support/types';

const page = new CustomersPage();

describe('UI · View Customers', () => {
  let seeded: Customer;

  beforeEach(() => {
    cy.apiCreateCustomer(buildCustomer()).then((created) => {
      seeded = created;
      page.navigate().waitForTable();
    });
  });

  afterEach(() => {
    if (seeded?.id) cy.apiDeleteCustomer(seeded.id);
  });

  it('shows the page header and the customers table', () => {
    cy.getByTestId('page-header').should('have.text', 'Customer Management');
    cy.getByTestId('customer-table').should('be.visible');
    cy.getByTestId('add-customer-button').should('be.visible');
  });

  it('displays the default seed customers from the API', () => {
    cy.fixture<{ seed: Customer[] }>('seed-customers').then(({ seed }) => {
      seed.forEach((s) => page.verifyRowMatches(s.id as number, s));
    });
  });

  it('shows a newly-seeded customer in the table', () => {
    page.verifyRowMatches(seeded.id as number, seeded);
  });

  it('filters the table by search term (email)', () => {
    page.search(seeded.email);
    page.expectRowCount(1);
    page.rowById(seeded.id as number).should('be.visible');
  });

  it('filters the table by search term (city)', () => {
    page.search(seeded.city);
    page.rowById(seeded.id as number).should('be.visible');
  });

  it('shows zero rows when search has no matches', () => {
    page.search('zzz-no-such-customer-zzz');
    page.expectRowCount(0);
  });

  it('clearing the search restores all rows', () => {
    page.search(seeded.email);
    page.expectRowCount(1);

    page.search('');
    page.rowById(seeded.id as number).should('be.visible');
    // there should be at least the seeded one plus any defaults
    page.rowCount().its('length').should('be.gte', 1);
  });
});
