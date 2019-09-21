import { exportAllDeclaration } from '@babel/types';

describe('Access join list page', () => {
  it('Visits join list page in browser', () => {
    cy.visit('/join-list');
  });
});

describe('Join list page links', function() {
  it('clicks a button and redirects to create list page', function() {
    cy.visit('/join-list');
    cy.get('p > a').click();
    // redirect to the list page
    cy.url().should('include', 'http://localhost:3000/');
  });
});

describe('Invalid token input', function() {
  it('fails when invalid token is input in form', function() {
    cy.visit('/join-list');
    cy.get('label > input').type('Hello, World');
    cy.get('[type="submit"]').click();
    cy.on('window:alert', str => {
      expect(str).to.equal(
        `Oops! That list can't be found. Please try again or create a new list.`
      );
    });
  });
});

describe('Valid token input', function() {
  it('stores token and redirects to list when valid token is input in form', function() {
    cy.visit('/join-list');
    cy.get('label > input').type('acorn coca sooth');
    cy.get('[type="submit"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('token')).to.exist;
      });
    cy.url().should('include', 'http://localhost:3000/');
  });
});
