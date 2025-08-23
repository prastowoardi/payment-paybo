class LoginPage {
  constructor() {
    this.elements = {
      emailInput: () => cy.get('[name="email"], input[type="email"], #email'),
      passwordInput: () => cy.get('[name="password"], input[type="password"], #password'),
      submitButton: () => cy.get('button[type="submit"], .login-btn, [data-cy="login-button"]'),
      errorMessage: () => cy.get('.error, .alert-danger, [data-cy="error-message"]'),
      forgotPasswordLink: () => cy.get('a:contains("Forgot"), a:contains("Lupa Password")')
    };
  }

  visit() {
    cy.visit('/');
    return this;
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email);
    return this;
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password);
    return this;
  }

  submit() {
    this.elements.submitButton().click();
    return this;
  }

  login(email, password) {
    return this.fillEmail(email)
               .fillPassword(password)
               .submit();
  }

  verifyErrorMessage(expectedMessage = null) {
    this.elements.errorMessage().should('be.visible');
    if (expectedMessage) {
      this.elements.errorMessage().should('contain.text', expectedMessage);
    }
    return this;
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
    return this;
  }
}