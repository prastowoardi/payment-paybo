const email = Cypress.env('email');
const password = Cypress.env('password');

Cypress.on('window:before:load', (win) => {
  // Hapus proteksi context menu
  Object.defineProperty(win, 'oncontextmenu', {
    get: () => null,
    set: () => {},
  });

  // Stop event listener keydown
  win.document.addEventListener('keydown', (e) => {
    e.stopImmediatePropagation();
  }, true);

  // Nonaktifkan alert dan console
  win.console.log = () => {};
  win.console.warn = () => {};
  win.console.error = () => {};
  win.alert = () => {};

  // Hapus navigator.webdriver
  delete win.navigator.__proto__.webdriver;
});

Cypress.Commands.add('login', () => {
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

  cy.url({ timeout: 10000 }).should('include', '/dashboard');
  cy.contains('Dashboard').should('be.visible');

  cy.getCookies().then((cookies) => {
    cy.log('Cookies:', JSON.stringify(cookies));
  });

  cy.get(':nth-child(4) > .c-sidebar-nav-dropdown-toggle')
    .should('be.visible')
    .click();

  cy.wait(1000);
});
