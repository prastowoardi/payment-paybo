Cypress.Commands.add('setViewport', (device) => {
  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1280, 720],
    large: [1920, 1080]
  };

  const [width, height] = viewports[device] || viewports.desktop;
  cy.viewport(width, height);
});

Cypress.Commands.add('waitForCondition', (conditionFn, timeout = 10000) => {
  const startTime = Date.now();
  
  const checkCondition = () => {
    if (Date.now() - startTime > timeout) {
      throw new Error('Condition not met within timeout');
    }
    
    if (!conditionFn()) {
      cy.wait(100).then(checkCondition);
    }
  };
  
  checkCondition();
});

Cypress.Commands.add('retryAction', (actionFn, maxRetries = 3) => {
  let retryCount = 0;
  
  const attemptAction = () => {
    try {
      return actionFn();
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        cy.wait(1000);
        return attemptAction();
      } else {
        throw error;
      }
    }
  };
  
  return attemptAction();
});