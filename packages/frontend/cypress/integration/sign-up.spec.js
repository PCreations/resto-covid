import { auth } from "../../src/adapters/shared/firebase";

describe("Sign up", () => {
  let testRestaurant;
  beforeEach(() => {
    cy.clearLocalStorage();
    const now = +new Date();
    testRestaurant = {
      name: `Test restaurant ${now}`,
      email: `pcriulan+test${now}@gmail.com`,
      password: `password${now}`,
      address: "17 rue Foo",
      postalCode: "75017",
      city: "Paris",
    };
  });
  afterEach(() => {
    cy.clearLocalStorage();
    if (auth.currentUser) {
      return auth.currentUser.delete();
    }
  });
  it("correctly signs up the user", () => {
    cy.visitSignUpForm();

    cy.fillSignUpForm(testRestaurant);

    cy.expectToBeOnDashboard();
  });
});
