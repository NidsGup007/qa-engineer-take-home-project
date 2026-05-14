import { ConfirmDeleteSelectors } from '../selectors/customer.selectors';
import { BasePage } from './BasePage';

const S = ConfirmDeleteSelectors;

export class ConfirmDeleteModal extends BasePage {
  isOpen() {
    this.getByTestId(S.container).should('be.visible');
    this.getByTestId(S.header).should('have.text', 'Confirm Delete');
    return this;
  }

  confirm() {
    this.getByTestId(S.yesBtn).click();
    return this;
  }

  cancel() {
    this.getByTestId(S.noBtn).click();
    return this;
  }
}
