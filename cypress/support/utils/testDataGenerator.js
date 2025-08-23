class TestDataGenerator {
  static generateRandomEmail() {
    const timestamp = Date.now();
    return `test${timestamp}@example.com`;
  }

  static generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateRandomNumber(min = 1, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateTransactionData() {
    return {
      amount: this.generateRandomNumber(100, 10000),
      currency: 'USD',
      description: `Test transaction ${this.generateRandomString(6)}`,
      date: new Date().toISOString().split('T')[0]
    };
  }

  static generateUserData() {
    const randomString = this.generateRandomString(6);
    return {
      name: `Test User ${randomString}`,
      email: this.generateRandomEmail(),
      phone: `+1234567${this.generateRandomNumber(100, 999)}`,
      company: `Test Company ${randomString}`
    };
  }
}

// Export untuk digunakan di test files
Cypress.Commands.add('generateTestData', () => {
  return TestDataGenerator;
});