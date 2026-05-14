import { CustomersPage } from '../../pages/CustomersPage';
import { buildCustomer } from '../../support/factories';
import type { Customer } from '../../support/types';

const page = new CustomersPage();

describe('UI · Edit Customer', () => {
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

  it('pre-populates the edit modal with the existing customer values', () => {
    const modal = page.clickEditById(seeded.id as number);

    modal
      .fieldHasValue('firstName', seeded.firstName)
      .fieldHasValue('lastName', seeded.lastName)
      .fieldHasValue('email', seeded.email)
      .fieldHasValue('city', seeded.city)
      .fieldHasValue('state', seeded.state)
      .fieldHasValue('zip', seeded.zip);
  });

  it('saves edits and reflects the new values in the table', () => {
    const updates = {
      lastName: 'UpdatedLast',
      email: 'updated.user@example.com',
      city: 'Seattle',
      state: 'WA',
    };

    page.clickEditById(seeded.id as number).fill(updates).save();
    page.waitForTable();

    page.verifyRowMatches(seeded.id as number, {
      firstName: seeded.firstName, // unchanged
      ...updates,
    });
  });

  it('persists edits across a page reload', () => {
    const updates = { notes: 'Updated note from Cypress' };

    page.clickEditById(seeded.id as number).fill(updates).save();
    page.waitForTable();
    page.reload().waitForTable();

    page.verifyRowMatches(seeded.id as number, updates);
  });

  it('blocks saving when a required field is cleared', () => {
    const modal = page.clickEditById(seeded.id as number);
    modal.fill({ email: '' }).save();

    // Modal stays open because HTML required validation blocks submission
    cy.getByTestId('modal-header').should('have.text', 'Edit Customer');
    cy.getByTestId('email-input').then(($el) => {
      expect(($el[0] as HTMLInputElement).validity.valueMissing).to.eq(true);
    });
  });
});
