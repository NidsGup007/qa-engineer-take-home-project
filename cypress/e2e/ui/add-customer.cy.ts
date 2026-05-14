import { CustomersPage } from '../../pages/CustomersPage';
import { buildCustomer } from '../../support/factories';

const page = new CustomersPage();

describe('UI · Add Customer', () => {
  let createdIds: number[] = [];

  beforeEach(() => {
    createdIds = [];
    page.navigate().waitForTable();
  });

  afterEach(() => {
    createdIds.forEach((id) => cy.apiDeleteCustomer(id));
  });

  it('adds a customer with all fields filled and displays it in the table', () => {
    const customer = buildCustomer();

    page.addCustomerUI(customer).then((created) => {
      createdIds.push(created.id as number);
      page.verifyRowMatches(created.id as number, customer);
    });
  });

  it('adds a customer with only required fields (no addressLine2 / notes)', () => {
    const customer = buildCustomer({ addressLine2: '', notes: '' });

    page.addCustomerUI(customer).then((created) => {
      createdIds.push(created.id as number);
      page.verifyRowMatches(created.id as number, {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      });
    });
  });

  it('does not submit the form when a required field is empty', () => {
    const customer = buildCustomer({ firstName: '' });
    const modal = page.openAddCustomerModal();
    modal.fill(customer).save();

    // The required HTML attribute should block submit and keep the modal open.
    cy.getByTestId('modal-header').should('have.text', 'Add Customer');
    cy.getByTestId('first-name-input').then(($el) => {
      expect(($el[0] as HTMLInputElement).validity.valueMissing).to.eq(true);
    });
  });

  it('closes the modal via the close button without persisting data', () => {
    const customer = buildCustomer();
    const modal = page.openAddCustomerModal();
    modal.fill(customer).close();

    cy.getByTestId('modal-container').should('not.exist');

    // Confirm no new record landed on the API
    cy.request<{ email: string }[]>('GET', `${Cypress.env('apiUrl')}/customers`).then((res) => {
      const match = res.body.find((c) => c.email === customer.email);
      expect(match, 'customer should NOT exist after cancel').to.be.undefined;
    });
  });
});
