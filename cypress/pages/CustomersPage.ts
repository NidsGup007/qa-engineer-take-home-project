import { CustomerTableSelectors } from '../selectors/customer.selectors';
import type { Customer } from '../support/types';
import { BasePage } from './BasePage';
import { CustomerModal } from './CustomerModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

const S = CustomerTableSelectors;

export class CustomersPage extends BasePage {
  readonly modal = new CustomerModal();
  readonly confirmDelete = new ConfirmDeleteModal();

  navigate() {
    return this.visit('/');
  }

  waitForTable() {
    this.getByTestId(S.table).should('be.visible');
    return this;
  }

  openAddCustomerModal() {
    this.getByTestId(S.addCustomerBtn).click();
    this.modal.isOpen().hasHeader('Add Customer');
    return this.modal;
  }

  search(term: string) {
    this.getByTestId(S.searchInput).clear();
    if (term) {
      this.getByTestId(S.searchInput).type(term);
    }
    return this;
  }

  rowCount() {
    return this.getByTestId(S.table).find('tbody tr');
  }

  expectRowCount(count: number) {
    if (count === 0) {
      this.getByTestId(S.table).find('tbody tr').should('have.length', 0);
    } else {
      this.getByTestId(S.table).find('tbody tr').should('have.length', count);
    }
    return this;
  }

  rowById(id: number) {
    return this.getByTestId(S.rowById(id));
  }

  clickEditById(id: number) {
    this.getByTestId(S.editBtnById(id)).click();
    this.modal.isOpen().hasHeader('Edit Customer');
    return this.modal;
  }

  clickDeleteById(id: number) {
    this.getByTestId(S.deleteBtnById(id)).click();
    this.confirmDelete.isOpen();
    return this.confirmDelete;
  }

  verifyRowMatches(id: number, expected: Partial<Customer>) {
    const row = this.rowById(id);
    row.should('be.visible');
    if (expected.firstName !== undefined) {
      row.find(`[data-testid="${S.cell.firstName}"]`).should('have.text', expected.firstName);
    }
    if (expected.lastName !== undefined) {
      row.find(`[data-testid="${S.cell.lastName}"]`).should('have.text', expected.lastName);
    }
    if (expected.email !== undefined) {
      this.rowById(id).find(`[data-testid="${S.cell.email}"]`).should('have.text', expected.email);
    }
    if (expected.addressLine1 !== undefined) {
      this.rowById(id)
        .find(`[data-testid="${S.cell.addressLine1}"]`)
        .should('have.text', expected.addressLine1);
    }
    if (expected.city !== undefined) {
      this.rowById(id).find(`[data-testid="${S.cell.city}"]`).should('have.text', expected.city);
    }
    if (expected.state !== undefined) {
      this.rowById(id).find(`[data-testid="${S.cell.state}"]`).should('have.text', expected.state);
    }
    if (expected.zip !== undefined) {
      this.rowById(id).find(`[data-testid="${S.cell.zip}"]`).should('have.text', expected.zip);
    }
    if (expected.notes !== undefined) {
      this.rowById(id).find(`[data-testid="${S.cell.notes}"]`).should('have.text', expected.notes);
    }
    return this;
  }

  /**
   * High-level helper: opens the modal, fills the form, saves, waits for the
   * post-save page reload, and returns the new customer's id by reading the
   * latest GET /api/customers response.
   */
  addCustomerUI(data: Customer) {
    this.openAddCustomerModal().fill(data).save();
    this.waitForTable();
    return cy
      .request<Customer[]>('GET', `${Cypress.env('apiUrl')}/customers`)
      .then((res) => {
        const found = res.body.find(
          (c) => c.email === data.email && c.firstName === data.firstName
        );
        expect(found, 'newly created customer should exist via API').to.exist;
        return found as Customer;
      });
  }
}
