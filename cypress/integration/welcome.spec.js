import { exportAllDeclaration } from '@babel/types';

describe('Cyress access test', () => {
  it('Visits iNeedToBuy in browser', () => {
    cy.visit('/create-list');
  });
});

describe('Welcome prompt displays when there are no list items', function() {
  it('displays a button to add a new item when there are no items on the list', function() {
    cy.visit('/create-list');
    // click the create shopping list button
    cy.get('.create-list-link').click();
    // redirect to the list page
    cy.get('section > .add-item-link').contains('Add Item');
  });

  it('page redirect to add item page when welcome button is clicked', function() {
    cy.visit('/create-list');
    // click the create shopping list button
    cy.get('.create-list-link').click();
    // redirect to the add item page
    cy.get('section > .add-item-link').click();
    cy.url().should('include', 'http://localhost:3000/add-item');
  });

  it('button doesnt display whe there is one list item', function() {
    cy.visit('/create-list');
    // click the create shopping list button
    cy.get('.create-list-link').click();
    // redirect to the add item page
    cy.get('section > .add-item-link').click();
    cy.get('#name').type("test item");
    cy.get('button').click();
    cy.get('.list-link').click();
    cy.get('.content-wrapper').should('not.have.value', 'No purchases just yet.')
  });
});