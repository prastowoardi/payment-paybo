const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://bo.dev88uat.com/',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    pageLoadTimeout: 30000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    watchForFileChanges: false,
    chromeWebSecurity: false,
    experimentalStudio: true,
    
    setupNodeEvents(on, config) {
      // Task untuk logging
      on('task', {
        log(message) {
          console.log(`[${new Date().toISOString()}] ${message}`);
          return null;
        },
        
        // Task untuk database operations (jika diperlukan)
        queryDB(query) {
          // Implement database query if needed
          console.log('Database query:', query);
          return null;
        },

        // Task untuk file operations
        readFileMaybe(filename) {
          try {
            return require('fs').readFileSync(filename, 'utf8');
          } catch (e) {
            return null;
          }
        }
      });

      // Plugin untuk mochawesome reporter
      require('cypress-mochawesome-reporter/plugin')(on);

      // Plugin untuk grep functionality
      require('@cypress/grep/src/plugin')(config);
      
      return config;
    },

    env: {
      // Base configuration
      baseUrl: 'https://bo.dev88uat.com/',
      username: 'merchant@seapay88.com',
      password: 'fKj&l56v',
      
      // Test configuration
      defaultTimeout: 10000,
      retryCount: 2,
      screenshotOnFail: true,
      
      // Environment specific
      environment: 'uat',
      apiUrl: 'https://bo.dev88uat.com/api',
      
      // Feature flags
      enableApiTests: true,
      enableAccessibilityTests: true,
      enablePerformanceTests: true,
      
      // Test data
      testUsers: {
        merchant: {
          email: 'merchant@seapay88.com',
          password: 'fKj&l56v',
          role: 'merchant'
        },
        admin: {
          email: 'admin@seapay88.com',
          password: 'admin123',
          role: 'admin'
        }
      },
      
      // Selectors configuration
      selectors: {
        login: {
          email: '[name="email"], input[type="email"], #email',
          password: '[name="password"], input[type="password"], #password',
          submit: 'button[type="submit"], .login-btn, [data-cy="login-button"]'
        },
        navigation: {
          dashboard: '[data-cy="menu-dashboard"], a[href*="dashboard"]',
          transactions: '[data-cy="menu-transactions"], a[href*="transaction"]',
          reports: '[data-cy="menu-reports"], a[href*="report"]',
          settings: '[data-cy="menu-settings"], a[href*="setting"]'
        }
      }
    },

    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 1
    },

    specPattern: '**/*.js',

    // Exclude certain spec patterns
    excludeSpecPattern: [
      '**/*.skip.cy.js',
      '**/*.wip.cy.js'
    ]
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
});