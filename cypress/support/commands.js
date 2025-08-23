// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
})

// cypress/support/commands.js
// Custom Commands untuk reusability

// ============================
// AUTHENTICATION COMMANDS
// ============================

Cypress.Commands.add('login', (credentials = null) => {
  const user = credentials || {
    email: Cypress.env('username'),
    password: Cypress.env('password')
  };

  cy.session(`login-${user.email}`, () => {
    cy.visit('/');
    
    cy.get('body').then(($body) => {
      // Handle different login form structures
      cy.loginHelper().fillCredentials(user.email, user.password);
      cy.loginHelper().submitForm();
      cy.loginHelper().verifySuccessfulLogin();
    });
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    const logoutSelectors = [
      '[data-cy="logout"]',
      'a:contains("Logout")',
      'button:contains("Logout")',
      '.logout-btn',
      '[data-testid="logout"]'
    ];

    let found = false;
    logoutSelectors.forEach(selector => {
      if (!found && $body.find(selector).length > 0) {
        cy.get(selector).first().click();
        found = true;
      }
    });

    if (!found) {
      cy.log('Logout button not found, clearing session manually');
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/login');
    }
  });

  cy.url().should('contain', 'login');
});

// ============================
// NAVIGATION COMMANDS
// ============================

Cypress.Commands.add('navigateToMenu', (menuName, submenu = null) => {
  cy.navigationHelper().clickMenu(menuName);
  
  if (submenu) {
    cy.navigationHelper().clickSubmenu(submenu);
  }
  
  cy.waitForPageLoad();
});

Cypress.Commands.add('navigateWithBreadcrumb', (path) => {
  cy.navigationHelper().verifyBreadcrumb(path);
});

// ============================
// TABLE/DATA COMMANDS
// ============================

Cypress.Commands.add('searchTable', (searchTerm, searchField = null) => {
  cy.tableHelper().performSearch(searchTerm, searchField);
  cy.waitForPageLoad();
});

Cypress.Commands.add('sortTable', (columnName, direction = 'asc') => {
  cy.tableHelper().sortByColumn(columnName, direction);
  cy.waitForPageLoad();
});

Cypress.Commands.add('filterTable', (filterOptions) => {
  cy.tableHelper().applyFilters(filterOptions);
  cy.waitForPageLoad();
});

Cypress.Commands.add('paginateTable', (page) => {
  cy.tableHelper().goToPage(page);
  cy.waitForPageLoad();
});

// ============================
// FORM COMMANDS
// ============================

Cypress.Commands.add('fillForm', (formData, formSelector = 'form') => {
  cy.get(formSelector).within(() => {
    Object.keys(formData).forEach(fieldName => {
      cy.formHelper().fillField(fieldName, formData[fieldName]);
    });
  });
});

Cypress.Commands.add('submitForm', (formSelector = 'form') => {
  cy.formHelper().submit(formSelector);
});

Cypress.Commands.add('validateFormErrors', (expectedErrors) => {
  cy.formHelper().checkValidationErrors(expectedErrors);
});

// ============================
// MODAL/DIALOG COMMANDS
// ============================

Cypress.Commands.add('openModal', (triggerSelector) => {
  cy.get(triggerSelector).click();
  cy.modalHelper().waitForModal();
});

Cypress.Commands.add('closeModal', () => {
  cy.modalHelper().closeModal();
});

Cypress.Commands.add('confirmDialog', (action = 'confirm') => {
  cy.modalHelper().handleConfirmDialog(action);
});

// ============================
// UTILITY COMMANDS
// ============================

Cypress.Commands.add('waitForPageLoad', (timeout = 10000) => {
  cy.get('[data-cy="loading"], .loading, .spinner', { timeout: 1000 })
    .should('not.exist');
  cy.get('body', { timeout }).should('be.visible');
});

Cypress.Commands.add('waitForAPI', (alias) => {
  cy.wait(alias);
  cy.get('@' + alias.replace('@', '')).should('have.property', 'response');
});

Cypress.Commands.add('checkPageTitle', (expectedTitle) => {
  cy.title().should('contain', expectedTitle);
});

Cypress.Commands.add('checkURL', (expectedPath) => {
  cy.url().should('contain', expectedPath);
});

// ============================
// SCREENSHOT AND REPORTING
// ============================

Cypress.Commands.add('takeScreenshot', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.screenshot(`${name}-${timestamp}`);
});

