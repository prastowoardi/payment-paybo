const email = Cypress.env('email');
const password = Cypress.env('password');

describe('Login to Back Office', () => {
  it('Login to Back Office', () => {
    cy.visit('/', {
      failOnStatusCode: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91 Safari/537.36'
      }
    });

    cy.log('Masuk ke halaman login');

    cy.get('input[name=email]').type(email);
    cy.log('Input email selesai');

    cy.get('input[name=password]').type(password);
    cy.log('Input password selesai');

    cy.get('.btn').click();
    cy.log('Klik tombol login');

    // cy.url().should('include', '/auth/otp');
    // cy.get('input[name=otp]').should('be.visible');

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');

    cy.getCookies().then((cookies) => {
      cy.log('Cookies:', JSON.stringify(cookies));
    });

    cy.get(':nth-child(4) > .c-sidebar-nav-dropdown-toggle')
      .should('be.visible')
      .click();

    cy.wait(1000);

    // Tambahan debug HTML jika page tiba-tiba blank
    // cy.wait(3000).then(() => {
    //   cy.document().then((doc) => {
    //     cy.log("HTML saat ini:");
    //     cy.log(doc.documentElement.innerHTML.substring(0, 1000));
    //   });
    // });
  });
});
