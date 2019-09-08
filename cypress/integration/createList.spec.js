import { exportAllDeclaration } from '@babel/types';

describe('Cyress access test', () => {
  it('Visits iNeedToBuy in browser', () => {
    cy.visit('/create-list');
  });
});

describe('Generate list token', function() {
  it('clicks a button and redirects to list page', function() {
    // go to the create list page
    cy.visit('/create-list');
    // click the create shopping list button
    cy.get('button').click();
    // redirect to the list page
    cy.url().should('include', 'http://localhost:3000/');
  });

  it('stores a token value in localStorage', function() {
    cy.visit('/create-list');
    cy.get('.create-list-link')
      .click()
      .should(() => {
        expect(localStorage.getItem('token')).to.exist;
      });
  });
});