Cypress.Commands.add('logAction', (message, data = null) => {
  cy.task('log', `[${new Date().toISOString()}] ${message}`);
  if (data) {
    cy.task('log', JSON.stringify(data, null, 2));
  }
});

// cypress/support/helpers/loginHelper.js
class LoginHelper {
  fillCredentials(email, password) {
    // Try multiple selectors for email field
    const emailSelectors = [
      '[data-cy="email"]',
      '[name="email"]',
      'input[type="email"]',
      '#email',
      '.email-input'
    ];

    const passwordSelectors = [
      '[data-cy="password"]',
      '[name="password"]',
      'input[type="password"]',
      '#password',
      '.password-input'
    ];

    cy.get('body').then(($body) => {
      // Fill email
      let emailFilled = false;
      emailSelectors.forEach(selector => {
        if (!emailFilled && $body.find(selector).length > 0) {
          cy.get(selector).clear().type(email);
          emailFilled = true;
        }
      });

      // Fill password
      let passwordFilled = false;
      passwordSelectors.forEach(selector => {
        if (!passwordFilled && $body.find(selector).length > 0) {
          cy.get(selector).clear().type(password);
          passwordFilled = true;
        }
      });

      if (!emailFilled || !passwordFilled) {
        throw new Error('Could not find email or password fields');
      }
    });

    return this;
  }

  submitForm() {
    const submitSelectors = [
      '[data-cy="login-button"]',
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Login")',
      'button:contains("Sign In")',
      '.login-btn',
      '.btn-login'
    ];

    cy.get('body').then(($body) => {
      let submitted = false;
      submitSelectors.forEach(selector => {
        if (!submitted && $body.find(selector).length > 0) {
          cy.get(selector).click();
          submitted = true;
        }
      });

      if (!submitted) {
        // Try pressing Enter on password field
        cy.get('input[type="password"]').type('{enter}');
      }
    });

    return this;
  }

  verifySuccessfulLogin() {
    // Wait for redirect away from login page
    cy.url().should('not.contain', '/login', { timeout: 15000 });
    
    // Check for dashboard or main content
    const successIndicators = [
      '[data-cy="dashboard"]',
      '.dashboard',
      '.main-content',
      'nav',
      '.sidebar',
      'body:contains("Dashboard")',
      'body:contains("Welcome")'
    ];

    cy.get('body').then(($body) => {
      let found = false;
      successIndicators.forEach(selector => {
        if (!found && $body.find(selector).length > 0) {
          cy.get(selector, { timeout: 10000 }).should('be.visible');
          found = true;
        }
      });
    });

    return this;
  }

  verifyLoginError(expectedMessage = null) {
    const errorSelectors = [
      '[data-cy="error-message"]',
      '.error',
      '.alert-danger',
      '.invalid-feedback',
      '.form-error'
    ];

    cy.get('body').then(($body) => {
      let found = false;
      errorSelectors.forEach(selector => {
        if (!found && $body.find(selector).length > 0) {
          const errorEl = cy.get(selector).should('be.visible');
          if (expectedMessage) {
            errorEl.should('contain.text', expectedMessage);
          }
          found = true;
        }
      });
    });

    return this;
  }
}

Cypress.Commands.add('loginHelper', () => {
  return new LoginHelper();
});

// cypress/support/helpers/navigationHelper.js
class NavigationHelper {
  clickMenu(menuName) {
    const menuSelectors = [
      `[data-cy="menu-${menuName.toLowerCase()}"]`,
      `[data-testid="menu-${menuName.toLowerCase()}"]`,
      `a[href*="${menuName.toLowerCase()}"]`,
      `.nav-item:contains("${menuName}")`,
      `a:contains("${menuName}")`,
      `.menu-item:contains("${menuName}")`,
      `li:contains("${menuName}") a`,
      `.sidebar a:contains("${menuName}")`
    ];

    cy.get('body').then(($body) => {
      let found = false;
      menuSelectors.forEach(selector => {
        if (!found && $body.find(selector).length > 0) {
          cy.get(selector).first().click();
          found = true;
        }
      });

      if (!found) {
        throw new Error(`Menu "${menuName}" not found`);
      }
    });

    return this;
  }

