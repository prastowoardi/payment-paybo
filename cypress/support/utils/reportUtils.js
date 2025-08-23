class ReportUtils {
  static generateCustomReport() {
    const timestamp = new Date().toISOString();
    const testResults = {
      timestamp,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      screenshots: [],
      errors: []
    };

    // This would be populated during test execution
    return testResults;
  }

  static saveTestMetrics(testName, duration, status) {
    const metrics = {
      testName,
      duration,
      status,
      timestamp: new Date().toISOString()
    };

    cy.task('log', `Test Metrics: ${JSON.stringify(metrics)}`);
  }
}

Cypress.Commands.add('saveMetrics', (testName, duration, status) => {
  ReportUtils.saveTestMetrics(testName, duration, status);
});