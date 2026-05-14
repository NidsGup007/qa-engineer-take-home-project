import type { Customer } from './types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Select a DOM element by `data-testid` value. */
      getByTestId(testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>): Chainable<JQuery<HTMLElement>>;
      /** Seed a customer directly through the API, returning the created record (with id). */
      apiCreateCustomer(payload?: Partial<Customer>): Chainable<Customer>;
      /** Delete a customer by id directly through the API. Swallows 404 so it is safe in afterEach hooks. */
      apiDeleteCustomer(id: number): Chainable<Cypress.Response<unknown>>;
      /** Best-effort cleanup: removes every customer with id >= idFrom. Used in afterEach. */
      apiCleanupCustomersFrom(idFrom: number): Chainable<void>;
    }
  }
}

Cypress.Commands.add('getByTestId', (testId, options) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

Cypress.Commands.add('apiCreateCustomer', (payload = {}) => {
  return cy
    .fixture<Customer>('customer-template')
    .then((template) => {
      const body = { ...template, ...payload };
      return cy
        .request<Customer>({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/customers`,
          body,
        })
        .then((res) => {
          expect(res.status).to.eq(201);
          return res.body;
        });
    });
});

Cypress.Commands.add('apiDeleteCustomer', (id: number) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/customers/${id}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiCleanupCustomersFrom', (idFrom: number) => {
  cy.request<Customer[]>('GET', `${Cypress.env('apiUrl')}/customers`).then((res) => {
    const toDelete = res.body.filter((c) => typeof c.id === 'number' && (c.id as number) >= idFrom);
    toDelete.forEach((c) => cy.apiDeleteCustomer(c.id as number));
  });
});

export {};
