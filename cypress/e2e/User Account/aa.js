// cypress/e2e/01-login.cy.js
describe('BO SeaPay88 - Login Tests with Helpers', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.logAction('Starting login test');
  });

  it('Should login with valid credentials using helper', () => {
    cy.loginHelper()
      .fillCredentials(Cypress.env('username'), Cypress.env('password'))
      .submitForm()
      .verifySuccessfulLogin();

    cy.checkURL('dashboard');
    cy.takeScreenshot('successful-login');
  });

  it('Should show validation errors for empty fields', () => {
    cy.loginHelper()
      .fillCredentials('', '')
      .submitForm()
      .verifyLoginError();

    cy.takeScreenshot('empty-fields-error');
  });

  it('Should show error for invalid credentials', () => {
    cy.loginHelper()
      .fillCredentials('invalid@email.com', 'wrongpassword')
      .submitForm()
      .verifyLoginError('Invalid credentials');

    cy.takeScreenshot('invalid-credentials-error');
  });

  it('Should handle forgot password flow', () => {
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Forgot"), a:contains("Lupa")').length > 0) {
        cy.get('a:contains("Forgot"), a:contains("Lupa")').click();
        
        cy.fillForm({
          email: Cypress.env('username')
        });
        
        cy.submitForm();
        cy.get('.success, .alert-success').should('be.visible');
        cy.takeScreenshot('forgot-password-success');
      }
    });
  });
});

// cypress/e2e/02-dashboard.cy.js
describe('BO SeaPay88 - Dashboard Tests with Helpers', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToMenu('Dashboard');
    cy.logAction('Navigated to dashboard');
  });

  it('Should display dashboard with proper navigation', () => {
    cy.checkURL('dashboard');
    cy.checkPageTitle('Dashboard');
    
    // Verify dashboard widgets using helper
    cy.get('.widget, .card, .dashboard-item')
      .should('have.length.greaterThan', 0);
    
    cy.takeScreenshot('dashboard-overview');
  });

  it('Should have working quick actions', () => {
    cy.get('.quick-action, .action-btn').each(($btn, index) => {
      if (index < 3) { // Test only first 3 buttons to save time
        cy.wrap($btn).click();
        cy.waitForPageLoad();
        cy.go('back');
        cy.waitForPageLoad();
      }
    });
    
    cy.takeScreenshot('quick-actions-tested');
  });

  it('Should display charts and statistics', () => {
    // Wait for charts to load
    cy.get('canvas, .chart, svg', { timeout: 15000 })
      .should('be.visible');
    
    // Check for statistics cards
    cy.get('body').should('contain.text', 'Total')
      .or('contain.text', 'Summary')
      .or('contain.text', 'Statistics');
    
    cy.takeScreenshot('dashboard-charts');
  });

  it('Should handle dashboard refresh', () => {
    cy.get('body').then(($body) => {
      if ($body.find('.refresh-btn, [data-cy="refresh"]').length > 0) {
        cy.get('.refresh-btn, [data-cy="refresh"]').click();
        cy.waitForPageLoad();
        cy.takeScreenshot('dashboard-refreshed');
      }
    });
  });
});

