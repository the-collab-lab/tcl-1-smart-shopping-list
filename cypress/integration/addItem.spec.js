import { exportAllDeclaration } from '@babel/types';

describe('Access add item page', () => {
  it('Visits add item page in browser', () => {
    cy.visit('/add-item');
  });
});

describe('Radio button tests', function() {
  it('Selects only one radio button', function() {
    // can't find radio buttons becuase it doesn't have a token stored, so it redirects to CreateList view
    localStorage.setItem('token', 'abc123');

    // now we can visit this page...
    cy.visit('/add-item');

    // added classes to group radio buttons by name (not required here, but good practice)
    const radioButtons = cy.get('.frequency-radio-button');

    // make sure there are only three radio buttons for this particular form
    radioButtons.should('have.length', 3);

    // confirm the initial state of each checkbox
    // for context, .eq(0) is the same as .first()
    cy.get('.frequency-radio-button')
      .eq(0)
      .should('be.checked');

    cy.get('.frequency-radio-button')
      .eq(1)
      .should('not.be.checked');

    cy.get('.frequency-radio-button')
      .eq(2)
      .should('not.be.checked');

    // check one of the unchecked radio buttons to change selection
    cy.get('.frequency-radio-button')
      .last()
      .check();

    // now re-confirm that the correct radio button is checked
    cy.get('.frequency-radio-button')
      .eq(0)
      .should('not.be.checked');

    cy.get('.frequency-radio-button')
      .eq(1)
      .should('not.be.checked');

    cy.get('.frequency-radio-button')
      .eq(2)
      .should('be.checked');

    // NOTE: I don't know of a way to check specifically that an expected-
    // incorrect test does indeed throw a failure. In cases, like the one
    // above where you want to confirm a state change and make sure an
    // element is NOT in the same state is was before some action, instead
    // of checking something like cy.get('.wronganswer').should.throw(Error)
    // we just check for what we DO expect it to be.
    //
    // More on Cypress best practices:
    // https://docs.cypress.io/guides/references/best-practices.html
  });
});
