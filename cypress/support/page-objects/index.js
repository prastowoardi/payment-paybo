import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';  
import TransactionPage from './TransactionPage';

// Register page objects as Cypress commands
Cypress.Commands.add('loginPage', () => new LoginPage());
Cypress.Commands.add('dashboardPage', () => new DashboardPage());
Cypress.Commands.add('transactionPage', () => new TransactionPage());

// Export for direct import
export {
  LoginPage,
  DashboardPage,
  TransactionPage
};

// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended'
  ],
  env: {
    node: true,
    browser: true,
    es6: true,
    'cypress/globals': true
  },
  plugins: [
    'cypress'
  ],
  rules: {
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-force': 'warn',
    'cypress/no-async-tests': 'error',
    'cypress/unsafe-to-chain-command': 'error'
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
};

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}