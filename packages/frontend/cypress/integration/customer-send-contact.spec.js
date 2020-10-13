import { createRestaurant } from "../support/create-restaurant";
import { auth } from "../../src/adapters/shared/firebase";

describe("Customer sends contact", () => {
  let restaurant, restaurantUser;

  beforeEach(async () => {
    ({ restaurant, restaurantUser } = await createRestaurant());
  });

  afterEach(async () => {
    const userCredentials = await auth.signInWithEmailAndPassword(
      restaurantUser.email,
      restaurantUser.password
    );
    return await userCredentials.user.delete();
  });

  it("sends their contact information", () => {
    const contact = {
      firstName: `First name`,
      lastName: `Last name`,
      phoneNumber: "0102030405",
    };
    cy.visitContactForm(restaurant.id);

    cy.fillContactForm(contact);

    cy.expectContactToBeSent();
  });
});
