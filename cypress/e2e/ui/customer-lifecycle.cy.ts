import { CustomersPage } from '../../pages/CustomersPage';
import { buildCustomer } from '../../support/factories';

const page = new CustomersPage();

describe('UI · Customer Lifecycle (create → search → edit → delete)', () => {
  const customer = buildCustomer();
  const edits = {
    lastName: 'LifecycleEdit',
    email: 'lifecycle.user@example.com',
    city: 'Austin',
    state: 'TX',
  };
  let createdId: number;

  before(() => {
    page.navigate().waitForTable();
  });

  it('adds the customer through the UI', () => {
    page.addCustomerUI(customer).then((created) => {
      createdId = created.id as number;
      page.verifyRowMatches(createdId, customer);
    });
  });

  it('finds the customer with search', () => {
    page.navigate().waitForTable();
    page.search(customer.email);
    page.expectRowCount(1);
    page.rowById(createdId).should('be.visible');
  });

  it('edits the customer', () => {
    page.navigate().waitForTable();
    page.clickEditById(createdId).fill(edits).save();
    page.waitForTable();
    page.verifyRowMatches(createdId, edits);
  });

  it('deletes the customer', () => {
    page.navigate().waitForTable();
    page.clickDeleteById(createdId).confirm();
    page.waitForTable();
    cy.getByTestId(`customer-row-${createdId}`).should('not.exist');
  });
});
