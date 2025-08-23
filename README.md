# Cypress E2E Testing Suite untuk BO SeaPay88

## Deskripsi
Suite automation testing lengkap untuk Back Office SeaPay88 menggunakan Cypress dengan arsitektur yang terstruktur, menggunakan Page Object Model, Custom Commands, dan Helpers untuk maintainability yang optimal.

## Arsitektur Project

```
cypress/
├── e2e/                           # Test files
│   ├── 01-login.cy.js             # Login functionality tests
│   ├── 02-dashboard.cy.js         # Dashboard tests
│   ├── 03-transactions.cy.js     # Transaction management tests
│   ├── 04-reports.cy.js           # Reports functionality tests
│   ├── 05-settings.cy.js          # Settings tests
│   ├── 06-navigation.cy.js        # Navigation tests
│   ├── 07-api-integration.cy.js   # API integration tests
│   ├── 08-accessibility.cy.js     # Accessibility tests
│   ├── 09-error-handling.cy.js    # Error handling tests
│   └── 10-performance.cy.js       # Performance tests
├── fixtures/                      # Test data
│   ├── testData.json              # Main test data
│   └── environments.json          # Environment configurations
├── support/                       # Support files
│   ├── commands/                  # Custom commands (modular)
│   │   ├── index.js               # Commands index
│   │   ├── authCommands.js        # Authentication commands
│   │   ├── navigationCommands.js  # Navigation commands
│   │   ├── formCommands.js        # Form commands
│   │   ├── tableCommands.js       # Table commands
│   │   ├── apiCommands.js         # API commands
│   │   └── utilityCommands.js     # Utility commands
│   ├── helpers/                   # Helper classes
│   │   ├── loginHelper.js         # Login helper
│   │   ├── navigationHelper.js    # Navigation helper
│   │   ├── tableHelper.js         # Table helper
│   │   ├── formHelper.js          # Form helper
│   │   ├── modalHelper.js         # Modal helper
│   │   └── apiHelper.js           # API helper
│   ├── page-objects/              # Page Object Model
│   │   ├── index.js               # Page objects index
│   │   ├── LoginPage.js           # Login page object
│   │   ├── DashboardPage.js       # Dashboard page object
│   │   └── TransactionPage.js     # Transaction page object
│   ├── utils/                     # Utility classes
│   │   ├── testDataGenerator.js   # Test data generator
│   │   ├── selectors.js           # Dynamic selector manager
│   │   ├── apiUtils.js            # API utilities
│   │   └── reportUtils.js         # Report utilities
│   ├── commands.js                # Main custom commands
│   └── e2e.js                     # Global setup and config
├── screenshots/                   # Test screenshots
├── videos/                        # Test videos
└── reports/                       # Test reports
```

## Prerequisites

- Node.js (v16.0 atau lebih baru)
- npm atau yarn
- Google Chrome browser
- Git

## Installation

### 1. Clone atau Setup Project
```bash
mkdir cypress-bo-seapay88-tests
cd cypress-bo-seapay88-tests
npm init -y
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install --save-dev cypress

# Additional testing utilities
npm install --save-dev @cypress/grep
npm install --save-dev cypress-mochawesome-reporter
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator

# Development tools
npm install --save-dev eslint prettier
npm install --save-dev eslint-plugin-cypress
```

### 3. Setup Project Structure
Buat folder structure sesuai arsitektur di atas dan copy semua file yang telah dibuat.

## Configuration

### Environment Variables
Buat file `.env` (optional) atau gunakan `cypress.config.js`:

```javascript
// cypress.config.js sudah include konfigurasi lengkap
// Sesuaikan baseUrl dan credentials sesuai environment
```

### Konfigurasi Multiple Environments
```bash
# Development
npm run test:env:dev

# Staging  
npm run test:env:staging

# UAT (default)
npm run test:env:uat
```

## Quick Start

### 1. Open Cypress GUI
```bash
npm run cypress:open
```

### 2. Run All Tests (Headless)
```bash
npm run cypress:run
```

### 3. Run Specific Test Suite
```bash
npm run test:login          # Login tests
npm run test:dashboard      # Dashboard tests
npm run test:transactions   # Transaction tests
npm run test:reports        # Report tests
npm run test:settings       # Settings tests
```

## Test Reporting

### Generate HTML Report
```bash
npm run report:generate
npm run report:merge
npm run report:html
```

### View Reports
Report HTML akan tersedia di `cypress/reports/index.html`

### Screenshots dan Videos
- Screenshots otomatis diambil saat test fail
- Videos tersimpan di `cypress/videos/`
- Screenshots tersimpan di `cypress/screenshots/`

## Advanced Configuration

### Custom Viewport Testing
```bash
# Mobile testing
npm run test:mobile

# Tablet testing  
npm run test:tablet

# Custom viewport dalam test
cy.setViewport('mobile');
cy.setViewport('tablet');
cy.setViewport('desktop');
```

### Parallel Testing
```bash
# Run tests in parallel (requires Cypress Dashboard)
npm run test:parallel
```

### Browser Testing
```bash
# Different browsers
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge
```

### Run Tests by Tags
```bash
# Smoke tests
npm run test:smoke

# Critical tests
npm run test:critical

# Regression tests
npm run test:regression
```

### Debug Mode
```bash
# Run with debug information
DEBUG=cypress:* npm run cypress:run

# Open DevTools in headed mode
npm run test:headed
```

### Code Quality
```bash
# Lint tests
npm run lint:cypress

# Format code
npm run format:cypress

# Clean up old reports
npm run clean:reports
```

### Test Review Checklist
- [ ] Tests follow naming conventions
- [ ] Custom commands used appropriately
- [ ] Page objects implemented for complex pages
- [ ] Appropriate assertions used
- [ ] Error handling implemented
- [ ] Test data managed properly
- [ ] Screenshots taken for key scenarios

### Performance Tips

1. **Use cy.session() untuk login** - Lebih cepat dari login berulang
2. **Intercept API calls** - Control network requests
3. **Use Page Object Model** - Better maintainability
4. **Selective test runs** - Use tags untuk run subset tests
5. **Parallel execution** - Run tests in parallel

### Debug Commands
```javascript
// Debug specific element
cy.get('.element').debug();

// Log current state
cy.then(() => {
  debugger; // Browser akan pause di sini
});

// Custom logging
cy.task('log', 'Debug information');
```

## Resources

### Documentation
- [Cypress Official Documentation](https://docs.cypress.io)
- [Best Practices Guide](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)

### Community
- [Cypress Discord](https://discord.gg/cypress)
- [Cypress GitHub](https://github.com/cypress-io/cypress)
- [Real World App Example](https://github.com/cypress-io/cypress-realworld-app)


### Development Workflow
1. Create feature branch
2. Write tests mengikuti pattern yang sudah ada
3. Run tests locally
4. Create pull request
5. Review dan merge

### Code Standards
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive test names
- Add comments untuk complex logic
- Update documentation

---

**Happy Testing!**