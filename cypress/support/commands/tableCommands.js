// Table interaction commands
Cypress.Commands.add('verifyTableHeaders', (expectedHeaders) => {
  expectedHeaders.forEach((header, index) => {
    cy.get('thead th').eq(index).should('contain.text', header);
  });
});

Cypress.Commands.add('verifyTableData', (expectedData) => {
  expectedData.forEach((rowData, rowIndex) => {
    cy.get('tbody tr').eq(rowIndex).within(() => {
      Object.values(rowData).forEach((cellValue, cellIndex) => {
        cy.get('td').eq(cellIndex).should('contain', cellValue);
      });
    });
  });
});