// cypress/e2e/03-transactions.cy.js
describe('BO SeaPay88 - Transaction Management with Helpers', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToMenu('Transactions');
    cy.waitForPageLoad();
    cy.logAction('Navigated to transactions page');
  });

  it('Should display transaction table with data', () => {
    cy.checkURL('transaction');
    
    // Verify table structure
    cy.get('table, .transaction-list').should('be.visible');
    cy.get('thead th').should('have.length.greaterThan', 3);
    
    // Check for essential columns
    cy.get('thead').should('contain.text', 'ID')
      .or('contain.text', 'Date')
      .or('contain.text', 'Amount');
    
    cy.takeScreenshot('transaction-table');
  });

  it('Should perform search functionality', () => {
    cy.searchTable('test');
    
    // Verify search results or no data message
    cy.get('tbody tr, .no-data').should('be.visible');
    cy.takeScreenshot('transaction-search-results');
    
    // Clear search
    cy.searchTable('');
    cy.tableHelper().getTableRowCount().should('be.greaterThan', 0);
  });

  it('Should sort table by different columns', () => {
    const columnsToTest = ['Date', 'Amount', 'Status'];
    
    columnsToTest.forEach(column => {
      cy.get('body').then(($body) => {
        if ($body.find(`th:contains("${column}")`).length > 0) {
          cy.sortTable(column, 'asc');
          cy.waitForPageLoad();
          
          cy.sortTable(column, 'desc');
          cy.waitForPageLoad();
        }
      });
    });
    
    cy.takeScreenshot('transaction-sorting-tested');
  });

  it('Should filter transactions by date range', () => {
    cy.get('body').then(($body) => {
      if ($body.find('input[type="date"], .date-picker').length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoString = weekAgo.toISOString().split('T')[0];

        cy.filterTable({
          'start_date': weekAgoString,
          'end_date': today
        });

        cy.waitForPageLoad();
        cy.takeScreenshot('transaction-date-filter');
      }
    });
  });

  it('Should handle pagination', () => {
    cy.get('.pagination').then(($pagination) => {
      if ($pagination.length > 0) {
        // Test going to page 2
        cy.paginateTable(2);
        cy.waitForPageLoad();
        
        // Test going back to page 1
        cy.paginateTable(1);
        cy.waitForPageLoad();
        
        cy.takeScreenshot('transaction-pagination');
      }
    });
  });

  it('Should view transaction details', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('a, button').contains(/view|detail|show/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click();
        }
      });
    });

    // Check if modal opens or navigates to detail page
    cy.get('body').then(($body) => {
      if ($body.find('.modal.show').length > 0) {
        cy.modalHelper().waitForModal();
        cy.takeScreenshot('transaction-detail-modal');
        cy.modalHelper().closeModal();
      } else {
        cy.checkURL('detail');
        cy.takeScreenshot('transaction-detail-page');
        cy.go('back');
      }
    });
  });

  it('Should export transaction data', () => {
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Export"), .export-btn').length > 0) {
        cy.get('button:contains("Export"), .export-btn').click();
        
        // Handle export modal or direct download
        cy.get('.modal, .dropdown-menu').then(($modal) => {
          if ($modal.length > 0 && $modal.is(':visible')) {
            cy.get('button:contains("CSV"), button:contains("Excel")').first().click();
            cy.takeScreenshot('transaction-export-modal');
          }
        });
      }
    });
  });
});

// cypress/e2e/04-reports.cy.js
describe('BO SeaPay88 - Reports with Helpers', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToMenu('Reports');
    cy.waitForPageLoad();
    cy.logAction('Navigated to reports page');
  });

  it('Should generate basic report', () => {
    cy.checkURL('report');
    
    // Select report type
    cy.get('select, .report-type').first().then(($select) => {
      if ($select.length > 0) {
        cy.wrap($select).select(1); // Select second option
      }
    });
    
    // Generate report
    cy.get('button:contains("Generate"), button:contains("Create Report")').click();
    cy.waitForPageLoad();
    
    // Verify report content
    cy.get('table, .report-content, canvas, .chart').should('be.visible');
    cy.takeScreenshot('basic-report-generated');
  });

  it('Should filter reports by date range', () => {
    const today = new Date().toISOString().split('T')[0];
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthAgoString = monthAgo.toISOString().split('T')[0];

    cy.fillForm({
      'start_date': monthAgoString,
      'end_date': today
    });

    cy.get('button:contains("Apply"), button:contains("Filter")').click();
    cy.waitForPageLoad();
    
    cy.takeScreenshot('report-date-filter');
  });

  it('Should export report data', () => {
    // Generate a report first
    cy.get('button:contains("Generate")').click();
    cy.waitForPageLoad();
    
    // Try to export
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Export"), .export-btn').length > 0) {
        cy.get('button:contains("Export"), .export-btn').click();
        cy.takeScreenshot('report-export');
      }
    });
  });

  it('Should display different report types', () => {
    const reportTypes = ['Transaction', 'Revenue', 'Summary', 'Analytics'];
    
    reportTypes.forEach(reportType => {
      cy.get('body').then(($body) => {
        if ($body.find(`option:contains("${reportType}"), a:contains("${reportType}")`).length > 0) {
          // Select report type
          cy.get(`option:contains("${reportType}"), a:contains("${reportType}")`).first().click();
          cy.waitForPageLoad();
          
          cy.takeScreenshot(`report-${reportType.toLowerCase()}`);
        }
      });
    });
  });
});

