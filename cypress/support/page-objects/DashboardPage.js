class DashboardPage {
  constructor() {
    this.elements = {
      pageTitle: () => cy.get('h1, .page-title'),
      widgets: () => cy.get('.widget, .card, .dashboard-item'),
      charts: () => cy.get('canvas, .chart, svg'),
      quickActions: () => cy.get('.quick-action, .action-btn'),
      refreshButton: () => cy.get('.refresh-btn, [data-cy="refresh"]'),
      recentTransactions: () => cy.get('.recent-transactions, .transaction-list'),
      statistics: () => cy.get('.stats, .statistics, .metrics')
    };
  }

  visit() {
    cy.visit('/dashboard');
    return this;
  }

  verifyPageLoaded() {
    this.elements.pageTitle().should('be.visible');
    this.elements.widgets().should('have.length.greaterThan', 0);
    return this;
  }

  verifyChartsLoaded() {
    this.elements.charts().should('be.visible');
    return this;
  }

  clickQuickAction(index = 0) {
    this.elements.quickActions().eq(index).click();
    return this;
  }

  refreshDashboard() {
    this.elements.refreshButton().click();
    cy.waitForPageLoad();
    return this;
  }

  verifyStatistics() {
    this.elements.statistics().should('be.visible');
    return this;
  }
}