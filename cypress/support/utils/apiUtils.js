class APIUtils {
  static setupCommonInterceptors() {
    // Login API
    cy.intercept('POST', '**/api/auth/login').as('loginAPI');
    cy.intercept('POST', '**/api/auth/logout').as('logoutAPI');
    
    // Dashboard APIs
    cy.intercept('GET', '**/api/dashboard/**').as('dashboardAPI');
    cy.intercept('GET', '**/api/stats/**').as('statsAPI');
    
    // Transaction APIs
    cy.intercept('GET', '**/api/transactions**').as('getTransactions');
    cy.intercept('POST', '**/api/transactions').as('createTransaction');
    cy.intercept('PUT', '**/api/transactions/**').as('updateTransaction');
    cy.intercept('DELETE', '**/api/transactions/**').as('deleteTransaction');
    
    // Report APIs
    cy.intercept('GET', '**/api/reports/**').as('getReports');
    cy.intercept('POST', '**/api/reports/generate').as('generateReport');
    
    // User APIs
    cy.intercept('GET', '**/api/user/profile').as('getUserProfile');
    cy.intercept('PUT', '**/api/user/profile').as('updateUserProfile');
  }

  static mockSuccessResponse(alias, data = {}) {
    cy.intercept('GET', `**/${alias}**`, {
      statusCode: 200,
      body: { success: true, data }
    }).as(alias);
  }

  static mockErrorResponse(alias, statusCode = 500, message = 'Internal Server Error') {
    cy.intercept('GET', `**/${alias}**`, {
      statusCode,
      body: { success: false, error: message }
    }).as(alias);
  }

  static waitForAllAPIs(aliases, timeout = 10000) {
    aliases.forEach(alias => {
      cy.wait(`@${alias}`, { timeout });
    });
  }
}

Cypress.Commands.add('setupAPIInterceptors', () => {
  APIUtils.setupCommonInterceptors();
});

Cypress.Commands.add('mockAPI', (alias, response, statusCode = 200) => {
  if (statusCode >= 400) {
    APIUtils.mockErrorResponse(alias, statusCode, response.error);
  } else {
    APIUtils.mockSuccessResponse(alias, response);
  }
});