describe("signing in", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it("can sign in", () => {
    cy.visitSignInForm();

    cy.signInWithTestUser();

    cy.expectToBeOnDashboard();
  });
});
