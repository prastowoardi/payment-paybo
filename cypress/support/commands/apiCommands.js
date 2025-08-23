Cypress.Commands.add('apiRequest', (method, endpoint, body = null, headers = {}) => {
  const authToken = window.localStorage.getItem('auth_token');
  
  const requestOptions = {
    method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken ? `Bearer ${authToken}` : '',
      ...headers
    },
    failOnStatusCode: false
  };

  if (body) {
    requestOptions.body = body;
  }

  return cy.request(requestOptions);
});

Cypress.Commands.add('verifyAPIResponse', (response, expectedStatus = 200, expectedProperties = []) => {
  expect(response.status).to.eq(expectedStatus);
  
  if (expectedProperties.length > 0) {
    expectedProperties.forEach(property => {
      expect(response.body).to.have.property(property);
    });
  }
});