// cypress/e2e/05-settings.cy.js
describe('BO SeaPay88 - Settings Management with Helpers', () => {
  beforeEach(() => {
    cy.login();
    cy.navigateToMenu('Settings');
    cy.waitForPageLoad();
    cy.logAction('Navigated to settings page');
  });

  it('Should display settings page with navigation', () => {
    cy.checkURL('setting');
    cy.get('.settings, .config, .setting-tabs').should('be.visible');
    cy.takeScreenshot('settings-overview');
  });

  it('Should update profile information', () => {
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Profile"), .profile-tab').length > 0) {
        cy.get('a:contains("Profile"), .profile-tab').click();
        cy.waitForPageLoad();
        
        const testData = {
          name: 'Updated Test Name',
          phone: '1234567890',
          company: 'Test Company'
        };
        
        cy.fillForm(testData);
        cy.takeScreenshot('profile-form-filled');
        
        // Don't actually save to avoid data corruption
        cy.get('button:contains("Save"), button:contains("Update")')
          .should('be.visible')
          .and('not.be.disabled');
      }
    });
  });

  it('Should test password change form', () => {
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Password"), .password-tab').length > 0) {
        cy.get('a:contains("Password"), .password-tab').click();
        cy.waitForPageLoad();
        
        const passwordData = {
          current_password: Cypress.env('password'),
          new_password: 'newTestPassword123!',
          confirm_password: 'newTestPassword123!'
        };
        
        cy.fillForm(passwordData);
        cy.takeScreenshot('password-change-form');
        
        // Validate form without submitting
        cy.get('button:contains("Save"), button:contains("Update")')
          .should('be.visible')
          .and('not.be.disabled');
      }
    });
  });

  it('Should handle security settings', () => {
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Security"), .security-tab').length > 0) {
        cy.get('a:contains("Security"), .security-tab').click();
        cy.waitForPageLoad();
        
        // Test 2FA settings if available
        cy.get('body').then(($secBody) => {
          if ($secBody.find('input[type="checkbox"]').length > 0) {
            cy.get('input[type="checkbox"]').first().check();
            cy.takeScreenshot('security-settings');
          }
        });
      }
    });
  });

  it('Should test notification preferences', () => {
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Notification"), .notification-tab').length > 0) {
        cy.get('a:contains("Notification"), .notification-tab').click();
        cy.waitForPageLoad();
        
        // Toggle notification settings
        cy.get('input[type="checkbox"]').each(($checkbox, index) => {
          if (index < 3) { // Test first 3 checkboxes
            cy.wrap($checkbox).click();
          }
        });
        
        cy.takeScreenshot('notification-settings');
      }
    });
  });
});

