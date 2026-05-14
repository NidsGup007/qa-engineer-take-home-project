export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
}
