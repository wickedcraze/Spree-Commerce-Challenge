// tests/fixtures/test-data.ts
export const TestData = {
  user: {
    email: `test.user.${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  },
  
  shippingAddress: {
    firstName: 'Test',
    lastName: 'User',
    address1: '123 Test Street',
    address2: 'Apt 1',
    city: 'Test City',
    zipCode: '12345',
    phone: '1234567890'
  },

  testCard: {
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '123',
    name: 'Test User'
  }
};