  clickSubmenu(submenuName) {
    cy.wait(500); // Wait for submenu to appear
    
    const submenuSelectors = [
      `[data-cy="submenu-${submenuName.toLowerCase()}"]`,
      `.dropdown-menu a:contains("${submenuName}")`,
      `.sub-menu a:contains("${submenuName}")`,
      `a:contains("${submenuName}")`
    ];

    cy.get('body').then(($body) => {
      let found = false;
      submenuSelectors.forEach(selector => {
        if (!found && $body.find(selector).length > 0) {
          cy.get(selector).first().click();
          found = true;
        }
      });

      if (!found) {
        throw new Error(`Submenu "${submenuName}" not found`);
      }
    });

    return this;
  }

  verifyBreadcrumb(expectedPath) {
    cy.get('[data-cy="breadcrumb"], .breadcrumb, .breadcrumb-nav').should('be.visible').within(() => {
      expectedPath.forEach((item, index) => {
        if (index === expectedPath.length - 1) {
          // Last item should be active
          cy.contains(item).should('have.class', 'active')
            .or('have.attr', 'aria-current')
            .or('be.visible');
        } else {
          cy.contains(item).should('be.visible');
        }
      });
    });

    return this;
  }

  openMobileMenu() {
    const mobileMenuSelectors = [
      '[data-cy="mobile-menu-toggle"]',
      '.mobile-menu-btn',
      '.hamburger',
      '.navbar-toggler',
      '.menu-toggle'
    ];

    cy.get('body').then(($body) => {
      mobileMenuSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click();
          return false; // break
        }
      });
    });

    return this;
  }
}

Cypress.Commands.add('navigationHelper', () => {
  return new NavigationHelper();
});

// cypress/support/helpers/tableHelper.js
class TableHelper {
  performSearch(searchTerm, searchField = null) {
    if (searchField) {
      cy.get(`input[name="${searchField}"], [data-cy="search-${searchField}"]`)
        .clear().type(searchTerm);
    } else {
      const searchSelectors = [
        '[data-cy="search"]',
        'input[placeholder*="search"]',
        '.search-input',
        'input[name="search"]'
      ];

      cy.get('body').then(($body) => {
        searchSelectors.forEach(selector => {
          if ($body.find(selector).length > 0) {
            cy.get(selector).clear().type(searchTerm);
            return false;
          }
        });
      });
    }

    // Submit search
    const submitSelectors = [
      '[data-cy="search-button"]',
      'button:contains("Search")',
      'button[type="submit"]'
    ];

    cy.get('body').then(($body) => {
      let submitted = false;
      submitSelectors.forEach(selector => {
        if (!submitted && $body.find(selector).length > 0) {
          cy.get(selector).click();
          submitted = true;
        }
      });

      if (!submitted) {
        cy.get('input[placeholder*="search"]').type('{enter}');
      }
    });

    return this;
  }

  sortByColumn(columnName, direction = 'asc') {
    const columnSelectors = [
      `th:contains("${columnName}")`,
      `[data-sort="${columnName}"]`,
      `th[data-column="${columnName}"]`,
      `.sortable:contains("${columnName}")`
    ];

    cy.get('body').then(($body) => {
      columnSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          const clicks = direction === 'desc' ? 2 : 1;
          for (let i = 0; i < clicks; i++) {
            cy.get(selector).click();
          }
          return false;
        }
      });
    });

    return this;
  }

  applyFilters(filterOptions) {
    Object.keys(filterOptions).forEach(filterName => {
      const value = filterOptions[filterName];
      
      // Handle different filter types
      cy.get(`select[name="${filterName}"], [data-cy="filter-${filterName}"]`).then(($el) => {
        if ($el.is('select')) {
          cy.wrap($el).select(value);
        } else if ($el.is('input')) {
          cy.wrap($el).clear().type(value);
        }
      });
    });

    // Apply filters
    cy.get('[data-cy="apply-filters"], button:contains("Apply"), button:contains("Filter")')
      .click();

    return this;
  }

  goToPage(pageNumber) {
    const pageSelectors = [
      `[data-cy="page-${pageNumber}"]`,
      `.pagination a:contains("${pageNumber}")`,
      `.page-item:contains("${pageNumber}") a`
    ];

    cy.get('body').then(($body) => {
      pageSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click();
          return false;
        }
      });
    });

    return this;
  }

  verifyTableData(expectedData) {
    expectedData.forEach((rowData, index) => {
      cy.get('tbody tr').eq(index).within(() => {
        Object.values(rowData).forEach((cellValue, cellIndex) => {
          cy.get('td').eq(cellIndex).should('contain', cellValue);
        });
      });
    });

    return this;
  }

  getTableRowCount() {
    return cy.get('tbody tr').its('length');
  }

  clickRowAction(rowIndex, actionName) {
    cy.get('tbody tr').eq(rowIndex).within(() => {
      cy.get(`button:contains("${actionName}"), a:contains("${actionName}"), [data-cy="action-${actionName.toLowerCase()}"]`)
        .click();
    });

    return this;
  }
}

