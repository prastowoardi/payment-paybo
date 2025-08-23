class TransactionPage {
  constructor() {
    this.elements = {
      pageTitle: () => cy.get('h1, .page-title'),
      transactionTable: () => cy.get('table, .transaction-list'),
      searchInput: () => cy.get('[data-cy="search"], input[placeholder*="search"]'),
      searchButton: () => cy.get('[data-cy="search-button"], button:contains("Search")'),
      filterButton: () => cy.get('.filter-btn, [data-cy="filter"]'),
      exportButton: () => cy.get('button:contains("Export"), .export-btn'),
      paginationContainer: () => cy.get('.pagination'),
      tableRows: () => cy.get('tbody tr'),
      tableHeaders: () => cy.get('thead th'),
      noDataMessage: () => cy.get('.no-data, .empty-state'),
      loadingSpinner: () => cy.get('.loading, .spinner')
    };
  }

  visit() {
    cy.visit('/transactions');
    return this;
  }

  verifyPageLoaded() {
    this.elements.pageTitle().should('be.visible');
    this.elements.transactionTable().should('be.visible');
    return this;
  }

  search(term) {
    this.elements.searchInput().clear().type(term);
    this.elements.searchButton().click();
    cy.waitForPageLoad();
    return this;
  }

  clearSearch() {
    this.elements.searchInput().clear();
    this.elements.searchButton().click();
    cy.waitForPageLoad();
    return this;
  }

  sortByColumn(columnName) {
    cy.get(`th:contains("${columnName}")`).click();
    cy.waitForPageLoad();
    return this;
  }

  goToPage(pageNumber) {
    this.elements.paginationContainer().within(() => {
      cy.get(`a:contains("${pageNumber}"), button:contains("${pageNumber}")`).click();
    });
    cy.waitForPageLoad();
    return this;
  }

  exportData() {
    this.elements.exportButton().click();
    return this;
  }

  getRowCount() {
    return this.elements.tableRows().its('length');
  }

  clickRowAction(rowIndex, actionName) {
    this.elements.tableRows().eq(rowIndex).within(() => {
      cy.get(`button:contains("${actionName}"), a:contains("${actionName}")`).click();
    });
    return this;
  }

  verifyNoData() {
    this.elements.noDataMessage().should('be.visible');
    return this;
  }
}