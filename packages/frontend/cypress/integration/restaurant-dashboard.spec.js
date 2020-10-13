import { createRestaurant } from "../support/create-restaurant";
import { auth, db } from "../../src/adapters/shared/firebase";
import { createAddContact } from "../../src/use-cases/add-contact";
import { createSignIn } from "../../src/use-cases/sign-in";
import { createFirebaseRestaurantRepository } from "../../src/adapters/restaurant-repository";
import { createSealedBoxEncrypter } from "../../src/adapters/encrypter";
import { createFirebaseAuthenticationGateway } from "../../src/adapters/authentication-gateway";

describe("Restaurant Dashboard", () => {
  let restaurant, restaurantUser, now;
  beforeEach(async () => {
    cy.clearLocalStorage();
    now = new Date("2020-10-13T18:03:30.398Z");
    ({ restaurant, restaurantUser } = await createRestaurant());
    const restaurantRepository = createFirebaseRestaurantRepository();
    const authenticationGateway = createFirebaseAuthenticationGateway();
    const encrypter = createSealedBoxEncrypter();
    const addContact = createAddContact({
      restaurantRepository,
      encrypter,
    });
    const signIn = createSignIn({ authenticationGateway });
    await addContact({
      restaurantId: restaurant.id,
      contactInformation: {
        firstName: "First Name",
        lastName: "Last Name",
        phoneNumber: "0102030405",
      },
      now,
    });
    return signIn(restaurantUser);
  });

  afterEach(async () => {
    const userCredentials = await auth.signInWithEmailAndPassword(
      restaurantUser.email,
      restaurantUser.password
    );
    await db.collection("restaurants").doc(userCredentials.user.uid).delete();
    return userCredentials.user.delete();
  });

  it("can read the contacts", () => {
    cy.goToDashboard();

    cy.expectContactToBeVisible({
      date: "13/10/2020 20:03",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "0102030405",
    });
  });
});
