Cypress.Commands.add('fillFormFromFixture', (fixturePath, formSelector = 'form') => {
  cy.fixture(fixturePath).then((formData) => {
    cy.fillForm(formData, formSelector);
  });
});

Cypress.Commands.add('submitAndVerify', (formSelector = 'form', expectedResult = 'success') => {
  cy.submitForm(formSelector);
  
  if (expectedResult === 'success') {
    cy.get('.success, .alert-success').should('be.visible');
  } else if (expectedResult === 'error') {
    cy.get('.error, .alert-danger').should('be.visible');
  }
});