Cypress.Commands.add('tableHelper', () => {
  return new TableHelper();
});

// cypress/support/helpers/formHelper.js
class FormHelper {
  fillField(fieldName, value) {
    const fieldSelectors = [
      `[name="${fieldName}"]`,
      `[data-cy="${fieldName}"]`,
      `#${fieldName}`,
      `.${fieldName}-input`,
      `input[placeholder*="${fieldName}"]`
    ];

    cy.get('body').then(($body) => {
      fieldSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          const $field = $body.find(selector);
          
          if ($field.is('select')) {
            cy.get(selector).select(value);
          } else if ($field.is('input[type="checkbox"]')) {
            if (value) cy.get(selector).check();
            else cy.get(selector).uncheck();
          } else if ($field.is('input[type="radio"]')) {
            cy.get(`${selector}[value="${value}"]`).check();
          } else if ($field.is('textarea')) {
            cy.get(selector).clear().type(value);
          } else {
            cy.get(selector).clear().type(value);
          }
          return false;
        }
      });
    });

    return this;
  }

  submit(formSelector = 'form') {
    cy.get(formSelector).within(() => {
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        '[data-cy="submit"]',
        '.submit-btn'
      ];

      cy.get('body').then(($body) => {
        let submitted = false;
        submitSelectors.forEach(selector => {
          if (!submitted && $body.find(selector).length > 0) {
            cy.get(selector).click();
            submitted = true;
          }
        });
      });
    });

    return this;
  }

  checkValidationErrors(expectedErrors) {
    expectedErrors.forEach(error => {
      cy.get('.error, .invalid-feedback, .form-error')
        .should('contain.text', error);
    });

    return this;
  }

  reset(formSelector = 'form') {
    cy.get(formSelector).within(() => {
      cy.get('button[type="reset"], .reset-btn').click();
    });

    return this;
  }
}

Cypress.Commands.add('formHelper', () => {
  return new FormHelper();
});

// cypress/support/helpers/modalHelper.js
class ModalHelper {
  waitForModal(timeout = 5000) {
    const modalSelectors = [
      '.modal.show',
      '.modal.fade.show',
      '[data-cy="modal"]',
      '.popup',
      '.dialog'
    ];

    cy.get('body').then(($body) => {
      modalSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector, { timeout }).should('be.visible');
          return false;
        }
      });
    });

    return this;
  }

  closeModal() {
    const closeSelectors = [
      '.modal .close',
      '[data-dismiss="modal"]',
      '.modal-close',
      '[data-cy="modal-close"]',
      'button:contains("Close")'
    ];

    cy.get('body').then(($body) => {
      closeSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click();
          return false;
        }
      });
    });

    return this;
  }

  handleConfirmDialog(action = 'confirm') {
    const buttonSelectors = action === 'confirm' 
      ? ['button:contains("Confirm")', 'button:contains("OK")', '.btn-confirm']
      : ['button:contains("Cancel")', '.btn-cancel'];

    cy.get('body').then(($body) => {
      buttonSelectors.forEach(selector => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click();
          return false;
        }
      });
    });

    return this;
  }
}

Cypress.Commands.add('modalHelper', () => {
  return new ModalHelper();
});

// cypress/support/helpers/apiHelper.js
class APIHelper {
  interceptAPI(method, url, alias, response = null) {
    if (response) {
      cy.intercept(method, url, response).as(alias);
    } else {
      cy.intercept(method, url).as(alias);
    }
    return this;
  }

  waitForAPI(alias, timeout = 10000) {
    cy.wait(`@${alias}`, { timeout });
    return this;
  }

  checkAPIResponse(alias, expectedStatus = 200) {
    cy.get(`@${alias}`).should(($xhr) => {
      expect($xhr.response.statusCode).to.equal(expectedStatus);
    });
    return this;
  }
}

Cypress.Commands.add('apiHelper', () => {
  return new APIHelper();
});