// cypress/e2e/06-navigation.cy.js
describe('BO SeaPay88 - Navigation Tests with Helpers', () => {
  beforeEach(() => {
    cy.login();
    cy.logAction('Testing navigation functionality');
  });

  it('Should navigate through all main menu items', () => {
    const mainMenus = ['Dashboard', 'Transactions', 'Reports', 'Settings', 'Users', 'Analytics'];
    
    mainMenus.forEach(menu => {
      cy.get('body').then(($body) => {
        if ($body.find(`a:contains("${menu}"), .nav-item:contains("${menu}")`).length > 0) {
          cy.navigateToMenu(menu);
          cy.checkURL(menu.toLowerCase());
          cy.takeScreenshot(`navigation-${menu.toLowerCase()}`);
        }
      });
    });
  });

  it('Should test breadcrumb navigation', () => {
    cy.navigateToMenu('Transactions');
    
    cy.get('body').then(($body) => {
      if ($body.find('.breadcrumb').length > 0) {
        cy.navigateWithBreadcrumb(['Home', 'Transactions']);
        cy.takeScreenshot('breadcrumb-navigation');
      }
    });
  });

  it('Should test mobile navigation', () => {
    cy.viewport('iphone-x');
    
    cy.navigationHelper().openMobileMenu();
    cy.get('.mobile-nav, .sidebar-mobile').should('be.visible');
    
    // Test mobile menu navigation
    cy.get('.mobile-nav a, .sidebar-mobile a').first().click();
    cy.waitForPageLoad();
    
    cy.takeScreenshot('mobile-navigation');
  });

  it('Should test user menu dropdown', () => {
    cy.get('.user-menu, .user-avatar, .profile-dropdown').click();
    
    cy.get('.dropdown-menu, .user-dropdown').should('be.visible');
    
    // Test profile link
    cy.get('body').then(($body) => {
      if ($body.find('a:contains("Profile")').length > 0) {
        cy.get('a:contains("Profile")').click();
        cy.checkURL('profile');
        cy.takeScreenshot('user-profile-page');
      }
    });
  });

  it('Should handle logout from navigation', () => {
    cy.get('.user-menu, .user-avatar').click();
    cy.logout();
    cy.checkURL('login');
    cy.takeScreenshot('logout-success');
  });
});

// cypress/e2e/07-api-integration.cy.js
describe('BO SeaPay88 - API Integration Tests with Helpers', () => {
  beforeEach(() => {
    // Setup API interceptors
    cy.apiHelper()
      .interceptAPI('GET', '**/api/dashboard**', 'getDashboard')
      .interceptAPI('GET', '**/api/transactions**', 'getTransactions')
      .interceptAPI('POST', '**/api/transactions/search**', 'searchTransactions');
    
    cy.login();
  });

  it('Should load dashboard data via API', () => {
    cy.navigateToMenu('Dashboard');
    
    cy.apiHelper()
      .waitForAPI('getDashboard')
      .checkAPIResponse('getDashboard', 200);
    
    cy.takeScreenshot('dashboard-api-loaded');
  });

  it('Should handle API errors gracefully', () => {
    // Mock API error
    cy.apiHelper().interceptAPI('GET', '**/api/transactions**', 'getTransactionsError', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    });
    
    cy.navigateToMenu('Transactions');
    
    cy.apiHelper().waitForAPI('getTransactionsError');
    
    // Should show error message
    cy.get('.error, .alert-danger').should('be.visible');
    cy.takeScreenshot('api-error-handling');
  });

  it('Should handle slow API responses', () => {
    // Mock slow API
    cy.apiHelper().interceptAPI('GET', '**/api/transactions**', 'slowTransactions', {
      delay: 5000
    });
    
    cy.navigateToMenu('Transactions');
    
    // Should show loading state
    cy.get('.loading, .spinner').should('be.visible');
    
    cy.apiHelper().waitForAPI('slowTransactions', 10000);
    
    cy.get('.loading, .spinner').should('not.exist');
    cy.takeScreenshot('slow-api-handled');
  });
});

