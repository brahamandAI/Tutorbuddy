import { mount } from 'cypress/react';
import './commands';

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

// Example: Import your global styles here
// import '../../src/styles/globals.css'; 