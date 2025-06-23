describe('Hello World Feature', () => {
    it('displays the correct message', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Hello World');
    });
});