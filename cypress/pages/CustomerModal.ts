import { CustomerModalSelectors, CustomerFieldKey } from '../selectors/customer.selectors';
import type { Customer } from '../support/types';
import { BasePage } from './BasePage';

const S = CustomerModalSelectors;

export class CustomerModal extends BasePage {
  isOpen() {
    this.getByTestId(S.container).should('be.visible');
    return this;
  }

  hasHeader(text: 'Add Customer' | 'Edit Customer') {
    this.getByTestId(S.header).should('have.text', text);
    return this;
  }

  fill(data: Partial<Customer>) {
    (Object.entries(data) as Array<[CustomerFieldKey, string | undefined]>).forEach(
      ([field, value]) => {
        const testId = S.input[field as CustomerFieldKey];
        if (!testId || value === undefined) return;
        this.getByTestId(testId).clear();
        if (value !== '') {
          this.getByTestId(testId).type(String(value), { delay: 0 });
        }
      }
    );
    return this;
  }

  save() {
    this.getByTestId(S.saveBtn).click();
    return this;
  }

  close() {
    this.getByTestId(S.closeBtn).click();
    return this;
  }

  fieldHasValue(field: CustomerFieldKey, value: string) {
    this.getByTestId(S.input[field]).should('have.value', value);
    return this;
  }
}