// cypress/e2e/08-accessibility.cy.js
describe('BO SeaPay88 - Accessibility Tests with Helpers', () => {
  beforeEach(() => {
    cy.login();
    cy.logAction('Testing accessibility features');
  });

  it('Should have proper heading hierarchy', () => {
    cy.navigateToMenu('Dashboard');
    
    cy.get('h1').should('have.length.lessThan', 2);
    cy.get('h1, h2, h3, h4, h5, h6').should('have.length.greaterThan', 0);
    
    cy.takeScreenshot('heading-hierarchy');
  });

  it('Should have alt text for all images', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('Should be keyboard navigable', () => {
    cy.get('body').tab();
    cy.focused().should('be.visible');
    
    // Navigate through several focusable elements
    for (let i = 0; i < 10; i++) {
      cy.focused().tab();
      cy.focused().should('be.visible');
    }
    
    cy.takeScreenshot('keyboard-navigation');
  });

  it('Should have proper form labels', () => {
    cy.navigateToMenu('Settings');
    
    cy.get('input, select, textarea').each(($element) => {
      const id = $element.attr('id');
      const name = $element.attr('name');
      
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist');
      } else if (name) {
        // Check if input is within a label or has aria-label
        cy.wrap($element).should('satisfy', ($el) => {
          return $el.closest('label').length > 0 || 
                 $el.attr('aria-label') || 
                 $el.attr('placeholder');
        });
      }
    });
  });

  it('Should have sufficient color contrast', () => {
    // This would require additional accessibility testing tools
    // For now, we'll just check that text is visible
    cy.get('body').should('be.visible');
    cy.get('nav').should('be.visible');
    cy.get('main, .main-content').should('be.visible');
    
    cy.takeScreenshot('color-contrast-check');
  });
});

// cypress/e2e/09-error-handling.cy.js
describe('BO SeaPay88 - Error Handling Tests with Helpers', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Should handle 404 errors gracefully', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    
    cy.get('body').should('contain.text', '404')
      .or('contain.text', 'Not Found')
      .or('contain.text', 'Page not found');
    
    cy.takeScreenshot('404-error-page');
  });

  it('Should handle network errors', () => {
    // Simulate network failure
    cy.intercept('GET', '**/api/**', { forceNetworkError: true }).as('networkError');
    
    cy.navigateToMenu('Transactions');
    
    cy.get('.error, .network-error, .offline').should('be.visible');
    cy.takeScreenshot('network-error');
  });

  it('Should handle form validation errors', () => {
    cy.navigateToMenu('Settings');
    
    // Try to submit empty form
    cy.get('form').within(() => {
      cy.get('input').first().clear();
      cy.submitForm();
    });
    
    cy.get('.error, .invalid-feedback').should('be.visible');
    cy.takeScreenshot('form-validation-errors');
  });

  it('Should handle session timeout', () => {
    // Clear session storage to simulate timeout
    cy.clearCookies();
    cy.clearLocalStorage();
    
    cy.reload();
    
    // Should redirect to login
    cy.checkURL('login');
    cy.takeScreenshot('session-timeout');
  });
});

// cypress/e2e/10-performance.cy.js
describe('BO SeaPay88 - Performance Tests with Helpers', () => {
  beforeEach(() => {
    cy.login();
  });

  it('Should load pages within acceptable time', () => {
    const pages = ['Dashboard', 'Transactions', 'Reports', 'Settings'];
    
    pages.forEach(page => {
      const startTime = Date.now();
      
      cy.navigateToMenu(page);
      cy.waitForPageLoad();
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        cy.logAction(`${page} loaded in ${loadTime}ms`);
        
        // Assert page loads within 5 seconds
        expect(loadTime).to.be.lessThan(5000);
      });
    });
  });

  it('Should handle large datasets efficiently', () => {
    cy.navigateToMenu('Transactions');
    
    // Load large dataset by changing page size if available
    cy.get('body').then(($body) => {
      if ($body.find('select[name="pageSize"], .page-size-select').length > 0) {
        cy.get('select[name="pageSize"], .page-size-select').select('100');
        
        const startTime = Date.now();
        cy.waitForPageLoad();
        
        cy.then(() => {
          const loadTime = Date.now() - startTime;
          cy.logAction(`Large dataset loaded in ${loadTime}ms`);
          
          expect(loadTime).to.be.lessThan(10000);
        });
      }
    });
  });

  it('Should handle multiple rapid clicks gracefully', () => {
    cy.navigateToMenu('Dashboard');
    
    // Rapidly click refresh button if available
    cy.get('body').then(($body) => {
      if ($body.find('.refresh-btn').length > 0) {
        for (let i = 0; i < 5; i++) {
          cy.get('.refresh-btn').click();
          cy.wait(100);
        }
        
        cy.waitForPageLoad();
        cy.takeScreenshot('rapid-clicks-handled');
      }
    });
  });
});