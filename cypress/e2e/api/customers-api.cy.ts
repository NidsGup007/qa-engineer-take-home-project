import { buildCustomer } from '../../support/factories';
import type { Customer } from '../../support/types';

const apiUrl = () => `${Cypress.env('apiUrl')}/customers`;

describe('API · /api/customers', () => {
  const createdIds: number[] = [];

  afterEach(() => {
    while (createdIds.length) {
      const id = createdIds.pop() as number;
      cy.apiDeleteCustomer(id);
    }
  });

  describe('POST /api/customers', () => {
    it('creates a customer and returns 201 + id', () => {
      const payload = buildCustomer();

      cy.request<Customer>('POST', apiUrl(), payload).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.include({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
        });
        expect(res.body.id).to.be.a('number');
        createdIds.push(res.body.id as number);
      });
    });

    it('returns 400 when required fields are missing', () => {
      cy.request({
        method: 'POST',
        url: apiUrl(),
        failOnStatusCode: false,
        body: { firstName: 'NoLast' },
      }).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.include('Missing required fields');
      });
    });

    it('treats whitespace-only required fields as invalid', () => {
      const payload = { ...buildCustomer(), firstName: '   ' };
      cy.request({ method: 'POST', url: apiUrl(), body: payload, failOnStatusCode: false }).then(
        (res) => {
          expect(res.status).to.eq(400);
        }
      );
    });
  });

  describe('GET /api/customers', () => {
    it('returns a list including a newly created customer', () => {
      cy.apiCreateCustomer().then((created) => {
        createdIds.push(created.id as number);
        cy.request<Customer[]>('GET', apiUrl()).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an('array');
          const found = res.body.find((c) => c.id === created.id);
          expect(found, 'created customer in list').to.exist;
        });
      });
    });
  });

  describe('GET /api/customers/:customerId/details', () => {
    it('returns the customer by id', () => {
      cy.apiCreateCustomer().then((created) => {
        createdIds.push(created.id as number);
        cy.request<Customer>('GET', `${apiUrl()}/${created.id}/details`).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.id).to.eq(created.id);
          expect(res.body.email).to.eq(created.email);
        });
      });
    });

    it('returns 404 for an unknown id', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl()}/999999/details`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
        expect(res.body.error).to.eq('Customer not found');
      });
    });
  });

  describe('PUT /api/customers/:customerId', () => {
    it('updates an existing customer', () => {
      cy.apiCreateCustomer().then((created) => {
        createdIds.push(created.id as number);
        const updated = { ...created, lastName: 'Updated', city: 'Tampa' };

        cy.request<Customer>('PUT', `${apiUrl()}/${created.id}`, updated).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.include({ lastName: 'Updated', city: 'Tampa' });
          expect(res.body.id).to.eq(created.id);
        });
      });
    });

    it('returns 404 when the id does not exist', () => {
      cy.request({
        method: 'PUT',
        url: `${apiUrl()}/999999`,
        body: buildCustomer(),
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(404);
      });
    });

    it('returns 400 when a required field is removed on update', () => {
      cy.apiCreateCustomer().then((created) => {
        createdIds.push(created.id as number);
        const bad = { ...created, firstName: '' };
        cy.request({
          method: 'PUT',
          url: `${apiUrl()}/${created.id}`,
          body: bad,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(400);
        });
      });
    });
  });

  describe('DELETE /api/customers/:customerId', () => {
    it('deletes an existing customer and returns 200', () => {
      cy.apiCreateCustomer().then((created) => {
        cy.request<{ message: string }>(
          'DELETE',
          `${apiUrl()}/${created.id}`
        ).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.have.property('message', 'Customer deleted');
        });

        cy.request({
          method: 'GET',
          url: `${apiUrl()}/${created.id}/details`,
          failOnStatusCode: false,
        }).then((res) => expect(res.status).to.eq(404));
      });
    });

    it('returns 404 when deleting a missing id', () => {
      cy.request({
        method: 'DELETE',
        url: `${apiUrl()}/999999`,
        failOnStatusCode: false,
      }).then((res) => expect(res.status).to.eq(404));
    });
  });
});
