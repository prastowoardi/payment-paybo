class SelectorManager {
  constructor() {
    this.selectors = Cypress.env('selectors') || {};
  }

  get(category, element) {
    return this.selectors[category]?.[element] || null;
  }

  findElement(selectors) {
    if (Array.isArray(selectors)) {
      for (const selector of selectors) {
        const element = Cypress.$(selector);
        if (element.length > 0) {
          return selector;
        }
      }
    }
    return selectors;
  }

  // Dynamic selector finder
  smartFind(element, context = 'body') {
    const commonSelectors = [
      `[data-cy="${element}"]`,
      `[data-testid="${element}"]`,
      `#${element}`,
      `.${element}`,
      `[name="${element}"]`,
      `input[placeholder*="${element}"]`,
      `button:contains("${element}")`,
      `a:contains("${element}")`,
      `*:contains("${element}")`
    ];

    return cy.get(context).then($context => {
      for (const selector of commonSelectors) {
        if ($context.find(selector).length > 0) {
          return cy.get(selector);
        }
      }
      throw new Error(`Element "${element}" not found`);
    });
  }
}

Cypress.Commands.add('selectorManager', () => {
  return new SelectorManager();
});