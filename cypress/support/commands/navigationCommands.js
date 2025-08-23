Cypress.Commands.add('navigateViaMenu', (menuPath) => {
  const menuItems = Array.isArray(menuPath) ? menuPath : [menuPath];
  
  menuItems.forEach((menuItem, index) => {
    if (index === 0) {
      // Main menu
      cy.get(`[data-cy="menu-${menuItem.toLowerCase()}"], a:contains("${menuItem}")`)
        .first()
        .click();
    } else {
      // Submenu
      cy.get(`.dropdown-menu a:contains("${menuItem}"), .sub-menu a:contains("${menuItem}")`)
        .first()
        .click();
    }
  });
  
  cy.waitForPageLoad();
});

Cypress.Commands.add('navigateViaBreadcrumb', (breadcrumbItem) => {
  cy.get('.breadcrumb a, .breadcrumb-item a')
    .contains(breadcrumbItem)
    .click();
  
  cy.waitForPageLoad();
});