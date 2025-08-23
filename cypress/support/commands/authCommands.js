Cypress.Commands.add('loginViaUI', (credentials = null) => {
  const user = credentials || {
    email: Cypress.env('username'),
    password: Cypress.env('password')
  };

  cy.session(`ui-login-${user.email}`, () => {
    cy.loginPage()
      .visit()
      .login(user.email, user.password);
    
    cy.url().should('not.contain', '/login');
    cy.get('body').should('contain.text', 'Dashboard').or('contain.text', 'Welcome');
  });
});

Cypress.Commands.add('loginViaAPI', (credentials = null) => {
  const user = credentials || {
    email: Cypress.env('username'),
    password: Cypress.env('password')
  };

  cy.session(`api-login-${user.email}`, () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/login`,
      body: {
        email: user.email,
        password: user.password
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      
      // Store authentication token
      if (response.body.token) {
        window.localStorage.setItem('auth_token', response.body.token);
      }
      
      // Store user data
      if (response.body.user) {
        window.localStorage.setItem('user_data', JSON.stringify(response.body.user));
      }
    });
  });
});