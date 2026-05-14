import { faker } from '@faker-js/faker';
import type { Customer } from './types';

export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode('#####'),
    notes: faker.lorem.sentence(),
    ...overrides,
  };
}
