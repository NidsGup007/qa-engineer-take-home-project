export const CustomerTableSelectors = {
  pageHeader: 'page-header',
  addCustomerBtn: 'add-customer-button',
  searchInput: 'search-input',
  table: 'customer-table',
  headerRow: 'customer-header-row',
  rowById: (id: number) => `customer-row-${id}`,
  editBtnById: (id: number) => `edit-customer-button-${id}`,
  deleteBtnById: (id: number) => `delete-customer-button-${id}`,
  cell: {
    firstName: 'customer-first-name-cell',
    lastName: 'customer-last-name-cell',
    email: 'customer-email-cell',
    addressLine1: 'customer-address-line-1-cell',
    addressLine2: 'customer-address-line-2-cell',
    city: 'customer-city-cell',
    state: 'customer-state-cell',
    zip: 'customer-zip-cell',
    notes: 'customer-notes-cell',
  },
} as const;

export const CustomerModalSelectors = {
  container: 'modal-container',
  header: 'modal-header',
  closeBtn: 'close-button',
  input: {
    firstName: 'first-name-input',
    lastName: 'last-name-input',
    email: 'email-input',
    addressLine1: 'address-line-1-input',
    addressLine2: 'address-line-2-input',
    city: 'city-input',
    state: 'state-input',
    zip: 'zip-input',
    notes: 'notes-input',
  },
  saveBtn: 'save-button',
} as const;

export const ConfirmDeleteSelectors = {
  container: 'modal-container',
  header: 'modal-header',
  yesBtn: 'confirm-delete-yes-button',
  noBtn: 'confirm-delete-no-button',
} as const;

export type CustomerFieldKey = keyof typeof CustomerModalSelectors.input;
